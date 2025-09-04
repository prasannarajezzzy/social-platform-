const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory user storage (replace with database in production)
let users = [];
let userIdCounter = 1;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: { message: 'Access token required' } });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: { message: 'Invalid or expired token' } });
    }
    req.user = user;
    next();
  });
};

// Helper function to find user by email
const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

// Helper function to find user by id
const findUserById = (id) => {
  return users.find(user => user.id === id);
};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Auth Routes

// Signup endpoint
app.post('/api/auth/signup', [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: { message: 'User with this email already exists' }
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: userIdCounter++,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    // Return user data without password
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Login endpoint
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' }
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' }
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return user data without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Get user profile endpoint
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    // Return user data without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Basic root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Creator Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      signup: '/api/auth/signup',
      login: '/api/auth/login',
      profile: '/api/auth/me'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});

module.exports = app;
