/**
 *
 * @type {Model}
 */
class Model  {
  constructor(data) {
    this._data = {};

    if(data) {
      this.parse(data);
    }
  }

  /**
   *
   */
  parse(data) {
    throw new Error('Implement me!');
  };

  /**
   *
   * @return {*}
   */
  toJSONString() {
    return JSON.stringify(this._data);
  }
}

module.exports = Model;