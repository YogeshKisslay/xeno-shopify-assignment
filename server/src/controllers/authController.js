

const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create the user. No verification fields needed.
    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ 
        message: 'Registration successful! Please log in.'
    });
  } catch (error) {
    console.error('--- REGISTRATION ERROR ---', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // --- NEW: Check if the user's store data has been ingested ---
    // We will now return this status to the frontend.
    const store = await prisma.store.findFirst(); // In our single-tenant demo, just find the first store.
    const hasIngested = store ? store.hasIngestedInitialData : false;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
      hasIngested: hasIngested,
    });
  } catch (error) {
    console.error('--- LOGIN ERROR ---', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }});
  const store = await prisma.store.findFirst();
  const hasIngested = store ? store.hasIngestedInitialData : false;
  
  res.status(200).json({ user, hasIngested });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};