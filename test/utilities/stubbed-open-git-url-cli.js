#!/usr/bin/env node
'use strict';
const proxyquire = require('proxyquire');

const openGitURLCLI = proxyquire('../../bin/open-git-url.js', {
  // '@runtimeGlobal': true,
  '@global': true,
  open (url, config) {
    if (!config || config.url !== true) {
      // We can refactor here if we need to call `open` in a mode
      //   other than for URLs
      throw new Error('Unexpected lack of `url`; will not open as URL.');
    }
    // eslint-disable-next-line no-console
    console.log(url);
  }
});

openGitURLCLI();
