#!/usr/bin/env node
'use strict';

// Todo: We could change this file to `.js` in Node 12 (while keeping
//   `type: "module"` in package.json root)
const fs = require('fs');
const {join, dirname, relative} = require('path');

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const git = require('isomorphic-git');
const findUp = require('find-up');
const open = require('open');
const dialog = require('dialog-node');
const ngu = require('normalize-git-url');
const {
  sections: cliSections,
  definitions: optionDefinitions
} = require('./optionDefinitions.js');

git.plugins.set('fs', fs);

const {
  file,
  type = 'view',
  branch: userBranch = null,
  help = false,
  diff = false,
  sha = null
} = commandLineArgs(optionDefinitions);

(async () => {
if (help) {
  const usage = commandLineUsage(cliSections);
  console.log(usage);
  return;
}

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
      console.warn('A SHA is not expected with the type ' + type);
    }
    fileRelativePath = relative(gitProjectPath, file);
    // Todo: dialog (ideally with pull-down of branches) to choose branch?
    branch = userBranch;
    if (!branch) {
      try {
        branch = await git.currentBranch({dir: gitProjectPath});
      } catch (err) {
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

  console.log('url', url);
  await open(url, {url: true}); // , {wait: true}
} catch (err) {
  console.log(err);
  // Todo: Convert to promise and object args: https://github.com/bat-tomr/dialog-node/issues/5
  dialog.error(
    // Message
    err.toString(),
    // Title
    'Error',
    // Auto closing time (0 for no timeout)
    0,
    // Closed callback
    function closed (code, retVal, stderr) {
      console.log('Closed');
    }
  );
}
})();
