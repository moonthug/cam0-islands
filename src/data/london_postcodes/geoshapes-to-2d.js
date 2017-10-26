/**
 * Created by axe on 21/08/2017.
 */

const fs = require('fs');

let postcodes = require('./postcodes_geoshapes.json');

module.exports = function() {
  return new Promise((resolve, reject) => {
    let jsonStream = fs.createWriteStream('postcodes_2d.json', {'flags': 'w'});

    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;

    // Loops through all waters and change lng/lat to cartesian
    postcodes.forEach((postcode, i) => {
      let centreLat = 0;
      let centreLon = 0;
      let pointCount = 0;

      if (postcode.name === 'n4') {
        console.log(i); // Rutland Water <3
      }

      postcode.ll.forEach(points => {
        points.forEach(point => {
          centreLat += point[0];
          centreLon += point[1];
          pointCount++;
        });
      });

      centreLat = centreLat / pointCount;
      centreLon = centreLon / pointCount;

      let transformLat = 0 - centreLat;
      let transformLon = 0 - centreLon;

      postcode.pointsRaw = [];

      postcode.ll.forEach((points, i) => {
        postcode.pointsRaw[i] = [];

        points.forEach((point, j) => {
          let newPoint = [
            point[0] + transformLat,
            point[1] + transformLon,
          ];

          minX = newPoint[0] < minX ? newPoint[0] : minX;
          minY = newPoint[1] < minY ? newPoint[1] : minY;

          maxX = newPoint[0] < maxX ? newPoint[0] : maxX;
          maxY = newPoint[1] < maxY ? newPoint[1] : maxY;

          postcode.pointsRaw[i][j] = newPoint;
        });
      });
    });

    postcodes.forEach(postcode => {
      postcode.points = [];
      postcode.pointsRaw.forEach((points, i) => {
        postcode.points[i] = [];

        points.forEach((point, j) => {
          postcode.points[i][j] = [
            point[0] / maxX,
            point[1] / maxY,
          ];
        });
      });
      delete postcode.ll;
      delete postcode.pointsRaw;
    });

    jsonStream.write(JSON.stringify(postcodes));
    jsonStream.end();
  });
};