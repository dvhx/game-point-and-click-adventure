// Check if object have only allowed attributes and nothing else
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.assertObjectAttributes = function (aObj, aAllowedAttributes) {
    // Check if object have only allowed attributes and nothing else
    const keys = Object.keys(aObj);
    const extra = keys.filter((key) => !aAllowedAttributes.includes(key));
    if (extra.length > 0) {
        console.error("Object contains extra attributes", extra);
        console.log(aObj);
    }
};
