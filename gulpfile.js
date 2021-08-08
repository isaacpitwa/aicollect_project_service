const gulp = require("gulp");
const nodemon = require('gulp-nodemon');
const ts = require("gulp-typescript");
const clean = require('gulp-rimraf');
const run = require('gulp-run');


gulp.task("build", function(done) { 
    gulp
    .src('./src/**/*.ts')
    .pipe(ts())
    .pipe(gulp.dest('./build'));
    done();
});

gulp.task('stopscript', function(done) {
    process.exit();
    done();
});

gulp.task('clean', (done) => {
    gulp.src("build/*", { read: false }).pipe(clean());
    done();
});

gulp.task('test',gulp.series('build',function(done)  {
    run('npm test').exec();
    done()

}));

gulp.task('serve', gulp.series('build', function(done) {
    const options = {
        script: 'build/index.js',
        delayTime: 1,
        watch: ['./src'],
        ext: 'ts',
        tasks: ['clean', 'build'],
        done: done
    };

    nodemon(options).on('restart', () => {
        console.log('restarting server');
    });
    done();
}));

