'use strict';


/**
 * Class used to retrieve data from the National Weather Service API.
 */
class NWSAPI {
  
  constructor() {
    let dailyForecast;
    let gridId;
    let gridX;
    let gridY;
    let nwsapi;
    nwsapi = this;
  
    /**
     * Get gridId for the provided coordinates.
     * @param   {String}   coordinates  Format: "<latitude>,<longitude>".
     * @param   {Integer}  retry        Connection retry count.
     * @return  {Promise}
     */
    this.getGridData = function(coordinates, retry = 3) {
      let [latitude, longitude] = coordinates.split(',');
    
      return $.ajax({
        type: 'GET',
        url: `https://api.weather.gov/points/${latitude},${longitude}`
      }).done(function(data) {
        dailyForecast = data.properties.forecast;
        gridId = data['properties']['gridId'];
        gridX = data['properties']['gridX'];
        gridY = data['properties']['gridY'];
      }).fail(function(data) {
        console.log('AJAX Error');
        dailyForecast = undefined;
        gridId, gridX, gridY = undefined;
        
        if(retry > 0) {
          nwsapi.getGridData(coordinates, retry--);
        } else {
          throw `Failed to retrieve grid data: ${data.statusText}`;
        }
      });
    }
  
    /**
     * Retrieve the forecast data.
     * @param  {String}   forecast  Location specific URL for forecast data.
     * @param  {Integer}  retry     Connection retry count.
     */
    this.getForecast = function(forecast = dailyForecast, retry = 3) {
      return $.ajax({
        type: 'GET',
        url: forecast
      }).fail(function(data) {
        if(data.responseJSON) {
          console.log(`There was an error retrieving the localized weather data.\n
                       Reason: `+data.responseJSON.title+`\n`+`
                       Details: `+data.responseJSON.detail);
        } else {
          throw `Unknown network error.`;
        }
        
        if(retry > 0) {
          nwsapi.getForecast(forecast, retry--);
        } else {
          throw `Failed to retrieve forecast: ${JSON.stringify(data.responseJSON, null, 2)}`;
        }
      });
    }
  }
}