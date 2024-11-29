const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const artworkRoutes = require("./routes/artwork");
const commentRoutes = require("./routes/comments");
const likeRoutes = require("./routes/likes");
const orderRoutes = require("./routes/orders");



// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/artwork", artworkRoutes);
app.use("/artwork", commentRoutes);
app.use("/artwork", likeRoutes);
app.use("/orders", orderRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));
