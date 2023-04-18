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

async function FetchUserByName(name, uid)
{
    try{
        const query = "SELECT * FROM Users WHERE fname LIKE $1 AND uid != $2 ";
        let user = await client.query(query, [`${name}%`, uid]);
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
        const query = "SELECT * FROM Photos INNER JOIN Albums ON Photos.aid = Albums.aid INNER JOIN Users on Albums.uid = Users.uid WHERE pid = $1";
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
        const query = "SELECT photourl, fname, lname, users.uid, pid, caption FROM photos INNER JOIN albums ON albums.aid = photos.aid INNER JOIN users ON albums.uid = users.uid ORDER BY photos.date DESC";
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

async function CreateComment(pid, uid, text)
{
    try{
        const query = "INSERT INTO Comments (PID, UID, text) VALUES ($1, $2, $3)";
        const result = await client.query(query, [pid, uid, text]);
    } catch (err){
        console.log(err.stack);
    }
}

async function FetchCommentsByPID(pid)
{
    try{
        const query = "SELECT date, fname, lname, text FROM Comments INNER JOIN Users on Comments.UID = Users.UID WHERE pid = $1";
        const result = await client.query(query, [pid]);
        return result.rows;
    } catch (err){
        console.log(err.stack);
    }
}

async function FetchTagsByPID(pid)
{
    try{
        const query = "SELECT * FROM Tags WHERE pid = $1";
        const result = await client.query(query, [pid]);
        return result.rows;
    } catch (err){
        console.log(err.stack);
    }
}

async function CreateTag(text, pid)
{
    try{
        const query = "INSERT INTO Tags (text, pid) VALUES ($1, $2)";
        const result = await client.query(query, [text, pid]);
    } catch (err){
        console.log(err.stack);
    }
}

async function FetchPhotosByTagText(text)
{
    try{
        const query = "SELECT fname, lname, albums.uid, photourl, caption, photos.pid FROM Tags INNER JOIN Photos ON Tags.pid = Photos.pid INNER JOIN Albums ON photos.aid = albums.aid INNER JOIN Users ON users.uid = albums.uid WHERE text = $1";
        const result = await client.query(query, [text]);
        return result.rows;
    } catch (err){
        console.log(err.stack);
    }
}

async function FetchPhotosByTagTextAndUID(text, uid)
{
    try{
        const query = "SELECT fname, lname, albums.uid, photourl, caption, photos.pid FROM Tags INNER JOIN Photos ON Tags.pid = Photos.pid INNER JOIN Albums ON photos.aid = albums.aid INNER JOIN Users ON users.uid = albums.uid WHERE text = $1 AND users.uid = $2";
        const result = await client.query(query, [text, uid]);
        return result.rows;
    } catch (err){
        console.log(err.stack);
    }
}

async function FetchLikesByPID(pid)
{
    try{
        const query = "SELECT fname, lname, users.uid FROM Likes INNER JOIN users ON likes.uid = users.uid WHERE pid = $1";
        const result = await client.query(query, [pid]);
        return result.rows;
    } catch (err){
        console.log(err.stack);
    }
}

async function CreateLike(uid, pid)
{
    try{
        const query = "INSERT INTO Likes (uid, pid) VALUES ($1, $2)";
        const result = await client.query(query, [uid, pid]);
    } catch (err){
        console.log(err.stack);
    }
}

async function FetchPopularTags()
{
    try{
        const query = "SELECT t.text, COUNT(*) as tag_count FROM Tags t JOIN photos p ON t.pid = p.pid GROUP BY t.text ORDER BY COUNT(*) DESC";
        const result = await client.query(query);
        return result.rows;
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
    DeletePhotoByPID,
    CreateComment,
    FetchCommentsByPID,
    FetchTagsByPID,
    CreateTag,
    FetchPhotosByTagText,
    FetchPhotosByTagTextAndUID,
    FetchLikesByPID,
    CreateLike,
    FetchPopularTags }