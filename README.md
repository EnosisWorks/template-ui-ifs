# Aurena mockup kit

Clickable HTML mockups that look like IFS Cloud (Aurena), for client workshops and proposals. They are built with Claude Code and need no installation: plain HTML/CSS/JS.

## Quick start (for consultants)

1. Clone this repo (preferably **outside** OneDrive/iCloud folders: macOS can block the preview server there).
2. Open the folder in Claude Code (desktop app → Code tab, or `claude` in a terminal).
3. Ask for what you need in business terms, for example:
   > Create a mockup for Acme: a lobby for the service manager, a list of service orders and a service order detail page with tabs for lines, materials and time reports. Add an assistant to create a service order.

   or run `/new-mockup` with a description.
4. Claude builds the pages in `mockups/<client>-<topic>/`, checks them in the browser and adds them to the kit home page (`index.html`).
5. To send it to a client, ask "export the Acme mockup" or run `/export-mockup`. You get `dist/<name>.zip` with self-contained HTML files.

Tips:
- Iterate in plain language: "move the status column to the front", "add a Release command", "make the UI Polish", "add note 3 explaining the approval rule".
- Paste a screenshot of the real IFS screen when you want Claude to match it closely.
- Pin the navigator with the pin button next to its search box. The setting is remembered in your browser.
- Hide the orange client notes before a demo: user menu → "Show / hide mockup notes".

## Viewing without Claude

Double-click any `.html` file, or serve the repo:

```bash
python3 -m http.server 8765
```

then open http://localhost:8765.

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Kit home and catalog of all mockups |
| `assets/` | Shared CSS/JS (the "Aurena look"). Change only to improve the kit for everyone |
| `kit/examples/` | Reference page per Aurena page type: lobby, overview list, detail, assistant, component gallery |
| `kit/templates/blank.html` | Empty page |
| `mockups/<name>/` | One folder per client mockup, with its own `config.js` (title, user, navigator) |
| `tools/bundle.py` | Creates standalone HTML for clients |
| `CLAUDE.md`, `.claude/skills/` | Instructions that make Claude follow the kit's conventions |

## Notes

- The header shows a **MOCKUP** badge, not the IFS logo. Don't add IFS trademarks to client material.
- The look follows Aurena conventions: navigator, command bar, record selector, state indicator, lists, field groups, lobby elements and assistants. It is not a pixel-exact copy. Adjust colours and tokens at the top of `assets/ifs-cloud.css` if your IFS release looks different.
