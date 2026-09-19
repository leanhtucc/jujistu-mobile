const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const defaultProjectRoot = path.resolve(__dirname, '..');

function createAliases(sourceRoot) {
  return new Map([
    ['@jujistu/ui', path.join(sourceRoot, 'ui')],
    ['@jujistu/app', path.join(sourceRoot, 'app')],
    ['@jujistu/features', path.join(sourceRoot, 'features')],
    ['@jujistu/shared', path.join(sourceRoot, 'shared')],
  ]);
}

function collectSourceFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectSourceFiles(absolutePath);
    }

    return /\.(ts|tsx)$/.test(entry.name) ? [absolutePath] : [];
  });
}

function resolveInternalImport(importer, specifier, aliases) {
  if (specifier.startsWith('.')) {
    return path.resolve(path.dirname(importer), specifier);
  }

  for (const [alias, target] of aliases) {
    if (specifier === alias || specifier.startsWith(`${alias}/`)) {
      return path.join(target, specifier.slice(alias.length + 1));
    }
  }

  return null;
}

function describeModule(absolutePath, sourceRoot) {
  const relativePath = path.relative(sourceRoot, absolutePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return null;
  }

  const [layer, feature] = relativePath.split(path.sep);
  return { feature, layer, relativePath };
}

function getModuleSpecifiers(sourceFile) {
  const specifiers = [];

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifiers.push({ node, value: node.moduleSpecifier.text });
    }

    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      specifiers.push({ node, value: node.arguments[0].text });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return specifiers;
}

function locationOf(sourceFile, node, projectRoot) {
  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
  return `${path.relative(projectRoot, sourceFile.fileName)}:${line + 1}`;
}

function isUiFile(fileName) {
  return (
    /[\\/](screens|sections|components)[\\/]/.test(fileName) ||
    fileName.endsWith('Screen.tsx')
  );
}

function isSharedApiImport(targetPath) {
  const normalized = targetPath.split(path.sep).join('/');
  return normalized.includes('shared/services/api');
}

function isFeatureServiceImport(targetPath, imported) {
  if (!imported || imported.layer !== 'features') {
    return false;
  }
  const normalized = targetPath.split(path.sep).join('/');
  return (
    normalized.includes('/services/') ||
    normalized.endsWith('/services') ||
    normalized.includes('/api/') ||
    normalized.endsWith('/api') ||
    normalized.endsWith('.api.ts') ||
    normalized.endsWith('.api')
  );
}

function checkArchitecture(projectRoot = defaultProjectRoot) {
  const sourceRoot = path.join(projectRoot, 'src');
  const aliases = createAliases(sourceRoot);
  const violations = [];

  for (const fileName of collectSourceFiles(sourceRoot)) {
    const text = fs.readFileSync(fileName, 'utf8');
    const scriptKind = fileName.endsWith('.tsx')
      ? ts.ScriptKind.TSX
      : ts.ScriptKind.TS;
    const sourceFile = ts.createSourceFile(
      fileName,
      text,
      ts.ScriptTarget.Latest,
      true,
      scriptKind,
    );
    const importer = describeModule(fileName, sourceRoot);

    if (!importer) {
      continue;
    }

    const isFeatureIndex =
      importer.layer === 'features' &&
      path.basename(fileName) === 'index.ts' &&
      path.dirname(fileName) ===
        path.join(sourceRoot, 'features', importer.feature);

    for (const { node, value } of getModuleSpecifiers(sourceFile)) {
      const targetPath = resolveInternalImport(fileName, value, aliases);
      const imported = targetPath && describeModule(targetPath, sourceRoot);

      if (!imported) {
        continue;
      }

      if (
        importer.layer === 'shared' &&
        ['app', 'features', 'ui'].includes(imported.layer)
      ) {
        violations.push(
          `${locationOf(sourceFile, node, projectRoot)} shared cannot import ${
            imported.layer
          }: ${value}`,
        );
      }

      if (
        importer.layer === 'ui' &&
        (imported.layer === 'app' || imported.layer === 'features')
      ) {
        violations.push(
          `${locationOf(sourceFile, node, projectRoot)} ui cannot import ${
            imported.layer
          }: ${value}`,
        );
      }

      if (importer.layer === 'features' && imported.layer === 'app') {
        violations.push(
          `${locationOf(
            sourceFile,
            node,
            projectRoot,
          )} features cannot import app: ${value}`,
        );
      }

      if (
        importer.layer === 'features' &&
        imported.layer === 'features' &&
        importer.feature !== imported.feature
      ) {
        violations.push(
          `${locationOf(sourceFile, node, projectRoot)} feature ${
            importer.feature
          } cannot import feature ${imported.feature}: ${value}`,
        );
      }

      if (
        importer.layer === 'app' &&
        imported.layer === 'features' &&
        value !== `@jujistu/features/${imported.feature}`
      ) {
        violations.push(
          `${locationOf(
            sourceFile,
            node,
            projectRoot,
          )} app must use the public API of feature ${
            imported.feature
          }: ${value}`,
        );
      }

      if (isUiFile(fileName) && isSharedApiImport(targetPath)) {
        violations.push(
          `${locationOf(
            sourceFile,
            node,
            projectRoot,
          )} UI components cannot access the shared API client directly: ${value}. UI must use feature hooks.`,
        );
      }

      if (isUiFile(fileName) && isFeatureServiceImport(targetPath, imported)) {
        violations.push(
          `${locationOf(
            sourceFile,
            node,
            projectRoot,
          )} UI components cannot import feature services directly: ${value}. UI must use feature hooks.`,
        );
      }

      if (isFeatureIndex && ts.isExportDeclaration(node)) {
        if (
          value.includes('services') ||
          value.includes('queries') ||
          value.includes('api') ||
          value.endsWith('.keys') ||
          value.endsWith('-keys')
        ) {
          violations.push(
            `${locationOf(
              sourceFile,
              node,
              projectRoot,
            )} feature index cannot export internal service, api, or query modules: ${value}`,
          );
        }
      }
    }

    if (isUiFile(fileName)) {
      function findDirectFetch(node) {
        if (
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === 'fetch'
        ) {
          violations.push(
            `${locationOf(
              sourceFile,
              node,
              projectRoot,
            )} screens cannot call fetch directly`,
          );
        }

        ts.forEachChild(node, findDirectFetch);
      }

      findDirectFetch(sourceFile);
    }
  }

  return violations;
}

if (require.main === module) {
  const violations = checkArchitecture();

  if (violations.length > 0) {
    console.error('Architecture boundary violations:\n');
    console.error(violations.map(violation => `- ${violation}`).join('\n'));
    process.exit(1);
  } else {
    console.log('Architecture boundaries passed.');
  }
}

module.exports = { checkArchitecture };
