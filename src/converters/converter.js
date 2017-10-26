const fs = require('fs');

/**
 *
 * @class {Converter}
 */
class Converter {

  constructor() {
    this._inputFilename = null;
    this._outputFilename = null;
    this._logger = null;
    this._loggerLabel = 'converter';
  }


  _log(message) {
    if (!this._logger) return;
    this._logger(message);
    this._logger(`${this._loggerLabel}: ${message}`);
  }

  /**
   *
   * @param {string} filename
   * @return {Converter}
   */
  setInputFilename(filename) {
    this._inputFilename = filename;
    return this;
  };


  /**
   *
   * @param {string} filename
   * @return {Converter}
   */
  setOutputFilename(filename) {
    this._outputFilename = filename;
    return this;
  };

  /**
   *
   * @param {function} logger
   * @param {string} label
   * @return {Converter}
   */
  setLogger(logger, label) {
    this._logger = logger;
    this._loggerLabel = label;
    return this;
  };

  /**
   *
   * @return {Promise}
   */
  convert() {
    if (!this._inputFilename) reject(new Error('No file to read from!?'));
    if (!this._outputFilename) reject(new Error('No file to write to!?'));

    this._log(`read file: ${this._inputFilename}`);

    let inputStream = fs.createReadStream(this._inputFilename, {flags: 'r', encoding: 'utf-8'});
    let outputStream = fs.createWriteStream(this._outputFilename, {flags: 'w', encoding: 'utf-8'});

    return this._convert(inputStream, outputStream);
  };

  /**
   *
   * @param {ReadStream} inputStream
   * @param {WriteStream} outputStream
   * @return {Promise}
   * @private
   */
  _convert(inputStream, outputStream) {
    throw new Error('Implement me!');
  };
}

module.exports = Converter;