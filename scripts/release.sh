yarn test || exit 1
branchName=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
echo $branchName
git stash push -- src || exit 1
git checkout master
yarn run build || exit 1
touch docs/.nojekyll
git add docs
git commit -m "Update docs for release $1"
git tag $1
git push --tags origin master
git checkout $branchName
git stash pop

