#!/usr/bin/env bash

declare -a arr=("core" "client" "server")

for i in "${arr[@]}"
do
  cd $i
  yarn test
  cd ..
done
