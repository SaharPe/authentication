const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../helpers/validations');

// Register
router.post('/register', async (req, res, next) => {
    try {
        // Validate req.body
        const result = await registerValidation.validateAsync(req.body);

        // Check if email are already exist in db
        const isEmailExist = await User.findOne({ email: result.email });
        if (isEmailExist) return res.status(400).send(`${result.email} is already registered`);

        // Check if username is already exist in db
        const isUsernameExist = await User.findOne({ username: result.username });
        if (isUsernameExist) return res.status(400).send(`${result.username} is already registered`);

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(result.password, salt);
        result.password = hashedPassword;

        // Create new user
        const user = new User(result);
        const savedUser = await user.save();

        res.send({ user: savedUser._id });
    } catch (error) {
        if (error.isJoi) return res.status(422).send(error.details[0].message);
        res.send(error)
        next(error);
    }
});

// Login
router.post('/login', async (req, res, next) => {
    try {
        // Validate req.body
        const result = await loginValidation.validateAsync(req.body);

        // Check if email are already exist in db
        const user = await User.findOne({ email: result.email });
        if (!user) return res.status(400).send(`${result.email} is not registered`);

        // Check if password is correct
        const isValidPassword = await bcrypt.compare(result.password, user.password);
        if (!isValidPassword) return res.status(400).send('Password is incorrect');

        // Create and assign a token
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN);
        res.header('auth-token', token).send(token);
    } catch (error) {
        if (error.isJoi) return res.status(422).send(error.details[0].message);
        res.send(error)
        next(error);
    }
});


module.exports = router;