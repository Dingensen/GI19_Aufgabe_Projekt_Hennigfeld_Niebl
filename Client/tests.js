// jshint esversion: 6
// jshint browser: true
// jshint node: true
"use strict";


//test swapLatLon
QUnit.test( "swapLatLon working correctly?", function( assert ) {

  var coords1 = ["first", "second"];
  var coords2 = [1,2];
  var coords3 = [0,0];

  assert.deepEqual(swapLatLon(coords1), ["second","first"], "swap of string tuple successful");
  assert.deepEqual(swapLatLon(coords2), [2,1], "swap of integer tuple successful");
  assert.deepEqual(swapLatLon(coords3), [0,0], "swap of identical tuple successful");

});
