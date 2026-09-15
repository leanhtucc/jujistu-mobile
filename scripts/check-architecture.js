const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const projectRoot = path.resolve(__dirname, '..');
const sourceRoot = path.join(projectRoot, 'src');
const aliases = new Map([
  ['@jujistu/ui', path.join(sourceRoot, 'ui')],
  ['@jujistu/app', path.join(sourceRoot, 'app')],
  ['@jujistu/features', path.join(sourceRoot, 'features')],
  ['@jujistu/shared', path.join(sourceRoot, 'shared')],
]);

function collectSourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectSourceFiles(absolutePath);
    }

    return /\.(ts|tsx)$/.test(entry.name) ? [absolutePath] : [];
  });
}

function resolveInternalImport(importer, specifier) {
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

function describeModule(absolutePath) {
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

function locationOf(sourceFile, node) {
  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
  return `${path.relative(projectRoot, sourceFile.fileName)}:${line + 1}`;
}

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
  const importer = describeModule(fileName);

  for (const { node, value } of getModuleSpecifiers(sourceFile)) {
    const targetPath = resolveInternalImport(fileName, value);
    const imported = targetPath && describeModule(targetPath);

    if (!imported) {
      continue;
    }

    if (
      importer.layer === 'shared' &&
      ['app', 'features', 'ui'].includes(imported.layer)
    ) {
      violations.push(
        `${locationOf(sourceFile, node)} shared cannot import ${
          imported.layer
        }: ${value}`,
      );
    }

    if (
      importer.layer === 'ui' &&
      (imported.layer === 'app' || imported.layer === 'features')
    ) {
      violations.push(
        `${locationOf(sourceFile, node)} ui cannot import ${
          imported.layer
        }: ${value}`,
      );
    }

    if (importer.layer === 'features' && imported.layer === 'app') {
      violations.push(
        `${locationOf(sourceFile, node)} features cannot import app: ${value}`,
      );
    }

    if (
      importer.layer === 'features' &&
      imported.layer === 'features' &&
      importer.feature !== imported.feature
    ) {
      violations.push(
        `${locationOf(sourceFile, node)} feature ${
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
        )} app must use the public API of feature ${
          imported.feature
        }: ${value}`,
      );
    }

    if (
      fileName.endsWith('Screen.tsx') &&
      imported.layer === 'shared' &&
      imported.feature === 'api'
    ) {
      violations.push(
        `${locationOf(
          sourceFile,
          node,
        )} screens cannot access the shared API client directly: ${value}`,
      );
    }
  }

  if (fileName.endsWith('Screen.tsx')) {
    function findDirectFetch(node) {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'fetch'
      ) {
        violations.push(
          `${locationOf(sourceFile, node)} screens cannot call fetch directly`,
        );
      }

      ts.forEachChild(node, findDirectFetch);
    }

    findDirectFetch(sourceFile);
  }
}

if (violations.length > 0) {
  console.error('Architecture boundary violations:\n');
  console.error(violations.map(violation => `- ${violation}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Architecture boundaries passed.');
}
