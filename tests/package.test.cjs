const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json')));

test('all Chrome manifest file references exist', () => {
  const files = [manifest.background.service_worker, manifest.action.default_popup,
    ...Object.values(manifest.icons), ...Object.values(manifest.action.default_icon)];
  for (const name of files) assert.ok(fs.existsSync(path.join(root, name)), name);
});

test('toolbar and installation icons are PNGs at the declared sizes', () => {
  for (const [size, name] of Object.entries(manifest.icons)) {
    const bytes = fs.readFileSync(path.join(root, name));
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', name);
    assert.equal(bytes.readUInt32BE(16), Number(size), name);
    assert.equal(bytes.readUInt32BE(20), Number(size), name);
  }
});

test('branding version and permission scope are consistent', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json')));
  assert.equal(manifest.name, 'TabRise');
  assert.equal(manifest.version, pkg.version);
  assert.equal(manifest.permissions, undefined);
  assert.equal(manifest.host_permissions, undefined);
  const html = fs.readFileSync(path.join(root, manifest.action.default_popup), 'utf8');
  assert.ok(html.includes(`<span class="version">${manifest.version}</span>`));
  assert.ok(html.includes('<title>TabRise</title>'));
  assert.ok(!html.includes('<script'));
});
