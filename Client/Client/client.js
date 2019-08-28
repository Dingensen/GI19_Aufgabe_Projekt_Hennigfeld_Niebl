// jshint esversion: 6
// jshint browser: true
// jshint node: true
"use strict";

Vue.config.devtools = true

//define global variables
var mainMap
var shapes

/**
* @function main
* @desc main function that is executing the script when called
*/
function main(){
  //assign global variables
  mainMap = L.map('mainMap');
  shapes = [];

  var timeApp = new Vue({
    el: '#App',
    data: {
      message: "Hello world!"
    }
  });
  mapSetUp();
}

/**
* @function mapSetUp
* @desc function that initialises the main-Map on the page when called.
*/
function mapSetUp(){
  var lat = 51.9607;
  var lon = 7.6261;
  var zoom = 12;

  mainMap.setView([lat, lon], zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mainMap);
}

/**
* @function createRoute
* @desc function that adds a given shape to the map.
* leaning on https://stackoverflow.com/questions/45931963/leaflet-remove-specific-marker
* @param map the map id of the map
* @param shape the GeoJSON of the shape to be added to the map
* @param color the color of the shape to add
* //TODO: add popup support
*/
function createRoute(map, shape){
  var id;
  var inputCoords = [];

  //choose a fitting id for the current shape
  if (shapes.length < 1) id = 0;
  else id = shapes[shapes.length - 1]._id + 1;

  //create a leaflet object from the given coordinates and colors
  var newRoute = new L.GeoJSON(shape)
  newRoute._id = id;

  //add the shape to the map and the shape array.
  mainMap.addLayer(newRoute);
  shapes.push(newRoute);
}

/**
* @function removeRoute
* @desc function to remove a given shape object from a given map
*/
function removeShape(map, id){
  var new_shapes = [];
  shapes.forEach(function(shape) {
    if (shape._id == id) map.removeLayer(shape);
    else new_shapes.push(shape);
  });
  shapes = new_shapes;
}

/**
* @function findEncounter
* @desc function to find the encounter between two routes
* routes should both contain metadata regarding the user/animal as well as start- and end-time for each route
* @param route1 GeoJSON FEATURE, representing route1.
* @param route2 GeoJSON FEATURE, representing route2.
* @param tolerance maximum distance in meters that can still count as an encounter
* @returns an objec that contains the two points closest to each other as well as their distance
*/
function findEncounter(route1, route2, tolerance){
  var closestEncounter = {};
  closestEncounter.dist = Number.MAX_SAFE_INTEGER;

  var route1Point;
  var route2Point;
  var dist;

  for(var i = 0; i < route1.geometry.coordinates.length; i++){
    route1Point = route1.geometry.coordinates[i];

    for(var j = 0; j < route2.geometry.coordinates.length; j++){
      route2Point = route2.geometry.coordinates[j];
      dist = twoPointDistance(route1Point, route2Point);
      if(dist < closestEncounter.dist){
        closestEncounter.dist = dist;
        closestEncounter.point1 = route1Point;
        closestEncounter.point2 = route2Point;
      }
    }
  }

  if(closestEncounter.dist > tolerance){
    console.log("chrip")
    closestEncounter.dist = null;
    closestEncounter.point1 = null;
    closestEncounter.point2 = null;
  }

  return closestEncounter;
}

/**
* @function circleDistance
* @desc computes the distance between two longitudes or two latitudes on the globe in meters.
* Imagine the globe as a 2-dimensional circle, with the parameters being points on the edge of the circle.
* @param start the first latitude OR longitude to compare
* @param end the second latitude OR longitude to compare
* @returns the distance in Meters between the two points on the 2-dimensional circle representing the earth. (not a flat earth, that one is squashed differently)
*
function cirleDistance(start, end){
  var earthRadius = 6371e3; //Radius in Meters
  var delta = toRadians();

}*/

/**
* @function twoPointDistance
* @desc takes two geographic points and returns the distance between them. Uses the Haversine formula (http://www.movable-type.co.uk/scripts/latlong.html, https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)
* @returns the distance between 2 points on the surface of a sphere with earth's radius
*/
function twoPointDistance(start, end){
  var earthRadius = 6371e3; //Radius
  var phi1        = toRadians(start[0]); //latitude at starting point. in radians.
  var phi2        = toRadians(end[0]); //latitude at end-point. in radians.
  var deltaLat    = toRadians(end[0]-start[0]); //difference in latitude at start- and end-point. in radians.
  var deltaLong   = toRadians(end[1]-start[1]); //difference in longitude at start- and end-point. in radians.

  var a = Math.sin(deltaLat/2)*Math.sin(deltaLat/2) + Math.cos(phi1)*Math.cos(phi2)*Math.sin(deltaLong/2)*Math.sin(deltaLong/2);
  var c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  var distance = earthRadius*c;

  return distance;
}

/**
* @function toRadians
* @desc helping function, takes degrees and converts them to radians
* @param degrees number value that represents an angle in degrees
* @returns number value that represents an angle in radians.
*/
function toRadians(degrees){
  var pi = Math.PI;
  return degrees * (pi/180);
}

/**
* @function swapLatLon
* @param coords coordinate tuple to swap the entries of, or Array of coordinate tuples
* @desc calls itself recursively on an array of coordinates until it reaches a coordinate tuple for which it then swaps the two entries.
* CURRENTLY NOT USED. REMOVE IF IT KEEPS BEING NOT USED
*/
function swapLatLon(coords){
  //look deeper if it appears to be an array of coordinates, call yourself recursively
  if(coords.length > 2 || (Array.isArray(coords[0]) || Array.isArray(coords[1]))){
    var newCoordArray = [];
    coords.forEach(function(element, index, Array){
        newCoordArray.push(swapLatLon(element));
    });
    return newCoordArray;

  }   //swap the two entries if the visited array is just an array of two
  else if(coords.length == 2){
    var newCoords = [];

    newCoords[0] = coords[1];
    newCoords[1] = coords[0];
    return newCoords;
  }   //return an error if none of the above applies
  else {
    TypeError(coords+"is not valid for swapLatLon");
  }
}
