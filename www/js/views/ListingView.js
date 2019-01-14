Nysus.Views.ListingView = Backbone.View.extend({

    tagName:'div',

    id: 'listing_view',

    initialize:function () {
        var self = this;
        // this.collection.on("reset", this.render, this   );
        // this.collection.on("add", function (establishment) {
        //     self.$el.append(new Nysus.Views.EstablishmentListItemView({model:establishment}).render().el);
        // });
    },

    render:function () {
        this.$el.empty();
        this.establishmentsList = new Nysus.Views.EstablishmentListView({collection: this.collection});
        this.$el.append(this.establishmentsList.render().$el)

        return this;
    }
});
