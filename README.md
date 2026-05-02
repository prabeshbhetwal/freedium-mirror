# Freedium Mirror Opener — Chrome Extension

A minimal Chrome extension (Manifest V3) that redirects Medium articles to the free [Freedium mirror](https://freedium-mirror.cfd) with one click.

---

## Features

- **Toolbar button** — Click the extension icon on any Medium page to instantly open it on Freedium.
- **Right-click menu** — Right-click on a Medium page (or a link to Medium) and select **"Open in Freedium Mirror"**.
- **Smart URL handling** — Preserves query parameters and fragments; won't double-wrap URLs that are already on the mirror.
- **Minimal permissions** — Only requests `activeTab` and `contextMenus`.

---

## File Structure

```
chrome-extension/
├── manifest.json      # Extension manifest (Manifest V3)
├── background.js      # Service worker — context menu + domain caching
├── popup.html         # Popup UI (shown on toolbar icon click)
├── popup.js           # Popup logic — status detection & redirect button
├── options.html       # Settings page UI
├── options.js         # Settings logic — configure mirror domain
├── icons/
│   ├── icon16.png     # 16×16 toolbar icon
│   ├── icon48.png     # 48×48 extensions page icon
│   └── icon128.png    # 128×128 Chrome Web Store icon
└── README.md          # This file
```

---

## Installation (Load Unpacked)

1. **Download / clone** this folder so you have the `chrome-extension/` directory on your machine.

2. Open **Google Chrome** and navigate to:
   ```
   chrome://extensions
   ```

3. Enable **Developer mode** (toggle in the top-right corner).

4. Click **"Load unpacked"**.

5. Select the `chrome-extension/` folder (the one containing `manifest.json`).

6. The extension should now appear in your extensions list with the name **"Freedium Mirror Opener"**. Pin it to the toolbar for easy access.

---

## How to Test

1. Navigate to any Medium article, for example:
   ```
   https://medium.com/some-path/article-slug-12345
   ```

2. **Option A — Toolbar popup:**
   Click the Freedium Mirror Opener icon in the toolbar. A popup appears showing the page status and a green **"Open in Freedium Mirror"** button. Click it to redirect.

3. **Option B — Right-click menu:**
   Right-click anywhere on the Medium page → select **"Open in Freedium Mirror"**. Same redirect happens.

4. **Right-click a Medium link:**
   On any page, right-click a link pointing to `medium.com` → select **"Open in Freedium Mirror"** → opens the mirrored article in a **new tab**.

5. **Non-Medium pages:**
   Clicking the toolbar icon on a non-Medium page shows the popup with a greyed-out status: "Not a Medium page".

6. **Already on mirror:**
   If you're already on the mirror domain, the popup shows a purple indicator: "Already on Freedium mirror".

7. **Settings page:**
   Click the gear icon at the bottom of the popup (or go to the extension's Options). You can change the mirror domain to any alternative, with a live URL preview.

---

## Supported Domains

| Pattern | Example |
|---|---|
| `https://medium.com/*` | `https://medium.com/@user/article-123` |
| `https://*.medium.com/*` | `https://towardsdatascience.medium.com/article-456` |

---

## Permissions

| Permission | Why |
|---|---|
| `activeTab` | Read the current tab's URL when the user clicks the icon |
| `contextMenus` | Add the right-click menu item |
| `storage` | Save user-configured mirror domain (synced across devices) |

---

## Settings

Open the **Settings** page from:
- The gear icon at the bottom of the popup
- Chrome → Extensions → Freedium Mirror Opener → Options

You can:
- **Change the mirror domain** (e.g. switch to a different Freedium mirror)
- **See a live URL preview** as you type
- **Reset to default** (`freedium-mirror.cfd`) anytime

Settings are synced via `chrome.storage.sync`, so they follow your Chrome profile across devices.

---

## Customising Icons

Replace the PNG files in `icons/` with your own designs:
- `icon16.png` — 16×16 px
- `icon48.png` — 48×48 px
- `icon128.png` — 128×128 px

---

## License

MIT — do whatever you want with it.
