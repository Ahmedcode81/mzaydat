# Saudi Plate Design - SVG Integration Plan

## ✅ Completed

### 1. SVG Plate Design Asset
- [x] Create `assets/plate-default.svg` — colorized Saudi plate design based on the provided SVG blueprint
- [x] Blue letters zone (left), white number zone (right), palm & swords emblem (center), "المملكة العربية السعودية" text (bottom-right)
- [x] Remove sample number/letter glyphs so dynamic app text overlays cleanly
- [x] Single zone divider (blue→white), rounded frame, screw holes, palm & swords emblem

### 2. CSS Integration (`css/plate.css`)
- [x] Use the SVG as a full-bleed background design layer on `.saudi-plate`
- [x] Fixed aspect-ratio plate sizing (320px base / 420px display) with sm/md/lg scale support
- [x] `.plate-blue` → transparent left overlay (39.6% width) aligned to blue SVG zone
- [x] `.plate-white` → transparent right overlay (60.4% width) with numbers on top
- [x] `.plate-logo` strip hidden in the SVG design (branding lives in the header)
- [x] Keep glow effect, display variant, RTL-locked direction, and responsive scaling

### 3. HTML Tweaks
- [x] `admin.html` — center preview, cap plate width, add static fallback plate markup
- [x] `live.html` — center `#live-plate`, cap plate width, add static fallback plate markup

### 4. Verification
- [ ] Open admin.html to verify the plate design
- [ ] Open live.html to verify the plate on the live screen

## 📝 Notes
- The `js/` directory (store.js, plate-component.js, logos.js, admin.js, live.js) referenced by the HTML files is currently missing from the workspace, so the plate must be rendered by the app's scripts to see dynamic content.
- Static fallback plate markup is included in both HTML files so the new SVG design is visible even without the missing scripts.
- The store logo strip is hidden on the plate itself; the store logo still shows in the live header.

</content>

