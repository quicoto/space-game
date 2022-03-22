import twemoji from 'twemoji';
import $ from './elements';
import _ from './config';
import colors from './colors';
import {
  costCalculator,
  loadSavedGame,
  saveGame,
  resetGame,
} from './utils';

const Gauge = require('svg-gauge');

const gauges = {
  fuelCapacity: null,
};

function updateSpeed() {
  if (_.navigation.ingnition) {
    _.navigation.speed = 1;
  } else {
    _.navigation.speed = 0;
  }

  $.navigationSpeed.innerText = _.navigation.speed.toFixed(0);
}

function updatefuel() {
  if (_.navigation.ingnition) {
    _.fuel.total -= _.navigation.consumption;
  }

  if (_.fuel.autoProducer > 0) {
    _.fuel.total += _.fuel.baseProduction * _.fuel.autoProducer;
    $.fuelAutoProducersRemove.disabled = false;
  } else {
    $.fuelAutoProducersRemove.disabled = true;
  }

  if (_.fuel.total >= _.fuel.autoProducerCost) {
    $.fuelAutoProducersAdd.disabled = false;
  } else {
    $.fuelAutoProducersAdd.disabled = true;
  }

  if (_.fuel.total >= _.fuel.capacity) {
    _.fuel.total = _.fuel.capacity;
  }

  if (_.fuel.total <= 0) {
    _.fuel.total = 0;
    _.navigation.ingnition = false;
    $.navigationIngnition.checked = false;
  }

  $.fuelAutoProducers.innerText = _.fuel.autoProducer;
  $.fuelAutoProducersCost.innerText = _.fuel.autoProducerCost;
  $.fuelPercentage.innerText = ((_.fuel.total * 100) / _.fuel.capacity).toFixed(1);
  $.fuelTotal.innerText = _.fuel.total.toFixed(2);
  gauges.fuelCapacity.setValue(_.fuel.total.toFixed(2));
}

function toggleCapitansLog() {
  $.captainsLog.hidden = !$.captainsLog.hidden;
  $.panels.hidden = !$.panels.hidden;
}

function addAutoProducer() {
  _.fuel.autoProducer += 1;
  _.fuel.total -= _.fuel.autoProducerCost;
  _.fuel.autoProducerCost = costCalculator(_.fuel.autoProducer);
}

function removeAutoProducer() {
  _.fuel.autoProducer -= 1;
  _.fuel.autoProducerCost = costCalculator(_.fuel.autoProducer);
  _.fuel.total += _.fuel.autoProducerCost;
}

function setEventListeners() {
  $.captainsLogClose.addEventListener('click', toggleCapitansLog);
  $.version.addEventListener('click', (domEvent) => {
    domEvent.preventDefault();
    toggleCapitansLog();
  });
  $.navigationIngnition.addEventListener('change', () => {
    // Can't start engine if no fuel
    if (_.fuel.total <= 0) {
      $.navigationIngnition.checked = false;
    }

    _.navigation.ingnition = $.navigationIngnition.checked;
  });

  $.fuelProduceButton.addEventListener('click', () => { _.fuel.total += 1; });
  $.fuelAutoProducersAdd.addEventListener('click', addAutoProducer);
  $.fuelAutoProducersRemove.addEventListener('click', removeAutoProducer);

  $.saveGame.addEventListener('click', () => {
    saveGame(_);
  });
  $.resetGame.addEventListener('click', resetGame);
}

function checkUpgrades() {
  // FUEL
  if (_.fuel.total >= _.fuel.autoProducerUnlock) {
    $.fuelAutoProducersWrapper.hidden = false;
  }
}

function setDefaultValues() {
  $.fuelCapacity.innerText = _.fuel.capacity;
}

function initGauges() {
  gauges.fuelCapacity = Gauge($.fuelCapacityGauge, {
    dialEndAngle: 0,
    dialStartAngle: 180,
    max: _.fuel.capacity,
    min: 0,
    showValue: false,
    value: 0,
    color(value) {
      const percentage = (value * 100) / _.fuel.capacity;

      if (percentage <= 30) {
        return colors.red;
      }

      if (percentage <= 65) {
        return colors.yellow;
      }

      if (percentage <= 100) {
        return colors.green;
      }

      return colors.red;
    },
  });
}

function init() {
  loadSavedGame(_);
  setDefaultValues();
  initGauges();
  setEventListeners();
  setInterval(() => {
    updatefuel();
    updateSpeed();
    checkUpgrades();
  }, 10);
  setInterval(() => {
    saveGame(_);
  }, 60 * 5 * 1000);
  twemoji.parse(document.body);
}

init();
