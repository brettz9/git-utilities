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
  it('Opens view/blob', function () {
    return Promise.all(['view', 'blob'].map(async (type) => {
      await openGitURL({
        file: __filename,
        branch: 'master',
        type
      });
      expect(openURL).to.equal(
        'https://github.com/brettz9/git-utilities/blob/master/test/openGitURL.js'
      );
    }));
  });

  it('Opens directory/tree', function () {
    return Promise.all(['directory', 'tree'].map(async (type) => {
      await openGitURL({
        file: __filename,
        branch: 'master',
        type
      });
      expect(openURL).to.equal(
        'https://github.com/brettz9/git-utilities/tree/master/test'
      );
    }));
  });

  it('Opens raw', function () {
    return Promise.all(['raw'].map(async (type) => {
      await openGitURL({
        file: __filename,
        branch: 'master',
        type
      });
      expect(openURL).to.equal(
        'https://raw.githubusercontent.com/brettz9/git-utilities/master/test/openGitURL.js'
      );
    }));
  });
});
