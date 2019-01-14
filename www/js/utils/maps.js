Nysus.Utils.maps = (function() {
  var storeEstablishmentsGeoData = function(data) {
        var geo_data = _.map(data.models, function(establishment){
            establishment_coordinates = {};
            establishment_coordinates['latitude'] = establishment.attributes.latitude;
            establishment_coordinates['longitude'] = establishment.attributes.longitude;
            establishment_coordinates['name'] = establishment.attributes.name;

            return establishment_coordinates;
        });

        store.set('establishments_list_map-coordinates', geo_data);
    }

  var currentPosition = function() {
    navigator.geolocation.getCurrentPosition(function(position){
        store.set('latitude', position.coords.latitude);
        store.set('longitude', position.coords.longitude);

        var crd = pos.coords;

        console.log('Your current position is:');
        console.log('Latitude : ' + crd.latitude);
        console.log('Longitude: ' + crd.longitude);
        console.log('More or less ' + crd.accuracy + ' meters.');
        return position;
    }, function() {
      alert('error fetching location')
    });
  }
});