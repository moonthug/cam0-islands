const fs = require('fs');
const path = require('path');

let islands = [
  'uk_lakes_and_wetlands',
  'london_postcodes'
];

let islandFuncs = islands.map(filename => {
  let outputFilename = path.resolve(path.join(__dirname, '..', 'out', `${filename}.json`));
  let writeStream = fs.createWriteStream(outputFilename, {'flags': 'w'});

  let islandFuncFile = path.resolve(path.join(__dirname, filename));
  return require(islandFuncFile)(writeStream, {logger: console.log});
});

Promise.all(islandFuncs)
  .then(results => {
    console.dir(results);
  })
  .catch(err => {
    throw err;
  });