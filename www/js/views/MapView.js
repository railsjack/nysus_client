window.debug = [];
Nysus.Views.MapView = Backbone.View.extend({

    tagName:'div',

    id: 'map_view',

    map: null,
    google_xhr: false,
    last_request: "",
    markersArray: [],

    initialize:function () {
        var self = this;
        this.bounds = new google.maps.LatLngBounds();
        // possibly use a new collection for the map that adapts to store.js
    },

    render:function () {
        this.$el.empty();

        this.appendMap();
        
        return this;
    },

    appendMap: function() {
        var self = this;
        this.buildMap()
        this.addEstablishments();
        this.addCurrentPositionMarker();
        this.adjustMapPositioning();
        this.map.fitBounds(this.bounds);
        setTimeout(function(){
            google.maps.event.trigger(self.map, 'resize')
            self.map.setZoom( 17 );
            var userLatLng;
            console.log(window.location.hash);
            // if (window.location.hash === "#establishments/map"){
            //     userLatLng = new google.maps.LatLng(store.get('mylatitude'), store.get('mylongitude'));
            //     console.log("should be current location");
            // }
            // else{
                userLatLng = new google.maps.LatLng(store.get('latitude'), store.get('longitude'));
                console.log("should be where you stopped at");
            //}
            console.log(userLatLng);
            self.map.setCenter(userLatLng);
        },500);
        
    },

    getRealContentHeight: function() {
        var footer = $('#footer');
        var header = $("div[data-role='navigation']:visible");
        var content = $(".page");
        var viewport_height = $(window).height();
        var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
        if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
            content_height -= (content.outerHeight() - content.height());
        }
        return content_height;
    },

    addCurrentPositionMarker: function() {
        var userLatLng = new google.maps.LatLng(store.get('mylatitude'), store.get('mylongitude'));
        this.currentPositionMarker = new RichMarker({
          position: userLatLng,
          map: this.map,
          draggable: false,
          flat: true,
          content: '<i class="icon-cd current-position"></i>'
        });
        this.bounds.extend(this.currentPositionMarker.position);
        this.map.fitBounds(this.bounds);
    },

    updateCurrentPositionMarker: function() {
        var userLatLng = new google.maps.LatLng(store.get('mylatitude'), store.get('mylongitude'));
        this.currentPositionMarker.setPosition(userLatLng);
    },

    adjustMapPositioning: function(){
        var that = this;
        this.$('#map').css('height', this.getRealContentHeight());
        this.$('#map').css('position', 'relative');
        this.$('#map').css('top', '1px');
        $( window ).resize(function() {
            this.$('#map').css('height', that.getRealContentHeight());
            this.$('#map').css('position', 'relative');
            this.$('#map').css('top', '1px');
        });
    },

    buildMap: function() {
        this.$el.append('<div id="map"></div>');

        var styleArray = [
          {
            featureType: "poi.business",
            elementType: "labels",
            stylers: [
              { visibility: "off" }
            ]
          }
        ];

        var mapOptions = {
            center: new google.maps.LatLng(store.get('latitude'), store.get('longitude')),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false,
            panControl: true,
            zoomControl: true,
            scaleControl: true,
            styles: styleArray
        };
        this.map = new google.maps.Map(this.$('#map')[0], mapOptions);

        var homeControlDiv = document.createElement('div');
        var homeControl = new HomeControl(homeControlDiv, this.map);

        homeControlDiv.index = 100;
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
        console.log('resizing');
        google.maps.event.trigger(this.map, 'resize')
        this.map.setZoom( 17 );

        var self = this;
        var url = window.location.hash;
        lastMapRequest = new Date();
        google.maps.event.addListener(this.map, 'zoom_changed', function(map){
            store.set('map_zoom', self.map.getZoom());
        });
        google.maps.event.addListener(this.map, 'idle', function() {
            lastMapRequest = new Date();
            console.log(lastMapRequest.getTime());
            var location = self.map.getCenter();
            store.set("latitude", location.lat());
            store.set("longitude", location.lng());
            setTimeout(function(){
                if (lastMapRequest.getTime() + 3000 <= new Date().getTime())
                {
                    console.log("getting closest places");
                    //get points around the new center of the map
                    var q = window.location.hash.split("/");
                    //console.log(q);
                    var query = q[q.length - 1].split(":");
                    console.log(query[1]);
                    q = [];
                    if (query[0] !== "" && query[0] !== "map")
                        q.push(query[0]);
                    else
                        q.push("");
                    if (query[1] !== undefined && query[1] !== null && query[1] !== "")
                        q.push(query[1]);
                    else
                        q.push("");
                    if (query[2] !== undefined && query[2] !== null && query[2] !== "")
                        q.push(query[2]);
                    else
                        q.push("");
                    query = q;
                    console.log(query);
                    console.log("zoom level");
                    console.log(self.map.getZoom());
                    console.log("zoom level");
                    var map_zoom = parseInt(store.get('map_zoom'));
                    var changed_radius = parseInt(200000/(self.map.getZoom()+1));

                    if(self.map.getZoom()<17)
                        featured = "true"
                    else
                        featured = ""

                    if(self.google_xhr && self.google_xhr.readystate != 4){ self.google_xhr.abort(); }
                    var api_request = api_host+"/api/v1/establishments.json?search="+query[0]+"&filters="+query[1]+"&city="+query[2]+"&latitude="+store.get('latitude')+"&longitude="+store.get('longitude')+"&radius="+changed_radius+"1&featured="+featured;
                    if(self.last_request==api_request) return;
                    self.last_request = api_request;
                    self.google_xhr = $.get(api_request,
                        function(data){
                            var geo_data = [];
                            for(var i = 0; i < data.establishments.length; i++){
                                var r = {};
                                r['id'] = data.establishments[i].id;
                                r['latitude'] = data.establishments[i].latitude;
                                r['longitude'] = data.establishments[i].longitude;
                                r['name'] = data.establishments[i].name;
                                r['specials'] = data.establishments[i].specials;
                                r['events'] = data.establishments[i].events;
                                r['featured'] = data.establishments[i].featured;
                                r['featured_text'] = data.establishments[i].featured_text;
                                r['user'] = data.establishments[i].user;
                                r['logo_url'] = data.establishments[i].logo_url;
                                geo_data.push(r);
                            }
                          store.set('establishments_list_map-coordinates', geo_data);
                          self.clearOverlays();
                          self.addEstablishments();
                        });
                }
            }, 3000);
        });
    },

    addEstablishments: function() {
        var that = this;
        var establishments = store.get('establishments_list_map-coordinates');
        console.log("addEstablishments...");

        for (i = 0; i < establishments.length; i++) {
            //determine which icon to use
            var icon = '';
            // console.log(establishments[i]);
            // console.log(establishments[i].featured);
            // console.log(establishments[i].user);
            var icon_zindex = 0;
            if (establishments[i].featured){ //featured
                console.log("featured");
                icon = '<img src="img/featured.png" style="height: 48px; color: #952e2c; text-shadow: 1px -2px 4px #000; cursor: pointer;" />';
                icon_zindex = 3;
            }
            else if (establishments[i].user){ //claimed
                console.log("claimed");
                icon = '<img src="img/claimed.png" style="height: 32px; color: #952e2c; text-shadow: 1px -2px 4px #000; cursor: pointer;" />';
                icon_zindex = 2;
            }
            else{ //unclaimed
                console.log("unclaimed");
                icon = '<img src="img/unclaimed.png" style="height: 32px; color: #952e2c; text-shadow: 1px -2px 4px #000; cursor: pointer;" />';
                icon_zindex = 1;
            }
            marker = new RichMarker({
              position: new google.maps.LatLng(establishments[i].latitude, establishments[i].longitude),
              map: this.map,
              draggable: false,
              flat: true,
              content: icon,
              zIndex: icon_zindex,
              animation: google.maps.Animation.DROP
            });

            this.bounds.extend(marker.position);
            this.markersArray.push(marker);
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    that.openModal(establishments[i]);
                }
            })(marker, i));
        }
    },

    refreshMap: function() {
        google.maps.event.trigger(this.map, 'resize');
        this.map.fitBounds(this.bounds);
    },

    openModal: function(establishment) {
        this.closeModals();
        console.log(establishment);
        var view = new Nysus.Views.MapModalView({model: establishment})
        Nysus.mapModal = new Backbone.BootstrapModal({
            content: view,
            id: 'map_establishment_modal',
            modalOptions: { backdrop: false },
            showFooter: false,
            animate: true,
            allowCancel: true,
            escape: true,
        });
        Nysus.mapModal.open();
    },

    closeModals: function() {
        if( $('.modal').length > 0 ) {
            $('.modal').remove();
        }
    },

    clearOverlays: function() {
        console.log(this.markersArray.length);
          for (var i = 0; i < this.markersArray.length; i++ ) {
            this.markersArray[i].setMap(null);
          }
          this.markersArray.length = 0;
          console.log("cleared markers");
    }
});

function HomeControl(controlDiv, map) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '50px';

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.style.textAlign = 'center';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<img src="img/pointer.png" style="height: 36px" />';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(controlUI, 'click', function() {
    map.setCenter(new google.maps.LatLng(store.get("mylatitude"), store.get("mylongitude")));
  });

}
