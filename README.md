# Hotel Booking API

This is a simple REST API application that allows users to view hotel rooms, make bookings, and generate invoices.

## Features

- List available hotel rooms
- Book a room for one night
- Confirm bookings
- Generate invoices for confirmed bookings


## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- SQLite3

## Setup

Install dependencies:
   ```
   npm install
   ```

## Running the Application

To start the server:

```
npm start
```

The API will be available at `http://localhost:3000`.

## API Endpoints

- `GET /room`: List all rooms
- `POST /booking`: Create a new booking
- `PUT /bookings/:id/confirm`: Confirm a booking
- `GET /booking`: List all bookings
- `GET /invoices`: List all invoices
- `GET /invoices/:id`: Get a specific invoice

## Running Tests

To run all tests:

```
npm test
```



