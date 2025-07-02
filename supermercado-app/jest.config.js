const { createDefaultPreset } = require("ts-jest")

const tsJestTransformCfg = createDefaultPreset().transform

/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { isolatedModules: true }],
  },
}
