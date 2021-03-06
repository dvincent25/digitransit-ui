function clickSouthOfCurrentLocation() {
  this.api.pause(500);
  this.api.element('class name', 'current-location-marker', (result) => {
    this.api.moveTo(result.value.ELEMENT, 20, 70); // 50 px south of current position
  });
  this.api.pause(100);
  this.api.mouseButtonClick();
  this.api.pause(5000);
}

function waitForPopupPaneVisible() {
  return this.waitForElementVisible('@popupPane',
                                    this.api.globals.itinerarySearchTimeout);
}

module.exports = {
  commands: [{
    clickSouthOfCurrentLocation,
    waitForPopupPaneVisible,
  }],
  elements: {
    currentLocationMarker: {
      selector: '.current-location-marker',
    },
    popupPane: {
      selector: '.leaflet-pane .leaflet-popup-pane',
    },
  },
};
