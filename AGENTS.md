# Freedium Mirror Opener

- Dependency-free Chromium Manifest V3 extension. `manifest.json` declares the toolbar action and `background.js` service worker. No build step, server, database or provider credentials.
- Toolbar click redirects the clicked tab to `https://freedium-mirror.cfd/{original-url}`. Only HTTPS `medium.com` and subdomains are supported. Other hosts, protocols, credentials, non-default ports and invalid tabs must remain untouched.
- Keep only `activeTab` permission. No automatic navigation, content scripts or broad host permissions for this flow.
- Run `node --test background.test.cjs` (Node.js 18+) and `node --check background.js` after source changes. Tests execute the real worker with stubbed Chrome APIs; they do not certify browser installation or mirror availability.
- For browser checks, load the repository unpacked in an isolated Chromium profile. Verify the action on a public Medium URL, an unsupported page and a repeated click on the mirror. Preserve the user's existing extension and browsing state.
- Mirror service is external; document outages honestly. Never embed account/session URLs in demo evidence.
- PNG icons must match manifest sizes 16, 48 and 128. Preserve unrelated local files; ignore `.DS_Store` rather than staging it.
