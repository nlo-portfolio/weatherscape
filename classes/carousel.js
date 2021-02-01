'use strict';


/**
 * Class used for controlling the carousel animations and data.
 */
class Carousel {
  
  constructor() {
    let interval;
    let dayPanels = $("#spin-container-day img"); // document.getElementById('spin-container-day').getElementsByTagName('img');
    let nightPanels = $("#spin-container-night img"); //document.getElementById('spin-container-night').getElementsByTagName('img');
    let textPanels = $("#spin-container-text img-text"); //document.getElementById('spin-container-text').getElementsByTagName('img');
    let cLib = new carouselLib();
    
    /**
     * Hide the carousels and display a message in the info section.
     * @param  {String}  message  The Message to be displayed after hiding the carousels.
     */
    this.hide = function(message = 'No Location Data') {
      $('.drag-container').hide();
      $('.spin-container').hide();
      $('#ground').show();
      $('#info-message').text(message);
      $('#info-message').removeClass('d-none');
      $('#info-message').addClass('d-flex');
    }
  
    /** 
     * Show the carousels and hide the error message.
     */
    this.show = async function() {
      $('.drag-container').show();
      $('.spin-container').show();
      $('#ground').hide();
      $('#error-message').hide();
      await this.hideProcessing();
    }
  
    /* Show the processing message while retrieving data.
     * @return  {Promise}
     */
    this.showProcessing = async function() {
      let i = 1;
      let s = 'Retrieving Forecast Data';
      interval = setInterval(function() {
        $('#info-message').text(s).append('<br>' + '.'.repeat(i));
        (i < 5) ? i++ : i = 1;
      }, 350);
    }
  
    /**
     * Hide the processing message and clear the interval.
     */
    this.hideProcessing = async function() {
      clearInterval(interval);
      $('#info-message').text('');
      $('#info-message').removeClass('d-flex');
      $('#info-message').addClass('d-none');
    }
  
    /**
     * Start the carousels and trigger the opening animations.
     */
    this.start = async function() {
      this.show();
      cLib.startDay();
      cLib.startNight();
      cLib.startText();
    }
  
    /**
     * Stop the carousels and trigger the closing animations.
     */
    this.stop = async function() {
      cLib.stopDay();
      cLib.stopNight();
      cLib.stopText();
    }
  
  /**
   * Update the carousels with forecast data.
   * @param  {Array}  periods  Array of dictionaries containing the forecast data.
   */
  this.update = function(periods) {
    if (periods[0].isDaytime) {
      let j = 0
      for (let i = 0; i < periods.length - 1; i += 2) {
        dayPanels[j].src = periods[i]['icon'];
        dayPanels[j].alt = periods[i].detailedForecast;
        dayPanels[j].title = periods[i].detailedForecast;
        nightPanels[j].src = periods[i + 1]['icon'];
        nightPanels[j].alt = periods[i + 1].detailedForecast;
        nightPanels[j].title = periods[i + 1].detailedForecast;
        //textPanels[j].innerHTML = periods[i].name.split(' ')[0];
        
        let nameSplit = periods[i].name.split(' ');
        if(nameSplit[0].toLowerCase() == 'this') {
          textPanels[j].innerHTML = nameSplit[1];
        } else {
          textPanels[j].innerHTML = nameSplit[0];
        }
        j++;
      }
    } else {
      let j = 0;
      let firstRun = true;
      for (let i = 0; i < periods.length - 1; i += 2) {
        if (firstRun) {
          dayPanels[j].src = periods[i]['icon'];
          dayPanels[j].alt = periods[i].detailedForecast;
          dayPanels[j].title = periods[i].detailedForecast;
          nightPanels[j].src = periods[i]['icon'];
          nightPanels[j].alt = periods[i].detailedForecast;
          nightPanels[j].title = periods[i].detailedForecast;
          textPanels[j].innerHTML = periods[i].name.split(' ')[0];
          
          firstRun = false;
          
          // Decrement counter to make up for missing element for night queries.
          i = i - 1;
        } else {
          dayPanels[j].src = periods[i]['icon'];
          dayPanels[j].alt = periods[i].detailedForecast;
          dayPanels[j].title = periods[i].detailedForecast;
          nightPanels[j].src = periods[i + 1]['icon'];
          nightPanels[j].alt = periods[i + 1].detailedForecast;
          nightPanels[j].title = periods[i + 1].detailedForecast;
          textPanels[j].innerHTML = periods[i].name.split(' ')[0];
        }
        j++;
      }
    }
    
    }
  }
}
