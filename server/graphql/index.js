const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { context, subscriptions } = require("./context");

module.exports = { typeDefs, resolvers, context, subscriptions };
