Nysus.Views.EstablishmentClaimView = Backbone.View.extend({

    tagName:'div',

    id: 'establishments_claim',

    events: {
        'click #submit': 'submit',
    },

    initialize:function () {
        var self = this;
    },

    render:function () {
        this.$el.empty();
        this.$el.html(this.template(this.model.toJSON()));

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

    submit: function(){
        event.preventDefault();
        var self = this;

        //check if everything is entered
        if ($("#name").val() !== "" && $("#title").val() !== "" && $("#email").val() !== "" && $("#phone").val() !== "" && $("#time").val() !== "")
        {
            url_parts = document.URL.split("/");
            var id = url_parts[url_parts.length -1];
            console.log(id);
            console.log($("#name").val());
            $.ajax({
                type: 'POST',
                url: api_host+'/api/v1/establishments/'+id+'/claim.json',
                //url: 'http://192.168.0.35:3000/api/v1/establishments/2/claim.json',
                dataType: 'json',
                data: {
                    'token': store.get('token'),
                    'name': $("#name").val(),
                    'title': $("#title").val(),
                    'email': $("#email").val(),
                    'phone': $("#phone").val(),
                    'time': $("#time").val()
                },
                success: function(data) {
                    console.log(data);
                    noty({
                        text: "Claim Request Sent",
                        layout: 'center',
                        timeout: 2000
                    });
                    setTimeout(function(){
                        window.history.back();
                    }, 2000)
                },
                error: function(xhr, status, error) {
                    console.log(error);
                    window.location = "/#login";
                }
            });
        }
        else
        {
            console.log("Error");
            noty({
                text: "Error: All fields are Required",
                layout: 'center',
                timeout: 2000
            });
        }
    }
});
