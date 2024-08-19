const express = require('express');
const bodyParser = require('body-parser');
const bookingRoutes = require('./src/routes/booking-routes');
const roomRoutes = require('./src/routes/room-routes');
const invoiceRoutes = require('./src/routes/invoice-routes');
const logger = require('./src/utils/logger');
const knex = require('./src/db/knex');


const app = express();

app.use(bodyParser.json());

app.use('/booking', bookingRoutes);
app.use('/room', roomRoutes);
app.use('/invoice', invoiceRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Hotel Booking API' });
});

app.use((err, req, res, next) => {
    logger.error('Unhandled error', { error: err.message });
    res.status(500).json({ error: 'An unexpected error occurred' });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await knex.migrate.latest();
        logger.info('Migrations completed successfully');

        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        logger.error('Error starting server:', err);
        process.exit(1);
    }
}

startServer();

module.exports = app;