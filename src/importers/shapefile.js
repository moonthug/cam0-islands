const util = require('util');
const shapefile = require('shapefile');

const Importer = require('./importer');

const GeoShape = require('../models/geoshape');

/**
 *
 * @constructor
 */
class ShapefileImporter extends Importer {
  importFile() {
    return new Promise((resolve, reject) => {
      let self = this;

      if (!this._filename) reject(new Error('No file to load!?'));
      if (!this._writeStream) reject(new Error('No stream to write to!?'));
      if (!this._mapper) reject(new Error('No mapper to process the data!?'));

      this._log(`read file: ${this._filename}`);

      let count = 0;

      self._writeStream.write('[');

      shapefile
        .open(this._filename)
        .then(source => source.read()
          .then(function log(result) {
            if (result.done === true) {
              self._log(` --- ${count} items total`);
              self._writeStream.write(']');
              self._writeStream.end();
              resolve();
            }

            self._mapper(result.value)
              .then(data => {
                if(count > 0) {
                  self._writeStream.write(',')
                }

                self._writeStream.write(
                  new GeoShape()
                    .parse(data)
                    .toJSONString()
                );

                if (count % 1000 === 0) self._log(` --- ${count} items passed passed`);
                count++;

                return source.read().then(log);
              })
              .catch(reject);
          }))
        .catch(reject);
    });
  }
}

module.exports = ShapefileImporter;