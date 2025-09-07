const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function insertTestUser() {
  await mongoose.connect(process.env.MONGO_URI);

  const user = new User({ email: 'test@uai.cl', password: 'test123' });
  await user.save();
  console.log('Usuario de prueba insertado');
  await mongoose.disconnect();
}

insertTestUser();
