/**
 *
 * @param {string} filepath
 * @param {function} mapTo
 * @return {Promise}
 */
module.exports = Importer = function() {

  this._writeStream = null;
  this._filename = null;
  this._mapper = null;
  this._logger = null;


  let _log = (message) => {
    if (!this._logger) return;
    this._logger(message);
  };

  /**
   *
   * @param {string} filename
   * @return {Importer}
   */
  this.setFilename = function (filename) {
    this._filename = filename;
    return this;
  };

  /**
   *
   * @param {WriteStream} writeStream
   * @return {Importer}
   */
  this.setWriteStream = function (writeStream) {
    this._writeStream = writeStream;
    return this;
  };

  /**
   *
   * @param {Promise} mapper
   * @return {Importer}
   */
  this.setMapper = function (mapper) {
    this._mapper = mapper;
    return this;
  };

  /**
   *
   * @param {function} logger
   * @return {Importer}
   */
  this.setLogger = function (logger) {
    this._logger = logger;
    return this;
  };

  return this;
};