'use strict';


/**
 *  WeatherScape is a front-end visualization app for weather data provided by the
 *  National Weather Service and presents a seven day forecast in a 3D carousel.
 */
$(document).ready(function() {


  /** Setup page and script */
  
  let interval;
  let location = $('#location');
  let carousel = new Carousel();
  let nwsAPI = new NWSAPI();
  let geoData = new GeoData();
  

  /** Functions */
  
  /**
   * Promisified delay.
   * @param   {int}     t  Time in milliseconds to delay.
   * @param   {v}       v
   * @return  {Promise}
   */
  function delay(t, v) {
    return new Promise(function(resolve) { 
      setTimeout(resolve.bind(null, v), t)
    });
  }
  
  /*
   * Formats a Date object.
   * @param   {Date}    date  Date object to format.
   * @return  {String}        String representation of Date object.
   */
  function formatDate(date) {
    let dateFormat = date.toLocaleString(
      'en-US', ({
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    )
    let timeFormat = date.toLocaleString(
      'en-US', ({
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZoneName: 'short'
      })
    )
    return dateFormat + ' @ ' + timeFormat;
  }
  
  /**
   * Retrieves a forecast with no coordinates loaded and updates the carousel.
   * @param  {string}  text  Validated input.
   */
  function load(text) {
    let locationName;
    carousel.stop()
    .then(() => carousel.showProcessing())
    .then(() => geoData.getCoordinates(text))
    .then(data => { locationName = data['locationName']; return nwsAPI.getGridData(data['coordinates']); })
    .then(gridData => nwsAPI.getForecast(gridData.properties.forecast))
    .then(forecast => { carousel.update(forecast.properties.periods); })
    .then(() => { return delay(3000).then(function() {
                                            carousel.hideProcessing();
                                            location.val(locationName);
                                            let updatedAt = `Updated: ${formatDate(new Date())}`
                                            $('#updated-message').text(updatedAt);
                                            return carousel.start();
                                          })
    
    })
    .catch(error => { carousel.hideProcessing();
                      carousel.hide('No Forecast Data');
                      $("#empty-message").text("No results found");
                      console.log(error); 
    });
  }
  
  /**
   * Retrieves a forecast with coordinates already loaded and updates the carousels.
   */
  function update() {
    carousel.stop()
    .then(() => nwsAPI.getForecast())
    .then(forecast => carousel.update(forecast.properties.periods))
    .then(() => { return delay(3000).then(function() {
                    return carousel.start();
                  })
    })
    .catch(error => { console.log(error); carousel.hide(); });
  }

  /**
   * On page reload, try to retrieve forecast data if a valid location is already entered.
   */
  function loadRefresh() {
    setTimeout( function() {
      if (location.val()) {
        load(location.val());
      } else {
        carousel.hide();
      }
    }, 500);
  }
  
  
  /** Events */
  
  /**
   * Ensure geocode data is loaded before auto-querying on page reloads.
   */
  //$.when(geoData.getCSV()).then(loadRefresh);  // Leave for fetching from server.
  loadRefresh();  // Leave for running locally.
  
  /**
   * Set the update interval.
   */
  let hours = 6;
  setInterval(update, 60 * 1000 * 60 * hours);
  
  /**
   * Query geoData for auto-complete suggestions on keypress.
   */
  location.on('input keypress', function(e) {
    if (e.which == 13) {
      load(location.val());
    } else {
      location.autocomplete({
        source: geoData.parseLocation(location.val()).sort(),
        delay: 2,
        minLength: 2,
        select: function(event, ui) {
                  event.preventDefault();
                  location.val(ui.item.label);
                  load(ui.item.value);
        },
        focus: function(event, ui) {
          event.preventDefault();
        },
        response: function(event, ui) {
          // ui.content is the array that's about to be sent to the response callback.
          if (ui.content.length == 0) {
            $("#empty-message").text("No results found");
          } else {
            $("#empty-message").empty();
          }
        }
      });
    }
  });
});
