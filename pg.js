const { Client } = require('pg');

const fs = require('fs');

const passwd = fs.readFileSync('credentials.txt', 'utf8')

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: passwd,
    database: 'postgres'
});

client.connect();

async function InsertUser(user) {
    try {
        const query = 'INSERT INTO users (name) VALUES ($1)';
        await client.query(query, [user.name]);
    } catch (err) {
        console.log(err.stack);
    }
}

async function FetchUser() {
    try{
        const query = 'SELECT * FROM users';
        var message = await client.query(query);

        return message;
    } catch (err){
        console.log(err.stack);
    }
}

module.exports = { InsertUser, FetchUser }