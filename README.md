# git-utilities

## Install

```shell
npm i @brettz9/git-utilities
```

## Use with Sourcetree

You can add to Sourcetree any or all of the following Custom actions (being
sure to change the `/path/to` portion to lead to where `@brettz9/git-utilities` is
hosted.

- **Menu Caption**: View File on Github
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `$REPO/$FILE`

- **Menu Caption**: Directory on Github
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=directory $REPO/$FILE`

- **Menu Caption**: Raw File on Github
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=raw $REPO/$FILE`

- **Menu Caption**: Blame File on Github
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=blame $REPO/$FILE`

- **Menu Caption**: History File on Github
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=history $REPO/$FILE`

- **Menu Caption**: Blame File on Github
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=blame $REPO/$FILE`

- **Menu Caption**: Commit on Github (Unified diff)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=commit --diff=unified --sha=$SHA $REPO/$FILE`

- **Menu Caption**: Commit on Github (Split diff)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=commit --diff=split --sha=$SHA $REPO/$FILE`

- **Menu Caption**: Last commit on Github (Unified diff)
- **Script to run**: `/path/to/@brettz9/git-utilities/bin/open-git-url.sh`
- **Parameters**: `--type=commit --diff=unified $REPO/$FILE`

- **Menu Caption**: Last commit on Github (Split diff)
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
  a requiring project's `package.json`. Run `-h` to get the commands.

## To-dos

1. Add various commit types and use in Sourcetree scripts
1. Script to rebase all branches at a certain depth from a given commit (default 1?)
  1. Use `dialog-node` (already in use for errors) to get further info for
    commit from user (e.g., branches to rebase onto `master` or a specific
    commit by SHA)
