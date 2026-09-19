const mongoose = require('mongoose'); // Import mongoose so the file can create a MongoDB schema and model

// Creates the structure for a booking document. A booking would be owned by one customer and keep to one trip package
const bookingSchema = new mongoose.Schema({
    // The customer who owns the booking and stores what customer made the booking
    user: {
        type: mongoose.Schema.Types.ObjectId, // Stores the MongoDB ObjectID of the user
        ref: 'users', // Tells mongoose that this ObjectID connects to the 'users' model
        required: true, // Booking can't be created without a user
        index: true, // Creates an index for the field so MongoDB can find bookings by the user quicker
    },

    trip: {
        // Stores what trip package the customer booked
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trips', // Tells mongoose that this ObjectID connects to the 'trips' model
        required: true,
        index: true,
    },

    // Stores the status of the booking
    status: {
        type: String, // Stored as text
        enum: ['booked'], // Only allows'booked' as a valid status
        default: 'booked', // Defaulted to 'booked' if there is no status
    },

    // Stores the time and date of when the booking was created
    bookedAt: {
        type: Date, // Lets mongoose know that the field has a JavaScript date
        default: Date.now, // Defaulted to the current date and time when booking is created
    },
});

// Create a compund index using the user and trip fields
bookingSchema.index(
    // MongoDB would index user and trips together. 1 means ascendng order
    {user: 1, trip: 1},
    // Make it unique. Prevents same user from booking the same trip twice
    {unique: true}
);

// Create mongoose model using the bookingSchema
const Booking = mongoose.model('bookings', bookingSchema);

// Export the Booking model
module.exports = Booking;