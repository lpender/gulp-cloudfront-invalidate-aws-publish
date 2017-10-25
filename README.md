# gulp-cloudfront-invalidate-aws-publish
A gulp plugin that allows you to programmatically invalidate paths in AWS cloudfront.

This version invalidates the array of files that were updated, created, or deleted by
[gulp-awspublish](https://github.com/pgherveou/gulp-awspublish/).

This will work with any similar plugin that uses the same `file.s3` API internally.

Tested with `gulp-awspublish` v3.0.1.

See [gulp-awspublish](https://github.com/pgherveou/gulp-awspublish/) for more
implementation details.

## Installation
```
npm install gulp-cloudfront-invalidate-aws-publish
```

## Usage

```js
var gulp = require('gulp')
  , awspublish = require('gulp-awspublish')
  , cloudfront = require('gulp-cloudfront-invalidate-aws-publish');

var publisher = awspublish.create({
  region: 'your-region-id',
  params: {
    Bucket: '...'
  }
}, {
  cacheFile: 'your-cache-location'
});

// define custom headers
var headers = {
  'Cache-Control': 'max-age=315360000, no-transform, public'
  // ...
};

var cfSettings = {
  distribution: 'E2A654H2YRPD0W', // Cloudfront distribution ID
  accessKeyId: '...',             // Optional AWS Access Key ID
  secretAccessKey: '...',         // Optional AWS Secret Access Key
  sessionToken: '...',            // Optional AWS Session Token
  wait: true,                     // Whether to wait until invalidation is completed (default: false)
  originPath: '/app',             // Configure OriginPath to be removed of file path to invalidation
  indexRootPath: true             // Invalidate index.html root paths (`foo/index.html` and `foo/`) (default: false)
}

gulp.task('invalidate', function () {

  return gulp.src('*')
    .pipe(publisher.publish(headers))
    .pipe(cloudfront(cfSettings))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});
```

## Contact
Lee Pender <Lpender@gmail.com>

## Credit

Thanks to:

https://github.com/confyio/gulp-cloudfront-invalidate

https://github.com/pgherveou/gulp-awspublish

https://github.com/sindresorhus/gulp-debug/
