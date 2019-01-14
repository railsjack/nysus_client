var Nysus = {
    Views: {},
    Models: {},
    Routers: {},
    Utils: {},
    Adapters: {}
};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //s
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    }
};

$(document).on("ready", function () {
    Nysus.router = new Nysus.Routers.AppRouter();
    Nysus.Utils.templates.load([
            "HomeView",
            "EstablishmentListView",
            "EstablishmentListItemView",
            "MapModalView",
            "SearchView",
            "EstablishmentShowView",
            "LoginView",
            "AccountView",
            "EstablishmentClaimView",
            "FilterView"
        ],
        function () {
            Nysus.router = new Nysus.Routers.AppRouter();
            Backbone.history.start({pushState: false});
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
            navigator.geolocation.watchPosition(onSuccess, onError);
            if (store.get("token") === null || store.get("token") === "")
                $(".float-btn").hide();
        }
    );
});

function onSuccess(position) {
  store.set('mylatitude', position.coords.latitude);
  store.set('mylongitude', position.coords.longitude);
  if (store.get('latitude') === null){
    store.set('latitude', position.coords.latitude);
    store.set("longitude", position.coords.longitude);
  }

  if( $('#map').length > 0 && Nysus.mapview !== null && Nysus.mapview !== undefined ) {
    Nysus.mapView.updateCurrentPositionMarker();
  }
}

function onError(error) { 
  console.log("Error Fetching Location");
  // noty({
  //   text: "Error: Unable to get current location. Please make sure your GPS is turned on.",
  //   layout: 'center',
  //   timeout: 5000
  // });
}
