const fs = require('fs');
const path = require('path');

const ShapefileImporter = require('./importers/shapefile');
const ShapefileConverter = require('./converters/shapefile');

module.exports = function(outputFilename, options) {
  return new Promise((resolve, reject) => {
    let name = 'uk_lakes_shapes';

    let geoShapesFilename = '/tmp/uk_lakes_shapes.json';
    let writeStream = fs.createWriteStream(geoShapesFilename, {'flags': 'w'});

    let importer = new ShapefileImporter()
      .setFilename(path.resolve(path.join(__dirname, 'data', 'uk_lakes_and_wetlands', 'GLWD-level2', 'glwd_2.shp')))
      .setWriteStream(writeStream)
      .setLogger(options.logger, name)
      .setMapper(d => {
        return new Promise(resolve => {
          return resolve({
            name: d.properties.GLWD_ID,
            ll: d.geometry.coordinates
          });
        });
      });

    let converter = new ShapefileConverter()
      .setInputFilename(geoShapesFilename)
      .setOutputFilename(outputFilename)
      .setLogger(options.logger, name);

    importer.importFile()
      .then(() => converter.convert())
      .then(result => {
        resolve(result);
      })
      .catch(reject);
  })
};
