module.exports = {
  roots: ["./test"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  reporters: [
    "default"
  ],
  runner: 'jest-serial-runner',
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: ["src*.{js,jsx,ts}"],
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
    "<rootDir>/test/support/setupTests.ts"
  ]
}
