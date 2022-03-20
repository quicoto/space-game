import twemoji from 'twemoji';
import $ from './elements';
import _ from './config';
import colors from './colors';

const Gauge = require('svg-gauge');

const projectKey = 'space-game';
const gauges = {
  fuelCapacity: null,
};

function loadSavedGame() {
  const savedGame = localStorage.getItem(`${projectKey}save`);

  if (savedGame) {
    Object.assign(_, JSON.parse(savedGame));
  }
}

function saveGame() {
  localStorage.setItem(`${projectKey}save`, JSON.stringify(_));

  $.saveGame.innerText = 'Game Saved!';

  setTimeout(() => {
    $.saveGame.innerText = 'Save';
  }, 5000);
}

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
  }

  $.fuelAutoProducers.innerText = _.fuel.autoProducer;

  if (_.fuel.total >= _.fuel.capacity) {
    _.fuel.total = _.fuel.capacity;
  }

  if (_.fuel.total <= 0) {
    _.fuel.total = 0;
    _.navigation.ingnition = false;
    $.navigationIngnition.checked = false;
  }

  $.fuelPercentage.innerText = ((_.fuel.total * 100) / _.fuel.capacity).toFixed(1);
  $.fuelTotal.innerText = _.fuel.total.toFixed(2);
  gauges.fuelCapacity.setValue(_.fuel.total.toFixed(2));
}

function setEventListeners() {
  $.navigationIngnition.addEventListener('change', () => {
    // Can't start engine if no fuel
    if (_.fuel.total <= 0) {
      $.navigationIngnition.checked = false;
    }

    _.navigation.ingnition = $.navigationIngnition.checked;
  });

  $.fuelProduceButton.addEventListener('click', () => { _.fuel.total += 1; });
  $.fuelAutoProducersAdd.addEventListener('click', () => { _.fuel.autoProducer += 1; });
  $.fuelAutoProducersRemove.addEventListener('click', () => {
    if (_.fuel.autoProducer > 0) {
      _.fuel.autoProducer -= 1;
    }
  });

  $.saveGame.addEventListener('click', saveGame);
}

function checkUpgrades() {
  // FUEL
  if (_.fuel.total >= _.fuel.autoProducerUnlock) {
    $.fuelAutoProducersAdd.hidden = false;
    $.fuelAutoProducersRemove.hidden = false;
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
  loadSavedGame();
  setDefaultValues();
  initGauges();
  setEventListeners();
  setInterval(() => {
    updatefuel();
    updateSpeed();
    checkUpgrades();
  }, 10);
  setInterval(() => {
    saveGame();
  }, 60 * 5 * 1000);
  twemoji.parse(document.body);
}

init();
