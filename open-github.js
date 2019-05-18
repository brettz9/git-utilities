/* eslint-disable no-console */
'use strict';

const {existsSync} = require('fs');
const {join, dirname, relative} = require('path');

const commandLineArgs = require('command-line-args');
const findUp = require('find-up');
const open = require('open');

const optionDefinitions = [
  {name: 'file', type: String}
];
const {file} = commandLineArgs(optionDefinitions);

const cwd = file === '.' ? process.cwd() : file;

const getGitProjectPath = async () => {
  if (existsSync((join(cwd, '.git')))) {
    return cwd;
  }

  const foundFile = await findUp('.git', {cwd, type: 'directory'});
  return (foundFile && dirname(foundFile)) || false;
};

(async () => {
try {
  const gitProjectPath = await getGitProjectPath();
  if (!gitProjectPath) {
    throw new Error(`Could not find .git project path searching from ${cwd}`);
  }
  const packageJSON = join(gitProjectPath, 'package.json');

  let pkg;
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    pkg = require(packageJSON);
  } catch (err) {
    throw new Error(`Trouble reading ${packageJSON}`);
  }
  if (!pkg.repository) {
    throw new Error(`Could not find a repository field at ${packageJSON}`);
  }
  const repoURL = pkg.repository.url;
  // Todo: Use utility to convert non-HTTPS Github URLs
  const urlBase = repoURL;
  if (!urlBase) {
    throw new Error(`Could not find a repository \`url\` at ${packageJSON}`);
  }

  const fileRelativePath = relative(gitProjectPath, file);

  // Todo: Get current branch name from `git branch` (some Node library API for
  //    git commands?); but keep option to open in `master` even if that is not
  //    the current branch; dialog (ideally with pull-down) to choose branch?
  const branch = 'master';

  const viewFileURL = urlBase + '/blob/' + branch + '/' + fileRelativePath;

  console.log('url', viewFileURL);
  await open(viewFileURL); // , {wait: true}

  // Todo: Other options:
  // const rawURL = urlBase.replace('https://github.com', https://raw.githubusercontent.com') + branch + '/' + fileRelativePath;
  // const blameURL = urlBase + '/blame/' + branch + '/' + fileRelativePath;
  // const historyURL = urlBase + '/commits/' + branch + '/' + fileRelativePath;
  // const editFileURL = urlBase + '/edit/' + branch + '/' + fileRelativePath;
  // const deleteFileURL = urlBase + '/delete/' + branch + '/' +
  //  fileRelativePath;
  // const viewDirectoryURL = urlBase + '/tree/' + branch + '/' +
  //  dirname(fileRelativePath);
} catch (err) {
  // Todo: Dialog to indicate erred with message
  console.log(err);
}
})();
