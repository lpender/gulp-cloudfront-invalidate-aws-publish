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

var awsSettings = {
  region: "...",
  params: {
    bucket: "E123123"
  }
}

var cfSettings = {
  distribution: 'E2A654H2YRPD0W', // Cloudfront distribution ID
  accessKeyId: '...',             // AWS Access Key ID
  secretAccessKey: '...',         // AWS Secret Access Key
  sessionToken: '...',            // Optional AWS Session Token
  wait: true                      // Whether to wait until invalidation is completed (default: false)
}

gulp.task('invalidate', function () {
  return gulp.src('*')
    .pipe(awspublish(awsSettings));
    .pipe(cloudfront(cfSettings));
});
```

## Contact
Lee Pender <Lpender@gmail.com>

## Credit

Thanks to:

https://github.com/lpender/gulp-cloudfront-invalidate
https://github.com/pgherveou/gulp-awspublish
https://github.com/sindresorhus/gulp-debug/
