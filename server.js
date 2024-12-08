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
const userRoutes = require("./routes/user");
// Initialize Express app
const app = express();
const path = require("path");

// ... other middleware ...
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/artwork", artworkRoutes);
app.use("/artwork", commentRoutes);
app.use("/artwork", likeRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
//root route
app.use("/", (req, res) => {
  res.send("Welcome to the Virtual Art Gallery API");
});
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
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
