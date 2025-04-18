// Render single room with correct stat according to room specification and current inventory
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.currentRoomName = SC.storage.readString('SC.currentRoomName', 'intro');

SC.renderRoom = function (aRoomName, oCustomDialog, oCustomCloseup) {
    // Render single room with correct stat according to room specification and current inventory
    if (aRoomName === 'CURRENT_ROOM') {
        aRoomName = SC.currentRoomName;
    }
    var room = SC.rooms[aRoomName];
    var e = SC.elementsWithId();
    var areas = [];

    // add closeup to layers
    var layers = JSON.parse(JSON.stringify(room.layers));
    if (oCustomCloseup) {
        layers = layers.concat(oCustomCloseup);
    }

    // clear previous
    //e.layers_bottom.textContent = '';
    e.map.textContent = '';
    e.dialog_bottom.textContent = '';

    // hide dialog message during reload
    e.dialog_message.style.visibility = 'hidden';

    // find exactly 1 matching dialog
    var dlg = room.items.filter((o) => o.dialog && SC.booleanExpression(o.if, SC.inventory.data));
    if (dlg.length === 0) {
        console.error('Room ' + aRoomName + ' has no dialog for ' + SC.inventory.keys());
        return;
    }
    if (dlg.length > 1) {
        console.error('Room ' + aRoomName + ' has more than 1 dialog for ' + SC.inventory.keys());
        console.error(dlg);
        return;
    }
    dlg = dlg[0];
    if (oCustomDialog) {
        // short delay so that player notices
        e.dialog_message.textContent = '';
        window.setTimeout(() => {
            e.dialog_message.textContent = oCustomDialog;
            e.dialog_message.classList.toggle('unseen', SC.unseen(oCustomDialog));
        }, 300);
    } else {
        e.dialog_message.textContent = dlg.dialog;
        e.dialog_message.classList.toggle('unseen', SC.unseen(dlg.dialog));
    }
    // dlg can have add/remove but no other attributes
    SC.assertObjectAttributes(dlg, ['if', 'dialog', 'add', 'remove']);
    if (dlg.add) {
        dlg.add.forEach(SC.inventory.add);
    }
    if (dlg.remove) {
        dlg.remove.forEach(SC.inventory.remove);
    }

    function onClickArea(event) {
        // Click on area
        var o = event.target.data;
        //console.warn('area.onclick', o, event, event.target);
        e.layers_wait.style.display = 'block';

        // show hourglass but not within first 0.5s
        e.layers_wait_hourglass.style.visibility = 'hidden';
        window.setTimeout(function () {
            e.layers_wait_hourglass.style.visibility = '';
        }, 500);

        var needs_render = false;
        // add to inventory
        if (o.add) {
            o.add.forEach((s) => SC.inventory.add(s));
            needs_render = true;
            //console.warn('added', o.add);
        }
        // remove from inventory
        if (o.remove) {
            o.remove.forEach((s) => SC.inventory.remove(s));
            needs_render = true;
            //console.warn('removed', o.remove);
        }
        // dialog
        var custom_dialog;
        var custom_closeup;
        if (o.dialog_replace) {
            custom_dialog = o.dialog_replace;
            needs_render = true;
        }
        // closeup
        if (o.closeup) {
            custom_closeup = o.closeup;
            needs_render = true;
        }
        // change room
        if (o.room) {
            if (o.room === 'CURRENT_ROOM') {
                o.room = SC.currentRoomName;
            }
            SC.inventory.add(o.room);
            SC.renderRoom(o.room);
            if (SC.rooms[o.room] && (o.room !== 'intro')) {
                SC.storage.writeString('SC.currentRoomName', o.room);
            }
            return;
        }
        // click
        if (o.click) {
            console.assert(typeof SC[o.click] === 'function',
                "Clickable item has click attribute '" + o.click + "' but SC." + o.click + " is not a function!");
            SC[o.click]();
        }
        // re-render room if needed
        if (needs_render) {
            //console.log('fixme re-render');
            SC.renderRoom(aRoomName, custom_dialog, custom_closeup);
            return;
        }
    }

    // handle true items (or bottoms?)
    room.items.filter((o) => !o.dialog && (o.area || o.bottom) && SC.booleanExpression(o.if, SC.inventory.data)).forEach((o) => {
        SC.assertObjectAttributes(o, ['if', 'area', 'bottom', 'title', 'room', 'add', 'remove',
            'dialog_replace', 'layers', 'closeup']);
        //console.log(o, room.areas[o.area]);
        // create clickable area
        var area = document.createElement('area');
        areas.push(area);
        area.shape = 'poly';
        area.coords = room.areas[o.area].join(',');
        area.data = o;
        area.onclick = onClickArea;
        if (o.title) {
            e.map.appendChild(area);
        }
        // title
        if (o.title) {
            area.title = o.title;
            //console.log(area);
        }
        // create bottom link
        if (o.bottom) {
            var a = document.createElement('div');
            a.classList.add('back');
            a.textContent = o.title;
            a.data = o;
            a.onclick = area.onclick;
            e.dialog_bottom.appendChild(a);
        }
        // layers
        if (o.layers) {
            //console.log('adding to layers', o.layers);
            o.layers.forEach((l) => layers.push(l));
        }
    });

    SC.resize();

    // background layers
    var remaining_images = layers.length;

    function onLoadImage() {
        // When all images are loaded reveal them at once
        remaining_images--;
        if (remaining_images === 0) {
            SC.resize();
            // show new image at once
            e.layers.style.visibility = '';
            e.layers_wait.style.display = 'none';
            SC.currentRoom.images.forEach((img) => img.style.visibility = '');
            // remove old images (they are underneath new one)
            Array.from(SC.e.layers_bottom.getElementsByTagName('img')).filter((img) => img.dataOld).forEach((img) => img.parentElement.removeChild(img));
            // reveal message
            e.dialog_message.style.visibility = '';
        }
    }

    function onDisableDrag() {
        // Prevent accidental drags
        return false;
    }

    var images = [];
    // mark old images as old (will be removed once new are fully loaded)
    Array.from(e.layers_bottom.getElementsByTagName('img')).forEach((img) => img.dataOld = true);
    // show new image layers
    //e.layers_bottom.textContent = '';
    layers.forEach((src) => {
        //console.log('layer', src);
        var img = document.createElement('img');
        images.push(img);
        img.onload = onLoadImage;
        img.style.visibility = 'hidden';
        //img.dataName = l;
        img.dataSrc = src;
        img.dataRel = 'room/' + aRoomName + '/' + src;
        img.src = 'room/' + aRoomName + '/' + src;
        img.ondragstart = onDisableDrag;
        img.classList.add('background');
        if (src.match('flicker')) {
            img.classList.add('flicker');
        }
        if (src.match('glint1')) {
            img.classList.add('glint1');
        }
        if (src.match('glint2')) {
            img.classList.add('glint2');
        }
        e.layers_bottom.appendChild(img);
    });

    if (aRoomName !== 'intro') {
        SC.currentRoomName = aRoomName;
    }
    SC.currentRoom = {name: aRoomName, layers, images, areas, e};
};

