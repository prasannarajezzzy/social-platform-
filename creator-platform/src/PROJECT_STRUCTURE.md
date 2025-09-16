# Project Structure

This document outlines the organized folder structure for the Creator Platform.

## Main Structure

```
src/
├── components/          # Shared components
│   ├── LoadingSpinner.js
│   ├── Navbar.js
│   └── ProtectedRoute.js
├── config/             # Configuration files
│   └── api.js
├── contexts/           # Shared contexts
│   ├── AuthContext.js
│   └── ProfileContext.js
├── creator/            # Creator Module (Social Media Influencers)
│   ├── components/     # Creator-specific components
│   ├── contexts/       # Creator-specific contexts
│   ├── pages/          # Creator pages
│   │   ├── ProfilePage.js
│   │   └── PublicProfile.js
│   ├── services/       # Creator-specific services
│   ├── styles/         # Creator-specific styles
│   ├── index.js        # Creator module exports
│   └── README.md       # Creator module documentation
├── hooks/              # Custom React hooks
│   └── useAuthRedirect.js
├── pages/              # Shared pages
│   ├── AboutUs.js
│   ├── Dashboard.js
│   ├── LandingPage.js
│   ├── LoginPage.js
│   └── RegisterPage.js
├── portfolio/          # Portfolio Module (Job Seekers)
│   ├── components/     # Portfolio-specific components
│   ├── contexts/        # Portfolio-specific contexts
│   ├── pages/           # Portfolio pages
│   │   ├── PortfolioBuilder.js
│   │   └── PortfolioDisplay.js
│   ├── services/        # Portfolio-specific services
│   ├── styles/          # Portfolio-specific styles
│   │   ├── PortfolioBuilder.css
│   │   └── PortfolioDisplay.css
│   ├── index.js         # Portfolio module exports
│   └── README.md        # Portfolio module documentation
├── services/            # Shared services
│   └── authAPI.js
├── styles/             # Shared styles
│   ├── README.md
│   ├── theme.css
│   └── theme.js
├── App.js              # Main app component
├── App.css             # Main app styles
├── index.js            # App entry point
└── PROJECT_STRUCTURE.md # This file
```

## Module Separation

### Creator Module (`/creator/`)
- **Purpose**: Social media influencer profiles
- **Features**: Social links, analytics, appearance customization
- **Pages**: ProfilePage, PublicProfile
- **Target Users**: Content creators, influencers, social media personalities

### Portfolio Module (`/portfolio/`)
- **Purpose**: Professional job seeker portfolios
- **Features**: Resume links, contact info, flexible content structure
- **Pages**: PortfolioBuilder, PortfolioDisplay
- **Target Users**: Job seekers, professionals, students

### Shared Components (`/components/`, `/contexts/`, `/services/`)
- **Purpose**: Common functionality used by both modules
- **Includes**: Authentication, navigation, shared utilities
- **Reusable**: Components and services used across modules

## Benefits of This Structure

1. **Clear Separation**: Portfolio and creator functionality are completely separated
2. **Scalability**: Easy to add new features to each module independently
3. **Maintainability**: Clear organization makes code easier to maintain
4. **Team Development**: Different teams can work on different modules
5. **Code Reuse**: Shared components reduce duplication
6. **Documentation**: Each module has its own documentation

## Import Examples

```javascript
// Import from creator module
import { ProfilePage, PublicProfile } from './creator';

// Import from portfolio module
import { PortfolioBuilder, PortfolioDisplay } from './portfolio';

// Import shared components
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
```
