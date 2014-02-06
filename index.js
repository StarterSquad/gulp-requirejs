var through = require('through2');
var requirejs = require('requirejs');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-requirejs';

module.exports = function (opts) {

  if (!opts) {
    throw new PluginError(PLUGIN_NAME, 'Missing options array!');
  }

  if (!opts.baseUrl) {
    throw new PluginError(PLUGIN_NAME, 'Pipeing dirs/files is not supported right now, please specify the base path for your script.');
  }

  var stream = through.obj(function (file, enc, callback) {

    var optimize = function (illBeBack) {

      opts.out = function (text) {
        illBeBack(text);
        stream.push(file);
        return callback();
      };
      requirejs.optimize(opts);
    };

    return optimize(function (text) {
      file.contents = Buffer(text);
    });
  });

  return stream;
};
