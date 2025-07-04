// Inventory (only booleans not counts)
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.inventory = (function () {
    // Inventory
    var self = {};
    self.data = SC.storage.readObject('SC.inventory.data', {});

    function save() {
        // Save inventory to local storage
        SC.storage.writeObject('SC.inventory.data', self.data);
    }

    self.keys = function (aIgnore) {
        // Return comma separated keys sorted alphabetically, used in room rendering, with optional exclusions
        aIgnore = aIgnore || [];
        return Object.keys(self.data).filter((s) => !aIgnore.includes(s)).sort().join(',');
    };

    self.removeAll = function () {
        // Remove all items from inventory
        self.data = {};
        save();
    };

    self.has = function (aItem) {
        // Return true if inventory contains item
        if (Array.isArray(aItem)) {
            if (aItem.length <= 0) {
                return true;
            }
            for (var i = 0; i < aItem.length; i++) {
                if (!self.data[aItem[i]]) {
                    return false;
                }
            }
            return true;
        }
        return self.data[aItem] ? true : false;
    };

    self.add = function (aItem) {
        // Add one item to inventory
        //throw "add " + aItem;
        self.data[aItem] = true;
        save();
    };

    self.remove = function (aItem) {
        // Remove one item from inventory, * removes all
        //throw "remove " + aItem;
        if (aItem === '*') {
            self.removeAll();
        } else {
            delete self.data[aItem];
        }
        save();
    };

    window.addEventListener('DOMContentLoaded', function () {
        var span = document.getElementById('inventory');
        window.setInterval(function () {
            span.textContent = Object.keys(self.data).sort().join(', ');
        }, 300);
    });

    return self;
}());

