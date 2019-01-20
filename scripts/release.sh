sed -i.bak s/__REPLACE_VERSION__/$1/g package.json
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
git add docs package.json
git commit -m "Update docs for release $1"
git tag $1
git push --tags origin master
git checkout $branchName
git stash pop
# sed -i.bak s/$1/__REPLACE_VERSION__/g package.json
