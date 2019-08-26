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
function createRoute(map, shape, inputColor){
  var id;
  var inputCoords = [];

  //loop through each feature in the feature collection in case two routes are separated
  shape.features.forEach(function(element){
    inputCoords.push(element.geometry.coordinates)
  })

  //swap the coordinates of each point as for SOME REASON GeoJSON got them in the wrong order
  for(var i = 0; i < inputCoords.length; i++){
    inputCoords[i] = swapLatLon(inputCoords[i]);

    //choose a fitting id for the current shape
    if (shapes.length < 1) id = 0;
    else id = shapes[shapes.length - 1]._id + 1;

    //create a leaflet object from the given coordinates and colors
    var newRoute = L.polyline(inputCoords[i], {color: inputColor});
    newRoute._id = id;

    //add the shape to the map and the shape array.
    mainMap.addLayer(newRoute);
    shapes.push(newRoute);
  }
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
* @function swapLatLon
* @param coords coordinate tuple to swap the entries of, or Array of coordinate tuples
* @desc calls itself recursively on an array of coordinates until it reaches a coordinate tuple for which it then swaps the two entries.
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
