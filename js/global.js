// Global variables all at one place
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.global = {
    "assertObjectAttributes": "Check if object have only allowed attributes and nothing else",
    "booleanExpression": "Evaluate inventory boolean expressions like '(book || gave_book) && key' to true or false",
    "currentRoom": "Object with currently loaded room, layers, images, areas, ...",
    "currentRoomName": "Name of the current room",
    "djb2": "String hash (to draw unseen text yellow)",
    "e": "Elements with ID",
    "elementsWithId": "Return all elements with defined id",
    "inventory": "Player's inventory with found items and visited rooms",
    "playState": "Set game state without playing through it",
    "playTest": "Click on chain of polygons, used to quickly walk through quests and testing",
    "purge": "Erase local storage items",
    "quest1": "Play test quest1 - from intro to locked room",
    "renderRoom": "Render single room with correct stat according to room specification and current inventory",
    "resize": "Correctly handle window resize",
    "resizeImageMap": "Resize image map areas if image is not displayed at original scale",
    "rooms": "Description of all rooms",
    "storage": "Simplified API to localStorage",
    "unseen": "Return true if text has been seen before",
};


