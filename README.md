# Freedium Mirror Opener — Chrome Extension

A minimal Chromium based browser's extension (Manifest V3) that redirects Medium articles to the free [Freedium mirror](https://freedium-mirror.cfd) with one click.

---

## Features

- **Toolbar button** — Click the extension icon on any Medium page to instantly open it on Freedium.
- **Minimal permissions** — Only requests `activeTab`.

---

## File Structure

```
freedium-mirror.cfd extension/
├── manifest.json      # Extension manifest (Manifest V3)
├── background.js      # Service worker — handles icon click to redirect
├── icons/
│   ├── icon16.png     # 16×16 toolbar icon
│   ├── icon48.png     # 48×48 extensions page icon
│   └── icon128.png    # 128×128 Chrome Web Store icon
└── README.md          # This file
```

---

## Installation (Load Unpacked)

1. **Download / clone** this folder so you have the `freedium-mirror.cfd extension/` directory on your machine.

2. Open **Google Chrome** and navigate to:
   ```
   chrome://extensions
   ```

3. Enable **Developer mode** (toggle in the top-right corner).

4. Click **"Load unpacked"**.

5. Select the `freedium-mirror.cfd extension/` folder (the one containing `manifest.json`).

6. The extension should now appear in your extensions list with the name **"Freedium Mirror Opener"**. Pin it to the toolbar for easy access.

---

## Usage

1. Navigate to any Medium article, for example:
   ```
   https://medium.com/some-path/article-slug-12345
   ```

2. Click the Freedium Mirror Opener icon in the toolbar to redirect the page to the mirror.

3. If you're already on the mirror domain, clicking the icon does nothing.

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

---

## Customising Icons

Replace the PNG files in `icons/` with your own designs:
- `icon16.png` — 16×16 px
- `icon48.png` — 48×48 px
- `icon128.png` — 128×128 px

---

## License

MIT — do whatever you want with it.
