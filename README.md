# git-utilities

## Install

```shell
npm i @brettz9/git-utilities
```

## Use with Sourcetree

You can add to Sourcetree any or all of the following Custom actions (being
sure to change the `/path/to` portion to lead to where `@brettz9/git-utilities` is
hosted.

- **Menu Caption**: View File on Github (SHA commit)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--sha=$SHA $REPO/$FILE`

- **Menu Caption**: View File on Github (Latest on branch)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `$REPO/$FILE`

- **Menu Caption**: Directory on Github (SHA commit)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=directory --sha=$SHA $REPO/$FILE`

- **Menu Caption**: Directory on Github (Latest on branch)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=directory $REPO/$FILE`

- **Menu Caption**: Raw File on Github (SHA commit)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=raw --sha=$SHA $REPO/$FILE`

- **Menu Caption**: Raw File on Github (Latest on branch)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=raw $REPO/$FILE`

- **Menu Caption**: Blame File on Github (SHA commit)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=blame --sha=$SHA $REPO/$FILE`

- **Menu Caption**: Blame File on Github (Latest on branch)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=blame $REPO/$FILE`

- **Menu Caption**: History File on Github (SHA commit)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=history --sha=$SHA $REPO/$FILE`

- **Menu Caption**: History File on Github (Latest on branch)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=history $REPO/$FILE`

- **Menu Caption**: Commit on Github (SHA commit, Unified diff)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=commit --diff=unified --sha=$SHA $REPO/$FILE`

- **Menu Caption**: Commit on Github (Latest on branch, Unified diff)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=commit --diff=unified $REPO/$FILE`

- **Menu Caption**: Commit on Github (SHA commit, Split diff)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=commit --diff=split --sha=$SHA $REPO/$FILE`

- **Menu Caption**: Commit on Github (Latest on branch, Split diff)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=commit --diff=split $REPO/$FILE`

- **Menu Caption**: Edit File on Github
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=edit $REPO/$FILE`

- **Menu Caption**: Delete File on Github
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=delete $REPO/$FILE`

You can also add `--branch=<branch>` within the parameters to target a
specific branch.

(Note: to allow you to use your system path instead of hard-coding the
paths above, you'd apparently need to follow one of the solutions at
<https://community.atlassian.com/t5/Bitbucket-questions/SourceTree-Hook-failing-because-paths-don-t-seem-to-be-set/qaq-p/274792> which create a
wrapper application for Sourcetree that adds in path awareness.)

But the shell script at least will work without these solutions, as it
has the line `source ~/.bash_profile`.

## Command line usage

- `open-git-url` - You can run this by either a global npm install or within
  a requiring project's `package.json`.

Run `-h` to get the commands:

[![doc-includes/cli.svg](https://brettz9.github.io/git-utilities/cli.svg)](doc-includes/cli.svg)

## To-dos

1. Add tests and coverage
1. Allow passing in cwd (or defaulting to `process.cwd()`).
1. Refactor to make export which just returns the URL that would be used
1. Document with some CLI examples
1. Add various commit types and use in Sourcetree scripts
1. Script to rebase all branches at a certain depth from a given commit (default 1?)
    1. Use `dialog-node` (already in use for errors) to get further info for
    commit from user (e.g., branches to rebase onto `master` or a specific
    commit by SHA)
1. See [webappfind](https://github.com/brettz9/webappfind) (AtYourCommand)
    for ideas of integration into Atom
1. See <https://github.com/tjunnone/npm-check-updates/issues/570>; might
    split up so as to also be able to query `npm view . repository` (or
    `npm view <npm-pkg-name> repository`) and use that as a base to check
    (via `HEAD` or API requests the presence of CHANGES files, licenses, etc.)
    and also to use npm packages for opening their Github commit history,
    etc. URLs.
1. Ensure working with global install (useful to be able to use on CL to
    open a Git URL from within the directory of a repo)
1. Change to work with any Git site (allowing templates for URL building)
