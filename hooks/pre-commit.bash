#!/bin/bash

git stash --keep-index -u

if npm run lint; then
    git add -A 
    echo "Linter passed"
else
    git stash pop
    echo "Linter failed, please fix linter errors"
    exit 1
fi

if npm run test; then
    git stash pop
    echo "Tests pass, proceeding with commit."
else
    git stash pop
    echo "Tests failing, aborting commit."
    exit 1
fi