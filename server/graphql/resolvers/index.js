// Dependencies
const sharp = require("sharp");
const { GraphQLDateTime } = require("graphql-iso-date");

// Local Dependencies
const { streamToBuffer } = require("./../../libs/stream-to-buffer");
const { User } = require("./../../models");

//  Resolvers
const { userResolversMutation, userResolverQuery } = require("./user");
const { roomResolverQuery, roomResolverMutation } = require("./room");
const { globalSubs } = require("./subs");
const { static_route, public_route } = require("./../../config");

const MIME_ALLOWED = ["image/jpeg", "image/png"];

const resolvers = {
  Date: GraphQLDateTime,
  Subscription: {
    ...globalSubs
  },
  Query: {
    files: () => "hola, magnolia",
    ...userResolverQuery,
    ...roomResolverQuery
  },
  Mutation: {
    async uploadPicture(parent, { file }, { user }) {
      // Get props provided by Upload (scarla)
      const { createReadStream, filename, mimetype, encoding } = await file;

      // Allow the next format
      if (!MIME_ALLOWED.includes(mimetype))
        throw new Error("This type is not allowed");

      // Initialize stream
      const stream = createReadStream();

      // Convert this stream to a single buffer
      const buffImage = await streamToBuffer(stream);

      const unique = new Date().getTime();

      const route = `${public_route}/${user.nickname}-${unique}.jpg`;

      const outside = `${static_route}/${user.nickname}-${unique}.jpg`;
      // Resize and make a local store
      const newImage = await sharp(buffImage)
        .resize(200)
        .toFile(route);

      await User.updateOne({ _id: user._id }, { pic: outside });

      return outside;
    },
    ...userResolversMutation,
    ...roomResolverMutation
  }
};

module.exports = resolvers;
