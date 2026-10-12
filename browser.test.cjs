const assert = require("node:assert/strict");
const test = require("node:test");
const { setTimeout: sleep } = require("node:timers/promises");
const { chromium } = require("playwright");

test("installed toolbar action grants activeTab and navigates only supported pages", { timeout: 90000 }, async () => {
  const context = await chromium.launchPersistentContext("", {
    channel: "chromium",
    headless: true,
    args: [
      `--disable-extensions-except=${__dirname}`,
      `--load-extension=${__dirname}`,
      "--enable-unsafe-extension-debugging",
    ],
  });
  try {
    // All web pages are isolated fixtures; this tests the extension, not mirror uptime.
    await context.route(/^https?:\/\//, (route) => route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><title>Isolated article fixture</title><main>Fixture article</main>",
    }));
    const worker = context.serviceWorkers()[0] || await context.waitForEvent("serviceworker", { timeout: 15000 });
    const extensionId = new URL(worker.url()).hostname;
    await worker.evaluate(() => {
      globalThis.actionCount = 0;
      chrome.action.onClicked.addListener(() => { globalThis.actionCount++; });
    });
    const page = context.pages()[0] || await context.newPage();
    const sentinel = await context.newPage();
    await sentinel.goto("https://example.com/sentinel");
    await page.goto("https://medium.com/@fixture/article-123456789abc");
    await page.bringToFront();
    const tabBeforeClick = await worker.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      return { url: tab.url };
    });
    assert.equal(tabBeforeClick.url, undefined, "URL must be inaccessible before activeTab is granted");
    const cdp = await context.newCDPSession(page);
    const { targetInfo } = await cdp.send("Target.getTargetInfo");
    const click = async () => {
      const before = await worker.evaluate(() => globalThis.actionCount);
      await cdp.send("Extensions.triggerAction", { id: extensionId, targetId: targetInfo.targetId });
      const deadline = Date.now() + 5000;
      while (await worker.evaluate(() => globalThis.actionCount) === before) {
        assert.ok(Date.now() < deadline, "Native toolbar action did not dispatch onClicked");
        await sleep(25);
      }
    };
    for (const url of [
      "https://medium.com/@fixture/article-123456789abc",
      "https://publication.medium.com/freedium-mirror.cfd-in-title-123456789abc?source=fixture#section",
    ]) {
      await page.goto(url);
      const original = page.url();
      const mirror = `https://freedium-mirror.cfd/${original}`;
      await click();
      await page.waitForURL(mirror, { timeout: 5000 });
      assert.equal(sentinel.url(), "https://example.com/sentinel");
      assert.equal(context.pages().length, 2, "Action must reuse the clicked tab");
      await click();
      assert.equal(page.url(), mirror, "Repeated mirror click must not nest redirects");
      await page.goBack();
      assert.equal(page.url(), original, "Back must restore the original article");
    }
    for (const url of [
      "https://example.com/account?token=synthetic-fixture",
      "https://medium.com.evil.example/article-123456789abc",
      "http://medium.com/article-123456789abc",
      "chrome://settings/",
    ]) {
      await page.goto(url);
      const original = page.url();
      await click();
      assert.equal(page.url(), original, `Unsupported page changed: ${original}`);
    }
    console.log(`Chromium ${context.browser().version()}: unpacked worker, native action, activeTab, same-tab, Back and unsupported-page checks passed; web content isolated.`);
  } finally {
    await context.close();
  }
});
