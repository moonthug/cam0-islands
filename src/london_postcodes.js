const fs = require('fs');
const path = require('path');

const ShapefileImporter = require('./importers/shapefile');
const ShapefileConverter = require('./converters/shapefile');

module.exports = function(outputFilename, options) {
  return new Promise((resolve, reject) => {
    let name = 'london_postcodes';

    let geoShapesFilename = '/tmp/london_shapes.json';
    let writeStream = fs.createWriteStream(geoShapesFilename, {'flags': 'w'});

    let importer = new ShapefileImporter()
      .setFilename(path.resolve(path.join(__dirname, 'data', 'london_postcodes', 'Distribution', 'Districts.shp')))
      .setWriteStream(writeStream)
      .setLogger(options.logger, name)
      .setMapper(d => {
        return new Promise(resolve => {
          return resolve({
            name: d.properties.name,
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
  });
};
