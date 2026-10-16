# hse-royals-dashboard
Hamilton Southeastern Royals 2026 football season dashboard

## Installed app

`index.html` links `manifest.webmanifest`, which gives the installed app its name, colours (`theme_color` #0a3d86, the page's theme-color tag; `background_color` #071f43, the hero banner the page opens on) and icons in `icons/`.  There is deliberately no `id`: Chrome resolves `id` against the origin, not the page's path, so on a shared host such as `daboodah-oss.github.io` any relative value would point at the host root and change the identity of copies already installed.  Without it the identity is `start_url`, which is what installed copies already have; keep `start_url` stable.  The maskable icon is made from `icons/icon-512.png` by `tools/make_maskable.py` (needs Pillow); rerun it if the logo changes.

Service worker (`sw.js`), and why it exists: the page has an "Install app" button driven by Chrome's install prompt, and that prompt still requires a service worker with a fetch handler.  It is network-first for the page (a cached copy only when offline), caches only real 200 responses, and caches the icons.  Bump both cache versions in `sw.js` on every change to it.

An installed copy picks up a changed manifest on Chrome's own cycle (about daily, on launch), not on publish; delete and re-add the app to force it.
