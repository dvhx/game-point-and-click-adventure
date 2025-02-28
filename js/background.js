// Background images and related code
// linter: ngspicejs-lint
// global: window, document, console
"use strict";

var SC = window.SC || {};

SC.background = (function () {
    var self = {};

    self.resize = function () {
        // Stacking background images atop of each other and placing them in center to fill page with correct aspect ratio
        var bg = document.querySelectorAll('.background');
        var w = window.innerWidth;
        var h = window.innerHeight;
        var x, y, s;
        if (w > h) {
            // console.log('landscape');
            x = w/2 - h/2;
            y = 0;
            s = h;
        } else {
            // console.log('portrait');
            x = 0;
            y = h/2 - w/2;
            s = w;
        }
        //console.log({s, x, y});
        bg.forEach((img) => {
            img.style.width = s + 'px';
            img.style.height = s + 'px';
            img.style.left = x + 'px';
            img.style.top = y + 'px';
            var m = img.getAttribute('usemap');
            if (m) {
                SC.resizeImageMap(img);
            }
        });
    };

    window.addEventListener('resize', self.resize);
    window.addEventListener('load', self.resize);

    return self;
})();

