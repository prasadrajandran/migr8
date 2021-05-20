#!/usr/bin/env bash

echo "1. run npm install"
npm install

echo "2. sort package.json"
npx sort-package-json

echo "3. building..."
npm run build

echo "4. linting..."
npm run lint

echo "5. run prettier..."
npm run prettier-fix

echo "6. testing..."
npm test

echo "7. check for outdated dependencies..."
npm outdated

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
