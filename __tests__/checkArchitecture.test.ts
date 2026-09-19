const fs = require('fs');
const os = require('os');
const path = require('path');

const { checkArchitecture } = require('../scripts/check-architecture');

describe('checkArchitecture', () => {
  it('passes on current project codebase without violations', () => {
    const violations = checkArchitecture();
    expect(violations).toEqual([]);
  });

  describe('boundary rule violations', () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'arch-test-'));
      // Create minimal project layout:
      // src/ui, src/app, src/features/auth, src/shared/services/api
      fs.mkdirSync(path.join(tempDir, 'src', 'features', 'auth', 'screens'), {
        recursive: true,
      });
      fs.mkdirSync(path.join(tempDir, 'src', 'features', 'auth', 'services'), {
        recursive: true,
      });
      fs.mkdirSync(path.join(tempDir, 'src', 'shared', 'services', 'api'), {
        recursive: true,
      });
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('catches screen importing shared/services/api directly', () => {
      // Create shared API dummy file
      fs.writeFileSync(
        path.join(tempDir, 'src', 'shared', 'services', 'api', 'index.ts'),
        'export const apiRequest = () => {};',
      );

      // Create screen that violates the rule
      const screenFile = path.join(
        tempDir,
        'src',
        'features',
        'auth',
        'screens',
        'BadScreen.tsx',
      );
      fs.writeFileSync(
        screenFile,
        "import { apiRequest } from '@jujistu/shared/services/api';\nexport function BadScreen() { return null; }",
      );

      const violations = checkArchitecture(tempDir);
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]).toContain(
        'UI components cannot access the shared API client directly',
      );
    });

    it('catches screen importing feature services directly', () => {
      // Create service dummy file
      fs.writeFileSync(
        path.join(
          tempDir,
          'src',
          'features',
          'auth',
          'services',
          'auth-service.ts',
        ),
        'export function requestOtp() {}',
      );

      // Create screen that violates the rule
      const screenFile = path.join(
        tempDir,
        'src',
        'features',
        'auth',
        'screens',
        'BadServiceScreen.tsx',
      );
      fs.writeFileSync(
        screenFile,
        "import { requestOtp } from '../services/auth-service';\nexport function BadServiceScreen() { return null; }",
      );

      const violations = checkArchitecture(tempDir);
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]).toContain(
        'UI components cannot import feature services directly',
      );
    });

    it('catches feature index exporting internal service or query modules', () => {
      // Create service dummy file
      fs.writeFileSync(
        path.join(
          tempDir,
          'src',
          'features',
          'auth',
          'services',
          'auth-service.ts',
        ),
        'export function requestOtp() {}',
      );

      // Create feature index that exports service
      const indexFile = path.join(
        tempDir,
        'src',
        'features',
        'auth',
        'index.ts',
      );
      fs.writeFileSync(indexFile, "export * from './services/auth-service';");

      const violations = checkArchitecture(tempDir);
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]).toContain(
        'feature index cannot export internal service, api, or query modules',
      );
    });

    it('catches screen calling fetch directly', () => {
      const screenFile = path.join(
        tempDir,
        'src',
        'features',
        'auth',
        'screens',
        'FetchScreen.tsx',
      );
      fs.writeFileSync(
        screenFile,
        "export function FetchScreen() { fetch('https://test.com'); return null; }",
      );

      const violations = checkArchitecture(tempDir);
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]).toContain('screens cannot call fetch directly');
    });
  });
});
