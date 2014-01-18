var gutil     = require('gulp-util'),
  requirejs   = require('requirejs'),
  PluginError = gutil.PluginError,
  es          = require('event-stream');

// Consts
const PLUGIN_NAME = 'gulp-requirejs';

module.exports = function(opts) {
  if (!opts) {
    throw new PluginError(PLUGIN_NAME, 'Missing options array!');
  }

  if (!opts.out && typeof opts.out !== 'string') {
    throw new PluginError(PLUGIN_NAME, 'Only single file outputs are supported right now, please pass a valid output file name!');
  }

  if (!opts.baseUrl) {
    throw new PluginError(PLUGIN_NAME, 'Pipeing dirs/files is not supported right now, please specify the base path for your script.');
  }

  return es.map(function (file, callback) {
    var ps = es.pause();

    opts.out = function(text) {
      file.contents = new Buffer(text);
      ps.resume();
      callback(null, file);
    };
    opts.optimize = 'none';
    requirejs.optimize(opts);
  });
};
