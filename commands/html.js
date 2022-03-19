const fs = require('fs');
const path = require('path');

const origin = path.resolve(__dirname, '../src/index.html');
const target = path.resolve(__dirname, '../dist/index.html');

fs.copyFile(origin, target, (err) => {
  if (err) {
    console.log('Oops! An Error Occured:', err);
  }
});
