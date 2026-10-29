const windowQueues = new Map();

async function moveNewTab(id) {
  try {
    const tab = await chrome.tabs.get(id);
    // Preserve deliberate placement inside groups and the pinned section.
    if (tab.pinned || tab.groupId !== -1) return;
    const pinned = await chrome.tabs.query({ windowId: tab.windowId, pinned: true });
    if (tab.index !== pinned.length) {
      await chrome.tabs.move(id, { index: pinned.length });
    }
  } catch (error) {
    // Tabs may disappear or change windows before their turn in the queue.
    console.debug('TabRise could not move a tab:', error.message);
  }
}

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.id === undefined || tab.pinned || tab.groupId !== -1) return;
  const previous = windowQueues.get(tab.windowId) || Promise.resolve();
  const next = previous.then(() => moveNewTab(tab.id));
  windowQueues.set(tab.windowId, next);
  next.finally(() => {
    if (windowQueues.get(tab.windowId) === next) windowQueues.delete(tab.windowId);
  });
});
