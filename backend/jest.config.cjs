module.exports = {
    preset: "ts-jest/presets/default-esm",
    modulePaths: ["<rootDir>/src"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
};
