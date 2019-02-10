const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type User {
    _id: ID
    name: String!
    nickname: String!
    email: String!
    password: String
    pic: String!
  }

  type Auth {
    token: String!
    _id: String!
    nickname: String!
    name: String!
    pic: String!
  }

  type Pair {
    _id: ID
    members: [User!]!
  }

  input LoginCredentials {
    email: String!
    password: String!
  }

  input newUserCredentials {
    name: String!
    nickname: String!
    email: String!
    password: String!
  }

  type Message {
    _id: ID!
    conversation: String!
    message: String!
    author: User!
    date: Date!
  }

  type Conversation {
    _id: ID
    members: [User!]!
    channel: String!
  }

  type Query {
    files: String!
    getUsers: [User!]!
    getPairs: [Pair!]!
    getChannels: [Conversation!]!
    getConversations(_id: String!): [Message!]!
  }

  type Mutation {
    uploadPicture(file: Upload!): String!
    login(user: LoginCredentials!): Auth!
    signup(user: newUserCredentials!): Auth!
    createPair(pairId: String!): Pair!
    createChannel(channel: String!): String!
    postMessage(idConversation: String!, message: String!): String!
  }

  type Subscription {
    pairAdded: Pair!
    channelAdded: Conversation!
    messagePosted(idConversation: String!): Message!
  }
`;

module.exports = typeDefs;
