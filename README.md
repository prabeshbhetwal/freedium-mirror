# Freedium Mirror Opener — Chromium based Browser's Extension

A minimal Chromium based browser's extension (Manifest V3) that redirects Medium articles to the free [Freedium mirror](https://freedium-mirror.cfd) with one click.

---

## Features

- **Toolbar button** — Click the extension icon on any Medium page to instantly open it on Freedium.
- **Minimal permissions** — Only requests `activeTab`.
- **Explicit action** — Redirects only the clicked tab; no automatic browsing interception or content injection.
- **Supported pages only** — HTTPS `medium.com` and its subdomains; unsupported pages stay untouched.

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
├── background.test.cjs # Offline URL, failure handling and manifest checks
├── AGENTS.md          # Project development instructions
└── README.md          # This file
```

---

## Installation (Load Unpacked)

1. **Download / clone** [this repository](https://github.com/prabeshbhetwal/freedium-mirror). No dependency installation, build step or API key is required.

2. In **Google Chrome**, open `chrome://extensions`; in **Microsoft Edge**, open `edge://extensions`.

3. Enable **Developer mode** (toggle in the top-right corner).

4. Click **"Load unpacked"**.

5. Select the repository folder containing `manifest.json` (a Git clone is normally named `freedium-mirror`).

6. The extension should now appear in your extensions list with the name **"Freedium Mirror Opener"**. Pin it to the toolbar for easy access.

---

## Usage

1. Navigate to a public HTTPS Medium article. For example, a deterministic URL-construction check uses:
   ```
   https://medium.com/@author/article-123456789abc
   ```

2. Click the Freedium Mirror Opener icon in the toolbar to redirect the page to the mirror.

3. The current tab navigates to `https://freedium-mirror.cfd/` followed by the original article URL. The example above is synthetic; it checks URL construction, not article availability.

4. On the mirror, an unrelated website, a browser settings page or a local file, clicking does nothing. HTTP URLs, URLs with credentials and non-default ports are also ignored. Custom Medium publication domains outside `*.medium.com` are not supported.

Use the browser's **Back** button to return to the original page. Click **Reload** on the extension card after editing its files. To stop, switch the extension off in the extensions page; no server or background process needs stopping.

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

The extension makes no background requests and stores no data. A successful click sends the article URL, including its query string, to the external mirror through browser navigation. The mirror controls its own availability, content and privacy practices. A valid redirect does not guarantee a readable article. If navigation fails, inspect the extension service worker console for the generic warning and retry the click.

## Development checks

With Node.js 18 or newer, run from the repository folder:

```sh
node --check background.js
node --test background.test.cjs
```

These checks need no dependencies or network access. They cover supported URLs, lookalike domains, unsupported protocols, missing tab information, navigation failures and manifest/icon consistency.

For an actual browser smoke check, use a separate Chromium profile, load the extension unpacked, then:

1. Open a real public HTTPS Medium article; click the toolbar action and verify the same tab's mirror URL.
2. Click again on the mirror and verify the URL stays unchanged.
3. Open `https://example.com` and `chrome://settings`; click and verify each stays unchanged.

Offline tests exercise the real worker with stubbed Chrome APIs. They do not certify browser installation or the mirror's live article retrieval.

---

## Customising Icons

Replace the PNG files in `icons/` with your own designs:
- `icon16.png` — 16×16 px
- `icon48.png` — 48×48 px
- `icon128.png` — 128×128 px

---

## License

MIT — do whatever you want with it.
