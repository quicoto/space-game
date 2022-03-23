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

let mainInterval;
let saveGameInterval;

const gauges = {
  fuelCapacity: null,
};

function updateSpeed() {
  if (_.navigation.ingnition) {
    const basicThrusters = _.navigation.thursters.basic;
    const superThrusters = _.navigation.thursters.super * 2;
    const megaThrusters = _.navigation.thursters.mega * 4;

    _.navigation.speed = basicThrusters + superThrusters + megaThrusters;
  } else {
    _.navigation.speed = 0;
  }

  $.navigationSpeed.innerText = _.navigation.speed.toFixed(0);

  $.navigationThurstersBasic.innerText = _.navigation.thursters.basic;
  $.navigationThurstersSuper.innerText = _.navigation.thursters.super;
  $.navigationThurstersMega.innerText = _.navigation.thursters.mega;
}

function updateFuel() {
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

function gameOver() {
  $.progress.hidden = true;
  $.panels.hidden = true;
  $.gameOver.hidden = false;
}

function updateProgress() {
  if (_.navigation.speed === 0) {
    return;
  }

  _.galaxy.explored += _.navigation.speed;

  // setInterval is 10, diving per 100 should give us 1 scond
  _.navigation.distance += +(_.navigation.speed / 100).toFixed(3);

  if (_.galaxy.explored >= _.galaxy.total) {
    _.galaxy.explored = _.galaxy.total;

    clearInterval(mainInterval);
    clearInterval(saveGameInterval);

    gameOver();
  }

  const percentage = ((_.galaxy.explored * 100) / _.galaxy.total).toFixed(0);

  $.navigationDistance.innerText = _.navigation.distance.toFixed(0);
  $.progressValue.innerText = percentage;
  $.progressBar.style.width = `${percentage}%`;
}

function init() {
  loadSavedGame(_);
  setDefaultValues();
  initGauges();
  setEventListeners();
  mainInterval = setInterval(() => {
    updateProgress();
    updateFuel();
    updateSpeed();
    checkUpgrades();
  }, 10);
  saveGameInterval = setInterval(() => {
    saveGame(_);
  }, 60 * 5 * 1000);
  twemoji.parse(document.body);
}

init();
