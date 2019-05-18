/* eslint-disable no-console */
'use strict';

const {existsSync} = require('fs');
const {join, dirname, relative} = require('path');

const commandLineArgs = require('command-line-args');
const findUp = require('find-up');

const optionDefinitions = [
  // {name: 'repo', type: String}
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
  const urlBase = pkg.repository.url;
  if (!urlBase) {
    throw new Error(`Could not find a repository \`url\` at ${packageJSON}`);
  }

  const fileRelativePath = relative(gitProjectPath, file);

  // Todo: Get current branch name from `git branch` (some Node library API for
  //    git commands?)
  const branch = 'master';

  const viewFileURL = urlBase + '/blob/' + branch + '/' + fileRelativePath;

  // Todo: Open URL
  console.log('url', viewFileURL);

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
