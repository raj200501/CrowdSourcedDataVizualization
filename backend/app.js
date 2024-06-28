const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const dataRoutes = require('./routes/dataRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(cors());

app.use('/api/data', dataRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
