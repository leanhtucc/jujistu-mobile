const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const supportedEnvironments = new Set(['development', 'staging', 'production']);
const [, , environment, command, ...commandArguments] = process.argv;

if (!supportedEnvironments.has(environment) || !command) {
  console.error(
    'Usage: node scripts/run-react-native.js <development|staging|production> <command> [...arguments]',
  );
  process.exit(1);
}

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

const rootDir = path.resolve(__dirname, '..');
const fileEnv = {
  ...parseEnvFile(path.join(rootDir, '.env')),
  ...parseEnvFile(path.join(rootDir, `.env.${environment}`)),
};

const cliPath = path.resolve(
  __dirname,
  '../node_modules/@react-native-community/cli/build/bin.js',
);
const result = spawnSync(
  process.execPath,
  [cliPath, command, ...commandArguments],
  {
    env: {
      ...process.env,
      ...fileEnv,
      JUJISTU_ENV: environment,
    },
    stdio: 'inherit',
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
