// jshint esversion: 6
// jshint browser: true
// jshint node: true
"use strict";

Vue.config.devtools = true

//define global variables
var mainMap
var routes

/**
* @function main
* @desc main function that is executing the script when called
*/
function main(){
  //assign global variables
  mainMap = L.map('mainMap');
  routes = [];

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
  var inputCoords = shape.features[0].geometry.coordinates;
  var swappedInputCoords = []

  //swap the coordinates of each point as for SOME REASON GeoJSON got them in the wrong order
  inputCoords.forEach(function(element, index, Array){
      swappedInputCoords.push(swapLatLon(element));
  });

  if (routes.length < 1) id = 0;
  else id = routes[routes.length - 1]._id + 1;

  var newRoute = L.polyline(swappedInputCoords, {color: inputColor});
  newRoute._id = id;

  mainMap.addLayer(newRoute);
  routes.push(newRoute);
}

/**
* @function removeRouteFromMap
* @desc function to remove a given shape object from a given map
*/
function removeRouteFromMap(map, id){
  var new_routes = [];
  routes.forEach(function(route) {
    if (route._id == id) map.removeLayer(route);
    else new_routes.push(route);
  });
}

/**
* @function swapLatLon
* @param coords coordinate tuple to swap the entries of
*/
function swapLatLon(coords){
  var newCoords = [];

  newCoords[0] = coords[1];
  newCoords[1] = coords[0];
  return newCoords;
}
