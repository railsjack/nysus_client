formatDate = function(utc_date) {
  var date = moment(utc_date).local();
  var formattedDate = date.format('MM/DD at hh:mm')

  return formattedDate;
}

