/**
 *
 * @type {Importer}
 */
class Importer {

  constructor() {
    this._writeStream = null;
    this._filename = null;
    this._mapper = null;
    this._logger = null;
    this._loggerLabel = 'importer';
  }

  _log(message) {
    if (!this._logger) return;
    this._logger(`${this._loggerLabel}: ${message}`);
  };

  /**
   *
   * @param {string} filename
   * @return {Importer}
   */
  setFilename(filename) {
    this._filename = filename;
    return this;
  }

  /**
   *
   * @param {WriteStream} writeStream
   * @return {Importer}
   */
  setWriteStream(writeStream) {
    this._writeStream = writeStream;
    return this;
  };

  /**
   *
   * @param {Promise} mapper
   * @return {Importer}
   */
  setMapper(mapper) {
    this._mapper = mapper;
    return this;
  };

  /**
   *
   * @param {function} logger
   * @param {string} label
   * @return {Importer}
   */
  setLogger(logger, label) {
    this._logger = logger;
    this._loggerLabel = label;
    return this;
  };

  /**
   *
   */
  importFile() {
    console.log('implement me!');
  };
}

module.exports = Importer;
