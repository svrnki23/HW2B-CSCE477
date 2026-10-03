# Simple Login Form (CSCE 477 practice)

This small project copies the basic layout of an online shop login page. It has two fields: email and password. JavaScript checks for empty fields, an `@` in the email, and a password of at least eight characters. A Node.js server repeats the checks and rejects badly formatted email addresses. The page uses `textContent` for messages instead of inserting HTML.

**This is a validation demonstration, not a real login system.** It has no database, accounts, or password storage. Do not enter a real password.

## How to run

1. Install Node.js 18 or newer.
2. Open a terminal in this folder.
3. Run `npm start`.
4. Open `http://localhost:3001` in your browser.

No additional packages are needed. Run `npm test` to check the server behavior.

## Basic tests

- Submit with both fields blank: the browser shows `Both fields are required.`
- Enter `hello` and `Password123`: the browser shows `Email must contain @.`
- Enter `student@example.com` and `short`: the browser reports the eight-character rule.
- Enter `student@example.com` and `Password123`: both browser and server validation pass.
- XSS test: use `<img src=x onerror=alert('XSS')>@test.com` as the email and `Password123` as the password. The basic JavaScript checks pass, but the server rejects the email. No alert should execute.

## What I would improve in a real project

Add a database with parameterized queries; store passwords with bcrypt and per-user salts; use HTTPS; include login throttling and secure sessions. These features are **not implemented** in this short class demonstration.

## Screenshot

`xss_test_screenshot.png` shows the XSS test input (`<img src=x onerror=alert('XSS')>@test.com`) being rejected by server-side validation with the message "Please enter a valid email address." No alert executes, which demonstrates that the input validation prevents the script from running.