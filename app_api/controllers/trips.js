const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Booking = require('../models/booking'); // Imported to make sure that when deleting a customer already has a booking connected to it
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
const tripsList = async(req, res) => {
    try {
        const trips = await Model.find({}).exec();

        return res.status(200).json(trips);
    } catch (err) {
        return res.status(500).json({
            message: "Can't retrieve trips"
        });
    }
};

// GET: /trips/:tripCode - lists one trip by code
const tripsFindByCode = async(req, res) => {
    try {
        const trips = await Model.find({
            code: req.params.tripCode
        }).exec();

        if (trips.length === 0) {
            return res.status(404).json({
                message: 'Trip not found'
            });
        }
        return res.status(200).json(trips);
    } catch (err) {
        return res.status(500).json({
            message: "Can't retrieve trip"
        });
    }
};

const tripsAddTrip = async(req, res) => {
    try {
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

        const trip = await newTrip.save();
        return res.status(201).json(trip);
    } catch (err) {
        return res.status(400).json({
            message: "Can't create trip"
        });
    }

};

// PUT: /trips/:tripCode - Updates an existing trip
// The response includes an HTTP status code and a JSON message.
const tripsUpdateTrip = async (req, res) => {
  try {
    const updatedTrip = await Model.findOneAndUpdate(
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
        },
        { new: true, runValidators: true }
    ).exec();

    if (!updatedTrip) {
        return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json(updatedTrip);
  } catch (err) {
    if ( err && (err.name === 'ValidationError' || err.name === 'CastError')) {
        return res.status(400).json({ message: 'Invalid trip data'});
    }

    return res.status(500).json({ message: "Can't update trip" });
  }
}

// Delete /api/trips/:tripCode
// Delete a singular trip but only when no customer bookings use it
const tripsDeleteTrip = async (req, res) => {
    try {
        // Find trip using the trip code from URL
        const trip = await Trip.findOne({
            code: req.params.tripCode
        }).exec();

        // If there isn't a matching trip then nothing is deleted
        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found'
            });
        }

        // Check if a booking is connected to this trip
        const bookingExists = await Booking.exists({
            trip: trip._id
        });

        // Don't delete trip if customer booking uses it
        if (bookingExists) {
            return res.status(409).json({
                message: 'Cannot delete a trip if it has a booking'
            });
        }

        // No booking uses the trip so it can be deleted
        await Trip.deleteOne({
            _id: trip._id
        }).exec();

        // 204 signals that the delete worked
        return res.status(204).send();
    } catch (err) {
        // If there is a problem when going into the database
        return res.status(500).json({
            message: 'Cannot delete trip'
        });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
}