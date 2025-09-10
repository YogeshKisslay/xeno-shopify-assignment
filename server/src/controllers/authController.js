const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../services/emailServices');

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
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
      },
    });

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid verification token.' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null, // Clear the token
            },
        });

        res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during email verification.', error: error.message });
    }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // IMPORTANT: Check if user is verified
    if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getMe = async (req, res) => {
  // The authMiddleware already found the user and attached it to req.user
  // We just need to send it back.
  res.status(200).json(req.user);
};
module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  getMe,
};
