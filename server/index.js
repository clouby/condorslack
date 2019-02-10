// Dependencies
const mongoose = require("mongoose");

// Local Dependencies
const app = require("./app");

// Spread ENV
const { USERNAME_DB, PASSWORD_DB, HTTP_PORT } = process.env;

// Get the prox port (http)
const PORT = HTTP_PORT || 3000;

// Initialize and connect DB (mongo)
async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://${USERNAME_DB}:${PASSWORD_DB}@cluster0-tmqvz.mongodb.net/condor-slack-db?retryWrites=true`,
      {
        keepAliveInitialDelay: 3000
      }
    );
    // Run the http server
    app.listen(PORT, () => console.log(`Server HTTP:${PORT} (listening...)`));
  } catch (err) {
    // Emit the error and stop the server
    console.error(err);
    process.exit(1);
  }
}

process.on("uncaughtException", function(error) {
  process.exit(1);
});

// Run app
main();
