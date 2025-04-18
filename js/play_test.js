// Play-test game as if player was clicking on items
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.playTest = function (aStartingRoom, aItems) {
    // Click on chain of polygons, used to quickly walk through quests and testing
    SC.renderRoom(aStartingRoom);
    function one() {
        var item = aItems.shift();
        console.log(item);
        if (!item) {
            return;
        }
        var a = SC.currentRoom.areas.find((o) => o.title === item);
        if (a) {
            a.click();
            window.setTimeout(one, 1000);
        } else {
            alert(item + ' not found in ' + SC.currentRoom.name);
            return;
        }
    }
    window.setTimeout(one, 1000);
};

SC.playState = function (aRoom, aInventory) {
    // Set game state without playing through it
    SC.storage.eraseAll();
    SC.inventory.data = {};
    aInventory.forEach(SC.inventory.add);
    SC.renderRoom(aRoom);
};

