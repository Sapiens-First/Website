const SHEET_ID = '1tFA7hIPKjgxoKBRgRaP5L360DzKW5u2IJGo4yNQRqmE';
const CONSENT_VERSION = '2026-10-15.1';
const CAMPAIGN_VERSION = '2026-10-15.1';
const CAMPAIGN_IDS = ['freeze-ai', 'stop-1984', 'no-killer-robots', 'citizens-dividend'];
const SIGNATURE_HEADERS = ['Receipt ID', 'Signed At', 'Email', 'Name', 'ZIP Code', 'Phone', 'Campaign', 'Demand Version', 'Consent Version', 'Email Updates', 'Source'];

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
function doGet() {
  return jsonResponse({ result: 'ready', service: 'campaign-signatures', version: CONSENT_VERSION, campaigns: CAMPAIGN_IDS });
}
function plainText(value) {
  const text = String(value || '');
  return /^[=+@-]/.test(text) ? "'" + text : text;
}
function canonicalEmail(value) {
  return String(value || '').replace(/^'(?=[=+@-])/, '').trim().toLowerCase();
}
function verifyHeaders(sheet, expected) {
  const actual = sheet.getRange(1, 1, 1, expected.length).getValues()[0];
  if (actual.some(function(value, index) { return value !== expected[index]; })) throw new Error('Unexpected sheet schema');
}
function doPost(e) {
  let lock;
  try {
    if (!e || !e.postData || e.postData.contents.length > 8192) return jsonResponse({ result: 'error' });
    const data = JSON.parse(e.postData.contents);
    if (!data || typeof data !== 'object' || typeof data.email !== 'string') return jsonResponse({ result: 'error' });
    const email = canonicalEmail(data.email);
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonResponse({ result: 'error' });
    if (data.action !== 'campaign-signature') return jsonResponse({ result: 'error' });
    if (CAMPAIGN_IDS.indexOf(data.campaignId) === -1 || data.agreed !== true || typeof data.updatesOptIn !== 'boolean' || data.demandVersion !== CAMPAIGN_VERSION || data.consentVersion !== CONSENT_VERSION || data.website) return jsonResponse({ result: 'error' });
    if (['name', 'zip', 'phone'].some(function(key) { return typeof data[key] !== 'string'; })) return jsonResponse({ result: 'error' });
    data.name = data.name.trim(); data.zip = data.zip.trim(); data.phone = data.phone.trim();
    if (data.name.length > 120 || /[\r\n\u0000]/.test(data.name) || (data.zip && !/^\d{5}(-\d{4})?$/.test(data.zip)) || (data.phone && (!/^[+\d().\s-]{7,30}$/.test(data.phone) || data.phone.replace(/\D/g, '').length < 7))) return jsonResponse({ result: 'error' });
    lock = LockService.getScriptLock();
    lock.waitLock(10000);
    const workbook = SpreadsheetApp.openById(SHEET_ID);
    const supporters = workbook.getSheetByName('Sheet1');
    if (!supporters) throw new Error('Supporter sheet missing');
    verifyHeaders(supporters, ['Timestamp', 'Email', 'Interest']);
    let signatures = workbook.getSheetByName('Campaign Signatures');
    if (!signatures) {
      signatures = workbook.insertSheet('Campaign Signatures');
      signatures.getRange(1, 1, 1, SIGNATURE_HEADERS.length).setValues([SIGNATURE_HEADERS]);
    }
    verifyHeaders(signatures, SIGNATURE_HEADERS);
    const rows = signatures.getLastRow() > 1 ? signatures.getRange(2, 1, signatures.getLastRow() - 1, SIGNATURE_HEADERS.length).getValues() : [];
    let saved = rows.find(function(row) { return canonicalEmail(row[2]) === email && row[6] === data.campaignId; });
    if (!saved) {
      saved = [Utilities.getUuid(), new Date().toISOString(), plainText(email), plainText(data.name), data.zip ? "'" + data.zip : '', plainText(data.phone), data.campaignId, CAMPAIGN_VERSION, CONSENT_VERSION, data.updatesOptIn, 'https://sapiensfirst.org/campaigns/' + data.campaignId];
      signatures.appendRow(saved);
    }
    const emails = supporters.getLastRow() > 1 ? supporters.getRange(2, 2, supporters.getLastRow() - 1, 1).getValues() : [];
    if (!emails.some(function(row) { return canonicalEmail(row[0]) === email; })) supporters.appendRow([saved[1], plainText(email), 'campaign:' + data.campaignId]);
    SpreadsheetApp.flush();
    return jsonResponse({ result: 'success', receiptId: saved[0], signedAt: saved[1], campaignId: saved[6], demandVersion: saved[7], consentVersion: saved[8], updatesOptIn: saved[9] === true || saved[9] === 'TRUE' });
  } catch (error) {
    return jsonResponse({ result: 'error' });
  } finally {
    if (lock) lock.releaseLock();
  }
}
