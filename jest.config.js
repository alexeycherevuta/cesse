module.exports = {
  roots: ["."],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: [
    "<rootDir>/src*.test.ts"
  ],
  reporters: [
    "default"
  ],
  runner: 'jest-serial-runner',
  testEnvironment: "jsdom",
  collectCoverage: false,
  collectCoverageFrom: ["src*.{jsx,ts}"],
  testPathIgnorePatterns: [],
  coveragePathIgnorePatterns: [
    "node_modules",
    "build",
    "coverage",
    ".vscode",
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: -80
    }
  },
  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.ts"
  ]
}
