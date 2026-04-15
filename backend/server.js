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

// Middleware — dynamic CORS so preview URLs (e.g. *.vercel.app) and FRONTEND_URL always match
// (browser Origin has no trailing slash; env vars often do — normalize both)
function normalizeOrigin(origin) {
  if (!origin || typeof origin !== 'string') return '';
  return origin.trim().replace(/\/$/, '');
}

function createCorsOrigin() {
  const extraProd = [
    'https://social-platform-five.vercel.app',
    'https://social-platform-ch61hj9i7-prasannarajezzzys-projects.vercel.app'
  ];
  const fromEnv = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((s) => normalizeOrigin(s.trim()))
    .filter(Boolean);

  const prodAllowList = new Set([
    ...extraProd.map(normalizeOrigin),
    ...fromEnv
  ]);

  const isProd = process.env.NODE_ENV === 'production';

  return function corsOrigin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    const o = normalizeOrigin(origin);

    if (!isProd) {
      if (o === 'http://localhost:3000' || o === 'http://127.0.0.1:3000') {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    }

    if (prodAllowList.has(o)) {
      return callback(null, true);
    }
    if (/^https:\/\/[\w.-]+\.vercel\.app$/i.test(o)) {
      return callback(null, true);
    }
    if (/^https:\/\/[\w.-]+\.netlify\.app$/i.test(o)) {
      return callback(null, true);
    }
    console.warn('[CORS] Blocked origin:', o);
    callback(new Error('Not allowed by CORS'));
  };
}

const corsOptions = {
  origin: createCorsOrigin(),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
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
    
    // Debug logging for authentication
    if (req.path.includes('portfolio-profiles')) {
      console.log('🔧 AUTH DEBUG - Path:', req.path);
      console.log('🔧 AUTH DEBUG - User from token:', user);
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
        portfolioData: user.portfolioData,
        portfolioProfiles: user.portfolioProfiles || [],
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
    console.log('Saving profile for user:', req.user.id);
    console.log('Profile data received:', profileData);
    console.log('Appearance data received:', appearanceData);
    
    const updateData = {};
    if (profileData) {
      const { username: _ignoredUsername, ...profileDataWithoutUsername } = profileData;
      updateData.profileData = profileDataWithoutUsername;
    }
    if (appearanceData) updateData.appearanceData = appearanceData;
    if (portfolioData) {
      updateData.portfolioData = {
        ...portfolioData,
        lastUpdated: new Date()
      };
    }
    updateData.lastProfileUpdate = new Date();

    console.log('Update data:', updateData);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    console.log('Profile saved successfully for user:', user.username);
    console.log('Updated profile data:', user.profileData);
    console.log('Updated appearance data:', user.appearanceData);

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
    if (profileData) {
      const { username: _ignoredUsername, ...profileDataWithoutUsername } = profileData;
      updateData.profileData = profileDataWithoutUsername;
    }
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

// Public portfolio endpoint (no authentication required)
app.get('/api/public/portfolio/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({
      'portfolioProfiles.portfolioData.portfolioUsername': username.toLowerCase(),
      'portfolioProfiles.portfolioData.isPublic': true,
      'portfolioProfiles.isActive': true,
      isActive: true 
    });
    
    if (!user) {
      return res.status(404).json({
        error: { message: 'Portfolio not found or private' }
      });
    }

    // Find the specific portfolio profile
    const portfolioProfile = user.portfolioProfiles.find(profile => 
      profile.portfolioData.portfolioUsername === username.toLowerCase() && 
      profile.isActive
    );
    
    if (!portfolioProfile) {
      return res.status(404).json({
        error: { message: 'Portfolio not found or inactive' }
      });
    }

    // Track portfolio view
    portfolioProfile.portfolioData.portfolioViews = (portfolioProfile.portfolioData.portfolioViews || 0) + 1;
    await user.save();

    // Return public portfolio data (no sensitive information)
    const publicPortfolio = {
      id: portfolioProfile.id,
      name: portfolioProfile.name,
      description: portfolioProfile.description,
      portfolioData: {
        profileName: portfolioProfile.portfolioData.profileName,
        fullName: portfolioProfile.portfolioData.fullName,
        portfolioUsername: portfolioProfile.portfolioData.portfolioUsername,
        resumeUrl: portfolioProfile.portfolioData.resumeUrl,
        contactInfo: portfolioProfile.portfolioData.contactInfo,
        sections: portfolioProfile.portfolioData.sections || [],
        appearance: portfolioProfile.portfolioData.appearance,
        theme: portfolioProfile.portfolioData.theme,
        portfolioViews: portfolioProfile.portfolioData.portfolioViews || 0,
        lastUpdated: portfolioProfile.portfolioData.lastUpdated
      },
      createdAt: portfolioProfile.createdAt,
      updatedAt: portfolioProfile.updatedAt
    };

    res.json(publicPortfolio);

  } catch (error) {
    console.error('Public portfolio fetch error:', error);
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

    console.log('Returning public profile with appearance data:', user.appearanceData);
    res.json(publicProfile);

  } catch (error) {
    console.error('Public profile fetch error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Portfolio Profiles Management Endpoints

// Get all portfolio profiles
app.get('/api/portfolio-profiles', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    res.json({
      success: true,
      profiles: user.portfolioProfiles || []
    });

  } catch (error) {
    console.error('Portfolio profiles fetch error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Create new portfolio profile
app.post('/api/portfolio-profiles', authenticateToken, [
  body('name').trim().isLength({ min: 1 }).withMessage('Profile name is required'),
  body('portfolioUsername').optional().trim().isLength({ min: 3, max: 30 }).withMessage('Portfolio username must be between 3-30 characters').matches(/^[a-zA-Z0-9_-]+$/).withMessage('Portfolio username can only contain letters, numbers, underscores, and hyphens')
], async (req, res) => {
  try {
    console.log('Backend: Creating portfolio profile');
    console.log('Backend: Request body:', req.body);
    console.log('Backend: User ID:', req.user?.id);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Backend: Validation errors:', errors.array());
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { name, description, portfolioData, portfolioUsername } = req.body;
    console.log('Backend: Extracted data:', { name, description, portfolioUsername, portfolioData: portfolioData ? 'present' : 'missing' });
    if (portfolioData && portfolioData.sections) {
      console.log('Backend: Original sections:', portfolioData.sections.map(s => ({ id: s.id, title: s.title, sectionName: s.sectionName })));
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('Backend: User not found');
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }
    console.log('Backend: User found, current portfolio profiles count:', user.portfolioProfiles?.length || 0);

    // Check if portfolio username is already taken
    if (portfolioUsername) {
      const existingPortfolio = await User.findOne({
        'portfolioProfiles.portfolioData.portfolioUsername': portfolioUsername.toLowerCase(),
        _id: { $ne: req.user.id }
      });
      
      if (existingPortfolio) {
        return res.status(400).json({
          error: { message: 'Portfolio username is already taken' }
        });
      }
    }

    // Initialize portfolioProfiles if not present
    if (!user.portfolioProfiles) user.portfolioProfiles = [];

    // Create new portfolio profile
    const newProfile = {
      id: Date.now().toString(),
      name,
      description: description || '',
      isDefault: user.portfolioProfiles.length === 0, // First profile is default
      isActive: true,
      portfolioData: portfolioData ? {
        ...portfolioData,
        portfolioUsername: portfolioUsername ? portfolioUsername.toLowerCase() : '',
        // Ensure sections have the correct field names for the schema
        sections: portfolioData.sections ? portfolioData.sections.map(section => {
          // Use title as sectionName since frontend sends title
          const sectionName = section.title || section.id || 'Untitled Section';
          return {
            id: section.id,
            sectionName: sectionName, // Required field for schema
            title: section.title || sectionName, // Keep title for frontend compatibility
            isVisible: section.isVisible !== undefined ? section.isVisible : true,
            subsections: section.subsections || [],
            bulletPoints: section.bulletPoints || [],
            order: section.order || 0
          };
        }) : []
      } : {
        isPortfolioEnabled: true,
        profileName: 'My Portfolio',
        fullName: '',
        portfolioUsername: portfolioUsername ? portfolioUsername.toLowerCase() : '',
        resumeUrl: '',
        contactInfo: {
          phone: '',
          email: '',
          additionalContacts: []
        },
        sections: [],
        theme: 'professional',
        isPublic: false,
        appearance: {
          portfolioMode: 'professional',
          colorScheme: 'blue',
          layout: 'modern',
          fontFamily: 'inter',
          fontSize: 'medium',
          backgroundType: 'solid',
          backgroundColor: '#ffffff',
          backgroundPattern: '',
          textColor: '#1f2937',
          cardBorderRadius: 'medium',
          cardShadow: 'medium',
          subsectionLayout: 'grid',
          cardDensity: 'comfortable',
          customCSS: ''
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Backend: Creating new profile object:', { id: newProfile.id, name: newProfile.name });
    if (newProfile.portfolioData && newProfile.portfolioData.sections) {
      console.log('Backend: Transformed sections:', newProfile.portfolioData.sections.map(s => ({ 
        id: s.id, 
        sectionName: s.sectionName, 
        title: s.title 
      })));
    }
    user.portfolioProfiles.push(newProfile);
    console.log('Backend: Profile added to user, saving...');
    
    await user.save();
    console.log('Backend: User saved successfully');

    res.status(201).json({
      success: true,
      message: 'Portfolio profile created successfully',
      profile: newProfile
    });

  } catch (error) {
    console.error('Portfolio profile creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Test route to check if PUT routes work
app.put('/api/test-route', authenticateToken, async (req, res) => {
  try {
    console.log('🚨 TEST ROUTE HIT! 🚨');
    res.json({ message: 'Test route working', user: req.user });
  } catch (error) {
    res.status(500).json({ error: { message: 'Test route error' } });
  }
});

// Update portfolio profile
app.put('/api/portfolio-profiles/:profileId', authenticateToken, [
  body('portfolioUsername').optional().trim().isLength({ min: 3, max: 30 }).withMessage('Portfolio username must be between 3-30 characters').matches(/^[a-zA-Z0-9_-]+$/).withMessage('Portfolio username can only contain letters, numbers, underscores, and hyphens')
], async (req, res) => {
  try {
    console.log('🚨 UPDATE ENDPOINT HIT! 🚨');
    const { profileId } = req.params;
    const { name, description, portfolioData, isDefault, isActive, portfolioUsername } = req.body;
    
    // Debug logging
    console.log('🔧 UPDATE DEBUG - Profile ID:', profileId, 'Type:', typeof profileId);
    console.log('🔧 UPDATE DEBUG - User ID:', req.user.id);
    console.log('🔧 UPDATE DEBUG - Request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('🔧 UPDATE DEBUG - User not found for ID:', req.user.id);
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    console.log('🔧 UPDATE DEBUG - User found:', user.name);
    console.log('🔧 UPDATE DEBUG - User portfolio profiles count:', user.portfolioProfiles?.length || 0);
    
    if (user.portfolioProfiles && user.portfolioProfiles.length > 0) {
      console.log('🔧 UPDATE DEBUG - Available profile IDs:');
      user.portfolioProfiles.forEach((p, index) => {
        console.log(`   ${index + 1}. ID: ${p.id} (type: ${typeof p.id}), Name: ${p.name}`);
      });
    }

    const profile = user.portfolioProfiles.find(p => p.id === profileId);
    if (!profile) {
      console.log('🔧 UPDATE DEBUG - Profile not found!');
      console.log('🔧 UPDATE DEBUG - Looking for:', profileId, 'Type:', typeof profileId);
      return res.status(404).json({
        error: { message: 'Portfolio profile not found' }
      });
    }

    console.log('🔧 UPDATE DEBUG - Profile found:', profile.name);

    // Check if portfolio username is already taken (if changing username)
    if (portfolioUsername && portfolioUsername !== profile.portfolioData.portfolioUsername) {
      const existingPortfolio = await User.findOne({
        'portfolioProfiles.portfolioData.portfolioUsername': portfolioUsername.toLowerCase(),
        _id: { $ne: req.user.id }
      });
      
      if (existingPortfolio) {
        return res.status(400).json({
          error: { message: 'Portfolio username is already taken' }
        });
      }
    }

    // Update profile properties
    if (name !== undefined) profile.name = name;
    if (description !== undefined) profile.description = description;
    if (portfolioData !== undefined) {
      profile.portfolioData = {
        ...profile.portfolioData,
        ...portfolioData,
        portfolioUsername: portfolioUsername ? portfolioUsername.toLowerCase() : profile.portfolioData.portfolioUsername
      };
    }
    if (portfolioUsername !== undefined) {
      profile.portfolioData.portfolioUsername = portfolioUsername.toLowerCase();
    }
    if (isDefault !== undefined) profile.isDefault = isDefault;
    if (isActive !== undefined) profile.isActive = isActive;
    
    profile.updatedAt = new Date();
    
    // If setting as default, unset other defaults
    if (isDefault) {
      user.portfolioProfiles.forEach(p => {
        if (p.id !== profileId) p.isDefault = false;
      });
    }
    
    await user.save();

    res.json({
      success: true,
      message: 'Portfolio profile updated successfully',
      profile: profile
    });

  } catch (error) {
    console.error('Portfolio profile update error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Delete portfolio profile
app.delete('/api/portfolio-profiles/:profileId', authenticateToken, async (req, res) => {
  try {
    const { profileId } = req.params;
    console.log('Backend: Attempting to delete portfolio profile with ID:', profileId);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('Backend: User not found');
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    console.log('Backend: User found, portfolio profiles:', user.portfolioProfiles.map(p => ({ id: p.id, name: p.name })));
    console.log('Backend: Looking for profile with ID:', profileId);

    const profileIndex = user.portfolioProfiles.findIndex(p => p.id === profileId);
    console.log('Backend: Profile index found:', profileIndex);
    
    if (profileIndex === -1) {
      console.log('Backend: Portfolio profile not found');
      return res.status(404).json({
        error: { message: 'Portfolio profile not found' }
      });
    }

    const deletedProfile = user.portfolioProfiles[profileIndex];
    console.log('Backend: Profile to delete:', { id: deletedProfile.id, name: deletedProfile.name });
    
    // Don't allow deleting the last profile
    if (user.portfolioProfiles.length === 1) {
      console.log('Backend: Cannot delete last profile');
      return res.status(400).json({
        error: { message: 'Cannot delete the last portfolio profile' }
      });
    }

    user.portfolioProfiles.splice(profileIndex, 1);
    
    // If deleted profile was default, set another as default
    if (deletedProfile.isDefault && user.portfolioProfiles.length > 0) {
      user.portfolioProfiles[0].isDefault = true;
    }
    
    await user.save();
    console.log('Backend: Portfolio profile deleted successfully');

    res.json({
      success: true,
      message: 'Portfolio profile deleted successfully'
    });

  } catch (error) {
    console.error('Portfolio profile deletion error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Check portfolio username availability
app.get('/api/portfolio-profiles/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username || username.length < 3 || username.length > 30) {
      return res.status(400).json({
        error: { message: 'Username must be between 3-30 characters' }
      });
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return res.status(400).json({
        error: { message: 'Username can only contain letters, numbers, underscores, and hyphens' }
      });
    }
    
    const existingPortfolio = await User.findOne({
      'portfolioProfiles.portfolioData.portfolioUsername': username.toLowerCase()
    });
    
    res.json({
      available: !existingPortfolio,
      username: username.toLowerCase()
    });
    
  } catch (error) {
    console.error('Username check error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Set default portfolio profile
app.put('/api/portfolio-profiles/:profileId/set-default', authenticateToken, async (req, res) => {
  try {
    const { profileId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    const profile = user.portfolioProfiles.find(p => p.id === profileId);
    if (!profile) {
      return res.status(404).json({
        error: { message: 'Portfolio profile not found' }
      });
    }

    // Unset all defaults
    user.portfolioProfiles.forEach(p => p.isDefault = false);
    
    // Set this profile as default
    profile.isDefault = true;
    profile.updatedAt = new Date();
    
    await user.save();

    res.json({
      success: true,
      message: 'Default portfolio profile updated successfully',
      profile: profile
    });

  } catch (error) {
    console.error('Set default portfolio profile error:', error);
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
      publicProfile: '/api/public/profile/:username',
      publicPortfolio: '/api/public/portfolio/:username',
      
      // Portfolio Management
      portfolioProfiles: '/api/portfolio-profiles',
      checkUsername: '/api/portfolio-profiles/check-username/:username'
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
