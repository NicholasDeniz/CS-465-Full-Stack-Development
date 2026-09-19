const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const tripsController = require('../controllers/trips');
const bookingsController = require('../controllers/bookings'); // Controller for owned customer bookings
const authController = require('../controllers/authentication');

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }

    const headers = authHeader.split(' ');

    if (headers.length < 2) {
        console.log('Not enough tokens in Auth Header: ' + headers.length);
        return res.sendStatus(501);
    }

    const token = authHeader.split(' ')[1];

    if (token == null) {
        console.log('Null Bearer Token');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            return res.status(401).json('Token Validation Error!');
        }

        req.auth = verified;
        next();
    });
}

// Only let admins go to the requested API
function requireAdmin(req, res, next) {
    // authenticateJWT() put the decoded JWT in req.auth
    // Check and make sure that the token has the user as an admin
    if (!req.auth || req.auth.role !=='admin') {
        return res.status(403).json({ // 403 tells that the application knows them but that they don't have permission
            message: 'Admin role needed'
        });
    }

    // If permission correct, continue to controller
    next();
}

// Only let customer role accounts use customer booking routes
function requireCustomer(req, res, next) {
    // The request has to have the customers valid customer JWT
    if (!req.auth || req.auth.role !== 'customer') {
        return res.status(403).json({
            message: 'Customer role required'
        });
    }

    // If permission is correct to continue
    next();
}

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

// Anyone can see the travel packages. Only a valid admin can create one.
router.route('/trips').get(tripsController.tripsList).post(authenticateJWT, requireAdmin, tripsController.tripsAddTrip);

// Anyone can view a trip. Only a valid admin can change it.
router.route('/trips/:tripCode').get(tripsController.tripsFindByCode).put(authenticateJWT, requireAdmin, tripsController.tripsUpdateTrip).delete(authenticateJWT, requireAdmin, tripsController.tripsDeleteTrip);

// Get customers bookings
router.route('/bookings').get(authenticateJWT, requireCustomer, bookingsController.ownedBookingsList);

// Create booking for customer
router.route('/bookings/:tripCode').post(authenticateJWT, requireCustomer, bookingsController.bookingsCreate);

// Cancel bookings owned by customer
router.route('/bookings/id/:bookingId').delete(authenticateJWT, requireCustomer, bookingsController.ownedBookingsCancel);

module.exports = router;