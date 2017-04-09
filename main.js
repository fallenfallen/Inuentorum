
var gApiKey = "AIzaSyCnu1OB9AyyaDeX77dhkl26lbgcRVKHufA";
var map;
var kmlLayer;

var initiated = false;
var textDialog, gApiScript, markerDialog;
var overlayEl = Ki ("overlay");
var dialogBody = Ki ("dialog_body");
var facebook = null;
var doneCategories = false;
var shownCatDialog = false;
var markers = [];
var categoriesSelectEl = Keen.createElement ("select");
var committingMarker = false;
var urgencyColors = [ "#30e31d", "#a9e31d", "#e3e11d", "#f6d912", "#f61212" ];
var prevCategoryEl = null;
var categoryCellEls = [];


var TextDialog = function (dialogEl) {
    this.dialogEl = dialogEl;
    this.titleEl = Keen.createElement ("h1");
    this.textEl = Keen.createElement ("p");
    this.btnEl = Keen.createElement ("button");
    this.btn2El = Keen.createElement ("button");

    Keen.class.add (this.titleEl, "title");
    Keen.class.add (this.textEl, "text");

    Keen.data (this.btnEl, "text_dialog", this);

    Keen.event.add (this.btnEl, "click", function (event) {
        var dialog = Keen.data (event.target, "text_dialog");

        if (dialog.callback) {
            dialog.callback (dialog, event);
        } else {
            dialog.dismiss ();
        }
    });

    Keen.data (this.btn2El, "text_dialog", this);

    Keen.event.add (this.btn2El, "click", function (event) {
        var dialog = Keen.data (event.target, "text_dialog");

        if (dialog.callback2) {
            dialog.callback2 (dialog, event);
        } else {
            dialog.dismiss ();
        }
    });
};

TextDialog.prototype = {
   show: function (title, text, btnText, callback, btn2Text, callback2) {
        var dialog = Keen.data (this.dialogEl, "dialog");

        if (dialog !== this && dialog) {
            dialog.dismiss ();
        }

        this.titleEl.textContent = title;
        this.textEl.textContent = text;

        if (dialog !== this || !dialog) {
            this.dialogEl.appendChild (this.titleEl);
            this.dialogEl.appendChild (this.textEl);
            this.dialogEl.appendChild (this.btnEl);
            this.dialogEl.appendChild (this.btn2El);
        }

        if (btnText) {
            this.callback = callback;
            this.btnEl.textContent = btnText;
            Keen.show (this.btnEl);
        } else {
            Keen.hide (this.btnEl);
        }

        if (btn2Text) {
            this.callback2 = callback2;
            this.btn2El.textContent = btn2Text;

            Keen.show (this.btn2El);
        } else {
            Keen.hide (this.btn2El);
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
        this.dialogEl.removeChild (this.btnEl);
        this.dialogEl.removeChild (this.btn2El);

        Keen.clean (this.dialogEl, "dialog");
    },

    done: function (event) {
        if (this.callback) {
            this.callback (this, event);
        } else {
            this.dismiss ();
        }
    }
};


/* Garbage begins */

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

/* Garbage ends */


var MarkerDialog = function (dialogEl) {
    this.dialogEl = dialogEl;
    this.titleEl = Keen.createElement ("h1");
    this.titleEl.textContent = tr ("Please, tell us what happened here");
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

    addRow (categoriesSelectEl, "Category");


    this.urgencyEl = Keen.createElement ("select");

    for (var i = 0; i <= 4; i++) {
        this.urgencyEl.innerHTML +=
            '<option value="' + i + '">' + i + '</option>';
    }

    addRow (this.urgencyEl, "Urgency");


    this.nameEl = Keen.createElement ("input", {
        type: "text"
    });

    addRow (this.nameEl, "Name it: ");


    this.messageEl = Keen.createElement ("input", {
        type: "text"
    });

    addRow (this.messageEl, "Describe it: ");


    var line = Keen.createElement ("tr");
    var cell = Keen.createElement ("td");
    this.btnEl = Keen.createElement ("button");

    Keen.data (this.btnEl, "marker_dialog", this);

    Keen.event.add (this.btnEl, "click", function (event) {
        Keen.data (event.target, "marker_dialog").done ();
    });

    this.btnEl.textContent = tr ("Post");

    this.btn2El = Keen.createElement ("button");

    Keen.data (this.btn2El, "marker_dialog", this);

    Keen.event.add (this.btn2El, "click", function (event) {
        Keen.data (event.target, "marker_dialog").dismiss ();
    });

    this.btn2El.textContent = tr ("Cancel");
};


MarkerDialog.prototype = {
    show: function (callback) {
        this.callback = callback;

        var dialog = Keen.data (this.dialogEl, "dialog");

        if (dialog !== this && dialog) {
            dialog.dismiss ();
        }

        this.nameEl.value = "";
        this.messageEl.value = "";
        this.urgencyEl.selectedIndex = 0;
        categoriesSelectEl.selectedIndex = 0;

        if (dialog !== this || !dialog) {
            this.dialogEl.appendChild (this.titleEl);
            this.dialogEl.appendChild (this.tableEl);
            this.dialogEl.appendChild (this.btnEl);
            this.dialogEl.appendChild (this.btn2El);
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
        this.dialogEl.removeChild (this.btnEl);
        this.dialogEl.removeChild (this.btn2El);

        Keen.clean (this.dialogEl, "dialog");
    },

    done: function () {
        var name = this.nameEl.value;
        var message = this.messageEl.value;

        if (!name) {
            Keen.Fx.poke (this.nameEl, { backgroundColor: "#EAB1AA" });
        }

        if (!message) {
            Keen.Fx.poke (this.messageEl, { backgroundColor: "#EAB1AA" });
        }

        if (name && message) {
            this.callback (this, {
                name: name,
                message: message,
                urgency: this.urgencyEl.selectedIndex,
                category: categoriesSelectEl.options [
                    categoriesSelectEl.selectedIndex].value
            });
        }
    }
};


function tr (str) {
    return str;
}


function loginFacebook () {
    new QWebChannel (qt.webChannelTransport, function (channel) {
        channel.objects.Qt.loginFacebookSlot ();
    });
}


var map;
var infoWindow;


function retryGetUserData (id, nameId, avatarId) {
    Keen.ajax.post ("https://graph.facebook.com/v2.8/" +
        v.user_id + "?access_token=" + facebook.token, {}, {
        onSuccess: function (data) {
            Keen.log (data);
        },
        onFail: function () {
            setTimeout (function () {
                retryGetUserData (id, nameId, avatarId);
            }, 5000);
        }
    });
}


function deleteMarker (id) {
    Keen.ajax.post ("http://dev2.gditeck.com/getInfo.php", {
        act: "delete",
        id: id
    }, {});

    textDialog.show (tr ("Delete ..."), tr ("Your marker will be" +
        "removed later."), tr ("Got It!"));
}


function markerClicked () {
    var v = Keen.data (this, "marker");

    var cache = facebook.cache [v.user_id];

    var nameId = "", avatarId = "";

    if (!cache) {
        cache = {
            id: v.user_id,
            img: "qrc:/img/unknown.jpg",
            name: tr ("Unknown")
        };

        nameId = "name_" + v.id;
        avatarId = "avatar" + v.id;

        retryGetUserData (v.user_id, nameId, avatarId);
    }

    infoWindow.close ();

    var content =
        "<table><tr>" +
            '<td><img id="' + avatarId +
            '" width="50" height="50" class="avimg" '+
            'src="' + cache.img + '" /></td>' +
            '<td id="' + nameId + '">' + cache.name + '</td>' +
        '</tr></table>' +

        '<div style="background-color: ' + urgencyColors [v.urgency] +
        ';" class="urgency"></div>' +

        '<div id="content">'+
        '<div id="siteNotice"></div>'+
        '<h1 id="firstHeading" class="firstHeading">' +
        v.title + '</h1>'+
        '<p style="color: #A0A0A0;">' + tr ("Posted at ") +
        (new Date (v.time * 1000)).toLocaleString () + '</p>' +
        '<div id="bodyContent">'+
        '<p>' + v.message +'</p>'+
        '</div>'+
        '</div>';

    if (v.user_id == facebook.id) {
        content += '<a href="#' + (+new Date).toString (16) +
            '" style="float: right;" ' +
            'onclick="deleteMarker (' + v.id + ')">' +
        tr ("Delete") + '</a>';
    }

    infoWindow.setContent (content);
    infoWindow.open (map, this);
}


function loadMarker (v) {
    marker = new google.maps.Marker ();
    marker.addListener ("click", markerClicked);

    Keen.data (marker, "marker", v);

    marker.setPosition ({
        lat: parseFloat (v.lat),
        lng: parseFloat (v.lng)
    });

    marker.setTitle (v.title);
    marker.setMap (map);
    marker.setIcon ("qrc:/img/marker" + v.urgency + ".png");

    markers.push (marker);
}


function loadMarkers (category, el) {
    textDialog.show (tr ("Please, wait ..."),
                    tr ("We're loading markers ..."));

    Keen.ajax.post ("http://dev2.gditeck.com/getInfo.php", {
        act: "coordinates",
        category: category
    }, {
        onSuccess: function (data) {
            Keen.log (data);

            if (!data) {
                textDialog.show (tr ("Sorry ..."),
                    tr ("We have failed to obtain markers data."),
                    tr ("Ok"));

                return;
            }

            Keen.each (markers, function (k, v) {
                v.setMap (null);
            });

            Keen.each (data, function (k, v) {
                loadMarker (v);
            });

            textDialog.dismiss ();

            if (prevCategoryEl !== null) {
                Keen.class.remove (prevCategoryEl, "active_category");
            }

            prevCategoryEl = el;
            Keen.class.add (el, "active_category");
        },
        onFail: function () {
            textDialog.show (tr ("Sorry ..."),
                tr ("We have failed to obtain markers data."),
                tr ("Ok"));
        }
    });
}


function commitMarker (latLng) {
    markerDialog.show (function (dialog, v) {
        if (committingMarker) {
            return;
        }

        committingMarker = true;
        
        Keen.toggle (dialog.nameEl);
        Keen.toggle (dialog.messageEl);
        Keen.toggle (dialog.btnEl);

        Keen.ajax.post ("http://dev2.gditeck.com/register.php", {
            user_id: facebook.id,
            lat: latLng.lat,
            lng: latLng.lng,
            title: v.name,
            message: v.message,
            urgency: v.urgency,
            category: v.category
        }, {
            onSuccess: function () {
                committingMarker = false;

                Keen.toggle (dialog.nameEl);
                Keen.toggle (dialog.messageEl);
                Keen.toggle (dialog.btnEl);

                loadMarkers (v.category,
                    categoryCellEls [categoriesSelectEl.selectedIndex]);
            },

            onFail: function () {
                committingMarker = false;

                Keen.toggle (dialog.nameEl);
                Keen.toggle (dialog.messageEl);
                Keen.toggle (dialog.btnEl);

                textDialog.show (tr ("Sorry!"),
                        tr ("We were unable to send your marker"),
                        tr ("OK"));
            }
        });
    });
}


function retryCategories () {
    Keen.ajax.post ("http://dev2.gditeck.com/getInfo.php", {
        act: "categories"
    }, {
        onSuccess: function (data) {
            var categoriesEl = Ki ("categories");

            Keen.each (data, function (k, v) {
                var line = Keen.createElement ("tr");
                var cell = Keen.createElement ("td");

                Keen.event.add (cell, "click", function () {
                    loadMarkers (v.id, cell);
                });

                cell.textContent = tr (v.name);
                line.appendChild (cell);
                categoriesEl.appendChild (line);

                categoriesSelectEl.innerHTML +=
                    '<option value="' + v.id + '">' + v.name + '</option>';

                categoryCellEls.push (cell);
            });

            Keen.show (Ki ("categories_wrapper"));

            doneCategories = true;

            if (shownCatDialog) {
                textDialog.dismiss ();
            }
        },
        
        onFail: function () {
            setTimeout (retryCategories, 5000);
        }
    });
}


function init () {
    var options = {
        center: {
            lat: 47.819363,
            lng: 35.153075
        },
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.HYBRID,
    };
	

    map = new google.maps.Map (document.getElementById ("map"), options);
 
    google.maps.event.addListener(map, "rightclick", function (event) {
        commitMarker ({
            lat: event.latLng.lat (),
            lng: event.latLng.lng ()
        });
    });

    infoWindow = new google.maps.InfoWindow ();

    /*
     * Download up-to-date KML files.
     * google.maps.KmlLayer refuses to download them
     * from qrc though.
     */

    /* 
    kmlLayer = new google.maps.KmlLayer ({
        url: "https://rawgit.com/chiffathefox/uberkml/master/main.kml?" +


        (+new Date).toString (16),
        preserveViewport: true,
        map: map
    });

    kmlLayer.addListener ("click", function (event) {
        Keen.log (event.featureData);
        event.featurData.infoWindowHtml = "";
    });
    */

	
    /* 
    textDialog.show (tr ("Who are you?"),
        tr ("Please, login via Facebook in order " +
            "to use full service's features"), tr ("Login"), loginFacebook);
            */

    initiated = true;

    retryCategories ();

    textDialog.show (tr ("Who are you?"),
                tr ("Please, login via Facebook in order " +
                    "to use full service's features"),
                tr ("Login"), loginFacebook);


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


/*
 * Called on successful facebook auth
 */

function setProfile (name, img, id, token) {
    Ki ("name").textContent = name;
    Ki ("avimg").setAttribute ("src", img);
    Keen.show (Ki ("profile"));
    facebook = {
        id: id,
        token: token,
        cache: {}
    };

    facebook.cache [id] = {
        id: id,
        img: img,
        name: name
    };

    textDialog.show (tr('Hold on!'),
        tr ('You can place markers simply by clicking ' +
             'on a place with right mouse button.' +
             'Choose a category in the left bar to see appropriate markers'),
        tr ('Got it!'), function (dialog) {
        
        if (doneCategories) {
            dialog.dismiss ();
            return;
        }
        
        shownCatDialog = true;

        textDialog.show (tr ("Please, wait ..."),
            tr ("We're fetching some data ..."));
    });
}


markerDialog = new MarkerDialog (dialogBody);
textDialog = new TextDialog (dialogBody);
textDialog.show (tr ("Please, wait"), tr ("We're loading something ..."));

gApiScript = Keen.loadScript ("https://maps.googleapis.com/maps/api/js?key=" +
    gApiKey + "&callback=init");

Keen.log ("load up");

setTimeout (retry, 10000);
