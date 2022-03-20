const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-dynamic-require
const packageJSON = require(path.resolve(__dirname, '../package.json'));

const origin = path.resolve(__dirname, '../src/index.html');
const target = path.resolve(__dirname, '../dist/index.html');

fs.copyFile(origin, target, (err) => {
  if (err) {
    console.log('Oops! An Error Occured:', err);
  } else {
    const targetContent = fs.readFileSync(target, 'utf-8');

    fs.writeFileSync(target, targetContent.replaceAll('%VERSION%', packageJSON.version));
  }
});
