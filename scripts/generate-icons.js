const fs = require('node:fs');
const path = require('node:path');
const { transform } = require('@svgr/core');
const prettier = require('prettier');

const projectRoot = path.resolve(__dirname, '..');
const sourceRoot = path.join(projectRoot, 'assets', 'icons');
const glyphsRoot = path.join(
  projectRoot,
  'src',
  'ui',
  'atoms',
  'icon',
  'glyphs',
);
const typesPath = path.join(
  projectRoot,
  'src',
  'ui',
  'atoms',
  'icon',
  'icon.types.ts',
);

// Protected manually-verified glyphs that must never be overwritten
const PROTECTED_GLYPH_FILES = new Set([
  path.join(glyphsRoot, 'ChevronLeftGlyph.tsx'),
  path.join(glyphsRoot, 'LogOutGlyph.tsx'),
]);

/**
 * Convert a filename or path stem to PascalCase component name + 'Glyph'.
 * e.g. 'test-icon' -> 'TestIconGlyph'
 *      'ic_home' -> 'IcHomeGlyph'
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
 * Detect foreground colors used in fill/stroke attributes.
 */
function analyzeSvgColors(svgContent) {
  const matches =
    svgContent.match(/(?:fill|stroke|stop-color)="([^"]+)"/gi) || [];
  const colors = new Set();

  for (const match of matches) {
    const val = match
      .replace(/^(fill|stroke|stop-color)="/i, '')
      .replace(/"$/, '')
      .trim();
    const lower = val.toLowerCase();
    if (
      lower !== 'none' &&
      lower !== 'transparent' &&
      lower !== 'inherit' &&
      lower !== 'currentcolor' &&
      !lower.startsWith('url(')
    ) {
      colors.add(val.toUpperCase());
    }
  }

  const hasEmbeddedImage = /<image\b/i.test(svgContent);

  return {
    colors: Array.from(colors),
    isMonochrome: colors.size <= 1,
    hasEmbeddedImage,
  };
}

/**
 * Generate a clean React Native TSX glyph from SVG.
 */
async function generateGlyph(svgPath, prettierConfig) {
  const relativeSvgPath = path
    .relative(sourceRoot, svgPath)
    .replace(/\\/g, '/');
  const relativeSubdir = path.dirname(relativeSvgPath);
  const baseName = path.basename(svgPath, '.svg');
  const componentName = toComponentName(baseName);

  // Preserve relative subfolder structure (e.g. tabs/home.tsx, common/search.tsx, test-icon.tsx)
  const targetDir =
    relativeSubdir === '.' ? glyphsRoot : path.join(glyphsRoot, relativeSubdir);
  const targetFile = path.join(targetDir, `${baseName}.tsx`);

  // Check collision protection
  if (PROTECTED_GLYPH_FILES.has(targetFile)) {
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

  // Strip web-only XMLNS and CSS style attributes that react-native-svg rejects in TypeScript
  const svgContent = rawSvgContent
    .replace(/\s*xmlns(:[a-z0-9]+)?="[^"]*"/gi, '')
    .replace(/\s*style="[^"]*"/gi, '');

  const { colors, isMonochrome, hasEmbeddedImage } =
    analyzeSvgColors(svgContent);

  if (hasEmbeddedImage) {
    console.warn(
      `[WARN] EMBEDDED_BITMAP_IMAGE_DETECTED: "${relativeSvgPath}" contains bitmap <image> element.`,
    );
  }

  const replaceAttrValues = {};

  if (isMonochrome) {
    if (colors.length === 1) {
      const monoColor = colors[0];
      replaceAttrValues[monoColor] = '{color}';
      replaceAttrValues[monoColor.toLowerCase()] = '{color}';
    } else {
      // No explicit colors found (standard SVG default is black)
      replaceAttrValues['#000'] = '{color}';
      replaceAttrValues['#000000'] = '{color}';
      replaceAttrValues.black = '{color}';
    }
  } else {
    console.warn(
      `[MULTICOLOR_REVIEW_REQUIRED] "${relativeSvgPath}": Multiple foreground colors detected (${colors.join(
        ', ',
      )}). Preserving original colors.`,
    );
  }

  // Calculate relative import to icon.types.ts
  const relTypes = path
    .relative(targetDir, typesPath)
    .replace(/\\/g, '/')
    .replace(/\.ts$/, '');
  const typesImportPath = relTypes.startsWith('.') ? relTypes : `./${relTypes}`;

  // Custom SVGR template adhering to JUJISTU GlyphProps contract
  const template = (variables, { tpl }) => {
    // Strip redundant `import * as React from 'react';` from SVGR imports to avoid duplicates
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

  // If the JSX body doesn't use `color`, use `color: _color` in signature to satisfy @typescript-eslint/no-unused-vars
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

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetFile, formatted, 'utf8');

  return {
    source: relativeSvgPath,
    target: path.relative(projectRoot, targetFile).replace(/\\/g, '/'),
    componentName,
    isMonochrome,
    colors,
  };
}

async function main() {
  console.log('=== JUJISTU Icon Asset Generator ===');
  console.log(`Source Root : ${path.relative(projectRoot, sourceRoot)}`);
  console.log(`Glyphs Root : ${path.relative(projectRoot, glyphsRoot)}\n`);

  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Source root directory does not exist: ${sourceRoot}`);
  }

  const svgFiles = findSvgFiles(sourceRoot);
  console.log(`Found ${svgFiles.length} SVG file(s) in source root.\n`);

  if (svgFiles.length === 0) {
    console.log('No SVG files found to generate.');
    return;
  }

  const prettierConfig = (await prettier.resolveConfig(projectRoot)) || {};
  const results = [];

  for (const file of svgFiles) {
    const res = await generateGlyph(file, prettierConfig);
    results.push(res);
    console.log(
      `Generated: ${res.source} -> ${res.target} (${res.componentName}) [${
        res.isMonochrome ? 'Monochrome' : 'Multicolor'
      }]`,
    );
  }

  console.log(`\nSuccessfully processed ${results.length} icon(s).`);
  console.log(
    'NOTE: Generated glyphs must be manually reviewed and registered in glyphs.ts.',
  );
}

main().catch(err => {
  console.error('\nIcon generation failed:', err.message);
  process.exitCode = 1;
});
