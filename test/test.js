const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const mocha = require('mocha');


describe('Test Weather', function() {
  before(async function() {
    timeout = 5000;
    let firefox = function() {
      const firefox = require('selenium-webdriver/firefox');
      const options = new firefox.Options();
      options.setPreference('browser.helperApps.neverAsk.saveToDisk', 'application/json application/octet-stream');
      options.setPreference('browser.download.folderList', 2)
      options.setPreference('browser.download.dir', `${__dirname}/temp`);
      options.headless();
      return new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
    }

    let chrome = function() {
      const chrome = require('selenium-webdriver/chrome');
      const options = new chrome.Options();
      options.headless();
      return new Builder().forBrowser('chrome').setChromeOptions(options).build();
    }
    driver = await firefox();
  });
  
  after(function() {
    driver.quit();
  });

  beforeEach(async function() {
    testCity = 'Los Angeles, CA';
    testZipcode = '90210';
    
    let localIndex = __dirname.slice(0, __dirname.lastIndexOf('/')) + '/index.html';
    await driver.get(`file:///${localIndex}`);
    await driver.wait(until.elementLocated(By.css('body')), timeout);
    body = await driver.findElement(By.css('body'));
    dragContainerDay = await body.findElement(By.id('drag-container-day'));
    dragContainerNight = await body.findElement(By.id('drag-container-night'));
    infoMessage = await body.findElement(By.id('info-message'));
    location = await body.findElement(By.id('location'));
    emptyMessage = await body.findElement(By.id('empty-message'));
  });
  
  describe("Test Frontend", function() {
    it("shows 'no location data' message on page load", async function() {
      assert(infoMessage.isDisplayed());
      assert(! await dragContainerDay.isDisplayed());
      assert(! await dragContainerNight.isDisplayed());
      await driver.wait(until.elementTextIs(infoMessage, 'No Location Data'), timeout);
      assert.equal('No Location Data', await infoMessage.getText());
    })
    
    it("shows autocomplete city/state location suggestions", async function() {
      await location.sendKeys(testCity.slice(0,5));
      await driver.wait(until.elementLocated(By.css('.ui-autocomplete')), timeout);
      await driver.wait(until.elementLocated(By.css('.ui-menu-item')), timeout);
      let menuItems = await body.findElements(By.className('ui-menu-item'));
      assert.equal(12, menuItems.length);
      assert.equal(testCity, await menuItems[10].getText());
    })
    
    it("shows autocomplete zipcode location suggestions", async function() {
      await location.sendKeys(testZipcode.slice(0,4));
      await driver.wait(until.elementLocated(By.css('.ui-autocomplete')));
      await driver.wait(until.elementLocated(By.css('.ui-menu-item')));
      let menuItems = await body.findElements(By.className('ui-menu-item'));
      assert.equal(10, menuItems.length);
      assert.equal(testZipcode, await menuItems[4].getText());
    })
    
    it("enters valid location data and presses enter", async function() {
      await location.sendKeys(testCity, Key.ENTER);
      await driver.wait(until.elementIsVisible(dragContainerDay));
      await driver.wait(until.elementIsVisible(dragContainerNight));
      assert(await dragContainerDay.isDisplayed());
      assert(await dragContainerNight.isDisplayed());
      assert(! await infoMessage.isDisplayed());
    })
    
    it("enters valid location data and selects autocomplete suggestion", async function() {
      await location.sendKeys(testCity.slice(0,5));
      await driver.wait(until.elementLocated(By.css('.ui-autocomplete')), timeout);
      await driver.wait(until.elementLocated(By.css('.ui-menu-item')), timeout);
      await location.sendKeys(Key.DOWN, Key.DOWN, Key.ENTER);
      await driver.wait(until.elementIsVisible(dragContainerDay));
      await driver.wait(until.elementIsVisible(dragContainerNight));
      assert(await dragContainerDay.isDisplayed());
      assert(await dragContainerNight.isDisplayed());
      assert(! await infoMessage.isDisplayed());
    })
    
    it("enters invalid location data and presses enter", async function() {
      msg = await emptyMessage.getText();
      assert(msg != 'No results found');
      await location.sendKeys('Invalid Location');
      await driver.wait(until.elementTextIs(emptyMessage, 'No results found'));
      assert(! await dragContainerDay.isDisplayed());
      assert(! await dragContainerNight.isDisplayed());
      assert(await infoMessage.isDisplayed());
      assert.equal('No Forecast Data', await infoMessage.getText());
    })
  });
});
