// Click the extension icon → open supported HTTPS Medium pages on the mirror.

const MIRROR = "freedium-mirror.cfd";

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url || !Number.isInteger(tab.id) || tab.id < 0) return;

  let source;
  try {
    source = new URL(tab.url);
  } catch {
    return;
  }
  if (source.protocol !== "https:" || source.username || source.password || source.port) return;
  if (source.hostname !== "medium.com" && !source.hostname.endsWith(".medium.com")) return;

  try {
    await chrome.tabs.update(tab.id, { url: `https://${MIRROR}/${tab.url}` });
  } catch {
    console.warn("Freedium Mirror Opener could not navigate this tab. Try clicking again.");
  }
});
