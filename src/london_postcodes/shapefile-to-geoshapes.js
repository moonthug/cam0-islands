const fs = require('fs');

const shapefile = require('shapefile');
const geocoder = require('local-reverse-geocoder');

/**
 *
 * @return {Promise}
 */
module.exports = function () {
  return new Promise((resolve, reject) => {
      let jsonStream = fs.createWriteStream('postcodes_geoshapes.json', {'flags': 'w'});
      let results = [];

      shapefile.open(__dirname + '/Distribution/Districts.shp')
        .then(source => source.read()
          .then(function log(result) {
            if (result.done) {
              jsonStream.write(JSON.stringify(results));
              jsonStream.end();
              resolve(results.length);
            }

            let data = {
              ll: result.value.geometry.coordinates,
              name: result.value.properties.name,
            };

            if (results.length % 100 === 0) {
              console.log(` --- ${results.length} postcodes passed`);
            }

            results.push(data);

            return source.read().then(log);
          })
          .catch(reject)
        )
        .catch(reject);
    });
};