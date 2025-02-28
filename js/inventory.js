// Inventory
// linter: ngspicejs-lint
// global: window, document, console, localStorage
"use strict";

var SC = window.SC || {};

SC.inventory = (function () {
    // Inventory
    var self = {},
        dialog,
        data = JSON.parse(localStorage.hasOwnProperty("SC.inventory.data") ? localStorage.getItem("SC.inventory.data") : "{}");
    self.data = data;

    function save() {
        // Save inventory to local storage
        localStorage.setItem('SC.inventory.data', JSON.stringify(data));
    }

    self.has = function (aItem) {
        // Return true if inventory contains item
        return data[aItem] ? true : false;
    };

    self.add = function (aItem) {
        // Add one item to inventory
        data[aItem] = data[aItem] || 0;
        data[aItem]++;
        save();
        return data[aItem];
    };

    self.set = function (aItem, aCount) {
        // Set how many items user have
        data[aItem] = aCount || 0;
        save();
        return data[aItem];
    };

    self.remove = function (aItem) {
        // Remove one item from inventory
        if (self.has(aItem)) {
            data[aItem]--;
            if (data[aItem] <= 0) {
                delete data[aItem];
            }
            save();
        }
        return data[aItem];
    };

    self.require = function (aItem, aMessage) {
        // If doesn't have aItem, show dialog aMessage and return false
        if (!self.has(aItem)) {
            dialog = dialog || document.createElement('dialog');
            dialog.className = "bottom";
            dialog.textContent = aMessage;
            dialog.style.color = 'red';
            document.body.appendChild(dialog);
            dialog.show();
            // autohide after 10s
            window.setTimeout(function () { if (dialog.parentElement) { dialog.parentElement.removeChild(dialog); } }, 30000);
            return false;
        }
    };

    return self;
}());
