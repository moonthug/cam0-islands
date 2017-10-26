const path = require('path');

const ShapefileImporter = require('./importer/shapefile');

module.exports = function(writestream, options) {
  return new Promise((resolve, reject) => {
    let waterImporter = new ShapefileImporter();
    waterImporter
      .setFilename(path.resolve(path.join(__dirname, 'data', 'uk_lakes_and_wetlands', 'GLWD-level2', 'glwd_2.shp')))
      .setWriteStream(writestream)
      .setLogger(options.logger)
      .setMapper(d => {
        return new Promise(resolve => {
          return resolve({
            name: d.properties.GLWD_ID,
            ll: d.geometry.coordinates
          });
        });
      })
      .read()
      .then(result => {
        resolve(result);
      })
      .catch(reject);
  })
};
