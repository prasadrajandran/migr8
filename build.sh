#!/usr/bin/env bash

if [ "$1" == 'test' ]
then
  echo "[INFO] test mode activated"
fi

echo "1. run npm install"
npm install

echo "2. sort package.json"
npx sort-package-json

echo "3. cleaning dist dir..."
rm -rf dist

echo "4. building..."
npm run build

echo "5. linting..."
npm run lint

echo "6. run prettier..."
npm run prettier-fix

echo "7. testing..."
npm test

if [ "$1" != 'test' ]
then 
  echo "8. check for outdated dependencies..."
  npm outdated
else
  echo "[SKIPPED] 8. check for outdated dependencies..."
fi

if [ "$1" != 'test' ]
then
  package_version=`cat package.json | grep version`
  package_version=${package_version/  \"version\"\: /} # remove `  "version": `
  package_version=${package_version/,/} # remove `,`

  echo
  echo "--- BUILD COMPLETE ---"
  echo
  echo "1. update the package version if necessary: $package_version"
  echo "2. do not forget to run \"npm install\" if the package version is updated so that the lockfile is updated too"
  echo "3. create PR to main (from development), merge PR, and create a GitHub release"
  echo "4. switch to the main branch locally and run \"git pull\""
  echo "5. to publish the package run: \"npm publish --access public\""
  echo "6. switch back to development, merge main, and run \"git push\""
else
  echo "--- TEST BUILD COMPLETE ---"
fi
