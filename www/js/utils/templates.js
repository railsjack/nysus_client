Nysus.Utils.templates = (function() {
    var load = function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (Nysus.Views[view]) {
                deferreds.push($.get('tpl/' + view + '.html?_=9', function(data) {
                    Nysus.Views[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

    // The public API
    return {
        load: load
    };

}());