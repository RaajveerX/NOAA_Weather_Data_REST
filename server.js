const express = require('express');
const { pool } = require('./database');
const cors = require('cors'); // allows frontend to makes calls to the server

const port = 3000;
const app = express();

// CORS middleware
app.use(cors());

// testing if the database pool is working, if not spin up an instance
pool.connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit
  });

// Root route for testing the server
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
})

// route to get the data for a specific station based on the station_id
app.get('/station/:station_id', async (req, res) => {
    try {
        const { station_id } = req.params;

        // format.txt describes stationd id as 11 characters
        if (! station_id || station_id.length !== 11) {
            return res.status(400).json({ message: 'Invalid station ID' });
        }

        // uses the index created in the database to query by station_id
        const query = `
            SELECT * FROM weather_records 
            WHERE station_id = $1 
            ORDER BY date DESC`;
        
        const result = await pool.query(query, [station_id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Station not found' });
        }
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error querying station:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Listen for messages
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

