// Email signup endpoint. The separately deployed Google Apps Script must match
// scripts/signup-apps-script.gs to save Timestamp, Email, and Interest columns.

const SIGNUP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXZdjPHlsgHyuklLQmJ2JNFjVZorzcdhUY-wkv3h5vTJuXxtqOveAK4JnIXVdwwSU0/exec';

// Styles for .sf/.sf-done live in shared.css alongside the rest of the design system.

// Email-only expressions of interest share one submission handler.
function createSignupForm(opts) {
  opts = opts || {};
  var form = document.createElement('form');
  form.className = 'sf sf--' + (opts.theme || 'light');
  var input = document.createElement('input');
  input.type = 'email';
  input.name = 'email';
  input.required = true;
  input.autocomplete = 'email';
  input.placeholder = opts.placeholder || 'Email address';
  input.setAttribute('aria-label', 'Email address');
  var button = document.createElement('button');
  button.type = 'submit';
  button.textContent = opts.buttonText || 'Keep me posted →';
  form.append(input, button);
  wireSignupForm(form, opts);
  return form;
}

function wireSignupForm(form, opts) {
  opts = opts || {};
  var interest = opts.interest || 'membership';
  var input = form.querySelector('input[type="email"]');
  var btn = form.querySelector('button');
  var btnText = btn.textContent;
  var pending = false;
  var status = document.createElement('div');
  status.className = 'signup-status';
  status.setAttribute('role', 'status');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    var email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.focus();
      return;
    }
    pending = true;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    form.after(status);
    status.textContent = '';

    // Apps Script redirects cross-origin; its no-cors response is opaque.
    // Wait for the request to settle; never report success on a timer.
    fetch(SIGNUP_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ email: email, interest: interest })
    }).then(function () {
      status.className = 'signup-done';
      status.textContent = "Thanks for your interest — we'll be in touch.";
      status.tabIndex = -1;
      form.replaceWith(status);
      status.focus({ preventScroll: true });
    }).catch(function () {
      pending = false;
      btn.disabled = false;
      btn.textContent = btnText;
      form.removeAttribute('aria-busy');
      status.textContent = "We couldn't send your email. Please try again.";
    });
  });
}

// Local signup links put keyboard users directly in the email field as well.
function focusSignup() {
  if (window.location.hash !== '#signup') return;
  var input = document.querySelector('#signup input[type="email"]');
  if (input) input.focus();
}
window.addEventListener('hashchange', focusSignup);
window.addEventListener('load', focusSignup);
document.addEventListener('click', function (event) {
  var link = event.target.closest('a[href="#signup"]');
  if (link) {
    event.preventDefault();
    var input = document.querySelector('#signup input[type="email"]');
    if (input) input.focus();
  }
});
