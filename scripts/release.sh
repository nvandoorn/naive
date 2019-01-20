yarn test || exit 1
branchName=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
echo $branchName
# TODO find a better way to exlcude
# docs from the stash
git stash push -- src || exit 1
git checkout master
yarn run build || exit 1
# this is a hack required
# to serve paths that start
# with '_'
touch docs/.nojekyll
git add docs
git commit -m "Update docs for release $1"
git tag $1
git push --tags origin master
git checkout $branchName
git stash pop

