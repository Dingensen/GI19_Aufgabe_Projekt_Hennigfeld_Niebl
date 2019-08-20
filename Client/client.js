// jshint esversion: 6
// jshint browser: true
// jshint node: true
"use strict";

Vue.config.devtools = true

var timeApp = new Vue({
  el: '#App',
  data: {
    message: "Hello world!"
  }
});

var mainMap = L.map('mainMap').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mainMap);
