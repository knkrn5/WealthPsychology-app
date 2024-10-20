import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';    

dotenv.config();

const dbClient = new Client({
    host: process.env.WS_DB_HOST,
    port: process.env.WS_DB_PORT,
    user: process.env.WS_DB_USER,
    password: process.env.WS_DB_PASSWORD,
    database: process.env.WS_DB_DATABASE,
    ssl: {
        rejectUnauthorized: false, 
    },
});

// Connect to the database
dbClient.connect()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(err => {
        console.error('Connection error', err.stack);
        process.exit(1);

    });

export default dbClient;