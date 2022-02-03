module.exports = grunt => {
    grunt.initConfig({
        uglify: {
            all: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'build/jsquick.min.map'
                },
                src: 'src/**/*.js',
                dest: 'build/jsquick.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify')

    grunt.registerTask('build', 'uglify:all')
}