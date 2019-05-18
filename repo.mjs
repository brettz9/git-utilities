/* eslint-disable no-console */
// Todo: We could change this file to `.js` in Node 12 (while keeping
//   `type: "module"` in package.json root)
import {existsSync} from 'fs';
import {join, dirname, relative} from 'path';

import commandLineArgs from 'command-line-args';
import Git from 'nodegit';
import findUp from 'find-up';
import open from 'open';
import dialog from 'dialog-node';
import ngu from 'normalize-git-url';

const optionDefinitions = [
  {name: 'file', type: String},
  {name: 'branch', type: String},
  {name: 'type', type: String}
];
const {file, type, branch: userBranch} = commandLineArgs(optionDefinitions);

const cwd = type === 'directory' && file === '.' ? process.cwd() : file;

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
    pkg = (await import(packageJSON)).default;
  } catch (err) {
    throw new Error(`Trouble reading ${packageJSON}`);
  }
  if (!pkg.repository) {
    throw new Error(`Could not find a repository field at ${packageJSON}`);
  }
  const repoURL = pkg.repository.url;
  const urlBase = ngu(repoURL).url;
  if (!urlBase) {
    throw new Error(`Could not find a repository \`url\` at ${packageJSON}`);
  }

  const fileRelativePath = relative(gitProjectPath, file);

  // Todo: dialog (ideally with pull-down of branches) to choose branch?
  let branch = userBranch;
  if (!branch) {
    let repo;
    try {
      repo = await Git.Repository.open(gitProjectPath);
    } catch (err) {
      throw new Error('Error opening Git repository');
    }
    try {
      branch = (await repo.getCurrentBranch()).shorthand();
    } catch (err) {
      throw new Error('Error getting current branch');
    }
  }

  let url;
  switch (type) {
  default:
  case 'view':
    url = urlBase + '/blob/' + branch + '/' + fileRelativePath;
    break;
  case 'raw':
    url = urlBase.replace(
      'https://github.com',
      'https://raw.githubusercontent.com'
    ) + branch + '/' + fileRelativePath;
    break;
  case 'blame':
    url = urlBase + '/blame/' + branch + '/' + fileRelativePath;
    break;
  case 'history':
    url = urlBase + '/commits/' + branch + '/' + fileRelativePath;
    break;
  case 'edit':
    url = urlBase + '/edit/' + branch + '/' + fileRelativePath;
    break;
  case 'delete':
    url = urlBase + '/delete/' + branch + '/' + fileRelativePath;
    break;
  case 'directory':
    url = urlBase + '/tree/' + branch + '/' + dirname(fileRelativePath);
    break;
  }

  console.log('url', url);
  await open(url); // , {wait: true}
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
