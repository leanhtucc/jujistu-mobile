/* eslint-env node */
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { transform } = require('@svgr/core');
const prettier = require('prettier');

const GENERATOR_VERSION = '2.0.0';

const defaultProjectRoot = path.resolve(__dirname, '..');
const defaultSourceRoot = path.join(defaultProjectRoot, 'assets', 'icons');
const defaultGlyphsRoot = path.join(
  defaultProjectRoot,
  'src',
  'ui',
  'atoms',
  'icon',
  'glyphs',
);
const defaultTypesPath = path.join(
  defaultProjectRoot,
  'src',
  'ui',
  'atoms',
  'icon',
  'icon.types.ts',
);
const defaultManifestPath = path.join(
  defaultProjectRoot,
  '.icon-manifest.json',
);

// Protected manually-verified glyphs that must never be overwritten
const PROTECTED_RELATIVES = new Set([
  'ChevronLeftGlyph.tsx',
  'LogOutGlyph.tsx',
  'MailGlyph.tsx',
]);

const PROTECTED_GLYPH_FILES = new Set([
  path.join(defaultGlyphsRoot, 'ChevronLeftGlyph.tsx'),
  path.join(defaultGlyphsRoot, 'LogOutGlyph.tsx'),
  path.join(defaultGlyphsRoot, 'MailGlyph.tsx'),
]);

function isProtectedGlyph(targetFile, glyphsRoot = defaultGlyphsRoot) {
  const normTarget = path.resolve(targetFile);
  for (const f of PROTECTED_GLYPH_FILES) {
    if (path.resolve(f) === normTarget) return true;
  }
  const rel = path.relative(glyphsRoot, targetFile).replace(/\\/g, '/');
  return PROTECTED_RELATIVES.has(rel);
}

/**
 * Calculate SHA-256 hash of content string or Buffer.
 */
function calculateHash(content) {
  const hash = crypto.createHash('sha256');
  hash.update(content);
  return `sha256:${hash.digest('hex')}`;
}

/**
 * Normalize color strings so #FFF, #ffffff, white map to #FFFFFF.
 * Preserves 'none', 'transparent', 'inherit', 'currentColor', and 'url(...)'.
 */
function normalizeColor(val) {
  if (!val || typeof val !== 'string') return val;
  const trimmed = val.trim();
  const lower = trimmed.toLowerCase();

  if (
    lower === 'none' ||
    lower === 'transparent' ||
    lower === 'inherit' ||
    lower === 'currentcolor' ||
    lower.startsWith('url(')
  ) {
    return trimmed;
  }

  if (lower === 'white' || lower === '#fff' || lower === '#ffffff') {
    return '#FFFFFF';
  }
  if (lower === 'black' || lower === '#000' || lower === '#000000') {
    return '#000000';
  }

  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    const r = trimmed[1];
    const g = trimmed[2];
    const b = trimmed[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }

  if (/^#[0-9a-f]{6}$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  return trimmed;
}

/**
 * Convert a filename or path stem to PascalCase component name + 'Glyph'.
 */
function toComponentName(fileStem) {
  const cleaned = fileStem.replace(/^ic_/, '');
  const camel = cleaned.replace(/[-_]+(.)/g, (_, c) => c.toUpperCase());
  const pascal = camel.charAt(0).toUpperCase() + camel.slice(1);
  return pascal.endsWith('Glyph') ? pascal : `${pascal}Glyph`;
}

/**
 * Recursively find all .svg files in a directory.
 */
function findSvgFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findSvgFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.svg')) {
      results.push(fullPath);
    }
  }
  return results.sort();
}

/**
 * Analyze SVG content for colors, constructs, and visual classification.
 */
function analyzeSvg(rawSvgContent) {
  // Strip XML comments before analysis
  const stripped = rawSvgContent.replace(/<!--[\s\S]*?-->/g, '');

  const hasEmbeddedImage = /<image\b/i.test(stripped);
  const hasFilter = /<filter\b/i.test(stripped);
  const hasMask = /<mask\b/i.test(stripped);
  const hasGradient = /<(?:linearGradient|radialGradient)\b/i.test(stripped);
  const hasUnsupported = /<(?:style|script|foreignObject)\b/i.test(stripped);

  // Remove <defs> and gradient blocks before scanning shape fills and strokes
  const shapesOnly = stripped.replace(/<defs\b[\s\S]*?<\/defs>/gi, '');

  const matches = shapesOnly.match(/(?:fill|stroke)="([^"]+)"/gi) || [];
  const colors = new Set();

  for (const match of matches) {
    const val = match
      .replace(/^(fill|stroke)="/i, '')
      .replace(/"$/, '')
      .trim();
    const normalized = normalizeColor(val);
    const lower = normalized.toLowerCase();
    if (
      lower !== 'none' &&
      lower !== 'transparent' &&
      lower !== 'inherit' &&
      lower !== 'currentcolor' &&
      !lower.startsWith('url(')
    ) {
      colors.add(normalized);
    }
  }

  const isMonochrome = !hasEmbeddedImage && !hasGradient && colors.size <= 1;
  const classification = isMonochrome ? 'MONOCHROME_VECTOR' : 'FIXED_VISUAL';

  return {
    colors: Array.from(colors),
    isMonochrome,
    classification,
    hasEmbeddedImage,
    hasFilter,
    hasMask,
    hasGradient,
    hasUnsupported,
  };
}

/**
 * Load or initialize .icon-manifest.json safely.
 */
function loadManifest(manifestPath) {
  if (fs.existsSync(manifestPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (data && typeof data === 'object' && data.entries) {
        return data;
      }
    } catch {
      // Corrupt manifest, fallback to default
    }
  }
  return {
    generatorVersion: GENERATOR_VERSION,
    generatorHash: '',
    entries: {},
  };
}

/**
 * Save .icon-manifest.json safely.
 */
function saveManifest(manifestPath, manifest) {
  const serialized = JSON.stringify(manifest, null, 2) + '\n';
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, serialized, 'utf8');
}

/**
 * Generate a clean React Native TSX glyph from SVG.
 */
async function generateGlyph(
  svgPath,
  prettierConfig,
  { sourceRoot, glyphsRoot, typesPath },
) {
  const relativeSvgPath = path
    .relative(sourceRoot, svgPath)
    .replace(/\\/g, '/');
  const relativeSubdir = path.dirname(relativeSvgPath);
  const baseName = path.basename(svgPath, '.svg');
  const componentName = toComponentName(baseName);

  const targetDir =
    relativeSubdir === '.' ? glyphsRoot : path.join(glyphsRoot, relativeSubdir);
  const targetFile = path.join(targetDir, `${baseName}.tsx`);

  if (isProtectedGlyph(targetFile, glyphsRoot)) {
    throw new Error(
      `ICON_GENERATION_COLLISION: Output file "${targetFile}" conflicts with protected verified glyph. Aborting.`,
    );
  }

  const rawSvgContent = fs.readFileSync(svgPath, 'utf8');
  if (
    !rawSvgContent.trim().startsWith('<svg') &&
    !rawSvgContent.includes('<svg')
  ) {
    throw new Error(`MALFORMED_SVG: "${relativeSvgPath}" is not valid SVG.`);
  }

  const svgContent = rawSvgContent
    .replace(/\s*xmlns(:[a-z0-9]+)?="[^"]*"/gi, '')
    .replace(/\s*style="[^"]*"/gi, '');

  const analysis = analyzeSvg(rawSvgContent);

  const replaceAttrValues = {};

  if (analysis.isMonochrome) {
    if (analysis.colors.length === 1) {
      const monoColor = analysis.colors[0];
      replaceAttrValues[monoColor] = '{color}';
      replaceAttrValues[monoColor.toLowerCase()] = '{color}';
      if (monoColor === '#FFFFFF') {
        replaceAttrValues['#FFF'] = '{color}';
        replaceAttrValues['#fff'] = '{color}';
        replaceAttrValues.white = '{color}';
      } else if (monoColor === '#000000') {
        replaceAttrValues['#000'] = '{color}';
        replaceAttrValues['#000000'] = '{color}';
        replaceAttrValues.black = '{color}';
      }
    } else {
      replaceAttrValues['#000'] = '{color}';
      replaceAttrValues['#000000'] = '{color}';
      replaceAttrValues.black = '{color}';
    }
  }

  const relTypes = path
    .relative(targetDir, typesPath)
    .replace(/\\/g, '/')
    .replace(/\.ts$/, '');
  const typesImportPath = relTypes.startsWith('.') ? relTypes : `./${relTypes}`;

  const template = (variables, { tpl }) => {
    const reactNativeImports = variables.imports.filter(
      stmt => !stmt.source || stmt.source.value !== 'react',
    );

    return tpl`
import React from 'react';
${reactNativeImports}
import type { GlyphProps } from '${typesImportPath}';

export function ${variables.componentName}({ size, color }: GlyphProps) {
  return (
    ${variables.jsx}
  );
}
`;
  };

  let rawJsx = await transform(
    svgContent,
    {
      native: true,
      typescript: true,
      svgo: false,
      expandProps: false,
      svgProps: { width: '{size}', height: '{size}' },
      replaceAttrValues,
      plugins: ['@svgr/plugin-jsx'],
      template,
    },
    { componentName },
  );

  const returnIndex = rawJsx.indexOf('return');
  const jsxBody = returnIndex !== -1 ? rawJsx.slice(returnIndex + 6) : '';
  if (!/\{\s*color\s*\}/.test(jsxBody)) {
    rawJsx = rawJsx.replace(
      /(\{\s*size\s*,\s*)color(\s*\}\s*:\s*GlyphProps)/s,
      '$1color: _color$2',
    );
  }
  if (!/\{\s*size\s*\}/.test(jsxBody)) {
    rawJsx = rawJsx.replace(
      /(\{\s*)size(\s*,\s*(?:color|_color))/s,
      '$1size: _size$2',
    );
  }

  const formatted = await prettier.format(rawJsx, {
    ...prettierConfig,
    parser: 'typescript',
  });

  return {
    content: formatted,
    componentName,
    relativeSvgPath,
    targetFile,
    analysis,
  };
}

/**
 * Main generator pipeline with checksum manifest, conflict detection,
 * and selective execution.
 */
async function runGenerator(options = {}) {
  const projectRoot = options.projectRoot || defaultProjectRoot;
  const sourceRoot = options.sourceRoot || defaultSourceRoot;
  const glyphsRoot = options.glyphsRoot || defaultGlyphsRoot;
  const typesPath = options.typesPath || defaultTypesPath;
  const manifestPath =
    options.manifestPath || path.join(projectRoot, '.icon-manifest.json');
  const targetFile = options.targetFile;
  const forceFile = options.forceFile;
  const dryRun = Boolean(options.dryRun);

  // Requirement: Blanket --force is strictly forbidden to protect custom glyphs
  if (options.force && !forceFile) {
    throw new Error(
      'Blanket --force is not permitted to protect custom glyphs. Please specify the target file to force: --force <path/to/icon.svg>',
    );
  }

  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Source root directory does not exist: ${sourceRoot}`);
  }

  // Calculate generator script hash
  const selfContent = fs.readFileSync(__filename, 'utf8');
  const currentGeneratorHash = calculateHash(selfContent);

  const manifest = loadManifest(manifestPath);
  const generatorHashChanged =
    Boolean(manifest.generatorHash) &&
    manifest.generatorHash !== currentGeneratorHash;

  const allSvgFiles = findSvgFiles(sourceRoot);
  let svgFiles = allSvgFiles;

  if (targetFile) {
    const normTarget = targetFile.replace(/\\/g, '/');
    svgFiles = allSvgFiles.filter(f => {
      const rel = path.relative(sourceRoot, f).replace(/\\/g, '/');
      return (
        rel === normTarget ||
        path.basename(f) === normTarget ||
        rel.endsWith(normTarget)
      );
    });
  }

  const prettierConfig = (await prettier.resolveConfig(projectRoot)) || {};
  const generated = [];
  const skipped = [];
  const conflicts = [];
  const errors = [];

  for (const file of svgFiles) {
    const relSvgPath = path.relative(sourceRoot, file).replace(/\\/g, '/');
    const relSubdir = path.dirname(relSvgPath);
    const baseName = path.basename(file, '.svg');
    const targetDir =
      relSubdir === '.' ? glyphsRoot : path.join(glyphsRoot, relSubdir);
    const targetFilePath = path.join(targetDir, `${baseName}.tsx`);

    const isForceTarget = Boolean(
      forceFile &&
        (forceFile === relSvgPath ||
          path.basename(forceFile) === path.basename(file) ||
          forceFile === targetFilePath),
    );

    let rawSvg;
    try {
      rawSvg = fs.readFileSync(file, 'utf8');
      if (!rawSvg.trim().startsWith('<svg') && !rawSvg.includes('<svg')) {
        throw new Error('Malformed SVG: no <svg> tag found');
      }
    } catch (err) {
      errors.push({ source: relSvgPath, message: err.message });
      continue;
    }

    const currentSourceHash = calculateHash(rawSvg);
    const targetExists = fs.existsSync(targetFilePath);
    const manifestEntry = manifest.entries
      ? manifest.entries[relSvgPath]
      : null;

    // Conflict Check 0: Protected custom glyph
    if (isProtectedGlyph(targetFilePath, glyphsRoot) && !isForceTarget) {
      conflicts.push({
        source: relSvgPath,
        target: targetFilePath,
        reason: 'PROTECTED_CUSTOM_GLYPH',
        message: `Output file "${targetFilePath}" is a protected verified glyph. Skipping to protect existing implementation. Use --force <file> to overwrite.`,
      });
      continue;
    }

    // Conflict Check 1: Target TSX exists, but has NO manifest entry (untracked pre-existing / custom)
    if (targetExists && !manifestEntry && !isForceTarget) {
      conflicts.push({
        source: relSvgPath,
        target: targetFilePath,
        reason: 'UNTRACKED_OUTPUT',
        message: `Output file "${targetFilePath}" exists but is not tracked in manifest. Skipping to protect existing file. Use --force <file> to overwrite.`,
      });
      continue;
    }

    // Conflict Check 2: Target TSX exists, was tracked, but has been modified manually
    if (targetExists && manifestEntry && !isForceTarget) {
      const currentOutputHash = calculateHash(
        fs.readFileSync(targetFilePath, 'utf8'),
      );
      if (currentOutputHash !== manifestEntry.outputHash) {
        conflicts.push({
          source: relSvgPath,
          target: targetFilePath,
          reason: 'MANUAL_EDIT',
          message: `Output file "${targetFilePath}" was modified manually outside generator. Skipping to protect manual changes. Use --force <file> to overwrite.`,
        });
        continue;
      }
    }

    // Skip Check: Target TSX exists, matches manifest outputHash, source hasn't changed, and generator hasn't changed
    if (
      targetExists &&
      manifestEntry &&
      !isForceTarget &&
      !generatorHashChanged
    ) {
      if (manifestEntry.sourceHash === currentSourceHash) {
        skipped.push({
          source: relSvgPath,
          target: targetFilePath,
          reason: 'UNCHANGED',
        });
        continue;
      }
    }

    // Generate glyph
    try {
      const result = await generateGlyph(file, prettierConfig, {
        sourceRoot,
        glyphsRoot,
        typesPath,
      });

      if (!dryRun) {
        fs.mkdirSync(targetDir, { recursive: true });
        fs.writeFileSync(targetFilePath, result.content, 'utf8');
        const outputHash = calculateHash(result.content);

        manifest.entries[relSvgPath] = {
          sourceHash: currentSourceHash,
          targetPath: path
            .relative(projectRoot, targetFilePath)
            .replace(/\\/g, '/'),
          outputHash,
          classification: result.analysis.classification,
          lastGenerated: new Date().toISOString(),
        };
      }

      generated.push({
        source: relSvgPath,
        target: targetFilePath,
        componentName: result.componentName,
        classification: result.analysis.classification,
        colors: result.analysis.colors,
      });
    } catch (err) {
      errors.push({ source: relSvgPath, message: err.message });
    }
  }

  if (!dryRun) {
    manifest.generatorVersion = GENERATOR_VERSION;
    manifest.generatorHash = currentGeneratorHash;
    saveManifest(manifestPath, manifest);
  }

  return {
    generated,
    skipped,
    conflicts,
    errors,
    dryRun,
  };
}

async function main() {
  const args = process.argv.slice(2);
  let targetFile = null;
  let forceFile = null;
  let force = false;
  let dryRun = false;
  let initManifest = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dry-run' || arg === '--audit') {
      dryRun = true;
    } else if (arg === '--init-manifest') {
      initManifest = true;
    } else if (arg === '--force') {
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith('--')) {
        forceFile = nextArg;
        i++;
      } else {
        force = true; // blanket force (will be rejected by runGenerator)
      }
    } else if (arg === '--only') {
      targetFile = args[i + 1];
      i++;
    } else if (!arg.startsWith('--')) {
      targetFile = arg;
    }
  }

  if (initManifest) {
    console.log(
      'Mode        : INITIALIZE BASELINE MANIFEST (No TSX files overwritten)\n',
    );
    const selfContent = fs.readFileSync(__filename, 'utf8');
    const currentGeneratorHash = calculateHash(selfContent);
    const manifest = {
      generatorVersion: GENERATOR_VERSION,
      generatorHash: currentGeneratorHash,
      entries: {},
    };

    const allSvgFiles = findSvgFiles(defaultSourceRoot);
    let trackedCount = 0;

    for (const file of allSvgFiles) {
      const relSvgPath = path
        .relative(defaultSourceRoot, file)
        .replace(/\\/g, '/');
      const relSubdir = path.dirname(relSvgPath);
      const baseName = path.basename(file, '.svg');
      const targetDir =
        relSubdir === '.'
          ? defaultGlyphsRoot
          : path.join(defaultGlyphsRoot, relSubdir);
      const targetFilePath = path.join(targetDir, `${baseName}.tsx`);

      if (fs.existsSync(targetFilePath)) {
        const svgContent = fs.readFileSync(file, 'utf8');
        const tsxContent = fs.readFileSync(targetFilePath, 'utf8');
        const analysis = analyzeSvg(svgContent);

        manifest.entries[relSvgPath] = {
          sourceHash: calculateHash(svgContent),
          targetPath: path
            .relative(defaultProjectRoot, targetFilePath)
            .replace(/\\/g, '/'),
          outputHash: calculateHash(tsxContent),
          classification: analysis.classification,
          lastGenerated: new Date().toISOString(),
        };
        trackedCount++;
        console.log(`  [TRACKED] ${relSvgPath} [${analysis.classification}]`);
      } else {
        console.log(`  [MISSING OUTPUT] ${relSvgPath} (no TSX file on disk)`);
      }
    }

    saveManifest(defaultManifestPath, manifest);
    console.log(
      `\nBaseline manifest safely initialized at "${path.relative(
        defaultProjectRoot,
        defaultManifestPath,
      )}" with ${trackedCount} entries. Zero TSX files were overwritten.`,
    );
    return;
  }

  const result = await runGenerator({
    targetFile,
    forceFile,
    force,
    dryRun,
  });

  if (result.generated.length > 0) {
    console.log(`\nGenerated (${result.generated.length}):`);
    for (const g of result.generated) {
      console.log(`  + ${g.source} -> ${g.target} [${g.classification}]`);
    }
  }

  if (result.skipped.length > 0) {
    console.log(`\nSkipped Unchanged (${result.skipped.length}):`);
    for (const s of result.skipped) {
      console.log(`  = ${s.source}`);
    }
  }

  if (result.conflicts.length > 0) {
    console.log(`\nConflicts Protected (${result.conflicts.length}):`);
    for (const c of result.conflicts) {
      console.log(`  ! ${c.source}: ${c.message}`);
    }
  }

  if (result.errors.length > 0) {
    console.error(`\nErrors (${result.errors.length}):`);
    for (const e of result.errors) {
      console.error(`  x ${e.source}: ${e.message}`);
    }
    process.exitCode = 1;
  }

  console.log(
    `\nSummary: ${result.generated.length} generated, ${result.skipped.length} skipped, ${result.conflicts.length} conflicts protected, ${result.errors.length} errors.`,
  );
}

if (require.main === module) {
  main().catch(err => {
    console.error('\nIcon generator failed:', err.message);
    process.exit(1);
  });
}

module.exports = {
  calculateHash,
  loadManifest,
  saveManifest,
  normalizeColor,
  toComponentName,
  findSvgFiles,
  analyzeSvg,
  generateGlyph,
  runGenerator,
};
