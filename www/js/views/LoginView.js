Nysus.Views.LoginView = Backbone.View.extend({

    tagName: 'div',

    id: 'login_view',

    events: {
        'submit #login_form': 'login',
        'submit #register_form': 'register',
        'click #show-registration': 'showRegistration',
        'click #show-login': 'showLogin'
    },

    initialize:function () {
        var self = this;
    },

    render:function () {
        this.$el.html(this.template());
        // setTimeout(function(){
        //     $("#registration").hide();
        //     $(".login-btn").hide();
        // });
        return this;
    },

    login: function(e) {
        e.preventDefault();
        var self = this;

        $.ajax({
            type: 'POST',
            url: api_host+'/api/v1/tokens.json',
            dataType: 'json',
            data: {
                'email': self.$('input#email').val(),
                'password': self.$('input#password').val()
            },
            success: function(data) {
                self.loginSuccess(data.token)
            },
            error: function(xhr, status, error) {
                self.showError(xhr.responseJSON.message)
            }
        });
    },

    loginSuccess: function(token) {
        store.set("token", token);

        noty({
            text: "Login Success",
            layout: 'center',
            timeout: 1000
        });
        $(".float-btn").show();
        var s = location.href.replace(location.hash,"");
        s += (s.slice(-1)=="/")?"#":"/#";
        window.location = s;
    },

    showRegistration: function(e){
        e.preventDefault();
        $("#login").hide();
        $(".register-btn").hide();
        $("#registration").show();
        $(".login-btn").show();

    },

    showLogin: function(e){
        e.preventDefault();
        $("#login").show();
        $(".register-btn").show();
        $("#registration").hide();
        $(".login-btn").hide();
    },

    register: function(e) {
        e.preventDefault();
        var self = this;

        $.ajax({
            type: 'POST',
            url: api_host+'/users.json',
            dataType: 'json',
            data: {
                'email': self.$('input#register_email').val(),
                'password': self.$('input#register_password').val()
            },
            success: function(data) {
                self.$('input#email').val(self.$('input#register_email').val()),
                self.$('input#password').val(self.$('input#register_password').val())
                self.login(e)
            },
            error: function(xhr, status, error) {
                self.showError(xhr.responseJSON.message)
            }
        });
    },

    registerSuccess: function(token) {
        $.ajax({
            type: 'POST',
            url: api_host+'/api/v1/tokens.json',
            dataType: 'json',
            data: {
                'email': this.$('input#register_email').val(),
                'password': this.$('input#register_password').val()
            },
            success: function(data) {
                self.loginSuccess(data.token)
            },
            error: function(xhr, status, error) {
                self.showError(xhr.responseJSON.message)
            }
        });
    },

    showError: function(message) {
        noty({
            text: message,
            layout: 'center',
            timeout: 2000
        });
    }

});
