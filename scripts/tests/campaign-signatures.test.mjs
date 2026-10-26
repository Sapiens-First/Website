import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import {
  campaigns,
  consentVersion,
  parseSignature,
  isSignatureReceipt,
} from "../../lib/campaigns.ts";

const input = {
  campaignId: "freeze-ai",
  email: " Alex@Example.org ",
  name: "Alex",
  zip: "02139",
  phone: "+1 202 555 0101",
  updatesOptIn: false,
  agreed: true,
};

test("email is required, optional fields can be empty, and invalid/unsupported input is rejected", () => {
  assert.equal(parseSignature(input).email, "alex@example.org");
  assert.ok(parseSignature({ ...input, name: "", zip: "", phone: "" }));
  for (const data of [
    null,
    { ...input, email: "" },
    { ...input, agreed: false },
    { ...input, campaignId: "__proto__" },
    { ...input, zip: "invalid" },
    { ...input, phone: "abc" },
    { ...input, website: "bot" },
  ])
    assert.equal(parseSignature(data), null);
});

test("success requires a matching, versioned, confirmed receipt", () => {
  const receipt = {
    result: "success",
    campaignId: "freeze-ai",
    receiptId: "receipt-123456",
    signedAt: new Date().toISOString(),
    demandVersion: campaigns["freeze-ai"].demandVersion,
    consentVersion,
    updatesOptIn: false,
  };
  assert.equal(isSignatureReceipt(receipt, "freeze-ai"), true);
  for (const data of [
    { result: "success" },
    { ...receipt, campaignId: "stop-1984" },
    { ...receipt, consentVersion: "old" },
    { ...receipt, signedAt: "invalid" },
  ])
    assert.equal(isSignatureReceipt(data, "freeze-ai"), false);
});

function backend() {
  const sheets = new Map();
  let serial = 0;
  let locked = false;
  let failSupporter = false;
  const existing = [
    ["Timestamp", "Email", "Interest"],
    ["2026-01-01", "existing@example.org", "membership"],
  ];
  function sheet(name, rows = []) {
    return {
      name,
      rows,
      getName() {
        return name;
      },
      getLastRow() {
        return rows.length;
      },
      getRange(row, col, height = 1, width = 1) {
        return {
          getValues: () =>
            Array.from({ length: height }, (_, i) =>
              Array.from(
                { length: width },
                (_, j) => rows[row - 1 + i]?.[col - 1 + j] ?? "",
              ),
            ),
          setValues(values) {
            for (let i = 0; i < values.length; i++) {
              rows[row - 1 + i] ??= [];
              for (let j = 0; j < values[i].length; j++)
                rows[row - 1 + i][col - 1 + j] = values[i][j];
            }
            return this;
          },
        };
      },
      appendRow(values) {
        if (name === "Sheet1" && failSupporter) {
          failSupporter = false;
          throw new Error("simulated write failure");
        }
        rows.push([...values]);
        return this;
      },
    };
  }
  sheets.set("Sheet1", sheet("Sheet1", structuredClone(existing)));
  const workbook = {
    getSheets: () => [...sheets.values()],
    getSheetByName: (name) => sheets.get(name),
    insertSheet(name) {
      const s = sheet(name);
      sheets.set(name, s);
      return s;
    },
  };
  const context = vm.createContext({
    console,
    Date,
    JSON,
    Object,
    String,
    Number,
    RegExp,
    SpreadsheetApp: { openById: () => workbook, flush() {} },
    Utilities: { getUuid: () => `signature-${++serial}-0123456789` },
    LockService: {
      getScriptLock: () => ({
        waitLock() {
          assert.equal(locked, false);
          locked = true;
        },
        releaseLock() {
          locked = false;
        },
      }),
    },
    ContentService: {
      MimeType: { JSON: "json" },
      createTextOutput(text) {
        return {
          text,
          setMimeType() {
            return this;
          },
        };
      },
    },
  });
  vm.runInContext(
    readFileSync(new URL("../signup-apps-script.gs", import.meta.url), "utf8"),
    context,
  );
  return {
    sheets,
    existing,
    failNextSupporter() {
      failSupporter = true;
    },
    submit(data) {
      return JSON.parse(
        context.doPost({ postData: { contents: JSON.stringify(data) } }).text,
      );
    },
    isLocked: () => locked,
  };
}

const payload = {
  ...input,
  action: "campaign-signature",
  demandVersion: campaigns["freeze-ai"].demandVersion,
  consentVersion,
  source: "https://sapiensfirst.org/campaigns/freeze-ai",
};

test("campaign save adds a supporter and signature without changing any previous rows", () => {
  const b = backend();
  const r = b.submit(payload);
  assert.equal(r.result, "success");
  assert.ok(r.receiptId);
  assert.equal(r.campaignId, "freeze-ai");
  assert.deepEqual(b.sheets.get("Sheet1").rows.slice(0, 2), b.existing);
  assert.equal(b.sheets.get("Sheet1").rows.length, 3);
  assert.equal(b.sheets.get("Campaign Signatures").rows.length, 2);
  assert.equal(b.sheets.get("Campaign Signatures").rows[1][4], "'02139");
  assert.equal(b.isLocked(), false);
});

test("repeat campaign signing returns the original receipt and preserves original profile/consent", () => {
  const b = backend();
  const first = b.submit(payload);
  const rows = JSON.stringify([...b.sheets].map(([name, s]) => [name, s.rows]));
  const repeat = b.submit({
    ...payload,
    email: "alex@example.org",
    name: "Changed",
    updatesOptIn: true,
  });
  assert.deepEqual(repeat, first);
  assert.equal(
    JSON.stringify([...b.sheets].map(([name, s]) => [name, s.rows])),
    rows,
  );
});

test("an existing supporter gets a distinct signature per campaign without duplicate supporter rows", () => {
  const b = backend();
  const first = b.submit({ ...payload, email: "existing@example.org" });
  const second = b.submit({
    ...payload,
    email: "existing@example.org",
    campaignId: "citizens-dividend",
  });
  assert.equal(first.result, "success");
  assert.equal(second.result, "success");
  assert.notEqual(first.receiptId, second.receiptId);
  assert.deepEqual(b.sheets.get("Sheet1").rows, b.existing);
  assert.equal(b.sheets.get("Campaign Signatures").rows.length, 3);
});

test("a partial write can be retried without duplicating a signature, with no false success", () => {
  const b = backend();
  b.failNextSupporter();
  assert.equal(b.submit(payload).result, "error");
  assert.equal(b.isLocked(), false);
  assert.equal(b.submit(payload).result, "success");
  assert.equal(b.sheets.get("Campaign Signatures").rows.length, 2);
  assert.equal(b.sheets.get("Sheet1").rows.length, 3);
});

test("bad campaign/version/consent and formula-like strings cannot corrupt the workbook", () => {
  const b = backend();
  for (const bad of [
    { ...payload, campaignId: "other" },
    { ...payload, demandVersion: "old" },
    { ...payload, agreed: false },
    { ...payload, zip: "=1+1" },
  ])
    assert.equal(b.submit(bad).result, "error");
  assert.equal(b.sheets.size, 1);
  assert.equal(
    b.submit({
      ...payload,
      name: '=HYPERLINK("https://example.org")',
      phone: "+12025550101",
    }).result,
    "success",
  );
  const saved = b.sheets.get("Campaign Signatures").rows[1];
  assert.equal(saved[3].startsWith("'="), true);
  assert.equal(saved[5].startsWith("'+"), true);
});

test("non-campaign submissions are rejected without changing supporter records", () => {
  const b = backend();
  for (const interest of ["membership", "start-a-circle", "fellowship"])
    assert.equal(
      b.submit({ email: "join@example.org", interest }).result,
      "error",
    );
  assert.equal(b.submit({ email: "join@example.org" }).result, "error");
  assert.deepEqual(b.sheets.get("Sheet1").rows, b.existing);
  assert.equal(b.sheets.size, 1);
});
