// Replace the existing Apps Script code, then update its web app deployment.
// Columns: Timestamp | Email | Interest. Existing rows are preserved.
const SHEET_ID = '1tFA7hIPKjgxoKBRgRaP5L360DzKW5u2IJGo4yNQRqmE';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const email = String(data.email || '').trim();
  const interest = data.interest === 'Start a Circle' ? 'start-a-circle' : (data.interest || 'membership');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !['membership', 'start-a-circle', 'fellowship'].includes(interest)) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    sheet.getRange(1, 1, 1, 3).setValues([['Timestamp', 'Email', 'Interest']]);
    // Treat email addresses beginning with '=' as text in Sheets.
    const safeEmail = email.startsWith('=') ? "'" + email : email;
    sheet.appendRow([new Date().toISOString(), safeEmail, interest]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
