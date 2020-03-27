const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')

const initializePassport = require('./passport-config')
initializePassport(passport)

app.use(express.json())

const users = []

app.get('/users', (req,res) => {
    res.json(users)
})
app.get('/app1', (req,res) => {
    res.render('./app1/dist/app1/index.html')
})
app.get('/app2', (req,res) => {
    res.render('./app2/dist/app2/index.html')
})

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