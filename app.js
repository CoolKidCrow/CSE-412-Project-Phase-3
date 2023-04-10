if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require("express")
const app = express()

const passport = require('passport')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(passport, email => database.FetchUserByEmail(email),
    uid => database.FetchUserByUID(uid))

const database = require('./databasepg')

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.fname + " " + req.user.lname, uid: req.user.uid})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs', { failureMessage: req.flash('failure')});
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashPass = await bcrypt.hash(req.body.password, 10);
        const result = await database.CreateUser({
            gender: req.body.gender,
            hometown: req.body.hometown,
            dob: req.body.dob,
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            hashPass: hashPass
        })
        if (result === "Email already registered") {
            req.flash('failure', result)
            res.redirect('/register')
        } else {
            res.redirect('/login')
        }
    } catch (err) {
        res.redirect('/register')
        console.log(err);
    }
})

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.redirect("/")
        }
        return res.redirect('/login')
    })
})


app.get('/friendsearch', checkAuthenticated, (req, res) => {
    res.render('friendsearch.ejs', { users: req.flash('users')})
})

app.post('/friendsearch', checkAuthenticated, async (req,res) => {
    const result = await database.FetchUserByName(req.body.name);
    req.flash('users', result);
    res.redirect('/friendsearch');
})

app.post('/addfriend', checkAuthenticated, async (req, res) => {
    await database.CreateFriendship(req.user.uid, req.body.fid)
    res.redirect('/friendsearch')
})

app.get('/account', checkAuthenticated, (req, res) => {
    res.render('account.ejs', { user: req.user})
})

app.post('/account', checkAuthenticated, async (req, res) => {
    await database.UpdateAccountInfo({
        gender: req.body.gender,
        hometown: req.body.hometown,
        dob: req.body.dob,
        fname: req.body.fname,
        lname: req.body.lname,
        uid: req.user.uid
    })
    res.redirect('/account')
})

app.get('/profile/:uid', checkAuthenticated, async (req, res) => {
    const fetchedUser = await database.FetchUserByUID(req.params.uid);
    const fetchedFriends = await database.FetchFriendsOfUserByUID(req.params.uid);
    res.render('profile.ejs', {user : fetchedUser, friends : fetchedFriends})
})











//middleware
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }

    return next();
}

app.listen(3000);