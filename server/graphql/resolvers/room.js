// Local Dependencies
const { User, Conversation, Message } = require("./../../models");
const { pubsub, events } = require("./subs");

const excludeMe = (_id, path = "members") => ({
  path
  // match: { _id: { $ne: _id } }
});

exports.roomResolverQuery = {
  async getPairs(
    parent,
    args,
    {
      user: { _id }
    }
  ) {
    const { pair } = await User.findById(_id).populate({
      path: "pair",
      populate: {
        ...excludeMe(_id)
      }
    });

    return [...pair];
  },
  async getConversations(parent, { _id }) {
    return await Message.find({ conversation: _id }).populate("author");
  },
  async getChannels(parent) {
    const channels = await Conversation.find()
      .sort({ channel: 1 })
      .hint({ channel: 1 });
    return channels;
  }
};

exports.roomResolverMutation = {
  async createPair(_, { pairId }, { user }) {
    const users = [user._id, pairId];

    const conversation = await Conversation.create({ members: users });

    const { members } = await Conversation.findOne({
      _id: conversation._id
    }).populate(excludeMe(user._id));

    await User.updateMany(
      { _id: { $in: users } },
      { $push: { pair: conversation._id } }
    );

    const pair = { _id: conversation._id, members };

    pubsub.publish(events.PAIR_ADDED, { pairAdded: pair });

    return { _id: conversation._id, members };
  },
  async createChannel(_, { channel }) {
    const channelAdded = await Conversation.create({ channel });
    console.log(channelAdded);
    pubsub.publish(events.CHANNEL_ADDED, { channelAdded });
    return "create-channel";
  },
  async postMessage(_, { idConversation: conversation, message }, { user }) {
    const newMessage = await Message.create({
      conversation,
      message,
      author: user._id
    });
    const main = await Message.populate(newMessage, {
      path: "author",
      select: "-pair -channels"
    });
    pubsub.publish(events.MESSAGE_POSTED, { messagePosted: main });
    return "post-message";
  }
};
