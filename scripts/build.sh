#!/usr/bin/env bash

declare -a arr=("core" "client" "server")
rm -rf docs || exit 0
mkdir docs || exit 0
touch docs/.nojekyll

for i in "${arr[@]}"
do
  cd $i
  yarn run build
  mkdir ../docs/$i
  cp -R docs/* ../docs/$i
  rm -rf docs
  cd ..
done
