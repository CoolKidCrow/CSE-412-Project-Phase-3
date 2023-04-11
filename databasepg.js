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
        let checkEmail = await FetchUserByEmail(user.email);
        if(checkEmail != null) {
            return "Email already registered"
        }
        const query = 'INSERT INTO users (gender, hometown, dob, fName, lName, email, hashPass) VALUES ($1,$2,$3,$4,$5,$6,$7)';
        await client.query(query, [user.gender, user.hometown, user.dob, user.fname, user.lname, user.email, user.hashPass]);
    } catch (err) {
        console.log(err.message);
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

async function CreateFriendship(uid, fid)
{
    try {
        const query = 'INSERT INTO Friends (UID, FID) VALUES ($1,$2)';
        await client.query(query, [uid, fid]);
    } catch (err) {
        console.log(err.message);
    }
}

async function FetchUserByName(name)
{
    try{
        const query = "SELECT * FROM Users WHERE fname LIKE $1";
        let user = await client.query(query, [`${name}%`]);
        return user.rows;
    } catch (err){
        console.log(err.stack);
    }
}

async function UpdateAccountInfo(user)
{
    try {
        const query = 'UPDATE Users SET gender = $1, hometown = $2, dob = $3, fname = $4, lname = $5 WHERE UID = $6';
        await client.query(query, [user.gender, user.hometown, user.dob, user.fname, user.lname, user.uid]);
    } catch (err) {
        console.log(err.message);
    }
}

async function FetchFriendsOfUserByUID(uid)
{
    try{
        const query = "SELECT fid, fname, lname FROM Friends INNER JOIN Users ON Friends.FID = Users.UID WHERE friends.uid = $1";
        const result = await client.query(query, [uid]);
        return result.rows;
    } catch (err){
        console.log(err.stack);
    }
}

async function CreateAlbum(uid, name)
{
    try {
        const query = 'INSERT INTO Albums (uid, albumName) VALUES ($1, $2)';
        await client.query(query, [uid, name]);
    } catch (err) {
        console.log(err.message);
    }
}

async function FetchAlbumsOfUserByUID(uid)
{
    try{
        const query = "SELECT aid, albumName FROM Albums WHERE uid = $1";
        const result = await client.query(query, [uid]);
        return result.rows;
    } catch (err){
        console.log(err.stack);
    }
}

async function FetchPhotosByAID(aid)
{
    try{
        const query = "SELECT * FROM Photos WHERE aid = $1 ORDER BY date DESC";
        const result = await client.query(query, [aid]);
        return result.rows;
    } catch (err){
        console.log(err.stack);
    }
}

async function CreatePhoto(aid, caption, photourl)
{
    try{
        const query = "INSERT INTO Photos (AID, caption, photoUrl) VALUES ($1, $2, $3)";
        const result = await client.query(query, [aid, caption, photourl]);
    } catch (err){
        console.log(err.stack);
    }
}

async function FetchPhotoByPID(pid)
{
    try{
        const query = "SELECT * FROM Photos WHERE pid = $1";
        const result = await client.query(query, [pid]);
        return result.rows[0];
    } catch (err){
        console.log(err.stack);
    }
}

async function FetchAlbumByAid(aid)
{
    try{
        const query = "SELECT * FROM albums WHERE aid = $1";
        const result = await client.query(query, [aid]);
        return result.rows[0];
    } catch (err){
        console.log(err.stack);
    }
}

async function FetchAllPhotos()
{
    try{
        const query = "SELECT * FROM photos INNER JOIN albums ON albums.aid = photos.aid INNER JOIN users ON albums.uid = users.uid ORDER BY photos.date DESC";
        const result = await client.query(query);
        return result.rows;
    } catch (err){
        console.log(err.stack);
    }
}

async function DeleteAlbumByAID(aid)
{
    try{
        const query = "DELETE FROM albums WHERE aid = $1;";
        await client.query(query, [aid]);
    } catch (err){
        console.log(err.stack);
    }
}

async function DeletePhotoByPID(pid)
{
    try{
        const query = "DELETE FROM photos WHERE pid = $1;";
        await client.query(query, [pid]);
    } catch (err){
        console.log(err.stack);
    }
}

module.exports = { CreateUser, 
    FetchUserByEmail, 
    FetchUserByUID, 
    CreateFriendship, 
    FetchUserByName, 
    UpdateAccountInfo, 
    FetchFriendsOfUserByUID, 
    CreateAlbum, 
    FetchAlbumsOfUserByUID,
    FetchPhotosByAID,
    CreatePhoto,
    FetchPhotoByPID,
    FetchAlbumByAid,
    FetchAllPhotos,
    DeleteAlbumByAID,
    DeletePhotoByPID }