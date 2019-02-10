// Dependencies
const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongoBcrypt = require("mongoose-bcrypt");

// Local Dependencies
const { static_route } = require("./../config");

// Unique field
const uniqueValue = {
  type: String,
  index: true,
  require: true,
  unique: true
};

// Build the User Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  nickname: { ...uniqueValue },
  email: { ...uniqueValue },
  password: {
    type: String,
    bcrypt: true,
    required: true,
    select: false
  },
  pic: {
    type: String,
    default: `${static_route}/default.jpg`
  },
  pair: [
    {
      type: Schema.Types.ObjectId,
      ref: "Conversation"
    }
  ],
  channels: [
    {
      type: Schema.Types.ObjectId,
      ref: "Conversation"
    }
  ]
});

// Inject the next plugins
UserSchema.plugin(uniqueValidator); // Validate whether user exist and print a pretty error message
UserSchema.plugin(mongoBcrypt); // Provide encryption funcionality to selected field and utils

// Define and export the model
module.exports = model("User", UserSchema);
