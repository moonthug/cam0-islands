const Model = require('./model');

/**
 *
 * @constructor
 */
class Island extends Model {

  constructor(data) {
    super(data);
  }

  parse(data) {
    this._data.label = data.label || '';
    this._data.points = data.points || [];

    return this;
  }
}

module.exports = Island;

