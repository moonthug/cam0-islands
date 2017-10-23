const fs = require('fs');
const path = require('path');

const basePath = './src';

fs.readdir(basePath, (err, files) => {
  if(err) throw err;

  files.forEach(filename => {
    let filePath = path.join(basePath, filename);
    fs.lstat(filePath, (err, stats) => {
      if(err) throw err;

      if(stats.isDirectory() === false) return;

      const pattern = require(path.resolve(filePath));

      pattern()
        .then(count => {
          console.log(` --- ${filePath} created ${count} islands`);
        })
        .catch(err => {
          console.err(` --- ${filePath} had an error: ${err}`);
        })
    })
  });
});