
var gApiKey = "AIzaSyCnu1OB9AyyaDeX77dhkl26lbgcRVKHufA";
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
	
	//get point
	google.maps.event.addListener(map, "rightclick", function(event) {
		var lat = event.latLng.lat();
		var lng = event.latLng.lng();
		console.log("Lat=" + lat + "; Lng=" + lng);
		
		Keen.ajax.get ("http://dev2.gditeck.com/register.php?user_id=1&lat="+lat+"&lng="+lng+"&title=test&message=mess", null, {
        onSuccess: function (data) {
            Keen.log (data);
        }
    });
		
	});
	
	
	
	

    /*
     * Download up-to-date KML files.
     * google.maps.KmlLayer refuses to download them
     * from qrc though.
     */

    kmlLayer = new google.maps.KmlLayer ({
        url: "https://rawgit.com/chiffathefox/uberkml/master/main.kml?" +

        /* Debug feature */

        (+new Date).toString (16),
        preserveViewport: true,
        map: map
    });

    kmlLayer.addListener ("click", function (event) {
        Keen.log (event.featureData);
        event.featurData.infoWindowHtml = "";
    });

    initiated = true;
    textDialog.dismiss ();
	
/*
    Keen.ajax.get ("http://ipinfo.io/geo", null, {
        onSuccess: function (data) {
            Keen.log (data);
            if (!data || typeof (data.loc) !== "string") {
                return;
            }

            data = data.loc.split (",");

            if (data.length !== 2) {
                return;
            }

            var pos = {
                lat: parseFloat (data [0]),
                lng: parseFloat (data [1])
            };

            if (!isNaN (pos.lat) && !isNaN (pos.lng)) {
                map.setCenter (pos);
            }
        }
    });
*/
    //(new PollBikeDialog (dialogBody)).show ();
}


function retry () {
    if (!initiated) {
        Keen.log ("failed to load");
        textDialog.show (tr ("We're dead!"),
            tr ("It appears that you have no active Internet connection."));

        Keen.head.removeChild (gApiScript);
        window.google = null;
        gApiScript = Keen.loadScript (
            "https://maps.googleapis.com/maps/api/js?key=" + gApiKey +
            "&callback=init");

        setTimeout (retry, 10000);
    }
}

function setProfile(name, img)
{
	$("#name").text(name);
	$(".avimg").attr("src",img);
	$("#profile").show();
}


textDialog = new TextDialog (dialogBody);
textDialog.show (tr ("Please, wait"), tr ("We're loading something ..."));

gApiScript = Keen.loadScript ("https://maps.googleapis.com/maps/api/js?key=" +
    gApiKey + "&callback=init");

Keen.log ("load up");

setTimeout (retry, 10000);