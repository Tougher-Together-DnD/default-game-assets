module.exports = function (grunt) {
  // Project configuration
  grunt.initConfig({
    uglify: {
      options: {
        compress: {
          drop_console: true, // Remove console statements
        },
        mangle: false, // Do not mangle variable names for readability
        beautify: true, // Beautify the output
        output: {
          comments: function (node, comment) {
            // Preserve the first comment block
            if (comment.type === 'comment2' && comment.value.includes('!')) {
              return true; // Keep comments like /*! ... !*/
            }
            return false;
          }
        }
      },
		target: {
		  files: [{
			expand: true,           // Enable dynamic expansion
			cwd: 'api-scripts/',            // Source folder
			src: ['**/*.js', '!**/_Testing/**'], // Include all JS files, exclude folders starting with "_"
			dest: 'api-scripts/',           // Output in the same folder as source
			ext: '.min.js',         // Extension for the minified files
			extDot: 'last'          // Replace only the last dot in filenames
		  }]
		}
	  }
	});
  
	// Load the plugin that provides the "uglify" task
	grunt.loadNpmTasks('grunt-contrib-uglify');
  
	// Default task(s)
	grunt.registerTask('default', ['uglify']);
  };
  