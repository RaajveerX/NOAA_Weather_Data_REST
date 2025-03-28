const { Pool } = require('pg');
const fs = require('fs');
const readline = require('readline');
const { pipeline } = require('node:stream/promises');
const copyFrom = require('pg-copy-streams').from;
const {Readable} = require('node:stream');

// Credentials for the database
const pool = new Pool({
    host: 'noaa',
    user: 'postgres',
    password: 'postgres',
    database: 'noaa_database',
    port: 5432,
});

async function createTable() {

    const client = await pool.connect();
    try {

        await client.query(`
            CREATE TABLE IF NOT EXISTS weather_records (
                station_id VARCHAR(11),
                date VARCHAR(10),
                element VARCHAR(4),
                data_value INTEGER,
                m_flag CHAR(1),
                q_flag CHAR(1),
                s_flag CHAR(1),
                obs_time VARCHAR(4)
            );
        `);
        console.log('Table created successfully');
    } finally {
        client.release();
    }
}

// Stream one batch
async function processBatch(client, batchLines) {
    // postgres copy needs data in a single string with newlines
    const batchData = batchLines.join('\n') + '\n';

    // read from this stream
    const fromStream = Readable.from(batchData);

    // output to the db
    const toDb = client.query(copyFrom(`
        COPY weather_records (
            station_id, date, element, data_value,
            m_flag, q_flag, s_flag, obs_time
        ) FROM STDIN WITH (FORMAT csv)
    `));

    await pipeline(fromStream, toDb);
}

// loads csv data into the postgres database
async function loadData() {

    // Process 1 million lines at a time, approx. 37 batches
    // Also tried 2 million, slightly slower than 1 million (~19 batches)
    const batch_size = 1000000;
    const client = await pool.connect();
    let currentBatch = []; // slight memory overhead here since we are using an array
    let batchCount = 0;

    try {

        // using postgres transactions to make sure each data chunk is loaded properly
        await client.query('BEGIN');
        console.log('Starting Data Loading Process...');

        // reading line by line
        const rl = readline.createInterface({
            input: fs.createReadStream('2024.csv')
        });

        for await (const line of rl) {
            currentBatch.push(line);

            // process the accumulated batch and reset batch for next iteration
            if (currentBatch.length === batch_size) {
                batchCount++;
                console.log(`Processing batch ${batchCount}...`);
                await processBatch(client, currentBatch);
                currentBatch = [];
            }
        }

        // Process any leftover lines
        if (currentBatch.length > 0) {
            batchCount++;
            console.log(`Processing final batch ${batchCount}...`);
            await processBatch(client, currentBatch);
        }

        // Creating index after loading all data
        console.log('Creating index...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_weather_records_station_id 
            ON weather_records(station_id)
        `);

        await client.query('COMMIT');
        console.log(`\nData loaded successfully. Processed in ${batchCount} batches.`);
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function initDatabase() {
    try {
        await createTable(); // create table
        await loadData(); // then, load data
        console.log('Database init completed');
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
}

initDatabase();

module.exports = { pool };