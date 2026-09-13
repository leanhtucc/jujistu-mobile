const { spawnSync } = require('node:child_process');
const path = require('node:path');

const supportedEnvironments = new Set(['development', 'staging', 'production']);
const [, , environment, command, ...commandArguments] = process.argv;

if (!supportedEnvironments.has(environment) || !command) {
  console.error(
    'Usage: node scripts/run-react-native.js <development|staging|production> <command> [...arguments]',
  );
  process.exit(1);
}

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
      JUJISTU_ENV: environment,
    },
    stdio: 'inherit',
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
