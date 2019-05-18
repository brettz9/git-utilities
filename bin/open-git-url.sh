#!/bin/bash

# Can't seem to get Sourcetree to work without running as a script so just pass on args

# Need this line for PATH awareness (or otherwise have to launch Sourcetree in
#   a different manner https://community.atlassian.com/t5/Bitbucket-questions/SourceTree-Hook-failing-because-paths-don-t-seem-to-be-set/qaq-p/274792 )
source ~/.bash_profile

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PARENT="$(dirname $DIR)"
eval "$PARENT/src/open-git-url.mjs $@"
