const path = require('path');

let islands = [
  'uk_lakes_and_wetlands',
  'london_postcodes'
];

let islandFuncs = islands.map(filename => {
  let islandFuncFile = path.resolve(path.join(__dirname, filename));
  let outputFilename = path.resolve(path.join(__dirname, '..', 'out', `${filename}.json`));
  return require(islandFuncFile)(outputFilename, {logger: console.log});
});

Promise.all(islandFuncs)
  .then(() => {
    console.log('complete');
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });