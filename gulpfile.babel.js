import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
import browser from 'browser-sync';
import yaml from 'js-yaml';
import yargs from 'yargs';
import fs from 'fs';
import selenium from 'selenium-standalone';
import rimraf from 'rimraf';
import stylish from 'gulp-jscs-stylish';

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS } = loadConfig();


gulp.task('selenium', (done) => {
    selenium.install({ logger: console.log }, () => {
        selenium.start(done);
    });
});

gulp.task('server', function(done) {
    var files = ['./**/*.html', './src/**/*.scss', './src/**/*.js'];
    browser.exit();
    browser.init({
        server: { baseDir: './dist' },
        port: PORT
    });
    gulp.watch('./src/**/*.scss', gulp.series(sass, reload));
    gulp.watch("./src/*.html", gulp.series(html, reload));
    gulp.watch('./src/**/*.js', gulp.series(javascript, reload));
});

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
    gulp.series(clean, html, gulp.parallel(javascript, sass, copy)));

// Build the site, run the server, and watch for file changes
gulp.task('default',
    gulp.series('build', 'server'));

gulp.task('e2e', gulp.series('selenium', (done) => {
    return gulp.src('wdio.conf.js')
        .pipe($.webdriver({
            logLevel: 'verbose',
            waitforTimeout: 20000,
            reporter: 'spec'
        })).on('error', () => {
            selenium.kill();
            process.exit(1);
        });
}));


gulp.task('test', gulp.series('e2e' /*, 'bdd'*/ ))

function html() {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest(PATHS.dist));
}

function loadConfig() {
    let ymlFile = fs.readFileSync('config.yml', 'utf8');
    return yaml.load(ymlFile);
}

// Combine JavaScript into one file
// In production, the file is minified
function javascript(done) {
    return gulp.src(PATHS.javascript)
        .pipe($.sourcemaps.init())
        .pipe($.jshint('.jshintrc'))
        //.pipe($.jscs())
        //.pipe($.stylish.combineWithHintResults())
        //.pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.concat('calculator.js'))
        //.pipe($.babel())
        //.pipe($.uglify())
        .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
        .pipe(gulp.dest(PATHS.dist + '/js'));
}

// Compile Sass into CSS
// In production, the CSS is compressed
function sass(done) {
    return gulp.src(PATHS.sass.files + '/*.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
                includePaths: PATHS.sass.includes + '/*.scss'
            })
            .on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: COMPATIBILITY
        }))
        // Comment in the pipe below to run UnCSS in production
        //.pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
        .pipe($.if(PRODUCTION, $.cssnano()))
        .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
        .pipe(gulp.dest(PATHS.dist + '/css'))
        .pipe(browser.reload({ stream: true }));
}

function clean(done) {
    rimraf(PATHS.dist, done);
}

function copy(done) {
    return gulp.src(PATHS.fonts)
        .pipe($.flatten())
        .pipe(gulp.dest(PATHS.dist + '/css'))
}

function reload(done) {
    browser.reload();
    done();
}
