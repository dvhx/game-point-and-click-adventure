// Main page
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.quest1 = function () {
    // Get the key and enter locked room
    SC.playTest('intro', [
        'Start new game',
        'Go to the alchemist\'s lab',
        'Back to hallway',
        'Go to the storeroom',
        'Grab the book',
        'Grab the book',
        'Go back to hallway',
        'Go to the alchemist\'s lab',
        'Grab the key',
        'Back to hallway',
        'Locked room'
    ]);
};

window.addEventListener('DOMContentLoaded', function () {
    SC.e = SC.elementsWithId();
    if (document.location.hash === '#intro') {
        SC.renderRoom('intro');
        //document.location.hash = '';
    } else {
        SC.renderRoom(SC.currentRoomName);
    }
    if (SC.storage.readBoolean('SC.debug')) {
        SC.e.debug.style.display = 'block';
        //SC.renderRoom('hallway');
        //SC.renderRoom('lab');
        //SC.renderRoom('storeroom');
        //SC.renderRoom('locked_room');
        //SC.playState('lab', ['gave_book', 'hallway', 'lab', 'storeroom']);
    }
});

