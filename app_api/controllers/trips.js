const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
const tripsList = async(req, res) => {
    const q = await Model
        .find({}) // Return single record
        .exec();

    // Uncomment the following line to show the results of the query on the console
    // console.log(q);

    if (!q) {
        return res.status(404).json(err);
    } else {
        return res.status(200).json(q);
    }
};

// GET: /trips/:tripCode - lists one trip by code
const tripsFindByCode = async(req, res) => {
    const q = await Model
        .find({'code' : req.params.tripCode}) 
        .exec();

    if (!q) {
        return res.status(404).json(err);
    } else {
        return res.status(200).json(q);
    }
};

const tripsAddTrip = async(req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    const q = await newTrip.save();

    if (!q) {
        return res.status(400).json(err);
    } else {
        return res.status(201).json(q);
    }
};

// PUT: /trips/:tripCode - Updates an existing trip
// The response includes an HTTP status code and a JSON message.
const tripsUpdateTrip = async (req, res) => {
  // Uncomment for debugging:
  // console.log(req.params);
  // console.log(req.body);

  const q = await Model.findOneAndUpdate(
    { code: req.params.tripCode },
    {
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description,
    }
  ).exec();

  if (!q) {
    // Database returned no data.
    return res.status(400).json({ message: 'Trip not found' });
  }

  // Return the updated trip.
  return res.status(201).json(q);
};

module.exports = {
  tripsUpdateTrip,
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
}