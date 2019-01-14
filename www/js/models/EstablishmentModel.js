Nysus.Models.Establishment = Backbone.Model.extend({

    url: function(){
        return api_host+'/api/v1/establishments/' + this.id + '.json'
    },

    initialize:function () {
        // this.reports = new app.models.ReportsCollection();
        // this.reports.parent = this;
    },

    sync: function(method, model, options) {
        var that = this;

        var params = _.extend({
            type: 'GET',
            dataType: 'json',
            data: {
                'token': store.get('token'),
                'latitude': store.get('latitude'),
                'longitude': store.get('longitude'),
                'radius': "2000"
            },
            // beforeSend: function( xhr ) {
            //     $('html').append('<i class="loading img-circle icon-spin1 animate-spin"></i>');
            //     $('.loading').fadeIn(100);
            // },
            // complete: function() {
            //     $(".loading").fadeOut("normal", function() {
            //         $(this).remove();
            //     });
            // },
            // success: function(data, text, xhr) {
            //     debugger;
            //     data.hasEvents = data['events'].length > 0

            //     _.each(data.events, function(event) {
            //       event.event.short_start_time = Nysus.Utils.dates.formatDate(event.event.start_time);
            //     });

            //    data.hasSpecials = data['specials'].length > 0

            //    _.each(data.specials, function(special) {
            //       special.special.short_start_time = Nysus.Utils.dates.formatDate(special.special.start_time);
            //    });
            //     console.log(data);
            // },
            error: function(thing) {
                console.log(thing);
            },
            url: that.url(),
            processData: true
        }, options);

        return $.ajax(params);
    }

});

Nysus.Models.EstablishmentCollection = Backbone.Collection.extend({

    model: Nysus.Models.Establishment,

    url: api_host+'/api/v1/establishments.json',

    parse: function(response) {
        return response.establishments;
    },

    sync: function(method, model, options) {
        var that = this;

        var params = _.extend({
            type: 'GET',
            dataType: 'json',
            data: {
                'token': store.get('token'),
                'latitude': store.get('latitude'),
                'longitude': store.get('longitude'),
                'radius': "200000000"
            },
            beforeSend: function( xhr ) {
                $('html').append('<i class="loading img-circle icon-spin1 animate-spin"></i>');
                $('.loading').fadeIn(100);
            },
            complete: function() {
                $(".loading").fadeOut("normal", function() {
                    $(this).remove();
                });
            },
            url: that.url,
            processData: true
        }, options);

        return $.ajax(params);

        // if (method === "read") {
        //     Nysus.Adapters.establishment.findById(options.data.name).done(function (data) {
        //         options.success(data);
        //     });
        // }
    }


});

Nysus.Models.MapCollection = Backbone.Collection.extend({

    model: Nysus.Models.Establishment
});

// Nysus.Models.ReportsCollection = Backbone.Collection.extend({

//     model: Nysus.Models.Establishment,

//     sync: function(method, model, options) {
//         // if (method === "read") {
//         //     console.log("find by manager");
//         //     app.adapters.employee.findByManager(this.parent.id).done(function (data) {
//         //         options.success(data);
//         //     });
//         // }
//     }

// });