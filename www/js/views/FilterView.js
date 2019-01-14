Nysus.Views.FilterView = Backbone.View.extend({

    tagName:'div',

    id: 'filter_view',

    initialize: function () {
    },

    events: {
        'click #search': 'search',
        'click #cat-clear': 'clear'
    },

    render: function () {
        this.$el.html(this.template());
        this.init();
        this.establishments.initialize();
        
        return this;
    },

    establishments: new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: api_host+"/api/v1/establishments/123/suggest?type=establishment&text=%QUERY&latitude="+store.get('latitude')+"&longitude="+store.get('longitude')+"&radius=200000000"
    }),

    init: function(){},
    putControls: function(){
        var self = this;
        var text = [];
        setTimeout(function(){
            $('#text').typeahead({
                  hint: true,
                  highlight: true,
                  minLength: 1
                },
                {
                  name: 'establishments',
                  displayKey: 'name',
                  source: self.establishments.ttAdapter(),
                  templates: {
                    header: '<h4>Establishments</h4>',
                    empty: [
                      '<p>No matching establishments found</p>'
                    ].join('\n'),
                  }
                }
            );

            //get and populate cities
            $.get(api_host+"/api/v1/establishments/123/suggest?type=city&text=&latitude="+store.get('latitude')+"&longitude="+store.get('longitude')+"&radius=200000000",
              function(data){
                console.log(data);
                var selected = store.get("citystate");
                var selectbox = $("#city");
                console.log(selectbox);
                for(var i = 0; i < data.length; i++)
                {
                  selectbox.append("<option value='"+data[i].city + "_"+data[i].state+"''>"+data[i].city + ", "+data[i].state+"</li>");
                }
                selectbox.val(selected);
              });
            //get and populate categories
            $.get(api_host+"/api/v1/establishments/123/suggest?type=category&text=&latitude="+store.get('latitude')+"&longitude="+store.get('longitude')+"&radius=200000000",
              function(data){
                if (store.get("filters") === null)
                  filters = []
                else
                  filters = store.get("filters").split(",");
                console.log(data);
                currentOrder = 1;
                var html = "<div class='row'>";
                for(var i = 0; i < data.length; i++)
                {
                  html += "<div class='col-xs-6'><br><input type='checkbox' id='"+data[i].id+"' /> "+data[i].title+"</div>";
                }
                html += "</div>";
                $("#cats").html(html);
              });
        }, 1000);
    },

    search: function(ev){
      ev.preventDefault();
      //get all the checked categories
      var filters = $("input:checkbox:checked").map(function(){
        console.log($(this).attr("id"));
        return $(this).attr("id");
      }).get().join(",");
      console.log(filters);
      if (store.get("text") === null)
        store.set("text", "");
      store.set("text"), $("#text").val().split(" - ")[0];
      store.set("filters", filters);
      var city = ""
      if ($("#city").val() === null)
        store.set("citystate", "");
      else{
        store.set("citystate", $("#city").val());
        city = $("#city").val();
      }
      q = $("#text").val()+":"+filters+":"+city;
      if ($("#city").val() !== null && $("#city").val() !== ""){ //need to set the location of the map to the city
        $.ajax({
          url: "https://maps.googleapis.com/maps/api/geocode/json?address="+store.get("citystate").replace("_",", ")+"&sensor=true",
          method: "GET",
          success: function(data){
            console.log(data);
            store.set("latitude", data.results[0].geometry.location.lat);
            store.set("longitude", data.results[0].geometry.location.lng);
            //window.location = "#search/filter/map/"+q;
            window.location = "#search/filter/list/"+q;
          },
          error: function(error){
            console.log(error);
            //window.location = "#search/filter/map/"+q
            window.location = "#search/filter/list/"+q
          }
        });
      }
      else{
        //window.location = "#search/filter/list/"+q
        window.location = "#search/filter/list/"+q
      }
    },

    clear: function(ev){
      ev.preventDefault();
      //get and uncheck all checked categories
      $('input:checkbox').removeAttr('checked');

      return false;

    }

});