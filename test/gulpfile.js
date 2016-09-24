var gulp = require('gulp');
// 清空文件夹
var clean = require('gulp-clean');
// 处理sass
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// css压缩
var cleanCss = require('gulp-clean-css');

var uglify = require('gulp-uglify'); // js压缩
var concat = require('gulp-concat'); // 合并
var rename = require('gulp-rename');// 重命名

//md5
var rev = require('gulp-rev');
// 根据rev-manifest.json 对应关系替换路径
var revCollector = require('gulp-rev-collector');

var browserSync = require('browser-sync').create();

var path = require('path');
// 载入配置文件
var fileConfig = require('./fileConfig');
var paths = fileConfig.getPaths();
var destPaths = fileConfig.getDestPaths();

var argv = require('yargs').argv;
var evr;

// 处理完css 等任务后,替换路径
gulp.task('buildDev',['buildHtml','buildCss','buildJS'],function(){
    console.log("buildDev...");
    return gulp.src([path.join(destPaths.rootPath+"/**/*.json"), paths.html])
        .pipe( revCollector({
            replaceReved: true
        }) )
        .pipe(gulp.dest(destPaths.rootPath))

});

//
gulp.task('buildDevCss',['buildCss'],function(){
    console.log("buildDevCss...");
    return gulp.src([path.join(destPaths.rootPath+"/**/*.json"), paths.html])
        .pipe( revCollector({
            replaceReved: true
        }) )
        .pipe(gulp.dest(destPaths.rootPath))

});

//编译 sass
// nested，expanded，compact，compressed
gulp.task('buildSass',function(){
    console.log("build-sass run");
    return gulp.src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.cssPath))
});

// css文件压缩,加版本号
gulp.task('buildCss', ['buildSass'],function() {
    console.log("buildCss md5");
    return gulp.src(paths.css)
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(destPaths.css))
        .pipe(rev.manifest())
        .pipe(gulp.dest(destPaths.revCss))
});

/* html打包 */
gulp.task('buildHtml', function () {
    return gulp.src(paths.html)
        .pipe(gulp.dest(destPaths.html));
});

/* js打包 */

gulp.task('buildJS',function () {
    
    console.log('buildJS...',paths.js);
  
    return gulp.src(paths.js)
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(rev())
        .pipe(gulp.dest(destPaths.js))
        .pipe( rev.manifest() )
        .pipe(gulp.dest(destPaths.revJs));

});


// 清空样式、js
gulp.task('clean', function () {
    console.log('clean');
    return gulp.src([destPaths.css, destPaths.js], {read: false})
        .pipe(clean({force: true}));
});

// Static server
gulp.task('browser-sync', function () {
    console.log("browser-sync...");

    // 更改默认端口

    var files = [
        '**/*.html',
        '**/*.css',
        '**/*.scss',
        '**/*.js'
    ];
    browserSync.init(files, {
        //更改默认端口weinre
        // ui: {
        //     port: 8080,
        //     weinre: {
        //         port: 9090
        //     }
        // },
        port: 8080,
        server: {
            baseDir: "./"
        },
        startPath: "./src/index.html"
    });

    gulp.watch([paths.css,paths.sass], ['buildDev']);
});


gulp.task('build',['clean','browser-sync'],function(){

    // buildDevCss
    console.log(">>>>>>",argv.c);
    if (argv.c) {

        gulp.run('buildDevCss');
    
    }else{
        
        gulp.run('buildDev');
    }
});




