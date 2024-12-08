require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Helper arrays from your seeder
const FIRST_NAMES = [
  "Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Isabella", "William", 
  "Sophia", "James", "Charlotte", "Benjamin", "Mia", "Lucas", "Amelia"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", 
  "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez"
];

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function updateUserNames() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);

    // Update each user
    for (const user of users) {
      const firstName = randomElement(FIRST_NAMES);
      const lastName = randomElement(LAST_NAMES);
      
      await User.findByIdAndUpdate(user._id, {
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`
      });
      
      console.log(`Updated user: ${user.username} with name: ${firstName} ${lastName}`);
    }

    console.log('All users updated successfully!');
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the update script
updateUserNames(); 