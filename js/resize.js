// Correctly handle window resize
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.resize = function () {
    // Correctly handle window resize
    SC.resizeImageMap(document.getElementById('layers_top'));
};

window.addEventListener('resize', SC.resize);


