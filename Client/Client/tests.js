// jshint esversion: 6
// jshint browser: true
// jshint node: true
"use strict";


//test swapLatLon
QUnit.test( "swapLatLon working correctly?", function( assert ) {

  var coords1 = ["first", "second"];
  var coords2 = [1,2];
  var coords3 = [0,0];
  var coords4 = [[1,2],[3,4],[5,6]]
  var coords5 = [[[7.59,51.97],[7.60,51.96]],[[7.63,51.96],[7.60,51.97]]]

  assert.deepEqual(swapLatLon(coords1), ["second","first"], "swap of string tuple successful");
  assert.deepEqual(swapLatLon(coords2), [2,1], "swap of integer tuple successful");
  assert.deepEqual(swapLatLon(coords3), [0,0], "swap of identical tuple successful");
  assert.deepEqual(swapLatLon(coords4), [[2,1],[4,3],[6,5]], "swap tuple array successful");
  assert.deepEqual(swapLatLon(coords5), [[[51.97,7.59],[51.96,7.60]],[[51.96,7.63],[51.97,7.60]]])
});

//test findEncounter
QUnit.test( "findEncounter working correctly?", function( assert ) {
  var route1 = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [
              7.597239017486571,
              51.97134580885172
            ],
            [
              7.596627473831176,
              51.96997099962356
            ],
            [
              7.596402168273926,
              51.96812022828657
            ],
            [
              7.596552371978759,
              51.96710227147084
            ],
            [
              7.597839832305908,
              51.966441248169694
            ]
          ]
        }
      }
    ]
  };
  var route2 = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [
              7.593269348144531,
              51.97027504760462
            ],
            [
              7.5948357582092285,
              51.970129633610206
            ],
            [
              7.596611380577087,
              51.969974304504014
            ],
            [
              7.597324848175048,
              51.9699049019634
            ],
            [
              7.599277496337891,
              51.96966694957956
            ],
            [
              7.600693702697753,
              51.96940255656008
            ],
            [
              7.60077953338623,
              51.96938933686815
            ]
          ]
        }
      }
    ]
  };
  var route3 = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[7.636442184448242,51.954974247843936],[7.63522982597351,51.95593627957945],[7.635540962219238,51.956422246526294],[7.636882066726685,51.9564718346941]]}}]};
  var route4 = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[7.633969187736511,51.95542716569981],[7.635106444358825,51.955919749998834],[7.635111808776856,51.956422246526294],[7.634392976760864,51.95672638642539]]}}]};

  //call the function with the three test parameters
  var call1 = findEncounter(route1.features[0], route2.features[0], 20);
  var call2 = findEncounter(route3.features[0], route4.features[0], 20);
  var call3 = findEncounter(route3.features[0], route4.features[0], 0);

  console.dir(call1)

  //check if results are within margin of error;
  var test1 = call1.dist >= 0 && call1.dist <= 10 && call1.dist != null;
  var test2 = call2.dist >= 4 && call2.dist <= 15 && call2.dist != null;

  assert.deepEqual(test1, true, "point1: "+call1.point1+" point2: "+call1.point1+" dist: "+call1.dist);
  assert.deepEqual(test2, true, "point1: "+call2.point1+" point2: "+call2.point1+" dist: "+call2.dist);
  assert.deepEqual(call3.dist, null, "point1: "+call3.point1+" point2: "+call3.point1+" dist: "+call3.dist);
});

//TODO: test toRadians

//TODO: test twoPointDistance

//TODO: test circleDistance
