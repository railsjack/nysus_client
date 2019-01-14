Nysus.Views.SearchView = Backbone.View.extend({

    initialize: function () {
    },

    events: {
        'click #search': 'search',
    },

    establishments: new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: api_host+"/api/v1/establishments/123/suggest?type=establishment&text=%QUERY&latitude="+store.get('latitude')+"&longitude="+store.get('longitude')+"&radius=200000000"
    }),

    render: function () {
        this.$el.html(this.template());
        this.init();
        this.establishments.initialize();
        return this;
    },

    init: function(){
        var self = this;
        var text = [];
        setTimeout(function(){
            $('.typeahead').typeahead({
                  hint: true,
                  highlight: true,
                  minLength: 1
                },
                {
                  name: 'establishments',
                  displayKey: 'name',
                  source: self.establishments.ttAdapter()
                }
            );
        }, 500);
    },

    search: function(ev){
      ev.preventDefault();
      //make sure filters and citystate store are set
      if (store.get('filters') === null)
        store.set("filters", "");
      if (store.get("citystate") == null)
        store.set("citystate", "");
      store.set("text", $("#text").val());
      q = $("#text").val()+":"+store.get('filters')+":"+store.get("citystate");
      window.location = "#search/filter/list/"+q
    }

    // search: function (event) {
    //     var key = $('.search-key').val();
    //     this.searchResults.fetch({reset: true, data: {name: key}});
    // },

    // onkeypress: function (event) {
    //     if (event.keyCode === 13) { // enter key pressed
    //         event.preventDefault();
    //     }
    // }

});