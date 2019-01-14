Nysus.Views.HomeView = Backbone.View.extend({
  
    initialize: function () {

    },

    render: function () {
        this.$el.html(this.template());
        $(document).ready(function(){
            setTimeout(function(){
                console.log(store.get("token") !== null);
                console.log(store.get("token") !== "");
                if (store.get("token") !== null && store.get("token") !== "")
                {
                    $("#login-btn").hide();
                    $("#account-btn").show();
                }
                else
                {
                    $("#login-btn").show();
                    $("#account-btn").hide();
                }
            }), 2000;
        });
        return this;
    }

});
