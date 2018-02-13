var PluginError = require('plugin-error')
  , log = require('fancy-log')
  , through = require('through2')
  , aws = require('aws-sdk');

module.exports = function (options) {
  options.wait = !!options.wait;
  options.indexRootPath = !!options.indexRootPath;

  var cloudfront = new aws.CloudFront();

  if ('credentials' in options) {
    cloudfront.config.update({
      credentials: options.credentials
    });
  }
  else {
    cloudfront.config.update({
      accessKeyId: options.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: options.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: options.sessionToken || process.env.AWS_SESSION_TOKEN
    });
  }

  var files = [];

  var complain = function (err, msg, callback) {
    callback(false);
    throw new PluginError('gulp-cloudfront-invalidate', msg + ': ' + err);
  };

  var check = function (id, callback) {
    cloudfront.getInvalidation({
      DistributionId: options.distribution,
      Id: id
    }, function (err, res) {
      if (err) return complain(err, 'Could not check on invalidation', callback);

      if (res.Invalidation.Status === 'Completed') {
        return callback();
      } else {
        setTimeout(function () {
          check(id, callback);
        }, 1000);
      }
    })
  };

  var processFile = function (file, encoding, callback) {
    // https://github.com/pgherveou/gulp-awspublish/blob/master/lib/log-reporter.js
    var state;

    if (!file.s3) return callback(null, file);
    if (!file.s3.state) return callback(null, file);
    if (options.states &&
        options.states.indexOf(file.s3.state) === -1) return callback(null, file);

    switch (file.s3.state) {
      case 'update':
      case 'create':
      case 'delete':
        let path = file.s3.path;

        if (options.originPath) {
          const originRegex = new RegExp(options.originPath.replace(/^\//, '') + '\/?');
          path = path.replace(originRegex, '');
        }

        files.push(path);
        if (options.indexRootPath && /index\.html$/.test(path)) {
          files.push(path.replace(/index\.html$/, ''));
        }
        break;
      case 'cache':
      case 'skip':
        break;
      default:
        log('Unknown state: ' + file.s3.state);
        break;
    }

    return callback(null, file);
  };

  var invalidate = function(callback){
    if(files.length == 0) return callback();

    files = files.map(function(file) {
      return '/' + file;
    });

    cloudfront.createInvalidation({
      DistributionId: options.distribution,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: files.length,
          Items: files
        }
      }
    }, function (err, res) {
      if (err) return complain(err, 'Could not invalidate cloudfront', callback);

      log('Cloudfront invalidation created: ' + res.Invalidation.Id);

      if (!options.wait) {
        return callback();
      }

      check(res.Invalidation.Id, callback);
    });
  };

  return through.obj(processFile, invalidate);
};
