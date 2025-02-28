// Count how many layers were loaded and if all show them
// linter: ngspicejs-lint
// global: document, window, console
"use strict";

var SC = window.SC || {};

SC.layerLoadedCounter = 0;

SC.layerLoaded = function () {
    // Show all layers when all images are loaded
    SC.layerLoadedCounter++;
    var layers = document.getElementById('layers');
    var img = layers.getElementsByTagName('img');
    if (SC.layerLoadedCounter >= img.length) {
        SC.background.resize();
        layers.style.opacity = 1;
    }
};