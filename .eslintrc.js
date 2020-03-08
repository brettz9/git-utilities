'use strict';
module.exports = {
  env: {
    node: true,
    browser: false
  },
  parser: 'babel-eslint',
  extends: [
    'ash-nazg/sauron-node',
    'plugin:node/recommended-script'
  ],
  settings: {
    polyfills: [
      // Not sure why compat is reporting for non-Node
      'Promise',
      'Promise.all',
      'URL'
    ]
  },
  overrides: [
    {
      files: ['test/**'],
      extends: [
        'plugin:node/recommended-module'
      ],
      parserOptions: {
        sourceType: 'module'
      },
      env: {
        mocha: true,
        node: true
      },
      globals: {
        __filename: 'readonly',
        __dirname: 'readonly',
        expect: 'readonly'
      },
      rules: {
      }
    },
    {
      files: 'test/utilities/stubbed-open-git-url-cli.js',
      extends: [
        'plugin:node/recommended-script'
      ],
      rules: {
        'node/shebang': 0
      }
    },
    {
      files: ['**/*.md'],
      rules: {
        'eol-last': 'off',
        'no-console': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'warn',
        'padded-blocks': 'off',
        'import/unambiguous': 'off',
        'import/no-unresolved': 'off',
        'node/no-missing-import': 'off',
        'node/no-missing-require': 'off',
        'func-names': 'off',
        'import/newline-after-import': 'off',
        strict: 'off'
      }
    }
  ],
  globals: {
    // By some ESLint bug, config overrides not working with globals
    require: 'readonly',
    module: 'readonly',
    exports: 'writable'
  },
  rules: {
    'node/exports-style': 0,
    'import/no-commonjs': 0,
    'no-process-exit': 0,
    'unicorn/no-process-exit': 2
  }
};
