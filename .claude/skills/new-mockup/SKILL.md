---
name: new-mockup
description: Create or extend an IFS Cloud (Aurena) style clickable HTML mockup for a client in mockups/<name>/. Use when the user asks for a mockup, screen, page, prototype or wireframe of IFS / Aurena, or wants to add a page to an existing mockup.
---

# Create an Aurena mockup

Follow CLAUDE.md (hard rules, page types, components). Steps:

1. **Understand the request.** Work out the client name, the business process, and which screens are needed (lobby, overview list, detail page, assistant, dialogs). If the client name or the list of screens is genuinely unclear, ask once. Otherwise choose sensible defaults and say what you assumed.
2. **Pick or create the folder** `mockups/<client>-<topic>/`. For a new mockup:
   - write `config.js` (copy the shape from `mockups/demo-maintenance/config.js`): title, user, notifications, and a navigator listing every page you build (plus a few `#` entries so it looks complete);
   - the start page is always `index.html`.
3. **Read the matching example** in `kit/examples/` for each page type before writing that page, and copy its structure. Fill it with realistic, consistent fictional data. The same order number, customer and amounts must match across pages. Use IFS terminology.
4. **Wire the flow:** list rows link to the detail page, the New command links to the assistant, the Finish button shows a toast, and dialogs open from their commands. Add `data-nav` ids that match `config.js`.
5. **Add client notes** (`.note-pin` / `.note-box`) only where the user asked for explanations or open questions.
6. **Register** the mockup in the root `index.html` between `MOCKUPS:START` and `MOCKUPS:END`.
7. **Verify:** start the `mockups` preview server, then open every page. Check for console errors, take a screenshot of each page, and click the navigator, tabs, edit mode and dialogs. Fix what is broken.
8. **Report** the pages created (as links), the assumptions you made, and how to share the mockup (`/export-mockup` or `python3 tools/bundle.py mockups/<name> --zip`).
