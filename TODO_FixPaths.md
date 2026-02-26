# TODO: Fix Path Issues in HTML Files

## Plan:
- Fix relative paths (./JS/, ./CSS/, ./Assets/) to absolute paths (/JS/, /CSS/, /Assets/)
- Fix Font Awesome CDN integrity hash

## Files to fix:
- [x] public/product.html
- [x] public/shop.html
- [x] public/cart.html
- [x] public/checkout.html
- [x] public/index.html
- [x] public/about.html
- [x] public/blog.html
- [x] public/FAQ.html
- [x] public/login.html
- [x] public/signup.html
- [x] public/forgot-password.html
- [x] public/reset-password.html
- [x] public/admin.html
- [x] public/admin_new.html

## Changes Made:
1. Changed all relative paths `./JS/`, `./CSS/`, `./Assets/` to absolute paths `/JS/`, `/CSS/`, `/Assets/`
2. Fixed the malformed Font Awesome CDN integrity hash (removed spaces in the hash)
3. Updated internal links to use absolute paths (e.g., `/login` instead of `login.html`)
