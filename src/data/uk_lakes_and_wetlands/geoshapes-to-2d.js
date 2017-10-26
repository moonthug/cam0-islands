/**
 * Created by axe on 21/08/2017.
 */

const fs = require('fs');

let waters = [];

module.exports = function() {
  return new Promise(resolve, reject, () => {
    let jsonStream = fs.createWriteStream('waters_2d.json', {'flags': 'w'});

    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;

    // Loops through all waters and change lng/lat to cartesian
    waters.forEach((water, w) => {
      let centreLat = 0;
      let centreLon = 0;
      let pointCount = 0;

      if (water.name === 'Empingham') {
        console.log(w); // Rutland Water <3
      }

      water.ll.forEach(points => {
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

      water.pointsRaw = [];

      water.ll.forEach((points, i) => {
        water.pointsRaw[i] = [];

        points.forEach((point, j) => {
          let newPoint = [
            point[0] + transformLat,
            point[1] + transformLon,
          ];

          minX = newPoint[0] < minX ? newPoint[0] : minX;
          minY = newPoint[1] < minY ? newPoint[1] : minY;

          maxX = newPoint[0] < maxX ? newPoint[0] : maxX;
          maxY = newPoint[1] < maxY ? newPoint[1] : maxY;

          water.pointsRaw[i][j] = newPoint;
        });
      });
    });

    waters.forEach(water => {
      water.points = [];
      water.pointsRaw.forEach((points, i) => {
        water.points[i] = [];

        points.forEach((point, j) => {
          water.points[i][j] = [
            point[0] / maxX,
            point[1] / maxY,
          ];
        });
      });
      delete water.ll;
      delete water.pointsRaw;
    });

    jsonStream.write(JSON.stringify(waters));
    jsonStream.end();
  });
};