import { Trip } from './trip';

// Booking connects a customer that is logged in to a trip
export interface Booking {
    // MongoID for the bookig
    _id: string;

    // MongoDB ID for the customer who owns the booking
    user: string;

    // API populates the reference before returning the booking
    trip: Trip;

    // Active status
    status: 'booked';

    // Date string of when the booking was created
    bookedAt: string;
}