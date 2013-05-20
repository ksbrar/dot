// Copyright 2002-2013, University of Colorado

/**
 * Basic 2-dimensional vector
 *
 * @author Jonathan Olson <olsonsjc@gmail.com>
 */

define( function( require ) {
  'use strict';
  
  var assert = require( 'ASSERT/assert' )( 'dot' );
  
  var dot = require( 'DOT/dot' );
  
  var inherit = require( 'PHET_CORE/inherit' );
  require( 'DOT/Util' );
  // require( 'DOT/Vector3' ); // commented out since Require.js complains about the circular dependency
  
  dot.Vector2 = function Vector2( x, y ) {
    // allow optional parameters
    this.x = x || 0;
    this.y = y || 0;
    
    assert && assert( typeof this.x === 'number', 'x needs to be a number' );
    assert && assert( typeof this.y === 'number', 'y needs to be a number' );
  };
  var Vector2 = dot.Vector2;
  
  Vector2.createPolar = function( magnitude, angle ) {
    return new Vector2( magnitude * Math.cos( angle ), magnitude * Math.sin( angle ) );
  };
  
  Vector2.prototype = {
    constructor: Vector2,
    
    isVector2: true,
    
    dimension: 2,
    
    magnitude: function() {
      return Math.sqrt( this.magnitudeSquared() );
    },
    
    magnitudeSquared: function() {
      return this.dot( this );
    },
    
    // the distance between this vector (treated as a point) and another point
    distance: function( point ) {
      return this.minus( point ).magnitude();
    },
    
    // the squared distance between this vector (treated as a point) and another point
    distanceSquared: function( point ) {
      return this.minus( point ).magnitudeSquared();
    },
    
    dot: function( v ) {
      return this.x * v.x + this.y * v.y;
    },
    
    equals: function( other ) {
      return this.x === other.x && this.y === other.y;
    },
    
    equalsEpsilon: function( other, epsilon ) {
      if ( !epsilon ) {
        epsilon = 0;
      }
      return Math.max( Math.abs( this.x - other.x ), Math.abs( this.y - other.y ) ) <= epsilon;
    },
    
    isFinite: function() {
      return isFinite( this.x ) && isFinite( this.y );
    },
    
    /*---------------------------------------------------------------------------*
     * Immutables
     *----------------------------------------------------------------------------*/
    
    copy: function() {
      return new this.constructor( this.x, this.y );
    },
    
    // z component of the equivalent 3-dimensional cross product (this.x, this.y,0) x (v.x, v.y, 0)
    crossScalar: function( v ) {
      return this.x * v.y - this.y * v.x;
    },
    
    normalized: function() {
      var mag = this.magnitude();
      if ( mag === 0 ) {
        throw new Error( "Cannot normalize a zero-magnitude vector" );
      }
      else {
        return new this.constructor( this.x / mag, this.y / mag );
      }
    },
    
    timesScalar: function( scalar ) {
      return new this.constructor( this.x * scalar, this.y * scalar );
    },
    
    times: function( scalar ) {
      // make sure it's not a vector!
      assert && assert( scalar.dimension === undefined );
      return this.timesScalar( scalar );
    },
    
    componentTimes: function( v ) {
      return new this.constructor( this.x * v.x, this.y * v.y );
    },
    
    plus: function( v ) {
      return new this.constructor( this.x + v.x, this.y + v.y );
    },
    
    plusScalar: function( scalar ) {
      return new this.constructor( this.x + scalar, this.y + scalar );
    },
    
    minus: function( v ) {
      return new this.constructor( this.x - v.x, this.y - v.y );
    },
    
    minusScalar: function( scalar ) {
      return new this.constructor( this.x - scalar, this.y - scalar );
    },
    
    dividedScalar: function( scalar ) {
      return new this.constructor( this.x / scalar, this.y / scalar );
    },
    
    negated: function() {
      return new this.constructor( -this.x, -this.y );
    },
    
    angle: function() {
      return Math.atan2( this.y, this.x );
    },
    
    // equivalent to a -PI/2 rotation (right hand rotation)
    perpendicular: function() {
      return new this.constructor( this.y, -this.x );
    },
    
    angleBetween: function( v ) {
      return Math.acos( dot.clamp( this.normalized().dot( v.normalized() ), -1, 1 ) );
    },
    
    rotated: function( angle ) {
      var newAngle = this.angle() + angle;
      return new this.constructor( Math.cos( newAngle ), Math.sin( newAngle ) ).timesScalar( this.magnitude() );
    },
    
    // linear interpolation from this (ratio=0) to vector (ratio=1)
    blend: function( vector, ratio ) {
      return this.plus( vector.minus( this ).times( ratio ) );
    },
    
    toString: function() {
      return "Vector2(" + this.x + ", " + this.y + ")";
    },
    
    toVector3: function() {
      return new dot.Vector3( this.x, this.y );
    },
    
    /*---------------------------------------------------------------------------*
     * Mutables
     *----------------------------------------------------------------------------*/
    
    set: function( x, y ) {
      this.x = x;
      this.y = y;
      return this;
    },
    
    setX: function( x ) {
      this.x = x;
      return this;
    },
    
    setY: function( y ) {
      this.y = y;
      return this;
    },
    
    add: function( v ) {
      this.x += v.x;
      this.y += v.y;
      return this;
    },
    
    addScalar: function( scalar ) {
      this.x += scalar;
      this.y += scalar;
      return this;
    },
    
    subtract: function( v ) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    },
    
    subtractScalar: function( scalar ) {
      this.x -= scalar;
      this.y -= scalar;
      return this;
    },
    
    componentMultiply: function( v ) {
      this.x *= v.x;
      this.y *= v.y;
      return this;
    },
    
    divideScalar: function( scalar ) {
      this.x /= scalar;
      this.y /= scalar;
      return this;
    },
    
    negate: function() {
      this.x = -this.x;
      this.y = -this.y;
      return this;
    }
    
  };
  
  /*---------------------------------------------------------------------------*
   * Immutable Vector form
   *----------------------------------------------------------------------------*/
  Vector2.Immutable = function ImmutableVector2( x, y ) {
    Vector2.call( this, x, y );
  };
  var Immutable = Vector2.Immutable;
  
  inherit( Immutable, Vector2 );
  
  // throw errors whenever a mutable method is called on our immutable vector
  Immutable.mutableOverrideHelper = function( mutableFunctionName ) {
    Immutable.prototype[mutableFunctionName] = function() {
      throw new Error( "Cannot call mutable method '" + mutableFunctionName + "' on immutable Vector2" );
    };
  };
  
  // TODO: better way to handle this list?
  Immutable.mutableOverrideHelper( 'set' );
  Immutable.mutableOverrideHelper( 'setX' );
  Immutable.mutableOverrideHelper( 'setY' );
  Immutable.mutableOverrideHelper( 'copy' );
  Immutable.mutableOverrideHelper( 'add' );
  Immutable.mutableOverrideHelper( 'addScalar' );
  Immutable.mutableOverrideHelper( 'subtract' );
  Immutable.mutableOverrideHelper( 'subtractScalar' );
  Immutable.mutableOverrideHelper( 'componentMultiply' );
  Immutable.mutableOverrideHelper( 'divideScalar' );
  Immutable.mutableOverrideHelper( 'negate' );
  
  // helpful immutable constants
  Vector2.ZERO = new Immutable( 0, 0 );
  Vector2.X_UNIT = new Immutable( 1, 0 );
  Vector2.Y_UNIT = new Immutable( 0, 1 );
  
  return Vector2;
} );
