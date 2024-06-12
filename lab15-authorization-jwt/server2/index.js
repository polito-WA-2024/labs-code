'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');

const { body, validationResult } = require("express-validator");

const { expressjwt: jwt } = require('express-jwt');

const jwtSecret = 'qTX6walIEr47p7iXtTgLxDTXJRZYDC9egFjGLIn0rRiahB4T24T4d5f59CtyQmH8';

// THIS IS FOR DEBUGGING ONLY: when you start the server, generate a valid token to do tests, and print it to the console
//This is used to create the token
const jsonwebtoken = require('jsonwebtoken');
const expireTime = 60; //seconds
//const token = jsonwebtoken.sign( { access: 'premium', authId: 1234 }, jwtSecret, {expiresIn: expireTime});
//console.log(token);

// init express
const app = express();
const port = 3002;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json()); // To automatically decode incoming json

// Check token validity
app.use(jwt({
  secret: jwtSecret,
  algorithms: ["HS256"],
  // token from HTTP Authorization: header
})
);


// To return a better object in case of errors
app.use( function (err, req, res, next) {
  //console.log("DEBUG: error handling function executed");
  console.log(err);
  if (err.name === 'UnauthorizedError') {
    // Example of err content:  {"code":"invalid_token","status":401,"name":"UnauthorizedError","inner":{"name":"TokenExpiredError","message":"jwt expired","expiredAt":"2024-05-23T19:23:58.000Z"}}
    res.status(401).json({ errors: [{  'param': 'Server', 'msg': 'Authorization error', 'path': err.code }] });
  } else {
    next();
  }
} );


/*** APIs ***/


// POST /api/film-stats
app.post('/api/film-stats',
   body('films', 'Invalid array of films').isArray(),   // could be isArray({min: 1 }) if necessary
   (req, res) => {
    // Check if validation is ok
    const err = validationResult(req);
    const errList = [];
    if (!err.isEmpty()) {
      errList.push(...err.errors.map(e => e.msg));
      return res.status(400).json({errors: errList});
    }
  //console.log("DEBUG: auth: ",req.auth);

  const authLevel = req.auth.access;
  const films = req.body.films;
  let cnt = 0;
  let revenues = 0;

  for (const f of films) {
    const nChars = Array.from(f).filter(c => c !== ' ').length;
    const revenue = (Math.random() * (10 * nChars));
    revenues += revenue;
    cnt++;
  }
  if (cnt > 0)
    revenues /= cnt;

  if (authLevel === 'premium') {
    const audience = Math.round( revenues * 1000000 / (8+ Math.random()*4));
    res.json({revenues: revenues, audience: audience});
  } else {
    res.json({revenues: revenues});
  }

});


/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`qa-server listening at http://localhost:${port}`);
});
