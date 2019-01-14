Nysus.Views.EstablishmentShowView = Backbone.View.extend({

    tagName:'div',

    id: 'establishments_show',

    events: {
        'click #favorite': 'favorite',
    },

    initialize:function () {
        var self = this;
    },

    render:function () {
        this.$el.empty();
        this.$el.html(this.template(this.model.toJSON()));

        this.checkIfFavorite();

        this.$("a[target='_system']").on('click', function(event) {
            event.preventDefault();
            var $this = $(this);
            var target = '_system';
            window.open($this.attr('href'), target);
        });

        // debugger;
        // fitText(this.$('.establishment-icon'))

        return this;
    },

    checkIfFavorite: function(){
        //get the id of the item
        var self = this;
        url_parts = document.URL.split("/");
        var id = url_parts[url_parts.length -1];
        $.ajax({
            type: 'GET',
            url: api_host+'/api/v1/users/123.json',
            dataType: 'json',
            data: {
                'token': store.get('token'),
            },
            success: function(data) {
                console.log(data);
                for(var i = 0; i < data.establishments.length; i++){
                    console.log (data.establishments[i].establishment.id == id)
                    if(data.establishments[i].establishment.id == id){
                        //swap the class on the favorite button
                        self.toggleFavorite();
                    }
                }
            },
            error: function(xhr, status, error) {
                console.log(error);
                if (store.get("token") == null || store.get("token") == "")
                    console.log("not logged in");
                else{
                    noty({
                        text: "Error: Unable to connect to the server.",
                        layout: 'center',
                        timeout: 5000
                      });
                }
            }
        });
    },

    toggleFavorite: function(){
        var button = $("#favorite");
        if(button.hasClass("glyphicon-star-empty")){ // swap to inactive
            button.removeClass("glyphicon-star-empty");
            button.addClass("glyphicon-star");
        }
        else{
           button.removeClass("glyphicon-star");
           button.addClass("glyphicon-star-empty"); 
        }
    },

    favorite: function(e){
        e.preventDefault();
        var self = this;
        //get the id of the item
        url_parts = document.URL.split("/");
        var id = url_parts[url_parts.length -1];
        console.log(id);
        $.ajax({
            type: 'POST',
            url: api_host+'/api/v1/establishments/'+id+'/favorite.json',
            dataType: 'json',
            data: {
                'token': store.get('token')
            },
            success: function(data) {
                self.toggleFavorite();
                var button = $("#favorite");
                var message = "";
                if ( button.hasClass("glyphicon-star-empty"))
                    message = "Unfavorited";
                else
                    message = "Favorited";
                noty({
                    text: message,
                    layout: 'center',
                    timeout: 2000
                });
            },
            error: function(xhr, status, error) {
                console.log(error);
                if (store.get("token") == null || store.get("token") == "")
                    window.location = "#/login";
                else{
                    noty({
                        text: "Error: " + error,
                        layout: 'center',
                        timeout: 2000
                    });
                }
            }
        });
    }
});
