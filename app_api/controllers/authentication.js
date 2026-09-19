const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');

const register = async (req, res) => {
    // Validate message to insure that all parameters are present
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    try {
        const user = new User({
            name, email, role: 'customer', password: ''
        });

        user.setPassword(password);
        await user.save();

        const token = user.generateJWT();

        return res.status(201).json({ token });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                message: 'Email is already registered'
            });
        }

        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Incorrect registration data'
            });
        }

        return res.status(500).json({
            message: "Can't register user"
        });
    }
};

const login = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({
                message: "Can't login"
            });
        }

        if (user) {
            const token = user.generateJWT();
            res.status(200).json({ token });
        } else {
            res.status(401).json(info);
        }
    })(req, res);
};

module.exports = {
    register,
    login
};