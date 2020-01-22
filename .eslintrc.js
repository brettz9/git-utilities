module.exports = {
    env: {
      node: true,
      browser: false
    },
    parser: "babel-eslint",
    extends: [
      'ash-nazg/sauron-node',
      'plugin:node/recommended-script'
    ],
    settings: {
      polyfills: [
        // Not sure why compat is reporting for non-Node
        "URL"
      ],
      jsdoc: {
        // For `jsdoc/check-examples` in `ash-nazg`
        matchingFileName: 'dummy.md',
        rejectExampleCodeRegex: '^`',
      }
    },
    overrides: [
      {
        files: ['open-git-url.js'],
        rules: {
          'no-console': 0,
          // Need these all disabled at first
          'spaced-comment': 0,
          'node/shebang': 0,
          'semi': 0,
          'eslint-comments/no-unused-enable': 0
        }
      },
      {
        files: ['test/**'],
        env: {
          mocha: true
        },
        globals: {
          expect: 'readonly'
        },
        rules: {
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
      'import/no-commonjs': 0
    }
  };
