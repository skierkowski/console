'use strict';

module.exports = {
  extends: '@serverless/eslint-config/node',
  root: true,
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/scripts/**', '**/test/**', 'prettier.config.js'],
      },
    ],
  },
  ignorePatterns: ['!.mocharc.js'],
};
