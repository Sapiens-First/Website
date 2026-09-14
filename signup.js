// ─── SIGNUP FORM COMPONENT ────────────────────────────────────────────────────
// Replace this URL after deploying your Google Apps Script web app.
// Setup: script.google.com → New project → paste doPost below → Deploy as Web App
//
//   function doPost(e) {
//     var sheet = SpreadsheetApp.openById('1tFA7hIPKjgxoKBRgRaP5L360DzKW5u2IJGo4yNQRqmE').getSheets()[0];
//     var data = JSON.parse(e.postData.contents);
//     sheet.appendRow([new Date(), data.email, data.interest || '']);
//     var out = ContentService.createTextOutput(JSON.stringify({ result: 'success' }));
//     out.setMimeType(ContentService.MimeType.JSON);
//     return out;
//   }
//
// NOTE: this doPost lives in a Google Apps Script project deployed separately
// on script.google.com, not in this repo — the deployed script must be
// updated by hand to match the snippet above (add the `interest` column)
// before the interest value below will actually reach the sheet.

const SIGNUP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwq5O0dKmyb7g2phwi0eyM0WXTyFKJfSfG8WpDRnfl426C-LcSIcfQeMYx9N-8Vp3gC/exec';

// Styles for .sf/.sf-done live in shared.css alongside the rest of the design system.

// ─── FACTORY ──────────────────────────────────────────────────────────────────
// createSignupForm({ theme: 'dark'|'light', placeholder, buttonText })
// Returns a DOM node you can append wherever you like.

function createSignupForm(opts) {
  opts = opts || {};
  var theme       = opts.theme       || 'light';
  var placeholder = opts.placeholder || 'your@email.com';
  var btnText     = opts.buttonText  || 'Join →';
  var interest    = opts.interest    || '';

  var wrap   = document.createElement('div');
  wrap.className = 'sf sf--' + theme;

  var input  = document.createElement('input');
  input.type = 'email';
  input.placeholder = placeholder;
  input.autocomplete = 'email';

  var btn    = document.createElement('button');
  btn.type   = 'button';
  btn.textContent = btnText;

  wrap.appendChild(input);
  wrap.appendChild(btn);

  function submit() {
    var email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.classList.add('sf-err');
      input.focus();
      return;
    }
    input.classList.remove('sf-err');
    btn.disabled = true;
    btn.textContent = '…';

    // With mode:'no-cors' the response body/status is opaque, so waiting on
    // it confirms nothing beyond "the round trip finished" — and that round
    // trip can take 10-30s through Google's redirect hop. Show success once
    // either the request settles or this timeout fires, so the UI doesn't
    // sit spinning long enough for people to give up mid-submit.
    var settled = false;
    function showDone() {
      if (settled) return;
      settled = true;
      var done = document.createElement('span');
      done.className = 'sf-done';
      done.textContent = '✓ You\'re in — we\'ll be in touch.';
      wrap.innerHTML = '';
      wrap.appendChild(done);
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    var fallback = setTimeout(showDone, 600);

    fetch(SIGNUP_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, interest: interest })
    }).then(function () {
      clearTimeout(fallback);
      showDone();
    }).catch(function () {
      clearTimeout(fallback);
      if (settled) return;
      btn.disabled = false;
      btn.textContent = btnText;
      input.classList.add('sf-err');
    });
  }

  btn.addEventListener('click', submit);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });

  return wrap;
}

// ─── WIRE-UP (for hand-authored .signup-row markup) ────────────────────────────
// wireSignupForm(formEl, { interest }) — attaches the same submit/success/error
// behavior as createSignupForm() above, but to an existing <form class="signup-row">
// (with its own <input type="email"> + <button>) instead of building new DOM.
// Styles for .signup-row/.signup-done live in shared.css.

function wireSignupForm(form, opts) {
  opts = opts || {};
  var interest = opts.interest || '';
  var input = form.querySelector('input[type="email"]');
  var btn = form.querySelector('button');
  var btnText = btn.textContent;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.focus();
      return;
    }
    btn.disabled = true;
    btn.textContent = '…';

    var settled = false;
    function showDone() {
      if (settled) return;
      settled = true;
      var done = document.createElement('span');
      done.className = 'signup-done';
      done.textContent = '✓ You\'re in — we\'ll be in touch.';
      form.replaceWith(done);
    }
    var fallback = setTimeout(showDone, 600);

    fetch(SIGNUP_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, interest: interest })
    }).then(function () {
      clearTimeout(fallback);
      showDone();
    }).catch(function () {
      clearTimeout(fallback);
      if (settled) return;
      btn.disabled = false;
      btn.textContent = btnText;
    });
  });
}
