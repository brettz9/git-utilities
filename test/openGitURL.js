import {resolve as pathResolve} from 'path';
import proxyquire from 'proxyquire';
import spawnPromise from './utilities/spawnPromise.js';

const cliPath = pathResolve(
  __dirname,
  './utilities/stubbed-open-git-url-cli.js'
);

let openURL = null;
const {openGitURL} = proxyquire('../src/index.js', {
  open (url, config) {
    openURL = url;
    if (!config || config.url !== true) {
      // We can refactor here if we need to call `open` in a mode
      //   other than for URLs
      throw new Error('Unexpected lack of `url`; will not open as URL.');
    }
  },
  'dialog-node': {
    error ({message, title, timeout}) {
      if (title !== 'Error') {
        throw new Error('Unexpected error dialog title');
      }
      if (timeout !== 0) {
        throw new Error('Unexpected error timeout');
      }
    }
  }
});

describe('Git-utilities programmatic (Opening)', function () {
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

  it('Opens blame', function () {
    return Promise.all(['blame'].map(async (type) => {
      await openGitURL({
        file: __filename,
        branch: 'master',
        type
      });
      expect(openURL).to.equal(
        'https://github.com/brettz9/git-utilities/blame/master/test/openGitURL.js'
      );
    }));
  });

  it('Opens commits/history', function () {
    return Promise.all(['commits', 'history'].map(async (type) => {
      await openGitURL({
        file: __filename,
        branch: 'master',
        type
      });
      expect(openURL).to.equal(
        'https://github.com/brettz9/git-utilities/commits/master/test/openGitURL.js'
      );
    }));
  });

  it('Opens edit', function () {
    return Promise.all(['edit'].map(async (type) => {
      await openGitURL({
        file: __filename,
        branch: 'master',
        type
      });
      expect(openURL).to.equal(
        'https://github.com/brettz9/git-utilities/edit/master/test/openGitURL.js'
      );
    }));
  });

  it('Opens delete', function () {
    return Promise.all(['delete', 'remove'].map(async (type) => {
      await openGitURL({
        file: __filename,
        branch: 'master',
        type
      });
      expect(openURL).to.equal(
        'https://github.com/brettz9/git-utilities/delete/master/test/openGitURL.js'
      );
    }));
  });
});

describe('Git-utilities CLI', function () {
  this.timeout(10000);
  it('Gets help', async function () {
    const {stderr, stdout} = await spawnPromise(
      cliPath, ['--help'], 5000
    );

    expect(stdout).to.contain('Open Git URL Utility');
    expect(stderr).to.equal('');
  });

  it('Opens view', async function () {
    const {stderr, stdout} = await spawnPromise(
      cliPath, [
        '--type', 'view',
        '--branch', 'master',
        '--dry-run',
        '--file', __filename
      ], 5000
    );

    expect(stdout).to.equal(
      'URL: https://github.com/brettz9/git-utilities/blob/master/test/openGitURL.js\n'
    );
    expect(stderr).to.equal('');
  });
});
