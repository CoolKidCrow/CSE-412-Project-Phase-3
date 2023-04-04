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

async function CreateUser(user) {
    try {
        const query = 'INSERT INTO users (gender, hometown, dob, fName, lName, email, hashPass) VALUES ($1,$2,$3,$4,$5,$6,$7)';
        await client.query(query, [user.gender, user.hometown, user.dob, user.fName, user.lName, user.email, user.hashPass]);
    } catch (err) {
        console.log(err.stack);
    }
}

async function FetchUserByEmail(email) {
    try{
        const query = 'SELECT * FROM users WHERE email = $1';
        let user = await client.query(query, [email]);
        return user.rows[0];
    } catch (err){
        console.log(err.stack);
    }
}

async function FetchUserByUID(uid) {
    try{
        const query = 'SELECT * FROM users WHERE UID = $1';
        let user = await client.query(query, [uid]);
        return user.rows[0];
    } catch (err){
        console.log(err.stack);
    }
}

module.exports = { CreateUser, FetchUserByEmail, FetchUserByUID}