# Majestic Borewells - Web Application

## Overview

Majestic Borewells is a full-stack web application that provides a platform for customers to book borewell drilling services and submit queries. The application includes a customer-facing interface for bookings and a secure admin dashboard for managing bookings and customer queries.

## Features

- **Interactive Map-Based Booking**: Customers can select their location on a map
- **Service Selection**: Choose from multiple borewell services (Sensor, Robo, Direct Drilling)
- **Admin Dashboard**: Manage bookings and customer queries
- **Query System**: Customers can submit queries which are tracked with status updates
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Maps API**: Leaflet with OpenStreetMap

## Project Structure

```
majestic-borewells/
├── server/
│   ├── server.js                     # Main server application
│   ├── controllers/
│   │   ├── routes/
│   │   │   ├── bookings.js           # Booking API endpoints
│   │   │   ├── queries.js            # Customer queries API endpoints
│   │   │   └── admin.js              # Admin API endpoints
│   ├── models/
│   │   └── booking.js                # Booking data model
│   └── views/
│       └── admin.html                # Admin dashboard template
├── booking.html                      # Customer booking page
├── FAQ.html                          # Frequently asked questions
├── home.html                         # Landing page
└── about.html                        # About the company
```

## Database Design

### MongoDB Collections

1. **Bookings Collection**
   - Schema includes:
     - `address`: Location for the borewell service
     - `date`: Scheduled service date
     - `time`: Scheduled service time
     - `service`: Service type (sensor, robo, direct)
     - `createdAt`: Booking creation timestamp

2. **Queries Collection**
   - Schema includes:
     - `name`: Customer name
     - `email`: Customer email
     - `phone`: Customer phone number
     - `query`: Customer question or concern
     - `date`: Timestamp of query submission
     - `status`: Query status (pending, in-progress, completed)

## File Descriptions

### Server Files

- **server.js**: The main application file that sets up Express, configures middleware, establishes MongoDB connection, and registers routes. It also includes enhanced error handling and connection retry logic.

- **controllers/routes/bookings.js**: Handles all booking-related operations:
  - Creating new bookings (`POST /api/bookings`)
  - Retrieving all bookings (`GET /api/bookings`)
  - Retrieving a specific booking (`GET /api/bookings/:id`)
  - Deleting a booking (`DELETE /api/bookings/:id`)
  - Includes a connection test endpoint

- **controllers/routes/queries.js**: Manages customer queries:
  - Storing new queries (`POST /api/queries`)
  - Retrieving all queries (`GET /api/queries`)
  - Updating query status (`PATCH /api/queries/:id`)
  - Deleting queries (`DELETE /api/queries/:id`)

- **models/booking.js**: Defines the Mongoose schema for the bookings collection, including validation rules for the different fields.

### Frontend Files

- **booking.html**: Interactive booking page with map integration that allows customers to:
  - Select their location on a map
  - Choose service type
  - Select date and time
  - Submit booking requests
  - Handles errors and server connectivity issues gracefully

- **admin.html**: Administrative dashboard that provides:
  - Overview statistics of bookings and queries
  - Management interface for customer bookings
  - Interface for handling customer queries with status updates
  - Actions for contacting customers or deleting records

## MongoDB Integration

The application uses Mongoose to connect to MongoDB and defines schemas for data validation. Key features of the MongoDB integration include:

1. **Connection Management**:
   - Implements connection retry logic
   - Handles disconnection events automatically
   - Provides connection status through the API

2. **Data Models**:
   - Uses Mongoose Schema for data validation
   - Prevents model overwriting with conditional compilation
   - Implements proper error handling for database operations

3. **Query Operations**:
   - Supports sorting and filtering
   - Implements proper error handling
   - Returns appropriate HTTP status codes based on operation results

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/majestic-borewells.git
   cd majestic-borewells
   ```

2. Install dependencies:
   ```
   cd server
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the server directory with the following variables:
   ```
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/majestic_borewells
   NODE_ENV=development
   ```

4. Start the server:
   ```
   node server.js
   ```

5. Access the application:
   - Main website: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin

## API Endpoints

### Bookings API

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get a specific booking
- `DELETE /api/bookings/:id` - Delete a booking

### Queries API

- `GET /api/queries` - Get all customer queries
- `POST /api/queries` - Submit a new query
- `PATCH /api/queries/:id` - Update query status
- `DELETE /api/queries/:id` - Delete a query

## Error Handling

The application implements comprehensive error handling:

1. **Client-Side Errors**:
   - Form validation
   - Network connectivity checks
   - Timeout handling for API requests

2. **Server-Side Errors**:
   - Request validation
   - Database error handling
   - Detailed error responses

## Security Considerations

- Input validation on both client and server
- Error messages don't expose sensitive information in production
- CORS configuration to control access to the API

## Future Enhancements

- User authentication for admin dashboard
- Email notifications for bookings and queries
- Payment integration for booking services
- Service availability calendar
- Customer profiles and booking history

## Contributors

- [Your Name] - Initial development and maintenance

## License

This project is licensed under the MIT License - see the LICENSE file for details.