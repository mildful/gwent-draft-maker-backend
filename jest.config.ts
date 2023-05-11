import type { Config } from '@jest/types';
import * as path from 'path';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: [
    '**/tests/**/**/*.spec.ts',
  ],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/index.ts'],
  coverageReporters: ['lcov', 'json', 'text-summary', 'html'],
  coverageDirectory: path.resolve(__dirname, 'tests', 'coverage'),
  setupFiles: [path.resolve(__dirname, 'tests/setup.ts')],
  testEnvironment: 'node',
  testTimeout: 5000,
};

module.exports = config;
