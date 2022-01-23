const { readFile, writeFile } = require('fs');
const { join } = require('path');

const angularJson = join(__dirname, '..', 'app', 'angular.json');
readFile(angularJson, function (err, content) {
  if (err) throw err;
  var parseJson = JSON.parse(content);
  parseJson.cli = { analytics: false };
  parseJson.projects.app.architect.build.options.allowedCommonJsDependencies = [
    'class-validator-multi-lang',
    'validator',
  ];

  writeFile(angularJson, JSON.stringify(parseJson, null, 2), function (err) {
    if (err) throw err;
  });
});

const polyfillsTs = join(__dirname, '..', 'app', 'src', 'polyfills.ts');
readFile(polyfillsTs, function (err, content) {
  if (err) throw err;
  const polyfillsLines = content.toString().split('\n');
  polyfillsLines.push(`import 'reflect-metadata';`);
  writeFile(polyfillsTs, polyfillsLines.join('\n'), function (err) {
    if (err) throw err;
  });
});

const tsconfigJson = join(__dirname, '..', 'app', 'tsconfig.json');
readFile(tsconfigJson, function (err, content) {
  if (err) throw err;
  var parseJson = JSON.parse(
    content
      .toString()
      .split('\n')
      .filter((v, i) => i > 0)
      .join('\n')
  );
  delete parseJson.compilerOptions.downlevelIteration;

  parseJson.compilerOptions.emitDecoratorMetadata = true;

  writeFile(tsconfigJson, JSON.stringify(parseJson, null, 2), function (err) {
    if (err) throw err;
  });
});
