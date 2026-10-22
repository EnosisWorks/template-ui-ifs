---
name: export-mockup
description: Package a mockup from mockups/<name>/ into standalone HTML files and a zip to send to a client. Use when the user wants to share, send, export, zip or deliver a mockup.
---

# Export a mockup

1. Identify the folder (`mockups/<name>`). If there are several mockups and it is unclear which one, list them and ask.
2. Check that the pages use only relative links within the folder (no `~/` or `../` links except the asset includes). Fix any that do.
3. Run `python3 tools/bundle.py mockups/<name> --zip`.
4. Open `dist/<name>/index.html` directly (file://) or through the preview server, and confirm that it renders with styles and that the navigator works.
5. Tell the user where `dist/<name>.zip` is. Remind them that the content is fictional unless they supplied real client data.
