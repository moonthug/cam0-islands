const util = require('util');

const Converter = require('./converter');

const Island = require('../models/island');

/**
 *
 * @constructor
 */
class ShapefileConverter extends Converter {

  /**
   *
   * @param {ReadStream} inputStream
   * @return {Promise}
   */
  readFileToJSON(inputStream) {
    return new Promise((resolve, reject) => {
      let string = '';

      inputStream.on('data', chunk => {
        string += chunk;
      });

      inputStream.on('end', () => {
        try {
          this._log('Parse to JSON...');
          let data = JSON.parse(string);
          resolve(data);
        }
        catch (err) {
          reject(err);
        }
      });
    })
  }

  /**
   *
   * @return {Promise}
   */
  _convert(inputStream, outputStream) {
    return new Promise((resolve, reject) => {

      this.readFileToJSON(inputStream)
        .then(geoShapes => {

          let minX = 0;
          let minY = 0;
          let maxX = 0;
          let maxY = 0;

          geoShapes.forEach(geoShape => {
            let centreLat = 0;
            let centreLon = 0;
            let pointCount = 0;

            // TODO Tidy this shit up!

            // Get Centre point
            geoShape.ll.forEach(points => {
              points.forEach(point => {
                centreLat += point[0];
                centreLon += point[1];
                pointCount++;
              });
            });
            centreLat = centreLat / pointCount;
            centreLon = centreLon / pointCount;

            // Get origin
            let transformLat = 0 - centreLat;
            let transformLon = 0 - centreLon;

            geoShape.pointsRaw = [];

            geoShape.ll.forEach((points, i) => {
              geoShape.pointsRaw[i] = [];

              points.forEach((point, j) => {
                let newPoint = [
                  point[0] + transformLat,
                  point[1] + transformLon,
                ];

                minX = newPoint[0] < minX ? newPoint[0] : minX;
                minY = newPoint[1] < minY ? newPoint[1] : minY;

                maxX = newPoint[0] < maxX ? newPoint[0] : maxX;
                maxY = newPoint[1] < maxY ? newPoint[1] : maxY;

                geoShape.pointsRaw[i][j] = newPoint;
              });
            });
          });


          geoShapes.forEach(geoShape => {
            geoShape.points = [];
            geoShape.pointsRaw.forEach((points, i) => {
              geoShape.points[i] = [];

              points.forEach((point, j) => {
                geoShape.points[i][j] = [
                  point[0] / maxX,
                  point[1] / maxY,
                ];
              });
            });
            delete geoShape.ll;
            delete geoShape.pointsRaw;
          });

          outputStream.write(JSON.stringify(geoShapes));
          outputStream.end();

          resolve();
        })
        .catch(reject);
    });
  };
}

module.exports = ShapefileConverter;