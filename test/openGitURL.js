'use strict';

const proxyquire = require('proxyquire');

let openURL = null;
const {openGitURL} = proxyquire('../src/index.js', {
  open (url) {
    openURL = url;
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
