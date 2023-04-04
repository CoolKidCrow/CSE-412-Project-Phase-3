
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserByUID) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        if (user == null) {
            return done(null, false, { message: "No user with email" })
        }

        try {
            if (await bcrypt.compare(password, user.hashpass)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Incorrect password" })
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.uid))
    passport.deserializeUser(async (uid, done) => {
        return done(null, await getUserByUID(uid));
    })
}

module.exports = initialize