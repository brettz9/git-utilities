/* eslint-disable no-console */
'use strict';

const {existsSync} = require('fs');
const {join, dirname} = require('path');

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
  console.log('pkg', urlBase + '/blob/');
  // Todo: Get current branch name from `git branch` (some Node library API for
  //    git commands?)

  // Todo: For <file-path> (or <directory-path>), get relative path by
  //   subtracting `gitProjectPath` out of `file` (`path` method?)
  // https://github.com/<user>/<repo>/blob/<branch>/<file-path>

  // Todo: Option to open directory instead of file
  // https://github.com/<user>/<repo>/tree/<branch>/<directory-path>
} catch (err) {
  // Todo: Dialog to indicate erred with message
  console.log(err);
}
})();
