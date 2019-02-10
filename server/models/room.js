// Dependencies
const { Schema, model } = require("mongoose");

const ConversationSchema = new Schema({
  channel: {
    type: String
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

// Build the Room Schema
const MessageSchema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation"
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

ConversationSchema.index({ channel: 1 }, { sparse: true });

// Define and export the model
exports.Message = model("Message", MessageSchema);
exports.Conversation = model("Conversation", ConversationSchema);
