import gulp from 'gulp'
import gutil from 'gulp-util'
import del from 'del'
import webpack from 'webpack'
import awspublish from 'gulp-awspublish'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from './webpack.config.js'
import jsonfile from 'jsonfile'

const config = jsonfile.readFileSync('./config.json')

// The development server (the recommended option for development)
gulp.task('default', ['webpack-dev-server'])

// Production build
gulp.task('build', ['clean-build', 'webpack:build', 'copy', 'copy-assets'])

gulp.task('webpack:build', function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig)
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    )

    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err) throw new gutil.PluginError('webpack:build', err)
        gutil.log('[webpack:build]', stats.toString({
            colors: true
        }))
        callback()
    })
})

gulp.task('clean-build', () => {
    return del.sync(['./build/**/*'])
})

gulp.task('publish', function() {
 
    // create a new publisher using S3 options 
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property 
    var publisher = awspublish.create({
        region: config.aws.region,
        params: {
            Bucket: config.aws.bucket
        }
    }, {
        cacheFileName: 'your-cache-location'
    });
 
    // define custom headers 
    var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
        // ... 
    };
 
    return gulp.src('./build/**/*')
         // gzip, Set Content-Encoding headers and add .gz extension 
        // .pipe(awspublish.gzip({ ext: '.gz' }))
 
        // publisher will add Content-Length, Content-Type and headers specified above 
        // If not specified it will set x-amz-acl to public-read by default 
        .pipe(publisher.publish(headers, { force: true, createOnly: false }))
        .pipe(publisher.sync())
        // create a cache file to speed up consecutive uploads 
        // .pipe(publisher.cache())
 
         // print upload updates to console 
        .pipe(awspublish.reporter())
})

gulp.task('copy', () => {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./build'))
})

gulp.task('copy-assets', () => {
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./build/img'))
})

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig)
myDevConfig.devtool = 'sourcemap'
myDevConfig.debug = true

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig)

gulp.task('webpack:build-dev', function(callback) {
    // run webpack
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError('webpack:build-dev', err)
        gutil.log('[webpack:build-dev]', stats.toString({
            colors: true
        }))
        callback()
    })
})

gulp.task('webpack-dev-server', function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig)
    myConfig.devtool = 'eval'
    myConfig.debug = true
    myConfig.entry.push('webpack-dev-server/client?http://localhost:8080')
    myConfig.entry.push('webpack/hot/dev-server')

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: '/',
        contentBase: 'src',
        stats: {
            colors: true
        }
    }).listen(8080, 'localhost', function(err) {
        if(err) throw new gutil.PluginError('webpack-dev-server', err)
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html')
    })
})