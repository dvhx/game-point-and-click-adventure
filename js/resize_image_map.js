// Resize image map areas if image is not displayed at original scale
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.resizeImageMap = function (aImage) {
    // Resize image map areas if image is not displayed at original scale
    // after image is loaded or when window is resized, we must scale map coordinates to fit screen
    //console.log('scaleImageMap', aImage.width, aImage.height, aImage.naturalWidth, aImage.naturalHeight, aImage.useMap);
    aImage = typeof aImage === 'string' ? document.getElementById(aImage) : aImage;
    if (!aImage || (aImage.naturalWidth <= 0)) {
        return;
    }
    if (!aImage.useMap) {
        console.warn('Image have no usemap');
        return;
    }
    var map = document.querySelector(aImage.useMap), i, c, a, coords, orig, kx, ky;
    if (!map) {
        return;
    }
    a = map.getElementsByTagName('area');
    kx = aImage.width / aImage.naturalWidth;
    ky = aImage.height / aImage.naturalHeight;

    //console.log('image', aImage);
    //console.log('map', map);

    for (i = 0; i < a.length; i++) {
        // remember original coords
        coords = a[i].coords.split(',').map(parseFloat);
        if (!a[i].orig) {
            a[i].orig = coords.slice();
        }
        orig = a[i].orig;
        // scale original coords to new coords
        for (c = 0; c < orig.length; c += 2) {
            coords[c] = orig[c] * kx;
            coords[c + 1] = orig[c + 1] * ky;
        }
        a[i].coords = coords.join(',');
        // unfocus area
        a[i].blur();
    }
};

