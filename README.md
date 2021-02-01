![WeatherScape](https://raw.githubusercontent.com/nlo-portfolio/nlo-portfolio.github.io/master/style/images/programs/weatherscape.png "WeatherScape")

## Description ##

WeatherScape is a webapp that retrieves meteorological data from the National Weather Service and displays a seven-day forecast in a 3D carousel.
<br><br>
[LIVE DEMO AVAILABLE](https://nlo-portfolio.github.io/weatherscape "WeatherScape Demo")

## Dependencies ##

None. Can be opened locally in a web browser (weatherscape/index.html).<br>
Testing requires Selenium WebDriver and Node.js. Tests can be run using the provided docker-compose file.<br>
<br>
Browsers: Tested in Firefox v89+, Chromium v91+.

## Usage ##

Open index.html in the project root folder and enter a location (city/state or zipcode) in the search box. Select one of the locations and the carousel will load on successfully retrieving data.<br>
<br>
Docker:

```
docker-compose build
docker-compose run test
```
