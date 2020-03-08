'use strict';

const proxyquire = require('proxyquire');

let openURL = null;
const {openGitURL} = proxyquire('../src/index.js', {
  // Todo: Stub `dialog` too to catch its error reporting
  open (url, config) {
    openURL = url;
    if (!config || config.url !== true) {
      // We can refactor here if we need to call `open` in a mode
      //   other than for URLs
      throw new Error('Will not open as URL.');
    }
  }
});

describe('Git-utilities (Opening)', function () {
  beforeEach(() => {
    openURL = null;
  });
  it('Opens', async function () {
    await openGitURL({
      file: __filename,
      branch: 'master',
      type: 'view'
    });
    expect(openURL).to.equal(
      'https://github.com/brettz9/git-utilities/blob/master/test/openGitURL.js'
    );
  });
});
