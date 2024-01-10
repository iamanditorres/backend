require('dotenv').config()

// require package express
const express = require('express')  

// require package moongose
const mongoose = require('mongoose')

// TODO: rename to relevant name re SP
// contains all the routes for the app
const workoutRoutes = require('./routes/workouts')
const tweetRoutes = require('./routes/tweets')

// create an express app
const app = express()

// middleware
// looks at any requests if it has a body (data) and 
// passes and attaches it to the request obj
app.use(express.json()) 

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// use the routes specified
app.use('/api/workouts', workoutRoutes) // TODO: delete
app.use('/api/tweets', tweetRoutes)

app.get('/', function(req, res){
    res.setHeader('Content-type','text/html')
    res.send('<body style="height:100%; overflow:hidden"><div style="height: 100%; width: 100%; display: grid; place-items: center; font-size:50px" ><p>ASTER-API IS RUNNING.</p></div></body>');
});

app.get('/cors', (req, res) => {
    res.set('Access-Control-Allow-Origin', 'https://aster-app-cles.onrender.com/');
    res.send('This has CORS enabled 🎈')
})

// connect to database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests on a certain port number
        app.listen(process.env.PORT, () => {
            console.log("[!] Connected to DB\n[!] Listening on port", process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })

/**
 * Credits to Net Ninja for tutorial for the MERN backbone code
 */