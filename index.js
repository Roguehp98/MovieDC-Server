const express = require('express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const session = require('express-session');
const { GraphQLServer } = require('graphql-yoga');
const cors = require('cors');
const permissions = require('./graphql/authorize');
const {PubSub} = require('graphql-yoga');

const app = express();

mongoose.connect('mongodb://admin:admin12345@ds137827.mlab.com:37827/dcweb',{ useNewUrlParser: true },(err) => {
    if(err) console.log("Connect DB Failed");
    else console.log("Connect DB Success");
})

const pubsub = new PubSub();

const context = (req) => ({
    req: req.request,
    pubsub
  });

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context,
    middlewares: [permissions]
})

const corOptions = {
  credentials: true,
  // origin: 'http://localhost:3000'
}
//change in Playground setting: "request.credentials": "include"
server.express.use(cors(corOptions));
server.express.use(function(req, res, next) {
  console.log(req.headers.origin)
  if (req.headers.origin) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  }
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

server.express.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true, 
    cookie: {
      httpOnly: false,
      maxAge: 7*24*60*60*1000,
  }
}))
// server.express.use(cors())
server.use('/a', (req,res) => {
  res.send('DC Server');
})
const port  = process.env.PORT || 6969;

const opts = {
    port: port,
    playground: '/graphql',
    cors: {
      credentials: true,
      // origin: ['http://localhost:3000'] // your frontend url.
    }
  };

server.start(opts, () => {
    console.log("Server is running at " + port )
})