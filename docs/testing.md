# Testing notes

## Live Chrome checks

Tested on 29 October 2026 with the original 0.1.0 tab ordering code. The 0.1.1 update keeps that ordering code and changes the brand, icon, popup, and documentation.

The following checks passed in a separate window:

1. Open two tabs: newest appears first.
2. Pin a tab, group two other tabs, then open another tab: pinned tab stays first, new tab appears next, group stays intact.
3. Use **New tab in group**: new tab stays in that group.
4. Close the new grouped tab: original group members remain.
5. Open two more tabs: newest appears first below the pinned tab.
6. Close the newest ungrouped tab: remaining order and group membership stay intact.

Collapsing the group preserved tab positions. Temporary test tabs were removed afterward.

## Automated checks

`npm test` runs local simulations of Chrome tab APIs using the production background script. The tests check tab ordering, pinned boundaries, groups, rapid creation, tabs closed before processing, separate windows, and fresh worker initialization. Packaging checks verify the referenced files and PNG dimensions.

## Update simulation

Replacing the worker with a fresh instance left existing positions, pins, groups, and focus untouched. New tabs continued to move correctly afterward, including background tabs. Grouped tabs remained in their groups.

This is not a real installed Chrome update or a Web Store delivery test. It does not verify extension identity or events interrupted during an update. No browser permissions were added for 0.1.1. The branding update still needs a manual reload check in Chrome.

## Known limits

Session restoration may reorder tabs because Chrome can emit creation events for restored tabs. A tab created while the extension is being reloaded may miss processing. There is no catch up sweep, because moving existing tabs on startup would be surprising.
