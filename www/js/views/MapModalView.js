Nysus.Views.MapModalView = Backbone.View.extend({

    tagName:'div',

    id: 'map_modal_view',

    events: {
      'click': 'showEstablishment',
      'click .close-modal': 'close'
    },

    initialize: function () {
        var self = this;
    },

    render: function () {
      this.$el.html(this.template(this.model));
        return this;
    },

    showEstablishment: function(event) {
      if($(event.target).attr('class') != 'icon-cancel-circled' && $(event.target).attr('class') != 'close-modal') {
        window.location.href = '#establishments/' + this.model.id;
      }
    },
});
