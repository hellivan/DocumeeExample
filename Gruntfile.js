module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {
                options: {
                    install: true,
                    copy: false,
                    targetDir: 'dist/bower_components',
                    cleanTargetDir: true
                }
            }
        },

        uglify: {
            options: {
                mangle: false
            }
        },

        html2js: {
            options: {
                module: 'templates',
                base: 'app',
                singleModule: true
            },
            dist: {
                src: ['src/templates/*.html'],
                dest: 'tmp/templates.js'
            }
        },

        clean: {
            dist: {
                src: ['dist']
            }
        },

        concat: {
            options: {
                separator: ';'
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'src/*.js', 'src/**/*.js']
        },

        compress: {
            dist: {
                options: {
                    archive: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                files: [
                    {expand: true, cwd: 'dist/', src: ['**'], dest: '.'}
                ]
            }
        },

        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 8080,
                    base: 'dist'
                }
            }
        },

        watch: {
            dev: {
                files: ['Gruntfile.js', 'src/**/*.js', 'src/**/*.html', 'src/**/*.css'],
                tasks: [
                    'jshint',
                    'copy:index',
                    'copy:templates',
                    'copy:fonts',
                    'useminPrepare',
                    'concat:generated',
                    'cssmin:generated',
                    'uglify:generated',
                    'usemin'
                ],
                options: {
                    atBegin: true
                }
            },
            min: {
                files: ['Gruntfile.js', 'src/**/*.js', 'src/**/*.html', 'src/**/*.css'],
                tasks: [
                    'jshint',
                    'copy:index',
                    'copy:templates',
                    'copy:fonts',
                    'useminPrepare',
                    'concat:generated',
                    'cssmin:generated',
                    'uglify:generated',
                    'usemin'
                ],
                options: {
                    atBegin: true
                }
            }
        },

        useminPrepare: {
            html: 'src/index.html',
            options: {
                dest: 'dist'
            }
        },

        usemin: {
            html: ['dist/index.html']
        },

        copy: {
            index: {
                src: 'src/index.html',
                dest: 'dist/index.html'
            },
            templates: {
                cwd: 'src/templates/',
                src: '**/*',
                dest: 'dist/templates/',
                expand: true
            },
            fonts: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: 'bower_components/bootstrap/dist',
                        src: ['fonts/*.*'],
                        dest: 'dist/'
                    }, {
                        expand: true,
                        dot: true,
                        cwd: 'bower_components/font-awesome',
                        src: ['fonts/*.*'],
                        dest: 'dist/'
                    }]
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('dev', ['bower', 'connect:server', 'watch:dev']);

    grunt.registerTask('min', ['bower', 'connect:server', 'watch:min']);

    grunt.registerTask('package', [
        'clean:dist',
        'bower',
        'jshint',
        'copy:index',
        'copy:templates',
        'copy:fonts',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'usemin',
        'compress:dist'
    ]);
};
