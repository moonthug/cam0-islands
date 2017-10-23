const fs = require('fs');

const shapefile = require('shapefile');
const geocoder = require('local-reverse-geocoder');

/**
 *
 * @return {Promise}
 */
module.exports = function () {
  return new Promise((resolve, reject) => {
    console.log(' --- Loading geo data...');

    geocoder.init({
        load: {
          admin1: false, admin2: false, admin3And4: false, alternateNames: false
        }
      },
      () => {
        console.log(' --- Geo data loaded');

        let jsonStream = fs.createWriteStream('waters_geoshapes.json', {'flags': 'w'});
        jsonStream.write('[');

        let count = 0;

        shapefile.open(__dirname + '/GLWD-level2/glwd_2.shp')
          .then(source => source.read()
            .then(function log(result) {
              if (result.done) {
                jsonStream.write(']');
                jsonStream.end();
                resolve(count);
              }

              geocoder.lookUp({
                latitude: result.value.properties.LAT_DEG,
                longitude: result.value.properties.LONG_DEG
              }, (err, res) => {
                if (err)
                  return reject(new Error('Lookup failed'));

                if (!res || res.length === 0)
                  return reject(new Error('Geo Not found!'));

                if (res[0][0].countryCode !== 'GB') {
                  return;
                }

                let data = {
                  glwdId: result.value.properties.GLWD_ID,
                  ll: result.value.geometry.coordinates,
                  name: res[0][0].asciiName,
                };

                if (count % 100 === 0) {
                  console.log(` --- ${count} waters passed`);
                }

                jsonStream.write(JSON.stringify(data));
                jsonStream.write(',');

                count++;
              });

              return source.read().then(log);
            })
            .catch(reject)
          )
          .catch(reject);
      });
  });
};