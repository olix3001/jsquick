module.exports = grunt => {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            all: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'build/jsquick.min.map'
                },
                src: 'src/**/*.js',
                dest: 'build/jsquick.min.js'
            }
        },
        concat: {
            all: {
                options: {
                    stripBanners: true,
                    banner: '/* <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    process: (src, filepath) => `// Source: ${filepath}\n${src}`
                },
                src: ['src/**/*.js'],
                dest: 'build/jsquick.all.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-concat')

    grunt.registerTask('build', ['uglify:all', 'concat:all'])
    grunt.registerTask('min', 'uglify:all')
}