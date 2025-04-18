// Erase local storage items
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.purge = function () {
    // Erase local storage items
    var b = SC.storage.readBoolean('SC.debug');
    SC.storage.eraseAll();
    SC.storage.writeBoolean('SC.debug', b);
    document.location.reload();
};

