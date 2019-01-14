Nysus.Views.AccountView = Backbone.View.extend({

    initialize: function () {
    },

    events: {
        'click .category-checkbox': 'editCategory',
        'click .special-form-btn': 'submitSpecial',
        'click .event-form-btn': 'submitEvent',
        'click .edit-btn': 'showEditFrom',
        'click .form-special-reset': 'resetSpecialForm',
        'click .edit-establishment-button': 'editEstablishment',
        'click .special-delete': 'deleteSpecial',
        'click .event-form-btn': 'submitEvent',
        'click .form-event-reset': 'resetEventForm',
        'click .event-delete': 'deleteEvent',
        'click .logout': 'logout'
    },

    render: function () {
        this.$el.html(this.template());
        if (store.get("token") == null || store.get("token") == "")
            window.location = "./#login"
        this.getData();
        console.log(this.data);
        return this;
    },

    showEditFrom: function(ev){
        ev.preventDefault();
        var id = ev.currentTarget.id.split("-")
        id = id[id.length-1]
        store.set("edit_id", id);
        if (ev.currentTarget.id.indexOf("special") > -1){
            $.ajax({
                type: "GET",
                url: api_host+'/api/v1/specials/'+id+'.json',
                success: function(data){
                    $("#special-form").html("Edit <button class='btn btn-red form-special-reset'>Reset</button>");
                    $("#special-add-btn").html("Edit Special");
                    $("#add-special-description").val(data.description);
                    $("#add-special-start-datetime").val(moment(data.start_time).format("MM/DD/YYYY dddd"));
                    $("#recurrence").val(data.recurring);
                    window.location = "#special-form";

                },
                error: function(){
                    noty({
                        text: "Error: Unable to get special. This could be a temporary server issue, or you currently have no Internet connection.",
                        layout: 'center',
                        timeout: 5000
                      });
                }
            });

        }
        else { //form for the events
            $.ajax({
                type: "GET",
                url: api_host+'/api/v1/events/'+id+'.json',
                success: function(data){
                    $("#event-form").html("Edit <button class='btn btn-red form-event-reset'>Reset</button>");
                    $("#event-add-btn").html("Edit Event");
                    $("#add-events-title").val(data.event.title);
                    $("#add-events-description").val(data.event.description);
                    $("#add-events-price").val(data.event.price);
                    $("#add-events-start-datetime").val(moment(data.event.start_time).format("MM/DD/YYYY ddd h:mm A"));
                    window.location = "#event-form";

                },
                error: function(){
                    noty({
                        text: "Error: Unable to get event. This could be a temporary server issue, or you currently have no Internet connection.",
                        layout: 'center',
                        timeout: 5000
                      });
                }
            });
        }
    },

    submitSpecial: function(ev){
        ev.preventDefault();
        var self = this;
        if ($("#special-form").html() === "Add")
        {
            $.ajax({
                type: 'POST',
                url: api_host+'/api/v1/specials.json',
                dataType: 'json',
                data: {
                    'token': store.get('token'),
                    "title": $("#add-special-title").val(),
                    "description": $("#add-special-description").val(),
                    "start_time": $("#add-special-start-datetime").val(),
                    "end_time": $("#add-special-end-datetime").val(),
                    "establishment_id": store.get("establishment_id"),
                    "recurring": $("#recurrence").val()
                },
                success: function(data){
                    console.log(data);
                    $("#specials").append("<li><div class='col-xs-12'>"+ $("#add-special-title").val() +"<div class='pull-right'><a href='#' id='edit-special-"+data.special.id+"' class='btn btn-red edit-btn'><span class='glyphicon glyphicon-pencil'></span></a> <a href='#' id='delete-special-"+data.special.id+"' class='btn btn-red special-delete'><span class='glyphicon glyphicon-trash'></span></a><div></div></li>");
                    self.resetSpecialForm();
                    noty({
                        text: "Special Added",
                        layout: 'center',
                        timeout: 1000
                    });
                },
                error: function(){
                    noty({
                        text: "Error: Unable to save your changes",
                        layout: 'center',
                        timeout: 2000
                      });
                }
            });
        }
        else { //edit existing record
            $.ajax({
                type: 'PUT',
                url: api_host+'/api/v1/specials/'+store.get("edit_id")+'.json',
                dataType: 'json',
                data: {
                    'token': store.get('token'),
                    "title": $("#add-special-title").val(),
                    "description": $("#add-special-description").val(),
                    "start_time": $("#add-special-start-datetime").val(),
                    "end_time": $("#add-special-end-datetime").val(),
                    "establishment_id": store.get("establishment_id"),
                    "recurring": $("#recurrence").val()
                },
                success: function(data){
                    console.log(data);
                    $('li#special-'+data.special.id+' .title').html(data.special.description);
                    store.set("edit_id", id);
                    self.resetSpecialForm();
                    noty({
                        text: "Special Edited",
                        layout: 'center',
                        timeout: 1000
                    });
                },
                error: function(data) {
                    console.log(data);
                    noty({
                        text: "Error: Unable to save your changes",
                        layout: 'center',
                        timeout: 2000
                      });
                }
            });
        }
    },

    deleteSpecial: function(e){
        e.preventDefault();
        var self = this;
        var id = e.currentTarget.id.split("-");
        id = id[id.length -1]
        //do delete call
        $.ajax({
            type: 'DELETE',
            url: api_host+'/api/v1/specials/' + id + '.json',
            dataType: 'json',
            success: function(data){
                noty({
                    text: "Special Deleted",
                    layout: 'center',
                    timeout: 1000
                });
                $(e.currentTarget).parent().parent().parent().remove()

            },
            error: function(error){
                noty({
                    text: "Error Deleting Special",
                    layout: 'center',
                    timeout: 1000
                });
            }
        });
    },

    editEstablishment: function(ev) {
        ev.preventDefault();
        $.ajax({
            type: 'PUT',
            url: api_host+'/api/v1/establishments/' + store.get('establishment_id') + '.json',
            dataType: 'json',
            data: {
                name: $('#name').val(),
                address_1: $('#address').val(),
                address_2: '',
                city: $('#city').val(),
                state: $('#state').val(),
                zipcode: $('#zipcode').val(),
                phone: $('#phone').val(),
                website: $('#website').val(),
                facebook_url: $('#facebook_url').val(),
                twitter_url: $('#twitter_url').val(),
                youtube_url: $('#youtube_url').val(),
                description: $('#description').val(),
            },
            success: function(data) {
                console.log(data);
                noty({
                    text: "Update Saved",
                    layout: 'center',
                    timeout: 1000
                });
            },
            error: function(data) {
                console.error(data);
                noty({
                    text: "Error: Changes Not Saved",
                    layout: 'center',
                    timeout: 1000
                });
            }
        });
    },

    resetSpecialForm: function(){
        $("#add-special-title").val("");
        $("#add-special-description").val("");
        $("#add-special-start-datetime").val("");
        $("#add-special-end-datetime").val("");
        $("#special-form").html("Add");
        $("#special-add-btn").html("Add Special");
        $("#recurrence").val("One-Time");
    },

    editCategory: function(ev){
        console.log(ev.currentTarget.id);
        $.ajax({
            type: 'POST',
            url: api_host+'/api/v1/establishments/'+store.get("establishment_id")+'/category.json',
            dataType: 'json',
            data: {
                'token': store.get('token'),
                'category_id': ev.currentTarget.id
            },
            success: function(data){
                if(data.checked){
                    noty({
                        text: "Category Added",
                        layout: 'center',
                        timeout: 1000
                    });
                }
                else{
                    noty({
                        text: "Category Removed",
                        layout: 'center',
                        timeout: 1000
                    });
                }
            },
            error: function(xhr, status, error) {
                console.log(error);
                noty({
                        text: "Error: Unable to save changes.",
                        layout: 'center',
                        timeout: 5000
                      });
            }
        });
    },

    getData: function(){
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
                	console.log(data.establishments[i]);
                	$("#favorites").append("<li><a class='btn btn-red btn-block' href='#establishments/"+data.establishments[i].establishment.id+"'>"+data.establishments[i].establishment.name+" <span class='glyphicon glyphicon-chevron-right pull-right'></span></a></li>");
                }
            },
            error: function(xhr, status, error) {
                $(".panel-group").hide();
                console.log(error);
            }
        });


        $.ajax({
            type: "GET",
            url: api_host+"/api/v1/establishments/123/mine.json",
            dataType: "json",
            data:{
                'token': store.get('token')
            },
            success: function(data) {
                if (data.establishment === null){
                    $(".panel-group").hide();
                }
                else{
                    $('#event-datepicker').datetimepicker();
                    $('#special-datepicker').datetimepicker({
                        pickTime: false
                    });
                    $('#special-datepicker').on("dp.hide", function(e){
                        e.preventDefault();
                        $('input', e.target).val( moment(e.date).format("MM/DD/YY dddd") );
                    });
                    $('#event-datepicker').on("dp.change", function(e){
                        e.preventDefault();
                        $('input', e.target).val( moment(e.date).format("MM/DD/YYYY ddd h:mm A") );
                    });
                    
                    if (data[0] != null) //we have an establishment
                    {
                        store.set("establishment_id", data[0].id);
                        $("#name").val(data[0].name);
                        $("#address").val(data[0].address_1);
                        $("#city").val(data[0].city);
                        //select the state dropdown option
                        var dd = $("#state")[0]
                        for (var i = 0; i < dd.options.length; i++) {
                            if (dd.options[i].text === data[0].state.toUpperCase()) {
                                dd.selectedIndex = i;
                                break;
                            }
                        }
                        $("#zipcode").val(data[0].zipcode);
                        $("#phone").val(data[0].phone);
                        $("#website").val(data[0].website);
                        $("#facebook_url").val(data[0].facebook_url);
                        $("#twitter_url").val(data[0].twitter_url);
                        $("#youtube_url").val(data[0].youtube_url);
                        $("#featured_text").val(data[0].featured_text);

                        //show specials
                        for(var i = 0; i < data[0].specials.length; i++){
                            console.log(data[0].specials[i]);
                            var title = moment(data[0].specials[i].start_date).format("MM/DD/YY dddd") + ' ' +
                            data[0].specials[i].special.description;
                            $("#specials").append("<li id='special-"+data[0].specials[i].special.id+"'><div class='col-xs-12'><span class='title'>"+ title +"</span><div class='pull-right'><a href='#' id='edit-special-"+data[0].specials[i].special.id+"' class='btn btn-red edit-btn'><span class='glyphicon glyphicon-pencil'></span></a> <a href='#' id='delete-special-"+data[0].specials[i].special.id+"' class='btn btn-red special-delete'><span class='glyphicon glyphicon-trash'></span></a><div></div></li>");
                        }
                        //show events
                        for(var i = 0; i < data[0].events.length; i++){
                            console.log(data[0].events[i]);
                            var title = moment(data[0].events[i].event.start_date).format("MM/DD/YY ddd h:mm A") + ' ' + data[0].events[i].event.description;
                            $("#events").append("<li id='event-"+data[0].events[i].event.id+"'><div class='col-xs-12'><span class='title'>"+ title +"</span><div class='pull-right'><a href='#' id='edit-event-"+data[0].events[i].event.id+"' class='btn btn-red edit-btn'><span class='glyphicon glyphicon-pencil'></span></a> <a href='#' id='delete-event-"+data[0].events[i].event.id+"' class='btn btn-red event-delete'><span class='glyphicon glyphicon-trash'></span></a></div></div></li>");
                        }
                        //show categories
                        $.ajax({
                            type: "GET",
                            url: api_host+"/api/v1/categories.json",
                            dataType: "json",
                            data:{
                                'token': store.get('token')
                            },
                            success:function(data2){
                                var categories = data2["categories"];
                                for(var j = 0; j < categories.length; j++)
                                {
                                    //check to see if the category needs to be checked
                                    var checked = false;
                                    //console.log(data[0].establishment_categories);
                                    for(var i = 0; i < data[0].establishment_categories.length; i++){
                                        console.log(data[0].establishment_categories[i].establishment_category.id === categories[j].id);
                                        if (data[0].establishment_categories[i].establishment_category.id === categories[j].id){
                                            checked = true;
                                            break;
                                        }
                                    }
                                    if(checked){
                                        $("#categories").append("<li><input class='category-checkbox checked' checked type='checkbox' id='"+ categories[j].id +"'> "+ categories[j].title +"</li>");
                                    }
                                    else{
                                        $("#categories").append("<li><input class='category-checkbox' type='checkbox' id='"+ categories[j].id +"'> "+ categories[j].title +"</li>");
                                    }
                                }
                            },
                            error: function(){
                                noty({
                                    text: "Error: Unable to contact server to get categories. Please check your network connection.",
                                    layout: 'center',
                                    timeout: 5000
                                  });
                            }
                        });
                    }
                }
            },
            error: function(xhr, status, error) {
                console.log(error);
                noty({
                        text: "Error: Unable to contact server. Please check your network connection.",
                        layout: 'center',
                        timeout: 5000
                      });
                $(".panel-group").hide();
            }
        });
    },

    submitEvent: function(ev){
        ev.preventDefault();
        var self = this;
        if ($("#event-form").html() === "Add")
        {
            $.ajax({
                type: 'POST',
                url: api_host+'/api/v1/events.json',
                dataType: 'json',
                data: {
                    'token': store.get('token'),
                    "title": $("#add-events-title").val(),
                    "description": $("#add-events-description").val(),
                    "price": $("#add-events-price").val(),
                    "start_time": $("#add-events-start-datetime").val(),
                    "end_time": $("#add-events-end-datetime").val(),
                    "establishment_id": store.get("establishment_id")
                },
                success: function(data){
                    console.log(data);
                    $("#events").append("<li><div class='col-xs-12'>"+ $("#add-events-title").val() +"<div class='pull-right'><a href='#' id='edit-event-"+data.event.id+"' class='btn btn-red edit-btn'><span class='glyphicon glyphicon-pencil'></span></a> <a href='#' id='delete-event-"+data.event.id+"' class='btn btn-red event-delete'><span class='glyphicon glyphicon-trash'></span></a><div></div></li>");
                    self.resetEventForm();
                    noty({
                        text: "Event Added",
                        layout: 'center',
                        timeout: 1000
                    });
                },
                error: function(){
                    noty({
                        text: "Error: Unable to add the event.",
                        layout: 'center',
                        timeout: 5000
                      });
                }
            });
        }
        else { //edit existing record
            $.ajax({
                type: 'PUT',
                url: api_host+'/api/v1/events/'+store.get("edit_id")+'.json',
                dataType: 'json',
                data: {
                    'token': store.get('token'),
                    "title": $("#add-events-title").val(),
                    "description": $("#add-events-description").val(),
                    "price": $("#add-events-price").val(),
                    "start_time": $("#add-events-start-datetime").val(),
                    "end_time": $("#add-events-end-datetime").val(),
                    "establishment_id": store.get("establishment_id")
                },
                success: function(data){
                    console.log(data);
                    $('li#event-'+data.event.id+' .title').html(data.event.description);
                    self.resetEventForm();
                    noty({
                        text: "Event Edited",
                        layout: 'center',
                        timeout: 1000
                    });
                },
                error: function(data) {
                    console.log(data);
                    noty({
                        text: "Error: Unable to update the event.",
                        layout: 'center',
                        timeout: 5000
                      });
                }
            });
        }
    },

    resetEventForm: function(){
        $("#add-events-title").val("");
        $("#add-events-description").val("");
        $("#add-events-price").val("");
        $("#add-events-start-datetime").val("");
        $("#add-events-end-datetime").val("");
        $("#event-form").html("Add");
        $("#event-add-btn").html("Add Event");
    },

    deleteEvent: function(e){
        e.preventDefault();
        var self = this;
        var id = e.currentTarget.id.split("-");
        id = id[id.length -1]
        //do delete call
        $.ajax({
            type: 'DELETE',
            url: api_host+'/api/v1/events/' + id + '.json',
            dataType: 'json',
            success: function(data){
                noty({
                    text: "Event Deleted",
                    layout: 'center',
                    timeout: 1000
                });
                $(e.currentTarget).parent().parent().parent().remove()

            },
            error: function(error){
                noty({
                    text: "Error Deleting Event",
                    layout: 'center',
                    timeout: 1000
                });
            }
        });
    },

    logout: function(){
        store.set("token", null);
        $(".float-btn").hide();
        window.location = "#"
    }

});