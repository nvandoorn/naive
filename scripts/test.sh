#!/usr/bin/env bash

declare -a arr=("core" "client" "server")

# start with unit tests for
# each package
for i in "${arr[@]}"
do
  cd $i
  yarn test
  cd ..
done

# if they pass,
# run the integration tests
cd integration
yarn test
cd ..
