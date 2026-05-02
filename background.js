// Click the extension icon → redirect current tab to freedium-mirror.cfd/{url}

const MIRROR = "freedium-mirror.cfd";

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url) return;
  if (tab.url.includes(MIRROR)) return;
  chrome.tabs.update(tab.id, { url: `https://${MIRROR}/${tab.url}` });
});
