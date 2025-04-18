// Track which dialog text are new and should be colored differently
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.unseen = function (aText) {
    // Return true if text has been seen before
    var data = SC.storage.readObject('SC.unseen', {});
    var hash = SC.djb2(aText);
    if (data[hash]) {
        return false;
    }
    data[hash] = 1;
    SC.storage.writeObject('SC.unseen', data);
    return true;
};


