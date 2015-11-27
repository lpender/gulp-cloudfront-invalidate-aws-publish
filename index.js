var util = require('gulp-util')
  , through = require('through2')
  , aws = require('aws-sdk');

module.exports = function (options) {
  options.wait = (options.wait === undefined || !options.wait) ? false : true;

  var cloudfront = new aws.CloudFront();

  cloudfront.config.update({
    accessKeyId: options.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: options.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: options.sessionToken || process.env.AWS_SESSION_TOKEN
  });

  var complain = function (err, msg, callback) {
    throw new util.PluginError('gulp-cloudfront-invalidate', msg + ': ' + err);
    return callback(false);
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

  var work = function (callback) {
    cloudfront.createInvalidation({
      DistributionId: options.distribution,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: options.paths.length,
          Items: options.paths
        }
      }
    }, function (err, res) {
      if (err) return complain(err, 'Could not invalidate cloudfront', callback);

      util.log('Cloudfront invalidation created: ' + res.Invalidation.Id);

      if (!options.wait) {
        return callback();
      }

      check(res.Invalidation.Id, callback);
    });
  };

  return through.obj(function (file, enc, callback) {
    callback();
  }, work);
};
