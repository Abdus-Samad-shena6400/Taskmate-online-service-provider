require('dotenv').config();
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ MONGO_URI not found in environment variables.");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.info("✅ MongoDB connection established"))
  .catch((error) => {
    console.error("❌ Mongoose connection Issue:", error);
    process.exit(1);
  });

mongoose.connection.on("reconnected", () =>
  console.info("ℹ️ Mongoose connection: Reestablished")
);

mongoose.connection.on("disconnected", () =>
  console.info("⚠️ Mongoose connection: Disconnected")
);

mongoose.connection.on("close", () =>
  console.info("⚠️ Mongoose connection: Closed")
);

mongoose.connection.on("error", (error) =>
  console.error("❌ Mongoose connection Issue:", error)
);

module.exports = mongoose;
