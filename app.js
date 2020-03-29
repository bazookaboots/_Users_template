if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const users = []
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.use(express.json())

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECERT,
    resave: false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended:false}))

app.get('/users', (req,res) => {
    res.render('index.ejs')
})
app.get('/users/login', (req,res) => {
    res.render('login.ejs')
})
app.get('/users/register', (req,res) => {
    res.render('register.ejs')
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
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email, 
            password: hashedPassword
        })
        res.redirect('/users/login')
    }
    catch {
        res.redirect('users/register')
    }
    console.log(users)
})

app.listen(3000)