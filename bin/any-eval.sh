#!/bin/bash

# Can't seem to get Sourcetree to work without running as a script so just pass on args

# Including these as generic script can target

# Need this line for PATH awareness (or otherwise have to launch Sourcetree in
#   a different manner https://community.atlassian.com/t5/Bitbucket-questions/SourceTree-Hook-failing-because-paths-don-t-seem-to-be-set/qaq-p/274792 )
source ~/.bash_profile

eval "$@"
