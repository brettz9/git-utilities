'use strict';

const fs = require('fs');
const {join, dirname, relative} = require('path');
const git = require('isomorphic-git');
const findUp = require('find-up');
const open = require('open');
const dialog = require('dialog-node');
const ngu = require('normalize-git-url');

// Todo: Make logging optional

exports.openGitURL = async ({
  file,
  type = 'view',
  branch: userBranch = null,
  diff = false,
  sha = null
}) => {
  const cwd = type === 'directory' && file === '.' ? process.cwd() : file;

  const getGitProjectPath = async () => {
    const foundFile = await findUp('.git', {cwd, type: 'directory'});
    return (foundFile && dirname(foundFile)) || false;
  };

  try {
    const gitProjectPath = await getGitProjectPath();
    if (!gitProjectPath) {
      throw new Error(`Could not find .git project path searching from ${cwd}`);
    }
    const packageJSON = join(gitProjectPath, 'package.json');

    let pkg;
    try {
      // pkg = (await import(packageJSON)).default;
      // eslint-disable-next-line global-require, import/no-dynamic-require
      pkg = require(packageJSON);
    } catch (err) {
      throw new Error(`Trouble reading ${packageJSON}`);
    }
    if (!pkg.repository) {
      throw new Error(`Could not find a repository field at ${packageJSON}`);
    }
    const repoURL = pkg.repository.url;
    const urlBase = ngu(repoURL).url
      .replace(/\.git$/u, '');
    if (!urlBase) {
      throw new Error(`Could not find a repository \`url\` at ${packageJSON}`);
    }

    let branch, fileRelativePath;
    if (!sha || ['delete', 'edit'].includes(type)) {
      if (sha && ['delete', 'edit'].includes(type)) {
        // eslint-disable-next-line no-console
        console.warn('A SHA is not expected with the type ' + type);
      }
      fileRelativePath = relative(gitProjectPath, file);
      // Todo: dialog (ideally with pull-down of branches) to choose branch?
      branch = userBranch;
      if (!branch) {
        try {
          branch = await git.currentBranch({fs, dir: gitProjectPath});
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log('err', err);
          throw new Error('Error getting current branch');
        }
      }
    }

    let url;
    switch (type) {
    default:
    case 'view': case 'blob':
      url = urlBase + '/blob/' + (sha || branch) + '/' + fileRelativePath;
      break;
    case 'directory': case 'tree':
      url = urlBase + '/tree/' + (sha || branch) + '/' +
        ((fileRelativePath && dirname(fileRelativePath)) || '');
      break;
    case 'raw':
      url = urlBase.replace(
        'https://github.com',
        'https://raw.githubusercontent.com'
      ) + (sha || branch) + '/' + fileRelativePath;
      break;
    case 'blame':
      url = urlBase + '/blame/' + (sha || branch) + '/' + fileRelativePath;
      break;
    case 'history':
      url = urlBase + '/commits/' + (sha || branch) + '/' +
        (fileRelativePath || '');
      break;
    case 'commit':
      url = urlBase + '/commit/' + (sha || branch) +
        (diff ? '?diff=' + diff : '');
      // Could technically also allow adding `#diff-` + sha_of_file to
      //   go to specific file diff
      break;
    case 'edit':
      url = urlBase + '/edit/' + branch + '/' + fileRelativePath;
      break;
    case 'delete':
      url = urlBase + '/delete/' + branch + '/' + fileRelativePath;
      break;
    }

    // eslint-disable-next-line no-console
    console.log('url', url);
    await open(url, {url: true}); // , {wait: true}
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // Todo: Convert to promise and object args: https://github.com/bat-tomr/dialog-node/issues/5
    const {/* response, */ stderr} = await dialog.error({
      // Message
      message: err.toString(),
      // Title
      title: 'Error',
      // Auto closing time (0 for no timeout)
      timeout: 0
    });
    if (stderr) {
      // eslint-disable-next-line no-console
      console.log('stderr', stderr);
      return;
    }
    // eslint-disable-next-line no-console
    console.log('Closed');
  }
};