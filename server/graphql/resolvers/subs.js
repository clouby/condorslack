const { PubSub, withFilter } = require("apollo-server-express");

const pubsub = new PubSub();

// Define subscribe name
const PAIR_ADDED = "PAIR_ADDED";
const CHANNEL_ADDED = "CHANNEL_ADDED";
const MESSAGE_POSTED = "MESSAGE_POSTED";

exports.globalSubs = {
  pairAdded: {
    subscribe: () => pubsub.asyncIterator([PAIR_ADDED])
  },
  messagePosted: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(MESSAGE_POSTED),
      (payload, variables) => {
        if (payload) {
          return (
            payload.messagePosted.conversation.toString() ===
            variables.idConversation
          );
        }
        return false;
      }
    )
  },
  channelAdded: {
    subscribe: () => pubsub.asyncIterator([CHANNEL_ADDED])
  }
};

exports.events = {
  PAIR_ADDED,
  MESSAGE_POSTED,
  CHANNEL_ADDED
};

exports.pubsub = pubsub;
