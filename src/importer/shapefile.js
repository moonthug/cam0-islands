const util = require('util');
const shapefile = require('shapefile');

const Importer = require('./importer');

function ShapefileImporter() {
  Importer.call(this);
}

util.inherits(ShapefileImporter, Importer);

/**
 *
 * @return {Promise}
 */
ShapefileImporter.prototype.read = function() {

  // TODO Move to static func on importer
  let _log = (message) => {
    if (!this._logger) return;
    this._logger(message);
  };


  let self = this;
  return new Promise((resolve, reject) => {

    if (!this._filename) reject(new Error('No file to load!?'));
    if (!this._writeStream) reject(new Error('No stream to write to!?'));
    if (!this._mapper) reject(new Error('No mapper to process the data!?'));

    _log(`read file: ${this._filename}`);

    let count = 0;

    shapefile
      .open(this._filename)
      .then(source => source.read()
        .then(function log(result) {
          if (result.done === true) {
            self._writeStream.write(']');
            self._writeStream.end();
            resolve(count);
          }

          self._mapper(result.value)
            .then(data => {
              self._writeStream.write(JSON.stringify(data));
              self._writeStream.write(',');
              if (count % 1000 === 0) _log(` --- ${count} items passed passed`);
              count++;

              return source.read().then(log);
            })
            .catch(reject);
        }))
      .catch(reject);
  });
};

module.exports = ShapefileImporter;