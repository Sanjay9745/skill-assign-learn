const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const models = {};

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/courses');

// Check if connection is successful
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});
mongoose.connection.once('open', () => {
    console.log('MongoDB connected successfully');
});

// Read all model files in the current directory except index.js
fs.readdirSync(__dirname)
    .filter(file => file !== 'index.js' && file.endsWith('.js'))
    .forEach(file => {
        const model = require(path.join(__dirname, file));
        models[model.modelName] = model;
    });

module.exports = models;