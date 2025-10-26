# Lunara Beauty

Lunara Beauty is a small, static marketing site / prototype for a beauty and wellness brand. The project uses plain HTML and CSS (with Font Awesome icons) to showcase services, an about section, and a contact form.

This README documents the purpose, file structure, how to preview the site locally, and how to customize the project.

## Project purpose

- Simple static site to present a beauty brand (Lunara Beauty).
- Focused pages: home (hero + contact form), about (mission, reviews), services (pricing & service list), and contact (form).
- Designed as a visual prototype or starter marketing site you can extend.

## Pages / Files

- `index.html` — Home / showcase, lead capture (consultation form), top banner, offerings and footer.
- `about.html` — About section: mission, vision and client reviews.
- `services.html` — Services grid listing treatments with brief descriptions and prices.
- `contact.html` — Contact form and contact details.
- `style.css` — All styling, fonts and responsive rules for the site.
- `readme.md` — This file.
- Images referenced (example names): `makeup.png`, `aboutimg.png`, `contact.png`. If not present locally they may be linked externally or need to be added to the folder.

## Technologies

- HTML5
- CSS3 (Google font: Playfair Display)
- Font Awesome (icons loaded from CDN)

No build tools or package managers are required — the site is static.

## How to preview (local)

Open `index.html` directly in your browser by double-clicking it. For a better local experience (recommended), serve the folder with a small HTTP server so relative links and assets behave as expected.

Using Python (works on Windows, macOS, Linux):

```powershell
# from inside the Project folder
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Or use the VS Code Live Server extension and click "Go Live" while `index.html` is open.

## Customization notes

- Copy and replace placeholder images (e.g. `makeup.png`, `aboutimg.png`, `contact.png`) with your own assets in the same folder.
- Edit text content directly in the HTML files to change headings, descriptions, contact number, or pricing.
- Styling is centralized in `style.css`. Tweak color variables, spacing, and fonts there.
- Navigation links use relative file names (`index.html`, `about.html`, `services.html`, `contact.html`). Keep those file names if you want the navigation to work.

## Accessibility & improvements (suggested next steps)

- Add proper form handlers / backend integration (currently forms are static and do not submit to a server).
- Add alt text to all images (most images already include `alt`, verify and fill descriptive text).
- Improve semantic structure and add ARIA attributes if needed for assistive tech.
- Extract repetitive components (header/footer) into templates if moving to a templating system or static site generator.

## License & attribution

This project is a personal/static prototype. If you want to add a license, consider adding an `LICENSE` file (for example MIT) or update this README with your chosen license.

Icons: Font Awesome is used via CDN. Images may be placeholders — verify their origin before publishing.

## Contact / author

Owner: `mariamdatiashvili-sys` (GitHub repository: Lunara-Beauty)

If you want me to expand the README with deployment steps (GitHub Pages, Netlify), add a CONTRIBUTING guide, or wire-up a form backend (Netlify Forms / Formspree / simple PHP), tell me which option you prefer and I can implement it.

---
_Generated on 2025-10-26_

