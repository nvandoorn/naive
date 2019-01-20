branchName=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
echo $branchName
git stash push -- src
git checkout master
yarn run build
touch build/.nojekyll
git add docs
git commit -m "Update docs for release $1"
git tag $1
git push --tags origin master
git checkout $branchName
git stash pop

