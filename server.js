const express = require('express')

const app = express()

const db = require('./final')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))





app.get('/', (req, res) => {
    res.sendFile('./home.html', { root: __dirname })
})

app.get('/register', (req, res) => {
    res.sendFile('./register.html', { root: __dirname })
})

app.get('/signIn', (req, res) => {
    res.sendFile('./signin.html', { root: __dirname })
})

app.post('/register', (req, res) => {
    db.register(req.body).then(data => {
        res.setHeader('content-type', 'text/html')
        if (data.email != undefined) {
            res.send(`
            ${data.email} registered successfully
            <a href="/">Go home </a>
            `)

        } else {
            res.send(`<h4>Error:${data}</h4>`)
        }
    }).catch(err => {
        res.send(`<h4>Error:${err}</h4>`)
    })
})


app.post('/signin', (req, res) => {
    db.signIn(req.body).then(data => {
        res.setHeader('content-type', 'text/html')
        if (data.email) {
            res.send(`
            ${data.email} signed in successfully
            <a href="/">Go home </a>
            `)

        } else {
            res.send(`<h4>${data}</h4>`)
        }
    }).catch(err => res.send(`<h4>${err}</h4>`))
})
app.use((req, res) => {
    res.send('not found')
})


db.startDB().then(() => {
    app.listen('8080', () => {
        console.log("app is listening port 8080")
    })
}).catch(err => console.log(err))