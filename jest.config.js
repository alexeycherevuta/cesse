module.exports = {
  roots: ["./test"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  reporters: [
    "default"
  ],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["src*.{js,jsx,ts}"],
  testPathIgnorePatterns: ["src/config"],
  coveragePathIgnorePatterns: [
    "/node_modules",
    "src/config",
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
  }
}
