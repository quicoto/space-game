const _ = {
  galaxy: {
    explored: 0,
    total: 1000000000, // kilometers
  },
  navigation: {
    thursters: {
      basic: 1,
      basicCost: 10,
      super: 0,
      mega: 0,
    },
    travelled: 0,
    ingnition: false,
    consumption: 0.010,
    speed: 0,
  },
  fuel: {
    autoProducer: 0,
    autoProducerCost: 5,
    baseProduction: 0.005,
    capacity: 10,
    total: 0,
  },
  upgrades: {
    autoProducers: 50,
    thrusters: 120,
    fuelTanks: 200,
  },
};

export default _;
