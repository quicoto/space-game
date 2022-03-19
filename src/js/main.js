const $ = {};
const _ = {
  fuel: {
    autoProducerUnlock: 5,
    autoProducer: 0,
    total: 0,
  },
};

function setElements() {
  // FUEL
  $.fuelProduceButton = document.getElementById('fuel-produce');
  $.fuelAutoProducers = document.getElementById('fuel-auto-producers');
  $.fuelAutoProducersWrapper = document.getElementById('fuel-auto-producers-wrapper');
  $.fuelTotal = document.getElementById('fuel-total');
  $.fuelAutoProducersAddButton = document.getElementById('fuel-auto-producers-add');
}

function updatefuel() {
  if (_.fuel.autoProducer > 0) {
    _.fuel.total += 0.01 * _.fuel.autoProducer;

    $.fuelAutoProducers.innerText = _.fuel.autoProducer;
  }

  $.fuelTotal.innerText = _.fuel.total.toFixed(0);
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

function init() {
  setElements();
  setEventListeners();
  setInterval(() => {
    updatefuel();
    checkUpgrades();
  }, 10);
}

init();
