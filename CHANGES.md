# CHANGES for @brettz9/git-utilities

## ?

- npm: Update devDeps

## 1.3.0

- Linting: Update
- Update: Switch from nodegit to isomorphic git;
    devDep: switch to fork of ansi-to-html (for actual build)
- Docs: Build HTML output of CLI API (using ansi-to-html)
- Docs: Build SVG output of CLI API (using ansi-to-svg)
- npm: Add eslint script and build-cli-svg script
- npm: Update devDeps

## 1.2.0

- Linting: Add HTML file linting (in case adding)
- example script: fix path
- npm: Update deps and devDeps

## 1.1.0

- Due to mistaken version pushed to npm, revisioning as 1.1.0

## 0.2.0

- Fix: Allow directory and history to be missing file info
  (e.g., if just getting of commit as possible in Sourcetree)
- Enhancement: Add `commit` type with `diff` option
- Enhancement: Add `sha` option and allow where possible
- Enhancement: Allow aliases `blob` and `tree` for `view` and
  `directory`, respectively

## 0.1.0

- Initial commit
