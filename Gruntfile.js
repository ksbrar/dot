/*global module:false*/
module.exports = function( grunt ) {
  'use strict';
  
  // print this immediately, so it is clear what project grunt is building
  grunt.log.writeln( 'Dot' );
  
  // Project configuration.
  grunt.initConfig( {
    pkg: '<json:package.json>',
    
    requirejs: {
      // unminified, with has.js
      development: {
        options: {
          almond: true,
          mainConfigFile: "js/config.js",
          out: "dist/development/dot.js",
          name: "config",
          optimize: 'none',
          wrap: {
            startFile: [ "js/wrap-start.frag", "lib/has.js" ],
            endFile: [ "js/wrap-end.frag" ]
          }
        }
      },
      
      // with has.js
      standalone: {
        options: {
          almond: true,
          mainConfigFile: "js/production-config.js",
          out: "dist/standalone/dot.min.js",
          name: "production-config",
          optimize: 'uglify2',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          wrap: {
            startFile: [ "js/wrap-start.frag", "lib/has.js" ],
            endFile: [ "js/wrap-end.frag" ]
          }
        }
      },
      
      // without has.js
      production: {
        options: {
          almond: true,
          mainConfigFile: "js/production-config.js",
          out: "dist/production/dot.min.js",
          name: "production-config",
          optimize: 'uglify2',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          wrap: {
            startFile: [ "js/wrap-start.frag" ],
            endFile: [ "js/wrap-end.frag" ]
          }
        }
      }
    },
    
    jshint: {
      all: [
        'Gruntfile.js', 'js/**/*.js', 'common/phet-core/js/**/*.js', 'common/assert/js/**/*.js'
      ],
      dot: [
        'js/**/*.js'
      ],
      // reference external JSHint options in jshint-options.js
      options: require( '../chipper/grunt/jshint-options' )
    }
  } );
  
  // default task ('grunt')
  grunt.registerTask( 'default', [ 'jshint', 'development', 'standalone', 'production' ] );
  
  // linter on dot subset only ('grunt lint')
  grunt.registerTask( 'lint', [ 'jshint:dot' ] );
  
  // compilation targets. invoke only one like ('grunt development')
  grunt.registerTask( 'production', [ 'requirejs:production' ] );
  grunt.registerTask( 'standalone', [ 'requirejs:standalone' ] );
  grunt.registerTask( 'development', [ 'requirejs:development' ] );
  
  // dependencies
  grunt.loadNpmTasks( 'grunt-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
};
