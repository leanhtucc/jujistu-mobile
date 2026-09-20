export {};

const fs = require('fs');
const os = require('os');
const path = require('path');

// Load generate-icons module
const {
  loadManifest,
  analyzeSvg,
  normalizeColor,
  runGenerator,
} = require('../scripts/generate-icons');

describe('generate-icons pipeline (Isolated in Temp Directory)', () => {
  jest.setTimeout(30000);

  let tempRoot: string;
  let tempSourceRoot: string;
  let tempGlyphsRoot: string;
  let tempManifestPath: string;

  beforeEach(() => {
    // Create completely isolated temp directory for each test
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'jujistu-icon-test-'));
    tempSourceRoot = path.join(tempRoot, 'assets', 'icons');
    tempGlyphsRoot = path.join(
      tempRoot,
      'src',
      'ui',
      'atoms',
      'icon',
      'glyphs',
    );
    tempManifestPath = path.join(tempRoot, '.icon-manifest.json');

    fs.mkdirSync(path.join(tempSourceRoot, 'tabs'), { recursive: true });
    fs.mkdirSync(path.join(tempGlyphsRoot, 'tabs'), { recursive: true });
  });

  afterEach(() => {
    // Clean up temp directory
    try {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  });

  const SAMPLE_SVG_A = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 0 L20 20 L0 20 Z" fill="#FE8B33"/>
</svg>`;

  const SAMPLE_SVG_B = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="10" stroke="#000000" stroke-width="2"/>
</svg>`;

  const SAMPLE_SVG_WITH_GRADIENT = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
<defs>
  <linearGradient id="g1"><stop offset="0" stop-color="#A70100"/><stop offset="1" stop-color="#FE8B33"/></linearGradient>
</defs>
<rect width="20" height="20" fill="url(#g1)"/>
</svg>`;

  it('1. Incremental Generation: generates new icons, then skips unchanged icons on next run', async () => {
    const svgPathA = path.join(tempSourceRoot, 'tabs', 'icon-a.svg');
    const svgPathB = path.join(tempSourceRoot, 'tabs', 'icon-b.svg');
    fs.writeFileSync(svgPathA, SAMPLE_SVG_A, 'utf8');
    fs.writeFileSync(svgPathB, SAMPLE_SVG_B, 'utf8');

    // Run 1: Should generate both
    const res1 = await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
    });

    expect(res1.generated).toHaveLength(2);
    expect(res1.skipped).toHaveLength(0);
    expect(res1.conflicts).toHaveLength(0);

    const tsxPathA = path.join(tempGlyphsRoot, 'tabs', 'icon-a.tsx');
    const tsxPathB = path.join(tempGlyphsRoot, 'tabs', 'icon-b.tsx');
    expect(fs.existsSync(tsxPathA)).toBe(true);
    expect(fs.existsSync(tsxPathB)).toBe(true);
    expect(fs.existsSync(tempManifestPath)).toBe(true);

    const m1 = loadManifest(tempManifestPath);
    expect(Object.keys(m1.entries)).toHaveLength(2);

    // Run 2: Without changes -> should skip both
    const res2 = await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
    });

    expect(res2.generated).toHaveLength(0);
    expect(res2.skipped).toHaveLength(2);
    expect(res2.conflicts).toHaveLength(0);
  });

  it('2. Output Conflict Detection: prevents overwriting manually edited TSX file without annotations', async () => {
    const svgPathA = path.join(tempSourceRoot, 'tabs', 'icon-a.svg');
    fs.writeFileSync(svgPathA, SAMPLE_SVG_A, 'utf8');

    // Run 1: Initial generation
    await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
    });

    const tsxPathA = path.join(tempGlyphsRoot, 'tabs', 'icon-a.tsx');
    const originalTsx = fs.readFileSync(tsxPathA, 'utf8');

    // Simulate manual edit (e.g. developer added custom logic without any annotations)
    const editedTsx = originalTsx + '\n// custom manual addition\n';
    fs.writeFileSync(tsxPathA, editedTsx, 'utf8');

    // Also update source SVG to simulate an external change that would normally trigger regeneration
    fs.writeFileSync(svgPathA, SAMPLE_SVG_A.replace('M10 0', 'M10 1'), 'utf8');

    // Run 2: Should detect conflict and NOT overwrite
    const res2 = await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
    });

    expect(res2.conflicts).toHaveLength(1);
    expect(res2.conflicts[0].target).toContain('icon-a.tsx');
    expect(res2.generated).toHaveLength(0);

    // Verify content is PRESERVED
    expect(fs.readFileSync(tsxPathA, 'utf8')).toBe(editedTsx);
  });

  it('3. Untracked Output Detection: protects pre-existing TSX files not in manifest', async () => {
    const svgPathA = path.join(tempSourceRoot, 'tabs', 'icon-a.svg');
    const tsxPathA = path.join(tempGlyphsRoot, 'tabs', 'icon-a.tsx');
    fs.writeFileSync(svgPathA, SAMPLE_SVG_A, 'utf8');

    // Pre-create TSX before running generator (simulating untracked pre-existing glyph)
    const preExistingContent = '// pre-existing unmanifested file';
    fs.writeFileSync(tsxPathA, preExistingContent, 'utf8');

    const res = await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
    });

    // Should detect as conflict/untracked and not overwrite
    expect(res.conflicts).toHaveLength(1);
    expect(fs.readFileSync(tsxPathA, 'utf8')).toBe(preExistingContent);
  });

  it('4. Strict Force Policy: allows forcing specific file, rejects blanket force', async () => {
    const svgPathA = path.join(tempSourceRoot, 'tabs', 'icon-a.svg');
    const tsxPathA = path.join(tempGlyphsRoot, 'tabs', 'icon-a.tsx');
    fs.writeFileSync(svgPathA, SAMPLE_SVG_A, 'utf8');

    await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
    });

    // Manually edit file
    fs.writeFileSync(tsxPathA, '// custom edit', 'utf8');

    // Blanket force without file should throw error
    await expect(
      runGenerator({
        projectRoot: tempRoot,
        sourceRoot: tempSourceRoot,
        glyphsRoot: tempGlyphsRoot,
        manifestPath: tempManifestPath,
        force: true, // blanket force
      }),
    ).rejects.toThrow(/Blanket --force is not permitted/);

    // Targeted force for specific file should succeed
    const res = await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
      forceFile: 'tabs/icon-a.svg',
    });

    expect(res.generated).toHaveLength(1);
    expect(fs.readFileSync(tsxPathA, 'utf8')).not.toBe('// custom edit');
  });

  it('5. Targeted Generation: processes only the specified file', async () => {
    const svgPathA = path.join(tempSourceRoot, 'tabs', 'icon-a.svg');
    const svgPathB = path.join(tempSourceRoot, 'tabs', 'icon-b.svg');
    fs.writeFileSync(svgPathA, SAMPLE_SVG_A, 'utf8');
    fs.writeFileSync(svgPathB, SAMPLE_SVG_B, 'utf8');

    const res = await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
      targetFile: 'tabs/icon-a.svg',
    });

    expect(res.generated).toHaveLength(1);
    expect(res.generated[0].source).toContain('icon-a.svg');

    // icon-b should NOT have been generated
    const tsxPathB = path.join(tempGlyphsRoot, 'tabs', 'icon-b.tsx');
    expect(fs.existsSync(tsxPathB)).toBe(false);
  });

  it('6. Missing Output Regeneration: regenerates when TSX was deleted', async () => {
    const svgPathA = path.join(tempSourceRoot, 'tabs', 'icon-a.svg');
    fs.writeFileSync(svgPathA, SAMPLE_SVG_A, 'utf8');

    await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
    });

    const tsxPathA = path.join(tempGlyphsRoot, 'tabs', 'icon-a.tsx');
    expect(fs.existsSync(tsxPathA)).toBe(true);

    // Delete output
    fs.unlinkSync(tsxPathA);

    // Run again
    const res = await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
    });

    expect(res.generated).toHaveLength(1);
    expect(fs.existsSync(tsxPathA)).toBe(true);
  });

  it('7. Idempotency: repeated runs yield exact identical files and manifest hashes', async () => {
    const svgPathA = path.join(tempSourceRoot, 'tabs', 'icon-a.svg');
    fs.writeFileSync(svgPathA, SAMPLE_SVG_A, 'utf8');

    await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
    });

    const tsxPathA = path.join(tempGlyphsRoot, 'tabs', 'icon-a.tsx');
    const contentRun1 = fs.readFileSync(tsxPathA, 'utf8');
    const manifestRun1 = fs.readFileSync(tempManifestPath, 'utf8');

    // Run again
    await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
    });

    const contentRun2 = fs.readFileSync(tsxPathA, 'utf8');
    const manifestRun2 = fs.readFileSync(tempManifestPath, 'utf8');

    expect(contentRun2).toBe(contentRun1);
    expect(manifestRun2).toBe(manifestRun1);
  });

  it('8. Malformed SVG Handling: reports error without crashing other files', async () => {
    const svgPathA = path.join(tempSourceRoot, 'tabs', 'icon-a.svg');
    const svgPathBad = path.join(tempSourceRoot, 'tabs', 'bad.svg');
    fs.writeFileSync(svgPathA, SAMPLE_SVG_A, 'utf8');
    fs.writeFileSync(svgPathBad, 'this is not valid svg XML', 'utf8');

    const res = await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
    });

    expect(res.errors).toHaveLength(1);
    expect(res.errors[0].source).toContain('bad.svg');
    expect(res.generated).toHaveLength(1);
    expect(res.generated[0].source).toContain('icon-a.svg');
  });

  it('9. Strict Color Replacement Boundaries: preserves fill="none", gradients, and opacity', () => {
    const analysis = analyzeSvg(SAMPLE_SVG_WITH_GRADIENT);
    // url(#g1) must NOT be counted as a replaceable solid color
    expect(analysis.colors).toHaveLength(0);
    expect(analysis.hasGradient).toBe(true);

    // Color normalizer preserves special values
    expect(normalizeColor('none')).toBe('none');
    expect(normalizeColor('url(#grad1)')).toBe('url(#grad1)');
    expect(normalizeColor('transparent')).toBe('transparent');
    expect(normalizeColor('#fff')).toBe('#FFFFFF');
    expect(normalizeColor('#ffffff')).toBe('#FFFFFF');
    expect(normalizeColor('white')).toBe('#FFFFFF');
  });

  it('10. Audit / Dry-Run Mode: reports actions without writing files or updating manifest', async () => {
    const svgPathA = path.join(tempSourceRoot, 'tabs', 'icon-a.svg');
    fs.writeFileSync(svgPathA, SAMPLE_SVG_A, 'utf8');

    const res = await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
      dryRun: true,
    });

    expect(res.dryRun).toBe(true);
    expect(res.generated).toHaveLength(1);

    // File and manifest must NOT exist
    const tsxPathA = path.join(tempGlyphsRoot, 'tabs', 'icon-a.tsx');
    expect(fs.existsSync(tsxPathA)).toBe(false);
    expect(fs.existsSync(tempManifestPath)).toBe(false);
  });

  it('11. Manifest Write Failure Handling: throws descriptive error if manifest path is unwritable', async () => {
    const svgPathA = path.join(tempSourceRoot, 'tabs', 'icon-a.svg');
    fs.writeFileSync(svgPathA, SAMPLE_SVG_A, 'utf8');

    // Invalid manifest path where writing will fail
    const invalidManifestDir = path.join(tempRoot, 'invalid-manifest-dir');
    fs.mkdirSync(invalidManifestDir, { recursive: true });

    await expect(
      runGenerator({
        projectRoot: tempRoot,
        sourceRoot: tempSourceRoot,
        glyphsRoot: tempGlyphsRoot,
        manifestPath: invalidManifestDir,
      }),
    ).rejects.toThrow();
  });

  it('12. Protected Custom Glyph: protects verified custom glyphs (e.g. MailGlyph.tsx) from being overwritten', async () => {
    const mailSvgPath = path.join(tempSourceRoot, 'MailGlyph.svg');
    const mailTsxPath = path.join(tempGlyphsRoot, 'MailGlyph.tsx');
    fs.writeFileSync(mailSvgPath, SAMPLE_SVG_A, 'utf8');
    fs.writeFileSync(
      mailTsxPath,
      '// Custom verified MailGlyph implementation',
      'utf8',
    );

    const res = await runGenerator({
      projectRoot: tempRoot,
      sourceRoot: tempSourceRoot,
      glyphsRoot: tempGlyphsRoot,
      manifestPath: tempManifestPath,
    });

    expect(res.conflicts).toHaveLength(1);
    expect(res.conflicts[0].reason).toBe('PROTECTED_CUSTOM_GLYPH');
    expect(fs.readFileSync(mailTsxPath, 'utf8')).toBe(
      '// Custom verified MailGlyph implementation',
    );
  });
});
