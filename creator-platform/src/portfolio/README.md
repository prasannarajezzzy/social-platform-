# Portfolio Module

This module contains all portfolio-related functionality for job seekers.

## Structure

```
portfolio/
├── components/          # Reusable portfolio components
├── contexts/            # Portfolio-specific contexts
├── pages/              # Portfolio pages
│   ├── PortfolioBuilder.js
│   └── PortfolioDisplay.js
├── services/            # Portfolio-specific services
├── styles/             # Portfolio-specific styles
│   ├── PortfolioBuilder.css
│   └── PortfolioDisplay.css
├── index.js            # Module exports
└── README.md           # This file
```

## Features

- **Portfolio Builder**: Create and edit professional portfolios
- **Portfolio Display**: Public portfolio viewing
- **Appearance Customization**: Color schemes, layouts, typography
- **Flexible Content Structure**: Sections, subsections, bullet points
- **Contact Management**: Multiple contact types and methods

## Usage

```javascript
import { PortfolioBuilder, PortfolioDisplay } from './portfolio';
```
