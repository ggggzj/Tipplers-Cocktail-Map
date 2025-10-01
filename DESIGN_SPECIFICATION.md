# TipplersCocktailMap Design Specification
*Vogue Editorial × Godfather Elegance × Luxurious Minimalism*

## Design Philosophy
The website embodies sophisticated editorial design inspired by Vogue magazine's clean typography and visual hierarchy, combined with the cinematic elegance and understated luxury of The Godfather aesthetic. The overall approach is minimal yet bold, with a light, airy foundation punctuated by strategic black and gold accents.

## Color Palette

### Primary Colors
- **Pure White**: `#FFFFFF` - Primary background, creating that airy, editorial feel
- **Warm White**: `#FEFEFE` - Secondary background for subtle layering
- **Soft Cream**: `#FAFAF9` - Tertiary background for cards and sections

### Accent Colors
- **Deep Black**: `#0A0A0A` - Primary text, navigation, strong contrasts
- **Charcoal**: `#1A1A1A` - Secondary text, subtle elements
- **Gold**: `#D4AF37` - Luxury accents, highlights, CTAs
- **Champagne Gold**: `#F7E7CE` - Subtle gold backgrounds, hover states
- **Rose Gold**: `#E8B4A0` - Secondary luxury accent for ratings/premium features

### Supporting Colors
- **Light Gray**: `#F5F5F5` - Borders, dividers, input backgrounds
- **Medium Gray**: `#9CA3AF` - Placeholder text, secondary information
- **Success Green**: `#10B981` - Available/open status indicators
- **Warning Amber**: `#F59E0B` - Busy/limited availability

## Typography

### Primary Typeface: Playfair Display (Editorial Headlines)
```css
font-family: 'Playfair Display', serif;
```
- **Usage**: Hero headlines, section titles, featured content
- **Characteristics**: High contrast, elegant serifs, editorial sophistication
- **Weights**: 400 (Regular), 600 (SemiBold), 700 (Bold)

### Secondary Typeface: Inter (Modern Sans-Serif)
```css
font-family: 'Inter', sans-serif;
```
- **Usage**: Body text, navigation, UI elements, descriptions
- **Characteristics**: Clean, readable, modern
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold)

### Typography Scale
- **Hero Headline**: 72px / 4.5rem (Desktop), 48px / 3rem (Mobile)
- **Section Titles**: 48px / 3rem (Desktop), 36px / 2.25rem (Mobile)
- **Card Titles**: 24px / 1.5rem
- **Body Text**: 16px / 1rem
- **Small Text**: 14px / 0.875rem
- **Caption**: 12px / 0.75rem

### Line Heights
- **Headlines**: 1.1
- **Titles**: 1.2
- **Body Text**: 1.6
- **UI Elements**: 1.4

## Spacing System
Based on 8px grid system for consistency and rhythm.

### Base Unit: 8px
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)
- **4xl**: 96px (6rem)

### Section Spacing
- **Between Sections**: 96px (Desktop), 64px (Mobile)
- **Within Sections**: 48px (Desktop), 32px (Mobile)
- **Card Spacing**: 24px gaps in grid layouts

## Layout Guidelines

### Grid System
- **Desktop**: 12-column grid with 24px gutters
- **Tablet**: 8-column grid with 20px gutters
- **Mobile**: 4-column grid with 16px gutters

### Container Widths
- **Maximum Width**: 1440px
- **Content Width**: 1200px
- **Narrow Content**: 800px (for readability)

### Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 768px)  /* Tablet */
@media (min-width: 1024px) /* Desktop */
@media (min-width: 1440px) /* Large Desktop */
```

## Component Specifications

### Navigation Bar
- **Height**: 80px (Desktop), 64px (Mobile)
- **Background**: Pure White with subtle shadow
- **Logo**: Left-aligned, Playfair Display, 24px
- **Menu Items**: Inter Medium, 16px, 40px spacing
- **Mobile**: Hamburger menu with slide-out drawer

### Hero Section
- **Layout**: Full viewport height (100vh)
- **Background**: White with large, editorial-style image
- **Typography**: Playfair Display for headline, Inter for subtitle
- **CTA Button**: Gold background, black text, 16px padding

### Bar Recommendation Cards
- **Dimensions**: 400px × 500px (Desktop), Full width (Mobile)
- **Layout**: Image (60%), Content (40%)
- **Border Radius**: 12px
- **Shadow**: Subtle (0 4px 12px rgba(0,0,0,0.1))
- **Hover Effect**: Slight scale (1.02) + shadow increase

### Search & Filter Bar
- **Height**: 64px
- **Background**: Light Gray with white inputs
- **Border Radius**: 32px (pill shape)
- **Inputs**: 44px height, 16px padding

### Interactive Map Section
- **Height**: 500px (Desktop), 400px (Mobile)
- **Frame**: Subtle border with rounded corners
- **Markers**: Gold pins with black icons

## Interaction Design

### Button States
- **Primary (Gold)**:
  - Normal: `#D4AF37`
  - Hover: `#B8941F`
  - Active: `#9A7D1A`

- **Secondary (White with black border)**:
  - Normal: White background, black border
  - Hover: Light gray background
  - Active: Medium gray background

### Animations & Transitions
- **Default Duration**: 0.3s ease-out
- **Hover Effects**: 0.2s ease-out
- **Page Transitions**: 0.5s ease-in-out
- **Micro-interactions**: 0.15s ease-out

### Loading States
- **Skeleton Screens**: Light gray placeholders
- **Spinners**: Gold color for premium feel
- **Progress Bars**: Gold fill on light gray track

## Image Treatment

### Photography Style
- **High contrast**, editorial quality
- **Lifestyle focused**: People enjoying cocktails
- **Architectural**: Beautiful bar interiors
- **Color grading**: Slightly warm, rich shadows

### Image Specifications
- **Hero Images**: 1920×1080 minimum
- **Bar Cards**: 400×300 (4:3 ratio)
- **Thumbnails**: 120×120 (1:1 ratio)
- **Format**: WebP with JPEG fallback

## Accessibility Guidelines

### Color Contrast
- **Text on White**: Minimum 4.5:1 ratio
- **Gold on White**: Minimum 3:1 ratio for large text
- **Interactive Elements**: Minimum 4.5:1 ratio

### Focus States
- **Outline**: 2px solid gold with 2px offset
- **Background**: Light champagne gold for form inputs

### Motion Preferences
- **Respect `prefers-reduced-motion`**
- **Provide alternatives** for animation-dependent interactions

## Mobile Considerations

### Touch Targets
- **Minimum Size**: 44×44px
- **Spacing**: 8px minimum between targets
- **Gesture Support**: Swipe for card carousels

### Typography Scaling
- **Reduce font sizes** proportionally
- **Maintain hierarchy** relationships
- **Ensure readability** at all screen sizes

## Brand Personality Expression

### Vogue Editorial Elements
- **Generous white space**
- **Strong typography hierarchy**
- **High-quality imagery**
- **Clean, sophisticated layouts**

### Godfather Elegance
- **Understated luxury**
- **Classic proportions**
- **Timeless color choices**
- **Refined details**

### Modern Web Standards
- **Fast loading times**
- **Intuitive navigation**
- **Accessible design**
- **Mobile-first approach**

This specification provides the foundation for creating a sophisticated, user-friendly cocktail bar recommendation website that embodies editorial elegance while maintaining modern web usability standards.