const shapefileToGeoshapes = require('./shapefile-to-geoshapes');
const geoshapesTo2d = require('./geoshapes-to-2d');

module.exports = run = function() {
  shapefileToGeoshapes()
    .then(() => {

      return geoshapesTo2d()
    })
    .then(() => {
      console.log('done');
    })
    .catch(err => {
      throw err;
    });
};

run();