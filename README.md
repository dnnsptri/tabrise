<img src="icons/icon128.png" width="80" height="80" alt="TabRise icon, a T rising above the horizon on a yellow background">

# TabRise

**New tabs. Up top.**

A tiny Chrome extension that puts new tabs at the top of your vertical tab list, below pinned tabs. Inspired by a habit I loved in Arc.

Built by [Dennis Petri](https://dennispetri.nl). Free, with no tracking.

## Install

[Download TabRise 0.1.1](https://github.com/dnnsptri/tabrise/raw/refs/heads/main/downloads/tabrise-0.1.1.zip), then:

1. Extract the ZIP.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** in the upper right corner.
4. Click **Load unpacked**.
5. Select the **tabrise** folder inside the extracted download. It contains `manifest.json`.
6. Open a new tab with **⌘T** on Mac or **Ctrl+T** on Windows and Linux.

The new tab should appear above your other unpinned tabs. For vertical tabs, open Chrome **Settings → Appearance → Tab position → Vertical**, if available in your version.

You can also clone this repository and load its root folder directly. No build or dependencies are needed to run the extension. This is a local installation, not a Chrome Web Store listing.

## Why it exists

I switch between projects throughout the day, with plenty of tabs open. In Arc, I liked having the latest tab at the top, right where I expected it. Moving to Chrome meant missing that small detail. TabRise brings it back.

It does one thing: move each newly created, ungrouped tab to the first position below pinned tabs.

## How it behaves

* Existing tabs are left alone when you install or reload TabRise.
* New tabs appear at the top, below pinned tabs.
* Tabs already inside a group when created stay in that group.
* New tabs opened in the background stay in the background.
* TabRise does not change which tab has focus.
* Each window is handled separately.
* With horizontal tabs, new tabs appear on the left, after pinned tabs.

Chrome can report restored tabs as newly created, so reopening closed tabs or restoring a session may change their order. The move happens just after creation, so you may see a brief movement. Another extension that rearranges tabs could conflict with TabRise.

## Update an existing installation

Unpacked extensions do not receive automatic updates from this repository.

1. Download and extract the new version.
2. Replace the contents of your existing installation folder with the new files. Keep the same folder path.
3. Open `chrome://extensions` and click **Reload** on the existing TabRise card.
4. Open a new tab to check it.

If you installed the original prototype named **New Tabs First**, replace the files in that original folder and reload its existing card. Its name will change to **TabRise**. Avoid installing both copies, since both would try to move tabs.

## Privacy

TabRise requests no browser permissions or website access. It has no analytics, content scripts, external dependencies, stored browsing data, or background network requests. It uses tab identifiers, window identifiers, positions, pinned state, and group state. It does not read website content, titles, URLs, or browsing history.

The optional **Source on GitHub** link opens GitHub only when you click it.

## Development

Run the automated tests with Node.js 20 or later:

```sh
npm test
```

Build a fresh installation ZIP with Python 3:

```sh
python3 scripts/package.py
```

The package contains the extension, icon assets, README, and license. No dependencies need to be installed.

The tests cover tab ordering, pinned tabs, groups, rapid creation, closed tabs, multiple windows, worker replacement, manifest references, and icon dimensions. Live Chrome checks also covered creating groups and closing tabs. Worker replacement is simulated, not a verified Chrome Web Store update. See [testing notes](docs/testing.md).

## Feedback

Found a bug or have a suggestion? [Open an issue](https://github.com/dnnsptri/tabrise/issues).

## License

[MIT License](LICENSE).
