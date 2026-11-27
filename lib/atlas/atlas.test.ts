import assert from "node:assert/strict";
import test from "node:test";
import {
  applyMemberAssignments,
  personColumns,
  selectionOf,
  governanceColumns,
  toPublicAtlas,
} from "./columns";
import { ATLAS_ORGANIZATION_NAME, circleLayout } from "./circles";
import type { AtlasRow } from "./model";

function row(partial: Record<string, string>): AtlasRow {
  return {
    ID: partial.ID,
    Name: partial.Name,
    Type: partial.Type,
    Status: "Active",
    Purpose: partial.Purpose ?? "",
    ...partial,
  };
}

test("public governance selection excludes person columns", () => {
  const selection = selectionOf(governanceColumns);
  assert.equal(selection.includes("*"), false);
  for (const column of personColumns) {
    assert.equal(selection.split(",").includes(column), false);
  }
});

test("signed-out atlas rows are redacted and carry no person fields", () => {
  const governance = [
    row({
      ID: "G-1",
      Name: "Visual Design",
      Type: "Role",
      "Parent Circle ID": "G-9",
      Accountabilities: "Design the site",
    }),
  ];
  const data = toPublicAtlas([], governance, []);
  const serialized = JSON.stringify(data);
  assert.match(serialized, /Redacted/);
  assert.equal(serialized.includes("profile_id"), false);
  assert.equal(serialized.includes("display_initials"), false);
  assert.equal(serialized.includes("engagement_level"), false);
  assert.equal(serialized.includes("assignment_basis"), false);
  assert.equal(serialized.includes("Ada Lovelace"), false);
  assert.equal(data.people.length, 0);
  assert.equal(data.governance[0].Assignee, "Redacted");
});

test("members see full names and not the redacted marker", () => {
  const governance = [
    row({
      ID: "G-1",
      Name: "Visual Design",
      Type: "Role",
      Assignee: "Redacted",
    }),
    row({ ID: "G-2", Name: "Writer", Type: "Role", Assignee: "Redacted" }),
  ];
  const pub = toPublicAtlas([], governance, []);
  const next = applyMemberAssignments(pub, [
    {
      governance_id: "G-1",
      profile_id: "11111111-1111-1111-1111-111111111111",
      full_name: "Ada Lovelace",
      display_initials: "AL",
      engagement_level: "Staff",
      assignment_basis: "Appointed",
    },
  ]);
  assert.equal(pub.governance[0].Assignee, "Redacted");
  assert.equal(next.governance[0]["Person name"], "Ada Lovelace");
  assert.equal(next.governance[0].Assignee, undefined);
  assert.equal(next.governance[0]["Display initials"], undefined);
  assert.equal(next.governance[1]["Person name"], "");
  assert.equal(next.people.length, 1);
  assert.equal(next.people[0].name, "Ada Lovelace");
  assert.equal(JSON.stringify(next).includes("11111111"), false);
  assert.equal(JSON.stringify(next).includes("AL"), false);
});

test("several root circles sit inside Sapiens First Movement", () => {
  const layout = circleLayout([
    row({ ID: "G-1", Name: "Sapiens First Global", Type: "Circle" }),
    row({ ID: "G-2", Name: "CA State Committee", Type: "Circle" }),
    row({ ID: "G-3", Name: "California Chapters", Type: "Circle" }),
    row({
      ID: "G-4",
      Name: "Executive Director",
      Type: "Circle",
      "Parent Circle ID": "G-1",
    }),
    row({
      ID: "G-5",
      Name: "Visual Design",
      Type: "Role",
      "Parent Circle ID": "G-4",
    }),
  ]);
  assert.equal(layout.root?.row.Name, ATLAS_ORGANIZATION_NAME);
  assert.equal(layout.root?.children.length, 3);
  assert.ok((layout.root?.r ?? 0) > 0);
  assert.equal(layout.anchor?.row.Name, "Sapiens First Global");
  const branchNames = layout.branches.map((branch) => branch.row.Name).sort();
  assert.deepEqual(branchNames, [
    "CA State Committee",
    "California Chapters",
    "Executive Director",
  ]);
  const role = layout.nodes.get("G-5");
  assert.equal(role?.kind, "role");
  assert.ok((role?.r ?? 0) >= 20);
});
