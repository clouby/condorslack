const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");
const { SECRET_KEY_TOKEN } = process.env;

async function verifyToken(token) {
  try {
    const user = await jwt.verify(token, SECRET_KEY_TOKEN);
    if (!user) throw new AuthenticationError("you must be logged in.");
    return user;
  } catch (error) {
    throw new Error("An Error occurred with this token.");
  }
}

exports.context = async ({ req, connection }) => {
  if (connection) {
    // Getting our conetext via subscription
    return connection.context;
  } else {
    // Get token from req-headers
    const auth = req.headers.authorization || null;

    if (!auth) return {};

    // Descompose the authorization field
    const token = auth.replace("Bearer ", "").trim();

    // Verify the current user
    const user = await verifyToken(token);

    return { user };
  }
};

exports.subscriptions = {
  async onConnect(connectionParams, webSocket) {
    if (connectionParams.authToken) {
      // Verify the current user
      const user = await verifyToken(connectionParams.authToken);

      return { user };
    }
    // Missing our auth token
    throw new Error("Missing token.");
  }
};
