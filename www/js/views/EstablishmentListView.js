Nysus.Views.EstablishmentListView = Backbone.View.extend({

    tagName:'ul',

    id: 'establishments_list',

    initialize:function () {
        var self = this;
        this.collection.on("reset", this.render, this);
        this.collection.on("add", function (establishment) {
            self.$el.append(new Nysus.Views.EstablishmentListItemView({model:establishment}).render().el);
        });
    },

    render:function () {
        this.$el.empty();
        
        _.each(this.collection.toJSON(), function (establishment) {
            model = new Nysus.Models.Establishment(establishment)
            this.$el.append(new Nysus.Views.EstablishmentListItemView( {model: model} ).render().el);
        }, this);
        if (this.collection.models.length === 0){
            noty({
                        text: "Error: NO Establishments Found.",
                        layout: 'center',
                        timeout: 2000
                      });
        }
        return this;
    }
});
