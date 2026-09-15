# Signup spreadsheet handler

The site sends `{ email, interest }` to the existing Apps Script web app in `signup.js`.
Interest is `membership`, `start-a-circle`, or `fellowship`.

## Update the existing deployment

1. Open the Apps Script project that handles the signup spreadsheet.
2. Replace its existing code with `signup-apps-script.gs` and save.
3. Choose **Deploy → Manage deployments**, select the existing web app, and click **Edit**.
4. Select **New version** and click **Deploy**. Updating the existing deployment keeps the endpoint URL used by the website.

The next valid submission writes the header **Timestamp | Email | Interest** and appends all three values. Existing signup rows are preserved; their Interest cells stay blank because their original interest is unknown.

The handler accepts the older `Start a Circle` label and normalizes it to `start-a-circle`. Missing interest defaults to `membership` for compatibility with older site versions.

The browser uses a cross-origin `no-cors` request and cannot read the handler's response. Browser payload checks do not prove a row was written; verify the spreadsheet after deploying the script.

Reference: https://developers.google.com/apps-script/concepts/deployments#edit_a_versioned_deployment
