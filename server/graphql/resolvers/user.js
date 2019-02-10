// Dependencies
const { UserInputError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");

// Local Dependencies
const { User } = require("./../../models");
const { SECRET_KEY_TOKEN } = process.env;

// FIXME: async delay
const sleep = ms => new Promise(r => setTimeout(r, ms));

exports.userResolverQuery = {
  async getUsers(parent, args, { user }) {
    if (!user) return [];

    const { _id } = user;

    const { pair } = await User.findById(_id).populate("pair", "_id");

    const conversations_id = pair.length > 0 ? pair.map(({ _id }) => _id) : [];

    const users = await User.find({
      pair: { $not: { $in: conversations_id } },
      _id: { $ne: _id }
    });

    return [...users];
  }
};

exports.userResolversMutation = {
  async login(
    parent,
    {
      user: { email, password }
    }
  ) {
    try {
      // Get the user
      const user = await User.findOne({ email }).select("+password");

      if (!user) throw new UserInputError("User not found.");

      // Validate the password provided
      const passwordVal = await user.verifyPassword(password);

      if (!passwordVal) throw new UserInputError("Invalid password.");

      const { _id, nickname, name, pic } = user;

      const token = await jwt.sign(
        {
          _id,
          nickname
        },
        SECRET_KEY_TOKEN
      );

      await sleep(3000);

      return { token, name, nickname, _id, pic };
    } catch (error) {
      console.error(error);
    }
  },
  async signup(parent, { user }) {
    const newUser = await User.create(user);

    await sleep(3000);

    const { _id, nickname, name, pic } = newUser;

    const token = await jwt.sign(
      {
        _id,
        nickname
      },
      SECRET_KEY_TOKEN
    );
    return { token, name, nickname, _id, pic };
  }
};
