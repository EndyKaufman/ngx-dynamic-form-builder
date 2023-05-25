const { readFileSync, existsSync } = require('fs');
module.exports = existsSync('transloco.config.json')
  ? JSON.parse(readFileSync('transloco.config.json').toString())
  : {};
