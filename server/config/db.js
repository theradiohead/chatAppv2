const mongoose = require("mongoose");

// this is supposed to be in a .env file but to facilate the use of the app i defined it here.
mongoURL = {
  url: "mongodb+srv://rihem:rihem@writers.bc5oo.mongodb.net/writers_db?retryWrites=true&w=majority",
};

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
