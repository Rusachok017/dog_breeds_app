const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const breedsRouter = require('./routes/breeds'); // Импортируем маршруты для пород
const authRouter = require('./routes/auth'); // Импортируем маршруты для аутентификации
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use('/auth', authRouter);
app.use('/breeds', breedsRouter);

// Test route
app.get('/', (req, res) => {
    res.send('Dog Breeds API is running!');
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});