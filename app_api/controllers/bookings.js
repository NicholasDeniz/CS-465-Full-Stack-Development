// Import booking model
// This will let the controller read, create, and delete booking documnets
const Booking = require('../models/booking');

// Import trip model
// This will let the controller loop up trips that already exist
const Trip = require('../models/travlr');

// GET /api/bookings
// This function returns the bookings belonging to the customer that is logged in
const ownedBookingsList = async (req, res) => {
    // Use try and cathc for error handling
    try {
        // Search bookings collection
        const bookings = await Booking.find({
            // Only returns bookings if the stored user ID matches Id of the user that is logged in
            // req.auth._id is from the valid JWT
            user: req.auth._id
        })

        // populate('trip') lets mongoose know to use the ID and retrive the trip information
        .populate('trip')

        // Sorts bookings by bookedAt at descending order
        .sort({ bookedAt: -1 })

        .exec();

        // Send bookings to frontend with succesful HTTP
        return res.status(200).json(bookings);

    } catch (err) {
        // Return a server error if something goes wrong in retrieving bookings
        return res.status(500).json({
            message: 'Unable to retrieve bookings'
        });
    }
};

// POST /api/bookings/:tripCode
// The function creates a new booking from the customer that is logged in
const bookingsCreate = async (req, res) => {
    // try and catch so errors can be handled
    try {
        // Look in the trips collection for a trip code that matches the tripCoide in the URL
        const trip = await Trip.findOne({
            // Compare trip codefield to value from URL
            code: req.params.tripCode
        })
        .exec(); // Execute database query

        // If findOne() didn't find a matching trip then the trip will be null
        if (!trip) {
            // Return HTTP 404 since requested trip doesn't exist
            return res.status(404).json({
                message: 'Trip not found'
            });
        }

        // Create a new Booking object
        const booking = new Booking({
            // Store logged in user's ID. Making the booking belong to the customer. Comes from the valid JWT
            user: req.auth._id,
            // Store ID of the found trip. Only store a refrence to the trip
            trip: trip._id,
        });

        // Save the new booking document in MongoDB
        await booking.save();

        // Since the booking.trip has only the trip's ObjectID doing populate('trip') replaces the actualtrip before the response
        await booking.populate('trip');

        // Sendnew booking to the frontend. HTTP 201 means that it was created correctly
        return res.status(201).json(booking);
        
    } catch (err) {
        // MongoDB error code 11000 means a unique index as messed up. A booking model must have user and trip together and be unique, so the user can't book same trip twice
        if (err && err.code === 11000) {
            // HTTP 409 means there is a conflict with existing data
            return res.status(409).json({
                message: 'This trip was already booked'
            });
        }

        return res.status(500).json({
            message: 'Booking was not able to be created'
        });
    }
};

// Delete /api/bookings/id/:bookingId
// This function will cancel a booking beloging to the customer that is logged in
const ownedBookingsCancel = async (req, res) => {

    try {
        // Search for the booking and delete if it matches
        const booking = await Booking.findOneAndDelete({
            // The bookings MongoDB _id has to match the bookingId in the URl
            _id: req.params.bookingId,
            // Booking must belong to a user that is currently logged in
            user: req.auth._id,
        })

        // Execte database operation
        .exec();

        // If there was no booking that matched both conditions then return null
        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        // Complete http request after delete works
        return res.status(204).send()

    } catch (err) {
        // If something else goes wrong when deleting return HTTP 400
        return res.status(400).json({
            message: 'Unable to cancel booking'
        });
    }
};

// Export controller functions
module.exports = {
    ownedBookingsList, ownedBookingsCancel, bookingsCreate,
}
