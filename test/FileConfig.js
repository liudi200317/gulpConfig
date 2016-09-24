/* src 原路径 */
var paths = {
    
    cssPath:'./src/css',

    html: './src/*.html',

    sass: './src/sass/*.scss',

    css: './src/css/*.css',

    js: './src/js/*.js',

    img: './src/images/**/*'

};
/* dest 目标路径 */
var destPaths = {

    rootPath:'./build',
    
    sass: './build/css',

    css: './build/css',

    js: './build/js',

    html: './build',

    img: './build/images',

    revCss:'./build/rev/css',
    
    revJs:'./build/rev/js'

};

var fileConfig = function () {
};

fileConfig.prototype.getPaths = function () {
    return paths;
};
fileConfig.prototype.getDestPaths = function () {
    return destPaths;
};

module.exports = new fileConfig();
