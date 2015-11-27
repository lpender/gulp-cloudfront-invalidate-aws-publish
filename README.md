# gulp-cloudfront-invalidate
A gulp plugin that allows you to invalidate paths in AWS cloudfront

## Installation
```
npm install gulp-cloudfront-invalidate
```

## Usage

```js
var gulp = require('gulp')
  , cloudfront = require('gulp-cloudfront-invalidate');

var settings = {
  distribution: 'E2A654H2YRPD0W', // Cloudfront distribution ID
  paths: ['/index.html']          // Paths to invalidate
  accessKeyId: '...',             // AWS Access Key ID
  secretAccessKey: '...',         // AWS Secret Access Key
  sessionToken: '...',            // Optional AWS Session Token
  wait: true                      // Whether to wait until invalidation is completed (default: false)
}

gulp.task('invalidate', function () {
  return gulp.src('*')
    .pipe(cloudfront(settings));
});
```


If you like this project, please watch this and follow me.

## Contributors
Here is a list of [Contributors](http://github.com/pksunkara/gulp-cloudfront-invalidate/contributors)

__I accept pull requests and guarantee a reply back within a day__

## License
MIT/X11

## Bug Reports
Report [here](http://github.com/pksunkara/gulp-cloudfront-invalidate/issues). __Guaranteed reply within a day__.

## Contact
Pavan Kumar Sunkara (pavan.sss1991@gmail.com)

Follow me on [github](https://github.com/users/follow?target=pksunkara), [twitter](http://twitter.com/pksunkara)
