const Service = require('../models/Service');

// GET: List all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST: Add a new service
const addService = async (req, res) => {
  const { name, description, price, isAddon } = req.body;
  try {
    const newService = new Service({ name, description, price, isAddon });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getServices, addService };

