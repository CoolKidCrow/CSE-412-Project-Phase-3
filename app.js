if(process.env.NODE_ENV  !== "production") {
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
    res.render('index.ejs', { name: req.user.fname + " " + req.user.lname})
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
    res.render('register.ejs');
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashPass = await bcrypt.hash(req.body.password, 10);
        await database.CreateUser({
            gender: req.body.gender,
            hometown: req.body.hometown,
            dob: req.body.dob,
            fName: req.body.fName,
            lName: req.body.lName,
            email: req.body.email,
            hashPass: hashPass
        })
        res.redirect('/login')
    } catch (err) {
        res.redirect('/register')
        console.log(err);
    }
})

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err) {
            return res.redirect("/")
        }
        return res.redirect('/login')
    })
})

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }

    return next();
}

app.listen(3000);