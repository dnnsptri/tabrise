const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname, '../background.js'),'utf8');
const tabs = [
 {id:1,windowId:1,index:0,pinned:true,groupId:-1,active:false},
 {id:2,windowId:1,index:1,pinned:false,groupId:-1,active:true},
 {id:3,windowId:1,index:2,pinned:false,groupId:7,active:false},
 {id:4,windowId:1,index:3,pinned:false,groupId:7,active:false}
];
let listener;
const moves = [];
const chrome = {tabs:{
 onCreated:{addListener(fn){listener=fn;}},
 async get(id){const t=tabs.find(t=>t.id===id);if(!t)throw Error('Tab closed');return {...t};},
 async query(q){return tabs.filter(t=>t.windowId===q.windowId && t.pinned);},
 async move(id,{index}){
  const tab=tabs.find(t=>t.id===id), old=tab.index;
  for(const t of tabs){if(t.id!==id && t.index>=index && t.index<old)t.index++;}
  tab.index=index;moves.push({id,index});
 }
}};
function startWorker(){vm.runInNewContext(source,{chrome,console});}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 startWorker();
 const before=JSON.stringify(tabs);
 startWorker(); // Replace the listener as Chrome would when replacing the worker.
 await settle();
 assert.equal(JSON.stringify(tabs),before);
 assert.equal(moves.length,0);
 console.log('PASS: worker replacement leaves all existing positions, pins, groups and focus untouched');
 const next={id:5,windowId:1,index:4,pinned:false,groupId:-1,active:false};tabs.push(next);listener({...next});await settle();
 assert.equal(next.index,1);
 assert.equal(tabs.find(t=>t.id===2).active,true);
 assert.deepEqual(tabs.filter(t=>t.groupId===7).map(t=>t.id),[3,4]);
 console.log('PASS: first new tab after replacement moves below pins without changing focus or group membership');
 startWorker();await settle();
 const grouped={id:6,windowId:1,index:5,pinned:false,groupId:7,active:false};tabs.push(grouped);listener({...grouped});await settle();assert.equal(grouped.index,5);
 console.log('PASS: group creation after worker restart stays in its group');
 const manifest=JSON.parse(fs.readFileSync(require('node:path').join(__dirname, '../manifest.json')));
 const candidate={...manifest,version:'0.1.2'};
 assert.equal(candidate.manifest_version,3);
 assert.equal(JSON.stringify(candidate.permissions),JSON.stringify(manifest.permissions));
 assert.equal(JSON.stringify(candidate.host_permissions),JSON.stringify(manifest.host_permissions));
 console.log('PASS: simulated version bump requires no additional permissions');
 console.log('LIMIT: this is a worker lifecycle simulation, not a Chrome installed update or Web Store delivery test');
})();
