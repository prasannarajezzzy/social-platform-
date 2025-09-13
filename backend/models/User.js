const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],

    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  username: {
    type: String,
    unique: true,
    sparse: true, // Allow null values but ensure uniqueness when present
    trim: true,
    lowercase: true
  },
  profileData: {
    profileImage: String,
    profileImageUrl: String,
    title: String,
    bio: String,
    socialLinks: {
      instagram: String,
      twitter: String,
      youtube: String,
      linkedin: String,
      github: String,
      facebook: String,
      tiktok: String,
      website: String
    },
    customLinks: [{
      id: {
        type: String,
        default: () => Date.now().toString()
      },
      title: {
        type: String,
        required: [true, 'Link title is required']
      },
      url: {
        type: String,
        required: [true, 'Link URL is required'],
        validate: {
          validator: function(v) {
            return /^https?:\/\/.+/.test(v);
          },
          message: 'Please provide a valid URL starting with http:// or https://'
        }
      },
      description: String,
      icon: {
        type: String,
        default: 'ExternalLink'
      },
      isActive: {
        type: Boolean,
        default: true
      },
      clicks: {
        type: Number,
        default: 0
      },
      order: {
        type: Number,
        default: 0
      },
      analytics: {
        dailyClicks: [{
          date: Date,
          clicks: { type: Number, default: 0 }
        }],
        weeklyClicks: [{
          week: String, // Format: "2024-W01"
          clicks: { type: Number, default: 0 }
        }],
        monthlyClicks: [{
          month: String, // Format: "2024-01"
          clicks: { type: Number, default: 0 }
        }],
        referrers: [{
          source: String,
          clicks: { type: Number, default: 0 }
        }],
        locations: [{
          country: String,
          city: String,
          clicks: { type: Number, default: 0 }
        }]
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  appearanceData: {
    theme: {
      type: String,
      default: 'lake-white'
    },
    brandColor: {
      type: String,
      default: '#667eea'
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    buttonStyle: {
      type: String,
      default: 'rounded'
    },
    buttonLayout: {
      type: String,
      default: 'stack'
    },
    font: {
      type: String,
      default: 'inter'
    },
    customCSS: String
  },
  portfolioData: {
    isPortfolioEnabled: {
      type: Boolean,
      default: false
    },
    fullName: String,
    portfolioUsername: {
      type: String,
      sparse: true,
      trim: true,
      lowercase: true
    },
    resumeUrl: String,
    contactInfo: {
      phone: String,
      email: String,
      additionalContacts: [{
        label: String,
        value: String,
        type: {
          type: String,
          enum: ['email', 'phone', 'website', 'social', 'other'],
          default: 'other'
        }
      }]
    },
        sections: [{
          id: {
            type: String,
            default: () => Date.now().toString()
          },
          sectionName: {
            type: String,
            required: [true, 'Section name is required']
          },
          bulletPoints: [String],
          order: {
            type: Number,
            default: 0
          },
          subsections: [{
            id: {
              type: String,
              default: () => Date.now().toString()
            },
            title: String,
            bulletPoints: [String],
            order: {
              type: Number,
              default: 0
            },
            dateRange: {
              startDate: String,
              endDate: String,
              isCurrent: {
                type: Boolean,
                default: false
              }
            },
            description: String,
            tags: [String]
          }]
        }],
    theme: {
      type: String,
      default: 'professional'
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    portfolioViews: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  analytics: {
    profileViews: {
      total: { type: Number, default: 0 },
      daily: [{
        date: Date,
        views: { type: Number, default: 0 }
      }],
      weekly: [{
        week: String, // Format: "2024-W01"
        views: { type: Number, default: 0 }
      }],
      monthly: [{
        month: String, // Format: "2024-01"
        views: { type: Number, default: 0 }
      }]
    },
    totalClicks: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }, // clicks/views ratio
    topPerformingLinks: [{
      linkId: String,
      clicks: Number,
      title: String
    }],
    visitorData: {
      uniqueVisitors: { type: Number, default: 0 },
      returningVisitors: { type: Number, default: 0 },
      avgSessionDuration: { type: Number, default: 0 }, // in seconds
      bounceRate: { type: Number, default: 0 } // percentage
    },
    geoData: [{
      country: String,
      city: String,
      visits: { type: Number, default: 0 },
      lastVisit: Date
    }],
    deviceData: [{
      type: String, // mobile, desktop, tablet
      visits: { type: Number, default: 0 },
      percentage: Number
    }],
    referralSources: [{
      source: String, // direct, google, instagram, etc.
      visits: { type: Number, default: 0 },
      percentage: Number
    }]
  },
  settings: {
    isPublic: { type: Boolean, default: true },
    allowAnalytics: { type: Boolean, default: true },
    seoEnabled: { type: Boolean, default: true },
    customDomain: String,
    metaDescription: String,
    metaKeywords: [String],
    googleAnalyticsId: String,
    facebookPixelId: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  lastProfileUpdate: Date
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance (removed to avoid duplicates since we're setting unique in schema)
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ username: 1 }, { unique: true, sparse: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!candidatePassword || !this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate username from email if not provided
userSchema.methods.generateUsername = function() {
  if (!this.username) {
    const baseUsername = this.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    this.username = baseUsername.toLowerCase() + Math.floor(Math.random() * 1000);
  }
};

// Method to get user data without sensitive information
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Method to track profile view
userSchema.methods.trackProfileView = function(visitorData = {}) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Increment total views
  if (!this.analytics) this.analytics = { profileViews: { total: 0, daily: [], weekly: [], monthly: [] } };
  if (!this.analytics.profileViews) this.analytics.profileViews = { total: 0, daily: [], weekly: [], monthly: [] };
  
  this.analytics.profileViews.total += 1;
  
  // Track daily views
  const dailyEntry = this.analytics.profileViews.daily.find(d => 
    d.date.toISOString().split('T')[0] === todayStr
  );
  
  if (dailyEntry) {
    dailyEntry.views += 1;
  } else {
    this.analytics.profileViews.daily.push({
      date: today,
      views: 1
    });
  }
  
  // Keep only last 30 days
  this.analytics.profileViews.daily = this.analytics.profileViews.daily
    .filter(d => (today - d.date) <= 30 * 24 * 60 * 60 * 1000)
    .sort((a, b) => b.date - a.date);
};

// Method to track link click with analytics
userSchema.methods.trackLinkClick = function(linkId, clickData = {}) {
  const link = this.profileData.customLinks.id(linkId);
  if (!link) return false;
  
  // Increment total clicks
  link.clicks += 1;
  this.analytics.totalClicks += 1;
  
  // Initialize analytics if not present
  if (!link.analytics) {
    link.analytics = {
      dailyClicks: [],
      weeklyClicks: [],
      monthlyClicks: [],
      referrers: [],
      locations: []
    };
  }
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Track daily clicks for this link
  const dailyEntry = link.analytics.dailyClicks.find(d => 
    d.date.toISOString().split('T')[0] === todayStr
  );
  
  if (dailyEntry) {
    dailyEntry.clicks += 1;
  } else {
    link.analytics.dailyClicks.push({
      date: today,
      clicks: 1
    });
  }
  
  // Track referrer if provided
  if (clickData.referrer) {
    const referrerEntry = link.analytics.referrers.find(r => r.source === clickData.referrer);
    if (referrerEntry) {
      referrerEntry.clicks += 1;
    } else {
      link.analytics.referrers.push({
        source: clickData.referrer,
        clicks: 1
      });
    }
  }
  
  // Track location if provided
  if (clickData.country) {
    const locationEntry = link.analytics.locations.find(l => 
      l.country === clickData.country && l.city === (clickData.city || '')
    );
    if (locationEntry) {
      locationEntry.clicks += 1;
    } else {
      link.analytics.locations.push({
        country: clickData.country,
        city: clickData.city || '',
        clicks: 1
      });
    }
  }
  
  // Update link's updatedAt
  link.updatedAt = new Date();
  
  // Update conversion rate
  this.updateConversionRate();
  
  return true;
};

// Method to calculate and update conversion rate
userSchema.methods.updateConversionRate = function() {
  if (!this.analytics || !this.analytics.profileViews) return;
  
  const totalViews = this.analytics.profileViews.total;
  const totalClicks = this.analytics.totalClicks;
  
  this.analytics.conversionRate = totalViews > 0 ? (totalClicks / totalViews * 100) : 0;
};

// Method to get analytics summary
userSchema.methods.getAnalyticsSummary = function() {
  const summary = {
    profileViews: {
      total: this.analytics?.profileViews?.total || 0,
      last30Days: 0,
      last7Days: 0
    },
    linkClicks: {
      total: this.analytics?.totalClicks || 0,
      last30Days: 0,
      last7Days: 0
    },
    conversionRate: this.analytics?.conversionRate || 0,
    topLinks: [],
    recentActivity: []
  };
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Calculate view stats
  if (this.analytics?.profileViews?.daily) {
    this.analytics.profileViews.daily.forEach(day => {
      if (day.date >= thirtyDaysAgo) summary.profileViews.last30Days += day.views;
      if (day.date >= sevenDaysAgo) summary.profileViews.last7Days += day.views;
    });
  }
  
  // Calculate click stats and top links
  if (this.profileData?.customLinks) {
    this.profileData.customLinks.forEach(link => {
      if (link.isActive) {
        summary.topLinks.push({
          id: link.id,
          title: link.title,
          clicks: link.clicks,
          url: link.url
        });
        
        // Calculate recent clicks
        if (link.analytics?.dailyClicks) {
          link.analytics.dailyClicks.forEach(day => {
            if (day.date >= thirtyDaysAgo) summary.linkClicks.last30Days += day.clicks;
            if (day.date >= sevenDaysAgo) summary.linkClicks.last7Days += day.clicks;
          });
        }
      }
    });
    
    // Sort top links by clicks
    summary.topLinks.sort((a, b) => b.clicks - a.clicks);
    summary.topLinks = summary.topLinks.slice(0, 5); // Top 5 links
  }
  
  return summary;
};

module.exports = mongoose.model('User', userSchema);
