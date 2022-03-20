import twemoji from 'twemoji';
import $ from './elements';
import _ from './config';
import colors from './colors';

const Gauge = require('svg-gauge');

const gauges = {
  fuelCapacity: null,
};

function updatefuel() {
  if (_.fuel.autoProducer > 0) {
    _.fuel.total += 0.005 * _.fuel.autoProducer;
    $.fuelAutoProducers.innerText = _.fuel.autoProducer;
  }

  if (_.fuel.total >= _.fuel.capacity) {
    _.fuel.total = _.fuel.capacity;
  }

  $.fuelPercentage.innerText = ((_.fuel.total * 100) / _.fuel.capacity).toFixed(1);
  $.fuelTotal.innerText = _.fuel.total.toFixed(2);
  gauges.fuelCapacity.setValue(_.fuel.total.toFixed(2));
}

function setEventListeners() {
  $.fuelProduceButton.addEventListener('click', () => { _.fuel.total += 1; updatefuel(); });
  $.fuelAutoProducersAddButton.addEventListener('click', () => { _.fuel.autoProducer += 1; updatefuel(); });
}

function checkUpgrades() {
  // FUEL
  if (_.fuel.total >= _.fuel.autoProducerUnlock) {
    $.fuelAutoProducersAddButton.hidden = false;
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
  setDefaultValues();
  initGauges();
  setEventListeners();
  setInterval(() => {
    updatefuel();
    checkUpgrades();
  }, 10);
  twemoji.parse(document.body);
}

init();
