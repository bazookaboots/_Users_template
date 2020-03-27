const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email=> users.find(user => user.email === email)
)

app.use(express.json())

const users = []

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECERT,
    resave: false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())


app.get('/users', (req,res) => {
    res.json(users)
})

app.post('/users/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/users/login',
    failureFlash: true
}))

app.post('/users/register', async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({ 
            name: req.body.name,
            email: req.body.email, 
            password: hashedPassword})
        res.status(201).send(user)
    }
    catch {
        res.status(500).send()
    }
})

app.listen(3000)