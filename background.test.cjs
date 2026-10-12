const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "background.js"), "utf8");
function load(update = async () => {}) {
  let click;
  const calls = [], warnings = [];
  vm.runInNewContext(source, {
    URL,
    console: { warn: (message) => warnings.push(message) },
    chrome: {
      action: { onClicked: { addListener: (listener) => { click = listener; } } },
      tabs: { update: (...args) => { calls.push(args); return update(...args); } },
    },
  });
  assert.equal(typeof click, "function");
  return { click, calls, warnings };
}

test("redirects only the clicked tab and preserves supported URL text", async () => {
  for (const url of [
    "https://medium.com/@author/article-123456789abc",
    "https://publication.medium.com/article-123456789abc",
    "https://nested.publication.medium.com/article-123456789abc",
    "https://MEDIUM.COM/@author/article-123456789abc",
    "https://medium.com:443/article-123456789abc",
    "https://medium.com/@author/freedium-mirror.cfd-in-the-title-123456789abc",
    "https://medium.com/article-123456789abc?source=demo&value=a%2Fb#section",
  ]) {
    const { click, calls, warnings } = load();
    await click({ id: 7, url });
    assert.equal(calls.length, 1, url);
    assert.equal(calls[0][0], 7);
    assert.equal(calls[0][1].url, `https://freedium-mirror.cfd/${url}`);
    assert.equal(warnings.length, 0);
  }
});

test("leaves unsupported, malformed, credential-bearing and lookalike URLs untouched", async () => {
  for (const url of [
    undefined, "", "not a URL", "https://",
    "http://medium.com/article-123456789abc",
    "chrome://settings", "chrome-extension://example/page.html", "about:blank",
    "file:///private/article.html", "data:text/html,article", "javascript:alert(1)",
    "https://example.com/account?token=demo",
    "https://medium.com.evil.example/article-123456789abc",
    "https://evilmedium.com/article-123456789abc",
    "https://medium.com@evil.example/article-123456789abc",
    "https://user:password@medium.com/article-123456789abc",
    "https://medium.com:8443/article-123456789abc",
    "https://freedium-mirror.cfd/https://medium.com/article-123456789abc",
    "https://reader.freedium-mirror.cfd/",
  ]) {
    const { click, calls } = load();
    await click({ id: 7, url });
    assert.equal(calls.length, 0, String(url));
  }
});

test("never navigates a missing or invalid tab ID", async () => {
  for (const id of [undefined, null, -1, "7", 1.5]) {
    const { click, calls } = load();
    await click({ id, url: "https://medium.com/article-123456789abc" });
    assert.equal(calls.length, 0, String(id));
  }
});

test("handles a closed tab without exposing the source URL in a warning", async () => {
  const { click, calls, warnings } = load(async () => { throw new Error("tab closed"); });
  await click({ id: 7, url: "https://medium.com/article-123456789abc?source=private-demo" });
  assert.equal(calls.length, 1);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /could not navigate/);
  assert.doesNotMatch(warnings[0], /private-demo|https:/);
});

test("manifest keeps minimal permissions and ships correctly sized PNG icons", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "manifest.json"), "utf8"));
  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(manifest.permissions, ["activeTab"]);
  assert.equal(manifest.host_permissions, undefined);
  assert.equal(manifest.content_scripts, undefined);
  assert.ok(fs.existsSync(path.join(__dirname, manifest.background.service_worker)));
  assert.ok(manifest.action.default_title);
  for (const icons of [manifest.icons, manifest.action.default_icon]) {
    for (const [size, filename] of Object.entries(icons)) {
      const png = fs.readFileSync(path.join(__dirname, filename));
      assert.deepEqual(png.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      assert.equal(png.readUInt32BE(16), Number(size));
      assert.equal(png.readUInt32BE(20), Number(size));
    }
  }
});
