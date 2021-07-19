// inject libs
var libs = [
  'lib/chartist.min.js',
  'lib/dom-to-image.min.js'
];
libs.forEach(function (path) {
  var lib = document.createElement('script');
  lib.src = browser.extension.getURL(path);
  (document.head || document.documentElement).appendChild(lib);
  lib.parentNode.removeChild(lib);
});

// add image url object
var uipp_images = {
  inflight: browser.extension.getURL('img/fleet-inflight.gif'),
  stay: browser.extension.getURL('img/mission-stay.jpg'),
  ship: browser.extension.getURL('img/mission-ship.jpg'),
  datetime: browser.extension.getURL('img/datetime.png'),
  expedition: browser.extension.getURL('img/expedition.png'),
  marketcollect: browser.extension.getURL('img/marketcollect.png'),
  yield: browser.extension.getURL('img/yield.png'),
  item: browser.extension.getURL('img/item.png'),
  metal: browser.extension.getURL('img/mine-metal.png'),
  crystal: browser.extension.getURL('img/mine-crystal.png'),
  deuterium: browser.extension.getURL('img/mine-deuterium.png'),
  astrophysics: browser.extension.getURL('img/tech-astro.png'),
  plasma: browser.extension.getURL('img/tech-plasma.png'),
  features: {
    alliance: browser.extension.getURL('img/features/alliance.png'),
    charts: browser.extension.getURL('img/features/charts.png'),
    deploytransport: browser.extension.getURL('img/features/deploytransport.png'),
    expeditionpoints: browser.extension.getURL('img/features/expeditionpoints.png'),
    expeditiontab: browser.extension.getURL('img/features/expeditiontab.png'),
    galaxy: browser.extension.getURL('img/features/galaxy.png'),
    galaxydebris: browser.extension.getURL('img/features/galaxydebris.png'),
    markethelper: browser.extension.getURL('img/features/markethelper.png'),
    minetext: browser.extension.getURL('img/features/minetext.png'),
    missingresources: browser.extension.getURL('img/features/missingresources.png'),
    nextbuilds: browser.extension.getURL('img/features/nextbuilds.png'),
    solarsat: browser.extension.getURL('img/features/solarsat.png'),
    ship: browser.extension.getURL('img/features/ship.png'),
    shipresources: browser.extension.getURL('img/features/shipresources.png'),
    stats: browser.extension.getURL('img/features/stats.png'),
    storagetime: browser.extension.getURL('img/features/storagetime.png'),
    topeco: browser.extension.getURL('img/features/topeco.png'),
    topfleet: browser.extension.getURL('img/features/topfleet.png'),
    topgeneral: browser.extension.getURL('img/features/topgeneral.png'),
    topresearch: browser.extension.getURL('img/features/topresearch.png')
  },
  resources: {
    am: browser.extension.getURL('img/resources/am.png'),
    metal: browser.extension.getURL('img/resources/metal.png'),
    crystal: browser.extension.getURL('img/resources/crystal.png'),
    deuterium: browser.extension.getURL('img/resources/deuterium.png')
  },
  ships: {
    202: browser.extension.getURL('img/ships/202.jpg'),
    203: browser.extension.getURL('img/ships/203.jpg'),
    204: browser.extension.getURL('img/ships/204.jpg'),
    205: browser.extension.getURL('img/ships/205.jpg'),
    206: browser.extension.getURL('img/ships/206.jpg'),
    207: browser.extension.getURL('img/ships/207.jpg'),
    208: browser.extension.getURL('img/ships/208.jpg'),
    209: browser.extension.getURL('img/ships/209.jpg'),
    210: browser.extension.getURL('img/ships/210.jpg'),
    211: browser.extension.getURL('img/ships/211.jpg'),
    212: browser.extension.getURL('img/ships/212.jpg'),
    213: browser.extension.getURL('img/ships/213.jpg'),
    214: browser.extension.getURL('img/ships/214.jpg'),
    215: browser.extension.getURL('img/ships/215.jpg'),
    217: browser.extension.getURL('img/ships/217.jpg'),
    218: browser.extension.getURL('img/ships/218.jpg'),
    219: browser.extension.getURL('img/ships/219.jpg')
  },
  score: {
  	global: browser.extension.getURL('img/score-global.png'),
  	economy: browser.extension.getURL('img/score-economy.png'),
  	research: browser.extension.getURL('img/score-research.png'),
  	military: browser.extension.getURL('img/score-military.png'),
  	fleet: browser.extension.getURL('img/score-fleet.png')
  }
};
var imgScript = document.createElement('script');
imgScript.innerHTML = 'var uipp_images = ' + JSON.stringify(uipp_images) + ';';
(document.head || document.documentElement).appendChild(imgScript);
imgScript.parentNode.removeChild(imgScript);

// inject main script
var userscript = function () {
  'use strict';

  // window.config default values
  window.config = window._getConfig();
  window._setConfigTradeRate();
  window._setConfigMyPlanets();
  window._parseResearchTab();

  window.config.features = window.config.features || {};
  var defaultFeatures = {
    alliance: true,
    charts: true,
    deploytransport: true,
    expeditionpoints: true,
    expeditiontab: true,
    galaxy: true,
    galaxydebris: true,
    minetext: true,
    missingresources: true,
    nextbuilds: true,
    ship: true,
    shipresources: true,
    solarsat: true,
    stats: true,
    storagetime: true,
    markethelper: true,
    topeco: true,
    topfleet: true,
    topgeneral: true,
    topresearch: true
  };
  for (var featureKey in defaultFeatures) {
    if (typeof window.config.features[featureKey] !== 'boolean') {
      window.config.features[featureKey] = defaultFeatures[featureKey];
    }
  }

  var features = window.config.features;

  // Add tabs in the left menu
  if (features.alliance) {
    window._addTabAlliance();
  }

  if (features.stats || features.charts || features.nextbuilds) {
    window._addTabStats();
  }

  if (features.topeco || features.topfleet || features.topgeneral || features.topresearch) {
    window._addTabTopflop();
  }

  if (features.expeditiontab) {
    window._addExpeditionMessageParserInterval();
    window._addTabExpeditions();
  }
  
  // Nearby Player
  window._addTabIdlePlayers();
  window._addTabNeighbors();

  window._addTabSettings();
  window._addLinkTabs();

  // Add static helpers
  window._addInprogParser();

  if (features.storagetime) {
    window._addCurrentPlanetStorageHelper();
  }

  if (features.deploytransport) {
    window._addPlanetFleetShortcuts();
  }

  // Add interval checkers
  if (features.galaxy) {
    window._addGalaxyPlayersPlanetsInterval();
  }

  if (features.galaxydebris) {
    window._addGalaxyDebrisInterval();
  }

  if (features.minetext || features.missingresources) {
    window._addCostsHelperInterval();
  }

  if (features.ship) {
    window._addShipHelperInterval();
  }

  if (features.shipresources) {
    window._addShipResourcesHelperInterval();
  }

  if (features.expeditionpoints) {
    window._addExpeditionHelperInterval();
  }

  if (features.solarsat) {
    window._addSolarSatHelperInterval();
  }

  window._addPlanetsNotes();
  if (features.markethelper) {
    window._addMarketHelper();
  }

  // Refresh universe data (config.players)
  window._refreshUniverseData();

  // Add historical point logger
  window._logHistoryData();

};

// inject user script into the document
var script = document.createElement('script');
script.textContent = '(' + userscript + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
