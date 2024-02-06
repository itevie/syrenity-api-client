module.exports = {
    transform: {'\\.[jt]sx?$': [
      "ts-jest",
      { useESM: true }
    ]},
    moduleNameMapper: {
      "(.+)\\.js": "$1"
    },
    extensionsToTreatAsEsm: [".ts"],
    testEnvironment: 'node',
    testRegex: '\\.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
  };