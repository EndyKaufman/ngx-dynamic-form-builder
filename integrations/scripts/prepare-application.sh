#!/bin/bash
rm -rf ./integrations/app
mkdir -p ./integrations/app
cd ./integrations
npx --yes ng new app --force --routing --style=scss --skip-git=true --skip-tests=true --minimal=true --interactive=false --force=true --commit=false
cd ../
mkdir -p ./integrations/app/src/app/new-api
cp -Rf ./apps/demo/src/app/panels/new-api/* ./integrations/app/src/app/new-api/
cp -Rf ./integrations/default/* ./integrations/app/src/app/
node ./integrations/scripts/path-angular-files.js
mkdir -p ./integrations/app/lib
cp -Rf ./dist/libs/ngx-dynamic-form-builder/* ./integrations/app/lib
npx --yes replace-json-property ./integrations/app/lib/package.json version 0.0.0
cd ./integrations/app/lib
npm pack .
cd ../
npm install --save ./lib/ngx-dynamic-form-builder-0.0.0.tgz --force
npm run build
cd ../../
