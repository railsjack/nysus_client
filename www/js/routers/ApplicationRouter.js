Nysus.Routers.AppRouter = Backbone.Router.extend({

    routes: {
        "":                          "home",
        "establishments":  "establishments_list",
        "establishments/map":  "establishments_map",
        "establishments/:id":    "establishment_show",
        "search":    "search",
        "search/filter": "filter",
        "search/filter/list/:query": "filter_results_list",
        "search/filter/map/:query": "filter_results_map",
        "login": "login",
        "account": "account",
        "claim/:id": "claim"
    },

    // before: {
    //     '*any': function(fragment, args) {
    //         debugger;
    //         try {
    //             if(typeof(Nysus.mapModal.type) != "undefined") {
    //                 console.log(Nysus.mapModal.type);
    //                 alert('closing');
    //                 Nysus.mapModal.close();
    //             }
    //         } catch(e) {
    //             console.log('no modal');
    //         }
    //     }
    // },

    before: {
        '*any': function(fragment){
            console.log(fragment);
            $("#back-button").attr("href", store.get("last-link"));
            store.set("last-link", "#" +fragment);
        }
    },

    after: {
            '*any': function(fragment) {
                store.set("last-link", "#" +fragment);
                console.log("saved last link");
            }
        },

    initialize: function () {
        Nysus.slider = new PageSlider($('body'));

        this.bind('all', function (trigger, args) {
               var routeData = trigger.split(":");
               $('.modal').remove();
        });
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        //if (!Nysus.homeView) {
            Nysus.homeView = new Nysus.Views.HomeView();
            Nysus.homeView.render();
        // } else {
        //     console.log('reusing home view');
        //     Nysus.homeView.delegateEvents(); // delegate events when the view is recycled
        // }
        $('#footer').fadeOut();
        Nysus.slider.slidePage(Nysus.homeView.$el);
    },

    search: function () {
        Nysus.searchView = new Nysus.Views.SearchView()
        Nysus.slider.slidePage(Nysus.searchView.render().$el);
    },

    filter: function () {
        Nysus.filterView = new Nysus.Views.FilterView()
        Nysus.slider.slidePage(Nysus.filterView.render().$el);
        Nysus.filterView.putControls();
    },

    // consider taking location argument
    establishments_list: function() {
        collection = new Nysus.Models.EstablishmentCollection();
        collection.fetch({
            success: function(data) {
                Nysus.Utils.maps.storeEstablishmentsGeoData(data);
                var geo_data = _.map(data.models, function(establishment){
                    establishment_coordinates = {};
                    establishment_coordinates['id'] = establishment.attributes.id;
                    establishment_coordinates['latitude'] = establishment.attributes.latitude;
                    establishment_coordinates['longitude'] = establishment.attributes.longitude;
                    establishment_coordinates['name'] = establishment.attributes.name;
                    establishment_coordinates['specials'] = establishment.attributes.specials;
                    establishment_coordinates['events'] = establishment.attributes.events;
                    establishment_coordinates["featured"] = establishment.attributes.featured;
                    establishment_coordinates["featured_text"] = establishment.attributes.featured_text;
                    establishment_coordinates["user"] = establishment.attributes.user;
                    //establishment_coordinates["logo_url"] = establishment.attributes.logo_url;
                    establishment_coordinates["logo_url"] = "";
                    return establishment_coordinates;
                });

                store.set('establishments_list_map-coordinates', geo_data);

                Nysus.listingView = new Nysus.Views.ListingView({collection: collection});
                $('#footer').fadeIn();
                Nysus.slider.slidePage(Nysus.listingView.render().$el);
            }
        });
    },

    filter_results_list: function(q){
        console.log("establishments_list...");
        query = q.split(":")
        collection = new Nysus.Models.EstablishmentCollection();
        $.get(api_host+"/api/v1/establishments.json?search="+query[0]+"&filters="+query[1]+"&city="+query[2]+"&latitude="+store.get('latitude')+"&longitude="+store.get('longitude')+"&radius=200000000",
            function(data){
              //console.log(data.establishments);
              for(var i = 0; i < data.establishments.length; i++){
                var worked = collection.create(data.establishments[i]);
                //console.log(worked);
              }
              console.log(data);
              Nysus.listingView = new Nysus.Views.ListingView({collection: collection});
              $('#footer').fadeIn();
              $("#map-btn").attr("href", "#establishments/map");
              $("#list").attr("href", "#search/filter/list/"+q);
              Nysus.slider.slidePage(Nysus.listingView.render().$el);

            },
            function(error){
              console.log("ERROR");
              console.log(error);
            }, "json");
    },

    establishment_show: function(id) {
        var establishment = new Nysus.Models.Establishment({id: id});
        establishment.fetch({
            success: function(data) {
                data.attributes.hasEvents = data.attributes['events'].length > 0

                _.each(data.attributes.events, function(event) {
                  event.event.short_start_time = formatDate(event.event.start_time);
                });

               data.attributes.hasSpecials = data.attributes['specials'].length > 0

               _.each(data.attributes.specials, function(special) {
                  special.special.short_start_time =formatDate(special.special.start_time);
               });
                console.log(data);
                Nysus.establishmentShowView = new Nysus.Views.EstablishmentShowView({model: establishment});
                Nysus.slider.slidePage(Nysus.establishmentShowView.render().$el);
            }
        })
    },

    establishments_map: function() {
        //store.set("latitude", store.get("mylatitude"));
        //store.set("longitude", store.get("mylongitude"));
        collection = new Nysus.Models.EstablishmentCollection();

        collection.fetch({
            success: function(data) {
                // Nysus.Utils.maps.storeEstablishmentsGeoData(data);

                var geo_data = _.map(data.models, function(establishment){
                    establishment_coordinates = {};
                    establishment_coordinates['id'] = establishment.attributes.id;
                    establishment_coordinates['latitude'] = establishment.attributes.latitude;
                    establishment_coordinates['longitude'] = establishment.attributes.longitude;
                    establishment_coordinates['name'] = establishment.attributes.name;
                    establishment_coordinates['specials'] = establishment.attributes.specials;
                    establishment_coordinates['events'] = establishment.attributes.events;
                    establishment_coordinates["featured"] = establishment.attributes.featured;
                    establishment_coordinates["featured_text"] = establishment.attributes.featured_text;
                    establishment_coordinates["user"] = establishment.attributes.user;

                    return establishment_coordinates;
                });

                store.set('establishments_list_map-coordinates', geo_data);

                Nysus.mapView = new Nysus.Views.MapView({collection: collection});
                $('#footer').fadeIn();
                Nysus.slider.slidePage(Nysus.mapView.render().$el);
            }
        });
    },
    filter_results_map: function(q){
        query = q.split(":")
        collection = new Nysus.Models.EstablishmentCollection();
        $.get(api_host+"/api/v1/establishments.json?search="+query[0]+"&filters="+query[1]+"&city="+query[2]+"&latitude="+store.get('latitude')+"&longitude="+store.get('longitude')+"&radius=200000000",
            function(data){
              //console.log(data.establishments);
              // for(var i = 0; i < data.establishments.length; i++){
              //   var worked = collection.create(data.establishments[i]);
              //   //console.log(worked);
              //}
              
              var geo_data = _.map(data.establishments, function(establishment){
                    establishment_coordinates = {};
                    establishment_coordinates['id'] = establishment.id;
                    establishment_coordinates['latitude'] = establishment.latitude;
                    establishment_coordinates['longitude'] = establishment.longitude;
                    establishment_coordinates['name'] = establishment.name;
                    establishment_coordinates['specials'] = establishment.specials;
                    establishment_coordinates['events'] = establishment.events;
                    establishment_coordinates["featured"] = establishment.featured;
                    establishment_coordinates["featured_text"] = establishment.featured_text;
                    establishment_coordinates["user"] = establishment.user;

                    return establishment_coordinates;
                });
              //console.log(geo_data);
            store.set('establishments_list_map-coordinates', geo_data);
              Nysus.mapView = new Nysus.Views.MapView({collection: collection});
              $('#footer').fadeIn();
              $("#map-btn").attr("href", "#establishments/map");
              $("#list").attr("href", "#search/filter/list/"+q);
              Nysus.slider.slidePage(Nysus.mapView.render().$el);

            },
            function(error){
              console.log("ERROR");
              console.log(error);
            }, "json");
    },

    login: function(){
        Nysus.loginView = new Nysus.Views.LoginView();
        Nysus.slider.slidePage(Nysus.loginView.render().$el);
    },

    account: function(){
        Nysus.accountView = new Nysus.Views.AccountView();
        Nysus.slider.slidePage(Nysus.accountView.render().$el);
    },

    claim: function(id){
        var establishment = new Nysus.Models.Establishment({id: id});
        establishment.fetch({
            success: function(data) {
                console.log(data);
                Nysus.establishmentClaimView = new Nysus.Views.EstablishmentClaimView({model: data});
                Nysus.slider.slidePage(Nysus.establishmentClaimView.render().$el);
            }
        })
    }

});