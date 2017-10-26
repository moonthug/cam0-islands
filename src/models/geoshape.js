const Model = require('./model');

/**
 *
 * @constructor
 */
class GeoShape extends Model {

  constructor(data) {
    super(data);
  }

  parse(data) {
    this._data.label = data.label || '';
    this._data.ll = data.ll || [];

    return this;
  }
}

module.exports = GeoShape;