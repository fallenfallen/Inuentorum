
var map;
var kmlLayer;

var initiated = false;
var textDialog, gApiScript;
var overlayEl = Ki ("overlay");
var dialogBody = Ki ("dialog_body");


var TextDialog = function (dialogEl) {
    this.dialogEl = dialogEl;
    this.titleEl = Keen.createElement ("h1");
    this.textEl = Keen.createElement ("p");

    Keen.class.add (this.titleEl, "title");
    Keen.class.add (this.textEl, "text");
};

TextDialog.prototype = {
    show: function (title, text) {
        var dialog = Keen.data (this.dialogEl, "dialog");

        if (dialog !== this && dialog) {
            dialog.dismiss ();
        }

        this.titleEl.textContent = title;
        this.textEl.textContent = text;

        if (dialog !== this || !dialog) {
            this.dialogEl.appendChild (this.titleEl);
            this.dialogEl.appendChild (this.textEl);
        }

        Keen.data (this.dialogEl, "dialog", this);
        Keen.show (overlay);
    },

    dismiss: function () {
        if (Keen.data (this.dialogEl, "dialog") !== this) {
            return;
        }

        Keen.hide (overlay);

        this.dialogEl.removeChild (this.titleEl);
        this.dialogEl.removeChild (this.textEl);

        Keen.clean (this.dialogEl, "dialog");
    }
};


var PollBikeDialog = function (dialogEl) {
    this.dialogEl = dialogEl;
    this.titleEl = Keen.createElement ("h1");
    this.titleEl.textContent = tr ("Please, tell us a bit about you");
    this.tableEl = Keen.createElement ("table");
    var tableEl = this.tableEl;

    Keen.class.add (this.titleEl, "title");
    Keen.style (tableEl, {
        width: "100%",
        textAlign: "left"
    });

    function addRow (el, text) {
        var line = Keen.createElement ("tr");
        var cell = Keen.createElement ("td");
        var label = Keen.createElement ("label");

        cell.textContent = tr (text);
        line.appendChild (cell);

        cell = Keen.createElement ("td");
        cell.appendChild (el);
        line.appendChild (cell);
        tableEl.appendChild (line);
    }

    this.levelEl = Keen.createElement ("select");
    this.levelEl.innerHTML =
        '<option value="0">' + tr ("Beginner") + "</option>" +
        '<option value="1">' + tr ("Low") + "</option>" +
        '<option value="2">' + tr ("Intermediate") + "</option>" +
        '<option value="3">' + tr ("High") + "</option>" +
        '<option value="4">' + tr ("Expert") + "</option>";

    addRow (this.levelEl, "Your biking level: ");


    this.frameTypeEl = Keen.createElement ("select");
    this.frameTypeEl.innerHTML = 
        '<option value="0">' + tr ("Touring") + "</option>" +
        '<option value="1">' + tr ("Racing") + "</option>" +
        '<option value="2">' + tr ("Mountain") + "</option>" +
        '<option value="3">' + tr ("BMX") + "</option>";

    addRow (this.frameTypeEl, "Your bike's frame type: ");


    this.forkTravelEl = Keen.createElement ("select");
    this.forkTravelEl.innerHTML = 
        '<option value="0">' + tr ("Rigid") + "</option>" +
        '<option value="1">' + tr ("0 - 80 mm") + "</option>" +
        '<option value="2">' + tr ("80 - 120 mm") + "</option>" +
        '<option value="3">' + tr ("120 - 140 mm") + "</option>" +
        '<option value="4">' + tr ("140 - 170 mm") + "</option>" +
        '<option value="5">' + tr ("180 - 210 mm") + "</option>";

    addRow (this.forkTravelEl, "Your bike's fork travel: ");


    this.wheelsEl = Keen.createElement ("select");
    this.wheelsEl.innerHTML = 
        '<option value="20">' + tr ("20   in") + "</option>" +
        '<option value="24">' + tr ("24   in") + "</option>" +
        '<option value="26">' + tr ("26   in") + "</option>" +
        '<option value="27.5">' + tr ("27.5 in") + "</option>" +
        '<option value="29">' + tr ("29   in") + "</option>";

    addRow (this.wheelsEl, "Your bike's wheels diameter: ");


    this.brakesEl = Keen.createElement ("select");
    this.brakesEl.innerHTML =
        '<option value="0">' + tr ("Mechanical") + "</option>" +
        '<option value="1">' + tr ("Hydraulic") + "</option>";

    addRow (this.brakesEl, "Your bike's brakes type: ");


    this.qualityEl = Keen.createElement ("select");
    this.qualityEl.innerHTML =
        '<option value="0">' + tr ("Low") + "</option>" +
        '<option value="0">' + tr ("Medium") + "</option>" +
        '<option value="0">' + tr ("High") + "</option>";

    addRow (this.qualityEl, "Overall bike quality: ");

    var line = Keen.createElement ("tr");
    var cell = Keen.createElement ("td", {
        colspan: 2
    });
    var button = Keen.createElement ("button");

    Keen.data (button, "poll_bike_dialog", this);

    Keen.event.add (button, "click", function (event) {
        Keen.data (event.el, "poll_bike_dialog").done ();
    });

    button.textContent = tr ("Done!");
    cell.appendChild (button);
    line.appendChild (cell);
    tableEl.appendChild (line);
};


PollBikeDialog.prototype = {
    show: function (callback) {
        this.callback = callback;

        var dialog = Keen.data (this.dialogEl, "dialog");

        if (dialog !== this && dialog) {
            dialog.dismiss ();
        }

        this.titleEl.selectedIndex = 0;
        this.levelEl.selectedIndex = 0;         
        this.frameTypeEl.selectedIndex = 0;
        this.forkTravelEl.selectedIndex = 0;
        this.wheelsEl.selectedIndex = 0;
        this.brakesEl.selectedIndex = 0;
        this.qualityEl.selectedIndex = 0;

        if (dialog !== this || !dialog) {
            this.dialogEl.appendChild (this.titleEl);
            this.dialogEl.appendChild (this.tableEl);
        }

        Keen.data (this.dialogEl, "dialog", this);
        Keen.show (overlay);
    },

    dismiss: function () {
        if (Keen.data (this.dialogEl, "dialog") !== this) {
            return;
        }

        Keen.hide (overlay);

        this.dialogEl.removeChild (this.titleEl);
        this.dialogEl.removeChild (this.tableEl);

        Keen.clean (this.dialogEl, "dialog");
    },

    done: function () {
        /* TODO: done */
    }
};


function tr (str) {
    return str;
}


function init () {
    var options = {
        center: {
            lat: 47.845502,
            lng: 35.053543
        },
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.HYBRID,
    };

    map = new google.maps.Map (document.getElementById ("map"), options);
    kmlLayer = new google.maps.KmlLayer ({
        url: "qrc:/kml/main.kml",
        map: map
    });

    initiated = true;
    textDialog.dismiss ();

    //(new PollBikeDialog (dialogBody)).show ();
}


textDialog = new TextDialog (dialogBody);
textDialog.show (tr ("Please, wait"), tr ("We're loading something ..."));

gApiScript = Keen.loadScript ("https://maps.googleapis.com/maps/api/js?key=AIzaSyCnu1OB9AyyaDeX77dhkl26lbgcRVKHufA&callback=init");

Keen.log ("load up");

setTimeout (function () {
    if (!initiated) {
        Keen.log ("failed to load");
        textDialog.show (tr ("We're dead!"),
            tr ("It appears that you have no active Internet connection."));

        Keen.head.removeChild (gApiScript);
        window.google = null;
        gApiScript = Keen.loadScript ("https://maps.googleapis.com/maps/api/js?key=AIzaSyCnu1OB9AyyaDeX77dhkl26lbgcRVKHufA&callback=init");
    }
}, 10000);
