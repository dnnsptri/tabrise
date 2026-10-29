const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname, '../background.js'), 'utf8');
async function run(tabs, events) {
  let listener;
  const moves = [];
  const chrome = { tabs: {
    onCreated: { addListener(fn) { listener = fn; } },
    async get(id) { const t = tabs.find(t => t.id === id); if (!t) throw new Error('Tab closed'); return {...t}; },
    async query(q) { return tabs.filter(t => t.windowId === q.windowId && t.pinned); },
    async move(id, {index}) {
      const t = tabs.find(t => t.id === id);
      const old = t.index;
      for (const other of tabs) {
        if (other.id === id || other.windowId !== t.windowId) continue;
        if (old > index && other.index >= index && other.index < old) other.index++;
        if (old < index && other.index > old && other.index <= index) other.index--;
      }
      t.index = index;
      moves.push([id, index]);
    }
  }};
  vm.runInNewContext(source, {chrome, console});
  for (const event of events) listener(event);
  await new Promise(resolve => setImmediate(resolve));
  return moves;
}
const tab = (id, index, extras = {}) => ({id,index,windowId:1,pinned:false,groupId:-1,...extras});
(async () => {
  const checks = [
    ['ordinary new tab', [tab(1,0),tab(2,1)], [tab(2,1)], [[2,0]]],
    ['pinned boundary', [tab(1,0,{pinned:true}),tab(2,1),tab(3,2)], [tab(3,2)], [[3,1]]],
    ['preserve grouped tab', [tab(1,0),tab(2,1,{groupId:8})], [tab(2,1,{groupId:8})], []],
    ['preserve pinned tab', [tab(1,0,{pinned:true})], [tab(1,0,{pinned:true})], []],
    ['already first', [tab(1,0)], [tab(1,0)], []],
    ['burst creation', [tab(1,0),tab(2,1),tab(3,2)], [tab(2,1),tab(3,2)], [[2,0],[3,0]]],
    ['closed tab does not block next tab', [tab(1,0),tab(3,1)], [tab(2,1),tab(3,1)], [[3,0]]],
    ['windows isolated', [tab(1,0,{pinned:true}),tab(2,0,{windowId:2}),tab(3,1,{windowId:2})], [tab(3,1,{windowId:2})], [[3,0]]],
    ['recheck group after event', [tab(1,0),tab(2,1,{groupId:9})], [tab(2,1)], []]
  ];
  for (const [name,tabs,events,expected] of checks) {
    assert.deepEqual(await run(tabs,events),expected,name);
    console.log('PASS: '+name);
  }
  const manifest = JSON.parse(fs.readFileSync(require('node:path').join(__dirname, '../manifest.json')));
  assert.equal(manifest.manifest_version,3);
  assert.equal(manifest.permissions,undefined);
  assert.equal(manifest.host_permissions,undefined);
  console.log('PASS: manifest has no requested permissions');
})();
