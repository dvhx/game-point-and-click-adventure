// djb2 string hash
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.djb2 = function (aString) {
    // djb2 string hash
    var chars = aString.split('').map(function (a) {
        return a.charCodeAt(0);
    });
    return chars.reduce(function (previous, current) {
        return ((previous << 5) + previous) + current;
    }, 5381);
};

