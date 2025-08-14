const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;


/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        ...tsJestTransformCfg,
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    watchPathIgnorePatterns: [
        "<rootDir>/\\.next/",
        "<rootDir>/public/",
        "<rootDir>/prisma/migrations/",
        "<rootDir>/backup.sql",
        "<rootDir>/node_modules/"
    ]
};