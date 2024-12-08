require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const OpenAI = require("openai");
const User = require("../models/User");
const Artwork = require("../models/Artwork");
const Comment = require("../models/Comment");
const Order = require("../models/Order");
const fetch = require('node-fetch');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration for data generation
const CONFIG = {
  ARTISTS_COUNT: 10,
  USERS_COUNT: 10,
  ARTWORKS_COUNT: 100,
  COMMENTS_PER_ARTWORK: 2,
  PRICE_RANGES: [
    { min: 50, max: 200 }, // Budget
    { min: 201, max: 500 }, // Mid-range
    { min: 501, max: 2000 }, // Premium
    { min: 2001, max: 10000 }, // Luxury
    { min: 10001, max: 50000 }, // Collector
  ],
  CATEGORIES: [
    "Abstract",
    "Landscape",
    "Portrait",
    "Modern",
    "Contemporary",
    "Minimalist",
    "Surreal",
    "Digital",
    "Photography",
    "Sculpture",
  ],
  ART_STYLES: [
    "Oil painting",
    "Watercolor",
    "Digital art",
    "Photography",
    "Acrylic",
    "Mixed media",
    "Charcoal",
    "Pencil drawing",
  ],
};

const ART_IMAGES = {
  "Abstract": [
    "https://images.unsplash.com/photo-1573221566340-81bdde00e00b",
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968",
  ],
  "Landscape": [
    "https://images.unsplash.com/photo-1500964757637-c85e8a162699",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  ],
  // Add more categories...
};

// Helper functions
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomPrice = () => {
  const range = randomElement(CONFIG.PRICE_RANGES);
  return Number(
    (Math.random() * (range.max - range.min) + range.min).toFixed(2)
  );
};

async function generateImage(prompt) {
  try {
    // Option 1: Use Lorem Picsum (Free)
    if (!process.env.UNSPLASH_API_KEY) {
      return `https://picsum.photos/1024/1024?random=${Math.random()}`;
    }
    
    // Option 2: Use Unsplash API
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(prompt)}`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.warn(`Failed to generate image: ${error.message}`);
    // Fallback to Lorem Picsum if there's an error
    return `https://picsum.photos/1024/1024?random=${Math.random()}`;
  }
}

const FIRST_NAMES = [
  "Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Isabella", "William", 
  "Sophia", "James", "Charlotte", "Benjamin", "Mia", "Lucas", "Amelia", 
  "Mason", "Harper", "Ethan", "Evelyn", "Alexander"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", 
  "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", 
  "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"
];

async function createUsers(type, count) {
  const users = [];
  const usedNames = new Set(); // To prevent duplicate names

  for (let i = 1; i <= count; i++) {
    const isArtist = type === "artist";
    
    // Generate unique name
    let firstName, lastName, username;
    do {
      firstName = randomElement(FIRST_NAMES);
      lastName = randomElement(LAST_NAMES);
      username = isArtist 
        ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}.art`
        : `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumber(1, 99)}`;
    } while (usedNames.has(username));
    
    usedNames.add(username);

    const bio = isArtist
      ? `${firstName} ${lastName} is a professional ${randomElement([
          "digital",
          "traditional",
          "contemporary",
          "modern",
          "abstract",
        ])} artist with a unique vision and ${randomNumber(5, 20)} years of experience.`
      : `Art enthusiast and collector with a passion for ${randomElement([
          "modern",
          "classical",
          "abstract",
          "contemporary",
        ])} art. Always seeking new perspectives in the art world.`;

    const user = new User({
      username: username,
      email: `${username}@example.com`,
      password: await bcrypt.hash("password123", 10),
      firstName: firstName,
      lastName: lastName,
      displayName: `${firstName} ${lastName}`,
      bio: bio,
      profileImage: await generateImage(
        `professional ${type} profile photo, ${
          isArtist ? "artistic and creative" : "casual and friendly"
        }`
      ),
      role: isArtist ? "artist" : "user",
    });
    users.push(await user.save());
  }
  return users;
}

async function createArtworks(artists) {
  const artworks = [];
  const artTitles = [
    "Sunset Dreams",
    "Urban Pulse",
    "Nature's Whisper",
    "Digital Echo",
    "Cosmic Dance",
    "Ocean Memories",
    "Mountain Spirit",
    "City Lights",
    "Forest Mystery",
    "Desert Wind",
    "River Song",
    "Night Vision",
    "Morning Dew",
    "Evening Star",
    "Ancient Ways",
    "Future Past",
    "Silent Echo",
    "Color Storm",
    "Light Path",
    "Dark Matter",
  ];

  for (let i = 0; i < CONFIG.ARTWORKS_COUNT; i++) {
    const style = randomElement(CONFIG.ART_STYLES);
    const category = randomElement(CONFIG.CATEGORIES);
    const title = `${randomElement(artTitles)} ${i + 1}`;

    const artwork = new Artwork({
      title: title,
      description: `A ${style} piece featuring ${category.toLowerCase()} elements`,
      image: await generateImage(
        `${style} of ${title}, ${category} style, professional artwork`
      ),
      price: randomPrice(),
      artistId: randomElement(artists)._id,
      category: category,
      likes: [],
      comments: [],
    });
    artworks.push(await artwork.save());
  }
  return artworks;
}

async function createComments(users, artworks) {
  const comments = [];
  const commentTemplates = [
    "Absolutely stunning work!",
    "The composition is remarkable.",
    "Love the use of color here.",
    "This piece speaks to me.",
    "Incredible technique!",
    "The detail is amazing.",
    "Beautiful interpretation.",
    "Masterfully executed.",
    "This is breathtaking!",
    "Such unique perspective!",
  ];

  for (const artwork of artworks) {
    const commentCount = randomNumber(1, CONFIG.COMMENTS_PER_ARTWORK);
    for (let i = 0; i < commentCount; i++) {
      const comment = new Comment({
        userId: randomElement(users)._id,
        artworkId: artwork._id,
        text: randomElement(commentTemplates),
        timestamp: new Date(
          Date.now() - randomNumber(0, 30) * 24 * 60 * 60 * 1000
        ),
      });
      comments.push(await comment.save());

      // Add comment to artwork
      await Artwork.findByIdAndUpdate(artwork._id, {
        $push: { comments: comment._id },
      });
    }
  }
  return comments;
}

async function createOrders(users, artworks) {
  const orders = [];
  const statuses = ["pending", "completed", "cancelled"];

  // Create orders for about 30% of artworks
  const orderCount = Math.floor(artworks.length * 0.3);
  const selectedArtworks = artworks
    .sort(() => 0.5 - Math.random())
    .slice(0, orderCount);

  for (const artwork of selectedArtworks) {
    const order = new Order({
      artworkId: artwork._id,
      buyerId: randomElement(users.filter((u) => u.role === "user"))._id,
      price: artwork.price,
      status: randomElement(statuses),
    });
    orders.push(await order.save());
  }
  return orders;
}

async function seedDatabase() {
  try {
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Artwork.deleteMany({}),
      Comment.deleteMany({}),
      Order.deleteMany({}),
    ]);

    console.log("Creating users...");
    const artists = await createUsers("artist", CONFIG.ARTISTS_COUNT);
    const regularUsers = await createUsers("user", CONFIG.USERS_COUNT);
    const allUsers = [...artists, ...regularUsers];

    console.log("Creating artworks...");
    const artworks = await createArtworks(artists);

    console.log("Creating comments...");
    await createComments(allUsers, artworks);

    console.log("Creating orders...");
    await createOrders(allUsers, artworks);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
  }
}

// Connect to MongoDB and run seeder
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    seedDatabase();
  })
  .catch((err) => console.error("MongoDB connection error:", err));
