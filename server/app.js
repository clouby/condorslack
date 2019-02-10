// Dependencies
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");

// Local Depdencies
const { typeDefs, resolvers, context, subscriptions } = require("./graphql");
const { public_route } = require("./config");

// Initialize apollo app
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context
  // subscriptions
});

// Initialize express app
const app = express();

// Static files `/public`
app.use("/static", express.static(public_route));

// Injecting middlewares
app.use(cors());

// Injecting  apollo to express app
apollo.applyMiddleware({ app });

// Create a native http server
const httpServer = http.createServer(app);

//  Injecting for expose subscriptions
apollo.installSubscriptionHandlers(httpServer);

// Export app
module.exports = httpServer;
