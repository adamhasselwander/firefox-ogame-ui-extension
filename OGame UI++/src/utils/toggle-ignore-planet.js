var fn = function () {
  'use strict';
  window._toggleIgnorePlanet = function _toggleIgnorePlanet (galaxy, system, position) {
    window.config.ignoredPlanets = window.config.ignoredPlanets || {};
    var key = galaxy + ':' + system + ':' + position;
    var $el = $('#planet_' + galaxy + '_' + system + '_' + position);
    if (window.config.ignoredPlanets[key]) {
      window.config.ignoredPlanets[key] = false;
      $el.removeClass('ignore');
    } else {
      window.config.ignoredPlanets[key] = true;
      $el.addClass('ignore');
    }

    window._saveConfig();
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
