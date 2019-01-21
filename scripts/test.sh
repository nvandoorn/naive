#!/usr/bin/env bash
cd core
yarn test || exit 1
cd ../server
yarn test || exit 1
cd ../client
yarn test || exit 1
