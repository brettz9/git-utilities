'use strict';

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
    typeLabel: `{underline ["view" (or "blob")|"raw"|"blame"|"history"|` +
                  `"edit"|"delete"|"directory" (or "tree")|"commit"]}`
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

const cliSections = [
  {
    header: 'Open Git URL Utility',
    // Add italics: `{italic textToItalicize}`
    content: 'Open various URLs for a Git(hub) repository.'
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  }
];

exports.sections = cliSections;
exports.definitions = optionDefinitions;
