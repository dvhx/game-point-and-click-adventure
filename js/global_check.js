// Track and warn about undocumented globals
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.globalCheck = function () {
    // Track and warn about undocumented globals
    SC.global = SC.global || {};
    // track objects that were no longer seen
    SC.globalCheck.neverSeen = SC.globalCheck.neverSeen || JSON.parse(JSON.stringify(SC.global));
    Object.keys(SC).forEach((k) => delete SC.globalCheck.neverSeen[k]);
    // alphabetical sorting is important to not redeclare things
    var a = Object.keys(SC.global);
    var b = Object.keys(SC.global).sort();
    if (a.join(',') !== b.join(',')) {
        console.warn('SC.global keys are not sorted alphabetically, this may lead to mistakes or redeclarations');
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                console.warn('  Key #' + i + ' (' + a[i] + ' should be swapped with ' + b[i] + ')');
                break;
            }
        }
    }
    // warn about undocumented globals
    SC.globalCheck.seen = SC.globalCheck.seen || {};
    Object.keys(SC)
        .filter((k) => k !== 'global' && k !== 'globalCheck')
        //.filter((k) => typeof SC[k] !== 'function') // optionally check only non-functions
        .filter((k) => !SC.global[k] && !SC.globalCheck.seen[k])
        .sort()
        .forEach((k) => {
        console.warn('SC.' + k + ' undocumented in js/globals.js');
        SC.globalCheck.seen[k] = typeof SC[k];
    });
};

SC.globalCheck();
window.addEventListener('DOMContentLoaded', SC.globalCheck);
window.setTimeout(SC.globalCheck, 1000);
window.setTimeout(SC.globalCheck, 5000);
window.setInterval(SC.globalCheck, 15000);
