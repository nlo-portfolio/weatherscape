'use strict';


/**
 * Class to assist with geolocation services.
 * The geodata is contained in a CSV file which is retrieved and parsed.
 */
class GeoData {
  
  constructor() {
    let csv;
    let geoData = geoDataDB;
  
    /**
     * Retrieve coordinates from the geocode CSV data.
     * @param   {String}  text  Query text.
     * @return  {String}        Coordinate values.
     */
    this.getCoordinates = async function(text) {
      try {
        for(let row of geoData) {
          row = row.split(';');
          if (row[0].toLowerCase() === text.toLowerCase())
            return { 'locationName': row[0], 'coordinates': row[1] };
        }
        throw 'Failure retrieving coordinates: Location Not Found.'
      } catch(e) {
        throw 'Geocoding data not loaded in time. Try again after it has downloaded.';
      }
    }
  
    /**
     * Compile a list of matches for autocomplete to use as suggestions.
     * @param   {String}  text  Query text.
     * @return  {Array}         Array containing match results.
     */
    this.parseLocation = function(text) {
      let results = [];
      for (let row of geoData) {
        row = row.split(';');
        if (row[0].split(' ').join('').toLowerCase().includes(text.split(' ').join('').toLowerCase())) {
          results.push(row[0]);
          //let dict = { label: row[0], value: row[1] };
          //results.push(dict)        
        }
        
        if (results.length >= 30)
          break;
      }
      return results;
    }
    
    /**
     * Retrieves the geodata CSV from the server.
     * NOTE: Unecessary if running the webpage locally.
     */
    this.getCSV = function() {
      return $.ajax({
        type: 'GET',
        url: 'data/geoData.csv',
        dataType: 'text'
      }).done(function(data) {
        geoData = data.split('\n');
        return data.split('\n');
      }).fail(function() {
        throw `Failed to retrieve geocode CSV data: ${request.statusText}`;
      });
    };
  }
}