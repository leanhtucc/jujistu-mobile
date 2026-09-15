# JUJISTU Icon Asset Workflow

Raw `.svg` files exported directly from the Figma design system are stored here as build-time source assets.
They are transformed into typed React Native TSX glyph components under `src/ui/atoms/icon/glyphs/` via `@svgr/cli`.

## Workflow

1. **Export SVG from Figma**: Export vector icon directly from Figma (do not optimize or simplify paths).
2. **Place in Folder**: Put the raw `.svg` file into the appropriate category folder:
   - `common/`: Shared icons used across multiple features (e.g. settings, add, close).
   - `home/`: Home-feature-specific icons.
   - `tabs/`: Bottom navigation tab bar icons (e.g. home, tournament, shop, mission, friends).
3. **Run Generator**:
   ```bash
   npm run icons:generate
   ```
4. **Review Generated TSX**: Check the output component under `src/ui/atoms/icon/glyphs/<folder>/<icon-name>.tsx`.
5. **Verify Geometry & Color Ownership**:
   - Confirm viewBox and vector paths match Figma.
   - For monochrome icons, verify fill/stroke uses `{color}`.
   - For multicolor icons, ensure colors are preserved as expected.
6. **Register in Registry**: Manually register approved glyph in `src/ui/atoms/icon/glyphs.ts`.
7. **Consume Only Through AppIcon**: Import and render via `<AppIcon name="..." />`. Never import raw SVG files directly into production screens or components.
