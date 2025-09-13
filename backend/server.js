require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Load production config if in production
const productionConfig = process.env.NODE_ENV === 'production' ? require('./config.production') : null;
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectDB = require('./config/database');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL,
        'https://social-platform-five.vercel.app',
        'https://social-platform-ch61hj9i7-prasannarajezzzys-projects.vercel.app',
        'https://your-frontend-domain.vercel.app',
        /\.vercel\.app$/,
        /\.netlify\.app$/
      ]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'MongoDB Connected'
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

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: { message: 'User with this email already exists' }
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password, // Will be hashed by the pre-save middleware
      profileData: {
        socialLinks: {},
        customLinks: []
      },
      appearanceData: {}
    });

    // Generate username if not provided
    newUser.generateUsername();

    // Save user to database
    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    // Return user data without password
    const userResponse = newUser.toSafeObject();

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: userResponse._id,
        name: userResponse.name,
        email: userResponse.email,
        username: userResponse.username,
        createdAt: userResponse.createdAt
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        error: { message: `${field} already exists` }
      });
    }
    
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

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' }
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' }
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    // Return user data without password
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Get user profile endpoint
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    // Return user data without password
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      profileData: user.profileData,
      appearanceData: user.appearanceData,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Get user profile endpoint
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    res.json({
      success: true,
      profile: {
        username: user.username,
        profileData: user.profileData,
        appearanceData: user.appearanceData,
        analytics: user.analytics,
        settings: user.settings
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Save/Update user profile endpoint (POST for compatibility)
app.post('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { profileData, appearanceData, portfolioData } = req.body;
    
    const updateData = {};
    if (profileData) updateData.profileData = profileData;
    if (appearanceData) updateData.appearanceData = appearanceData;
    if (portfolioData) {
      updateData.portfolioData = {
        ...portfolioData,
        lastUpdated: new Date()
      };
    }
    updateData.lastProfileUpdate = new Date();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    res.json({
      success: true,
      message: 'Profile saved successfully',
      profileData: user.profileData,
      appearanceData: user.appearanceData
    });

  } catch (error) {
    console.error('Profile save error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Update user profile endpoint (PUT for RESTful compliance)
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { profileData, appearanceData } = req.body;
    
    const updateData = {};
    if (profileData) updateData.profileData = profileData;
    if (appearanceData) updateData.appearanceData = appearanceData;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    res.json({
      message: 'Profile updated successfully',
      profileData: user.profileData,
      appearanceData: user.appearanceData
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Enhanced track link click endpoint with analytics
app.post('/api/profile/track-click/:linkId', async (req, res) => {
  try {
    const { linkId } = req.params;
    const { referrer, country, city, userAgent } = req.body;
    
    // Find user by link ID (public endpoint, no auth required)
    const user = await User.findOne({ 'profileData.customLinks.id': linkId });
    
    if (!user) {
      return res.status(404).json({
        error: { message: 'Link not found' }
      });
    }

    // Track the click with analytics data
    const clickData = {
      referrer: referrer || 'direct',
      country: country || 'Unknown',
      city: city || 'Unknown',
      userAgent: userAgent || 'Unknown'
    };

    const success = user.trackLinkClick(linkId, clickData);
    
    if (!success) {
      return res.status(404).json({
        error: { message: 'Link not found' }
      });
    }

    await user.save();

    // Get the link URL to redirect
    const link = user.profileData.customLinks.id(linkId);
    
    res.json({ 
      message: 'Click tracked successfully',
      redirectUrl: link.url
    });

  } catch (error) {
    console.error('Click tracking error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Add/Create custom link endpoint
app.post('/api/profile/links', authenticateToken, [
  body('title').trim().isLength({ min: 1 }).withMessage('Link title is required'),
  body('url').isURL().withMessage('Valid URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { title, url, description, icon } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    // Initialize profileData if not present
    if (!user.profileData) user.profileData = { customLinks: [] };
    if (!user.profileData.customLinks) user.profileData.customLinks = [];

    // Create new link
    const newLink = {
      id: Date.now().toString(),
      title,
      url: url.startsWith('http') ? url : `https://${url}`,
      description: description || '',
      icon: icon || 'ExternalLink',
      order: user.profileData.customLinks.length,
      analytics: {
        dailyClicks: [],
        weeklyClicks: [],
        monthlyClicks: [],
        referrers: [],
        locations: []
      }
    };

    user.profileData.customLinks.push(newLink);
    user.lastProfileUpdate = new Date();
    
    await user.save();

    res.status(201).json({
      message: 'Link created successfully',
      link: newLink
    });

  } catch (error) {
    console.error('Link creation error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Update custom link endpoint
app.put('/api/profile/links/:linkId', authenticateToken, async (req, res) => {
  try {
    const { linkId } = req.params;
    const { title, url, description, icon, isActive, order } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    const link = user.profileData.customLinks.id(linkId);
    if (!link) {
      return res.status(404).json({
        error: { message: 'Link not found' }
      });
    }

    // Update link properties
    if (title !== undefined) link.title = title;
    if (url !== undefined) link.url = url.startsWith('http') ? url : `https://${url}`;
    if (description !== undefined) link.description = description;
    if (icon !== undefined) link.icon = icon;
    if (isActive !== undefined) link.isActive = isActive;
    if (order !== undefined) link.order = order;
    
    link.updatedAt = new Date();
    user.lastProfileUpdate = new Date();
    
    await user.save();

    res.json({
      message: 'Link updated successfully',
      link: link
    });

  } catch (error) {
    console.error('Link update error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Delete custom link endpoint
app.delete('/api/profile/links/:linkId', authenticateToken, async (req, res) => {
  try {
    const { linkId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    const linkIndex = user.profileData.customLinks.findIndex(link => link.id === linkId);
    if (linkIndex === -1) {
      return res.status(404).json({
        error: { message: 'Link not found' }
      });
    }

    user.profileData.customLinks.splice(linkIndex, 1);
    user.lastProfileUpdate = new Date();
    
    await user.save();

    res.json({
      message: 'Link deleted successfully'
    });

  } catch (error) {
    console.error('Link deletion error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Reorder links endpoint
app.put('/api/profile/links/reorder', authenticateToken, async (req, res) => {
  try {
    const { linkOrder } = req.body; // Array of { id, order } objects
    
    if (!Array.isArray(linkOrder)) {
      return res.status(400).json({
        error: { message: 'linkOrder must be an array' }
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    // Update order for each link
    linkOrder.forEach(({ id, order }) => {
      const link = user.profileData.customLinks.id(id);
      if (link) {
        link.order = order;
        link.updatedAt = new Date();
      }
    });

    // Sort links by order
    user.profileData.customLinks.sort((a, b) => a.order - b.order);
    user.lastProfileUpdate = new Date();
    
    await user.save();

    res.json({
      message: 'Links reordered successfully',
      links: user.profileData.customLinks
    });

  } catch (error) {
    console.error('Link reorder error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Analytics endpoint
app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    const analytics = user.getAnalyticsSummary();
    
    res.json({
      message: 'Analytics retrieved successfully',
      analytics
    });

  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Detailed link analytics endpoint
app.get('/api/analytics/links/:linkId', authenticateToken, async (req, res) => {
  try {
    const { linkId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    const link = user.profileData.customLinks.id(linkId);
    if (!link) {
      return res.status(404).json({
        error: { message: 'Link not found' }
      });
    }

    res.json({
      message: 'Link analytics retrieved successfully',
      linkAnalytics: {
        id: link.id,
        title: link.title,
        url: link.url,
        totalClicks: link.clicks,
        analytics: link.analytics,
        isActive: link.isActive,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt
      }
    });

  } catch (error) {
    console.error('Link analytics fetch error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Public profile endpoint (no authentication required)
app.get('/api/public/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ 
      username: username.toLowerCase(),
      'settings.isPublic': true,
      isActive: true 
    });
    
    if (!user) {
      return res.status(404).json({
        error: { message: 'Profile not found or private' }
      });
    }

    // Track profile view
    user.trackProfileView({
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer,
      ip: req.ip
    });
    
    await user.save();

    // Return public profile data (no sensitive information)
    const publicProfile = {
      name: user.name,
      username: user.username,
      profileData: {
        profileImage: user.profileData?.profileImage,
        profileImageUrl: user.profileData?.profileImageUrl,
        title: user.profileData?.title,
        bio: user.profileData?.bio,
        socialLinks: user.profileData?.socialLinks,
        customLinks: user.profileData?.customLinks
          ?.filter(link => link.isActive)
          ?.sort((a, b) => a.order - b.order)
          ?.map(link => ({
            id: link.id,
            title: link.title,
            url: link.url,
            description: link.description,
            icon: link.icon,
            order: link.order
          }))
      },
      appearanceData: user.appearanceData,
      settings: {
        seoEnabled: user.settings?.seoEnabled,
        metaDescription: user.settings?.metaDescription,
        metaKeywords: user.settings?.metaKeywords
      },
      stats: {
        totalLinks: user.profileData?.customLinks?.filter(link => link.isActive)?.length || 0,
        joinedDate: user.createdAt
      }
    };

    res.json(publicProfile);

  } catch (error) {
    console.error('Public profile fetch error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Update profile settings endpoint
app.put('/api/profile/settings', authenticateToken, async (req, res) => {
  try {
    const { 
      isPublic, 
      allowAnalytics, 
      seoEnabled, 
      customDomain, 
      metaDescription, 
      metaKeywords,
      googleAnalyticsId,
      facebookPixelId 
    } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    // Initialize settings if not present
    if (!user.settings) user.settings = {};

    // Update settings
    if (isPublic !== undefined) user.settings.isPublic = isPublic;
    if (allowAnalytics !== undefined) user.settings.allowAnalytics = allowAnalytics;
    if (seoEnabled !== undefined) user.settings.seoEnabled = seoEnabled;
    if (customDomain !== undefined) user.settings.customDomain = customDomain;
    if (metaDescription !== undefined) user.settings.metaDescription = metaDescription;
    if (metaKeywords !== undefined) user.settings.metaKeywords = metaKeywords;
    if (googleAnalyticsId !== undefined) user.settings.googleAnalyticsId = googleAnalyticsId;
    if (facebookPixelId !== undefined) user.settings.facebookPixelId = facebookPixelId;

    user.lastProfileUpdate = new Date();
    await user.save();

    res.json({
      message: 'Settings updated successfully',
      settings: user.settings
    });

  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Basic root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Creator Platform API',
    version: '3.0.0',
    database: 'MongoDB with Mongoose + Analytics',
    features: [
      'User Authentication',
      'Profile Management',
      'Custom Links with Analytics',
      'Public Profiles',
      'Real-time Click Tracking',
      'Detailed Analytics Dashboard',
      'SEO Optimization'
    ],
    endpoints: {
      // Authentication
      health: '/health',
      signup: '/api/auth/signup',
      login: '/api/auth/login',
      profile: '/api/auth/me',
      
      // Profile Management
      updateProfile: '/api/profile',
      updateSettings: '/api/profile/settings',
      
      // Link Management
      createLink: '/api/profile/links',
      updateLink: '/api/profile/links/:linkId',
      deleteLink: '/api/profile/links/:linkId',
      reorderLinks: '/api/profile/links/reorder',
      
      // Analytics & Tracking
      trackClick: '/api/profile/track-click/:linkId',
      analytics: '/api/analytics',
      linkAnalytics: '/api/analytics/links/:linkId',
      
      // Public Access
      publicProfile: '/api/public/profile/:username'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: { message: 'Something went wrong!' }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});

module.exports = app;
