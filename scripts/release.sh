#!/usr/bin/env bash

declare -a arr=("core" "client" "server")

# TODO re-enable git stuff

# git stash || exit 1
# git checkout master

rm -rf docs
mkdir docs
touch docs/.nojekyll

branchName=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

for i in "${arr[@]}"
do
  echo "***  Building naive-$i  ***"
  cd $i
  # update the version in the package file
  yarn run build || exit 1
  mv docs ../docs/$i
  cd ..
done

for i in "${arr[@]}"
do
  echo "***  Testing and publishing naive-$i  ***"
  cd $i
  # make sure the tests pass
  yarn test || exit 1
  # update the version in the package file
  # for some reason yarn fucks
  # with the git repo? use npm for now
  # I guess
  npm version $1
  npm publish --access public || exit 1
  cd ..
done

# git commit -m "Update for release $1"
# git tag $1
# git push --tags origin master
# git checkout $branchName
# git stash pop
