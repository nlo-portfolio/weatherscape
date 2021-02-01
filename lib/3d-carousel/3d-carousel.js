/*
Code in this script was adopted from (and heavily modified):
https://github.com/HoangTran0410/3DCarousel/blob/master/index.html
*/


/**
 * Modified library for animating the 3d carousel.
 */
function carouselLib() {
  // You can change global variables here:
  let autoRotate = false; // auto rotate or not
  let rotateSpeed = -60; // unit: seconds/360 degrees
 
  
  // ===================== start =======================
  // animation start after 1000 miliseconds

  let odragDay = document.getElementById('drag-container-day');
  let ospinDay = document.getElementById('spin-container-day');
  let odragNight = document.getElementById('drag-container-night');
  let ospinNight = document.getElementById('spin-container-night');
  let odragText = document.getElementById('drag-container-text');
  let ospinText = document.getElementById('spin-container-text');

  let dEle = ospinDay.getElementsByTagName('img');
  let nEle = ospinNight.getElementsByTagName('img');
  let tEle = ospinText.getElementsByTagName('img-text');


  let centerDivPadding = 25;
  let centerDiv = document.getElementById('center-div');
  
  setCenterDivDimensions();
  let radius = centerDiv.clientWidth / 2 - centerDivPadding;
  if((radius >= ospinDay.clientWidth) && ((radius * 2) > window.innerWidth)) {
    radius = ospinDay.clientWidth;
  }
  setOSpinDimensions();

  // Size of ground - depends on radius
  let ground = document.getElementById('ground');
  ground.style.width = radius * 3 + "px";
  ground.style.height = radius * 3 + "px";

  this.startDay = function(delayTime) {
    for (let i = 0; i < dEle.length; i++) {
      //dEle[i].style.animation = 'img-open 1s linear';
      dEle[i].style.transform = "rotateY(" + (i * (360 / dEle.length)) + "deg) translateZ(" + radius + "px)";
      dEle[i].style.transition = "transform 1s";  // Deals images.
      dEle[i].style.transitionDelay = delayTime || (dEle.length - i) / 4 + "s";
      //dEle[i].style.transitionDelay = delayTime || (((dEle.length - i) / 4) + 1) + "s";
    }
  }

  this.startNight = function(delayTime) {
    for (let i = 0; i < nEle.length; i++) {
      //nEle[i].style.animation = 'img-open 1s linear';
      nEle[i].style.transform = "rotateY(" + (i * (360 / dEle.length)) + "deg) translateZ(" + radius + "px)";
      nEle[i].style.transition = "transform 1s";  // Deals images.
      nEle[i].style.transitionDelay = delayTime || (nEle.length - i) / 4 + "s";
      //nEle[i].style.transitionDelay = delayTime || (((nEle.length - i) / 4) + 1) + "s";
    }
  }

  this.startText = function(delayTime) {
    for (let i = 0; i < tEle.length; i++) {
      //tEle[i].style.animation = 'img-open 1s linear';
      tEle[i].style.transform = "rotateY(" + (i * (360 / tEle.length)) + "deg) translateZ(" + radius + "px)";
      tEle[i].style.transition = "transform 1s";  // Deals images.
      tEle[i].style.transitionDelay = delayTime || (tEle.length - i) / 4 + "s";
      //tEle[i].style.transitionDelay = delayTime || (((tEle.length - i) / 4) + 1) + "s";
    }
  }

  this.stopDay = function(delayTime) {
    for (let i = 0; i < dEle.length; i++) {
      dEle[i].style.transform = "rotateY(0deg) translateZ(0px)";
      dEle[i].style.transition = "transform 1s";
      dEle[i].style.transitionDelay = delayTime || (dEle.length - i) / 4 + "s";
      //dEle[i].style.transitionDelay = '0s'; // delayTime || (dEle.length - i) / 4 + "s";
    }
  }
  
  this.stopNight = function(delayTime) {
    for (let i = 0; i < nEle.length; i++) {
      nEle[i].style.transform = "rotateY(0deg) translateZ(0px)";  // Main rotation.
      nEle[i].style.transition = "transform 1s";  // Deals images.
      nEle[i].style.transitionDelay = delayTime || (nEle.length - i) / 4 + "s";
      //nEle[i].style.transitionDelay = '0s'; // delayTime || (nEle.length - i) / 4 + "s";
    }
  }

  this.stopText = function(delayTime) {
    for (let i = 0; i < tEle.length; i++) {
      tEle[i].style.transform = "rotateY(0deg) translateZ(0px)";  // Main rotation.
      tEle[i].style.transition = "transform 1s";  // Deals images.
      tEle[i].style.transitionDelay = delayTime || (tEle.length - i) / 4 + "s";
      //tEle[i].style.transitionDelay = '0s'; // delayTime || (tEle.length - i) / 4 + "s";
    }
  }

  this.applyTransform = function(obj, tX, tY) {
    // Constrain the angle of camera (between 0 and 180)
    if(tY > 180) tY = 180;
    if(tY < 0) tY = 0;

    // Apply the angle
    obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
  }

  this.playSpin = function(yes) {
    ospinDay.style.animationPlayState = (yes?'running':'paused');
    ospinNight.style.animationPlayState = (yes?'running':'paused');
    ospinText.style.animationPlayState = (yes?'running':'paused');
  }
  
  function setOSpinDimensions() {
    if(centerDiv.clientHeight <= centerDiv.clientWidth / 3) {
      radius = centerDiv.clientHeight / 2;
    }
    ospinDay.style.width = radius * 0.75;
    ospinDay.style.height = centerDiv.clientHeight * 0.375;
    ospinNight.style.width = radius * 0.75;
    ospinNight.style.height = centerDiv.clientHeight * 0.375;
    ospinText.style.width = radius * 0.75;
    ospinText.style.height = centerDiv.clientHeight * 0.15;
  }
  
  function setCenterDivDimensions() {
    let locationHeight = document.getElementById('locationRow').clientHeight;
    let updatedHeight = document.getElementById('updated-message').clientHeight;
    let centerDivMaxHeight = (window.innerHeight - locationHeight - updatedHeight);
    if(centerDiv.clientWidth <= centerDivMaxHeight) {
      centerDiv.style.height = centerDiv.clientWidth + 'px';
    } else {
      centerDiv.style.height = (centerDivMaxHeight - 100) + 'px';
    }
  }

  // Auto Spin
  if (autoRotate) {
    let animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
    ospinDay.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
    ospinNight.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
    ospinText.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
  }
  
  /*
   * Handlers for touch movement.
   */
  (() => {
    let cLib = this;
    let sX, sY, nX, nY,
        desX = 0,
        desY = 0,
        tX = 0,
        tY = 10;

    document.getElementById('center-div').onpointerdown = function (e) {
      clearInterval(odragDay.timer);
      clearInterval(odragNight.timer);
      clearInterval(odragText.timer);
      e = e || window.event;
      let sX = e.clientX,
          sY = e.clientY;

      this.onpointermove = function (e) {
        e = e || window.event;
        let nX = e.clientX,
            nY = e.clientY;
        desX = nX - sX;
        desY = nY - sY;
        tX += desX * 0.1;
        tY += desY * 0.1;
        cLib.applyTransform(odragDay, tX, tY);
        cLib.applyTransform(odragNight, tX, tY);
        cLib.applyTransform(odragText, tX, tY);
        sX = nX;
        sY = nY;
      };

      this.onpointerup = function (e) {
        odragDay.timer, odragNight.timer, odragText.timer = setInterval(function () {
          desX *= 0.95;
          desY *= 0.95;
          tX += desX * 0.1;
          tY += desY * 0.1;
          cLib.applyTransform(odragDay, tX, tY);
          cLib.applyTransform(odragNight, tX, tY);
          cLib.applyTransform(odragText, tX, tY);
          cLib.playSpin(false);
          if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
            clearInterval(odragDay.timer);
            clearInterval(odragNight.timer);
            clearInterval(odragText.timer);
            cLib.playSpin(true);
          }
        }, 17);
        this.onpointermove = this.onpointerup = null;
      };

      return false;
    };

    document.getElementById("center-div").onmousewheel = function(e) {
      e = e || window.event;
      let d = e.wheelDelta / 20 || -e.detail;
      radius += d;
      start(1);
    };
  })();
  
  (() => {
    $(window).resize(() => {
    
      setCenterDivDimensions();
      radius = centerDiv.clientWidth / 2 - centerDivPadding;
      if((radius >= ospinDay.clientWidth) && ((radius * 2) > window.innerWidth)) {
        radius = ospinDay.clientWidth;
      }    
      setOSpinDimensions();
        
      for (let i = 0; i < dEle.length; i++) {
        dEle[i].style.transform = 'rotateY(' + (i * (360 / dEle.length)) + 'deg) translateZ(' + radius + 'px)';
        dEle[i].style.transitionDelay = '0s';
      }
      for (let i = 0; i < nEle.length; i++) {
        nEle[i].style.transform = 'rotateY(' + (i * (360 / nEle.length)) + 'deg) translateZ(' + radius + 'px)';
        nEle[i].style.transitionDelay = '0s';
      }
      for (let i = 0; i < tEle.length; i++) {
        tEle[i].style.transform = 'rotateY(' + (i * (360 / tEle.length)) + 'deg) translateZ(' + radius + 'px)';
        tEle[i].style.transitionDelay = '0s';
      }
    });
  })();
};