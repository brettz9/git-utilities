#!/bin/sh
':' //# ; exec /usr/bin/env node --experimental-modules "$0" "$@"
// Re: the above, See http://sambal.org/2014/02/passing-options-node-shebang-line/
/* eslint-enable semi: ["error"], spaced-comment: ["error"],
    eslint-comments/no-unused-enable: ["error"] */

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
import commandLineUsage from 'command-line-usage';

const optionDefinitions = [
  {
    name: 'file', alias: 'f', type: String, defaultOption: true,
    description: 'File (or directory) to process for opening its Web URL',
    typeLabel: '{underline file-path}'
  },
  {
    name: 'branch', alias: 'b', type: String,
    description: 'Optional branch to view (Defaults to current branch)',
    typeLabel: '{underline branch-name}'
  },
  {
    // Todo: Might allow multiple to open multiple URLs
    name: 'type', alias: 't', type: String,
    description: 'Type of operation.  Defaults to "view".',
    typeLabel: `{underline ["view"|"raw"|"blame"|"history"|` +
                  `"edit"|"delete"|"directory"|"commit"]}`
  },
  {
    name: 'diff', alias: 'd', type: String,
    description: `Diff (for the "commit" type). Defaults to ` +
      `"default" (whatever is on use at Github).`,
    typeLabel: `{underline ["unified"|"split"|"default"]}`
  },
  {
    name: 'sha', alias: 's', type: String,
    description: `The commit SHA`,
    typeLabel: `{underline SHA}`
  },
  {
    name: 'help', alias: 'h', type: Boolean,
    description: 'Display this help guide'
  }
];
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
  const usage = commandLineUsage([
    {
      header: 'Open Git URL Utility',
      // Add italics: `{italic textToItalicize}`
      content: 'Open various URLs for a Git(hub) repository.'
    },
    {
      header: 'Options',
      optionList: optionDefinitions
    }
  ]);
  console.log(usage);
  return;
}

const cwd = type === 'directory' && file === '.' ? process.cwd() : file;

const getGitProjectPath = async () => {
  if (existsSync((join(cwd, '.git')))) {
    return cwd;
  }

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
    pkg = (await import(packageJSON)).default;
  } catch (err) {
    throw new Error(`Trouble reading ${packageJSON}`);
  }
  if (!pkg.repository) {
    throw new Error(`Could not find a repository field at ${packageJSON}`);
  }
  const repoURL = pkg.repository.url;
  const urlBase = ngu(repoURL).url
    // Still leaving this
    // eslint-disable-next-line unicorn/no-unsafe-regex
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
  }

  let url;
  switch (type) {
  default:
  case 'view':
    url = urlBase + '/blob/' + sha || branch + '/' + fileRelativePath;
    break;
  case 'raw':
    url = urlBase.replace(
      'https://github.com',
      'https://raw.githubusercontent.com'
    ) + sha || branch + '/' + fileRelativePath;
    break;
  case 'blame':
    url = urlBase + '/blame/' + sha || branch + '/' + fileRelativePath;
    break;
  case 'history':
    url = urlBase + '/commits/' + sha || branch + '/' + fileRelativePath;
    break;
  case 'edit':
    url = urlBase + '/edit/' + branch + '/' + fileRelativePath;
    break;
  case 'delete':
    url = urlBase + '/delete/' + branch + '/' + fileRelativePath;
    break;
  case 'directory':
    url = urlBase + '/tree/' + sha || branch + '/' + dirname(fileRelativePath);
    break;
  case 'commit':
    url = urlBase + '/commit/' + sha || branch + (diff ? '?diff=' + diff : '');
    // Could technically also allow adding `#diff-` + sha_of_file to
    //   go to specific file diff
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
