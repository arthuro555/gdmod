module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.json",
      diagnostics: true,
    },
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
