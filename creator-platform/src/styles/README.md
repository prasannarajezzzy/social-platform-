# 🎨 Creator Platform Theme System

This directory contains the centralized color system and design tokens for the Creator Platform.

## 📁 Files

- `theme.css` - Main theme file with all color definitions and utility classes

## 🎯 Usage

### Importing the Theme

The theme is automatically imported in:
- `src/index.css` (global import)
- `src/App.css` (component styles)

### Using Colors in CSS

```css
/* Use semantic color variables */
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

/* Use direct color variables */
.highlight {
  background-color: var(--electric-blue);
  color: var(--white);
}

/* Use gradient variables */
.hero-section {
  background: var(--primary-gradient);
}
```

### Using Utility Classes

```html
<!-- Background colors -->
<div class="bg-electric-blue">Electric Blue Background</div>
<div class="bg-primary-gradient">Gradient Background</div>

<!-- Text colors -->
<p class="text-vibrant-coral">Coral text</p>
<p class="text-success">Success message</p>

<!-- Border colors -->
<div class="border-soft-teal">Teal border</div>
```

## 🎨 Color Categories

### Primary Colors
- `--electric-blue` - Main brand color
- `--dark-charcoal` - Primary text and UI elements
- `--white` - Backgrounds and inverse text

### Secondary Colors
- `--vibrant-coral` - Error states, accent elements
- `--soft-teal` - Success states, positive actions

### Neutral Tones
- `--light-gray` - Subtle backgrounds, borders
- `--muted-gold` - Premium features, ratings

### Accent Colors
- `--sunset-orange` - Warning states, hover effects
- `--light-sky-blue` - Highlights, gradients

## 🔧 Semantic Variables

Use semantic variables for consistent, meaningful color application:

```css
/* States */
--success-color
--error-color
--warning-color
--info-color

/* Text hierarchy */
--text-primary
--text-secondary
--text-muted
--text-disabled

/* Backgrounds */
--bg-primary
--bg-secondary
--bg-tertiary

/* Interactive states */
--btn-primary-bg
--btn-primary-hover
--input-border-focus
```

## 🌟 Best Practices

1. **Always use theme variables** instead of hardcoded colors
2. **Prefer semantic variables** over direct color variables when possible
3. **Use utility classes** for simple color applications
4. **Test with accessibility tools** to ensure proper contrast ratios
5. **Update theme.css** when adding new colors or components

## 🔄 Making Changes

To modify colors:

1. Edit `src/styles/theme.css`
2. Update semantic variables if needed
3. Test across all components
4. Update this documentation if adding new categories

## 🎭 Future: Dark Mode

The theme system is designed to support dark mode. When implementing:

1. Add dark mode variables to `theme.css`
2. Use `[data-theme="dark"]` selector
3. Update semantic variables for dark context
4. Test all components in both modes

Example:
```css
[data-theme="dark"] {
  --bg-primary: var(--dark-charcoal);
  --text-primary: var(--white);
  --border-primary: #404040;
}
```
