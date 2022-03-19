const fs = require('fs-extra');
const path = require('path');

const origin = path.resolve(__dirname, '../src/assets');
const target = path.resolve(__dirname, '../dist/assets');

fs.copy(origin, target, (err) => {
  if (err) {
    console.log('An error occured while copying the folder.');
    return console.error(err);
  }
  console.log('Copy completed!');

  return true;
});
