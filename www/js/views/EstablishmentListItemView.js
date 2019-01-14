Nysus.Views.EstablishmentListItemView = Backbone.View.extend({

    tagName:"li",

    className:"list-item",

    initialize:function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});
