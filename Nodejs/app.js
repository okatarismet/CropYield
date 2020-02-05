const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const rateLimit = require("express-rate-limit");


const operationRoute = require('./api/routes/operation');

// max setted as infinite for development purposes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 600000 // limit each IP to 100 requests per windowMs
  });

/**
 * TO-DO: X-Rate-Limit-Limit kullaniciya header ile gonderilecek
 */
app.use(limiter);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With,Content-Type,Accept, Authorization,token'
        )
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

//Routes
app.use('/operation', operationRoute);

app.get((req,res,next)=>{
    const error = new Error('Not found');
    error.status(404);
    next(error)
})
app.get((error,req,res,next)=>{
    res.status(err.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app
