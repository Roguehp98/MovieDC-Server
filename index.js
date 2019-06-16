const express = require('express');
const mongoose = require('mongoose');
const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const session = require('express-session');
const { GraphQLServer } = require('graphql-yoga');
const MongoStore = require('connect-mongo')(session);
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
  origin: 'http://localhost:3000'
}
//change in Playground setting: "request.credentials": "include"
server.express.use(cors(corOptions));
server.express.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
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
  // store: new MongoStore({
  //   mongooseConnection:mongoose.connection
  //   //other advanced options
  // })
}))
// server.express.use(cors())
server.express.use('/', (req,res) => {
  res.send('DC Server');
})

const opts = {
    port: 6969,
    cors: {
      credentials: true,
      origin: ['http://localhost:3000'] // your frontend url.
    }
  };

server.start(opts, () => {
    console.log("Server is running at port 6969")
})