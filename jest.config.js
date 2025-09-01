/**
 * Configuration Jest pour modules ES6
 */

export default {
  // Utiliser node comme environnement de test
  testEnvironment: 'node',
  
  // Support des modules ES6
  transform: {
    '^.+\\.js$': ['babel-jest', {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
    }]
  },
  
  // Extensions de fichiers à traiter
  moduleFileExtensions: ['js', 'json'],
  
  // Patterns de fichiers de test
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // Couverture de code
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/coverage/',
    '/src/legacy/'
  ],
  
  // Reporters
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Seuils de couverture
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Setup et teardown
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Verbose pour plus de détails
  verbose: true,
  
  // Timeout pour tests longs
  testTimeout: 10000
};
