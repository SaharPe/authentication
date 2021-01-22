const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();
dotenv.config();

// Import routes
const authRoute = require('./routes/auth');

// MongoDB connection
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB is connected...')).catch(err => console.log(err));

// Middleware
app.use(express.json());

// Routes middleware
app.use('/api/user', authRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server in running on http://localhost:${PORT}`))