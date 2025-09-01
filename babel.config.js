/**
 * Configuration Babel pour Jest
 */

export default {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      }
    }]
  ]
};
