# Geist Variable Font Usage Guide

## Overview

Your project is configured to use **Geist Variable**, a modern font family from Vercel that provides excellent readability and performance.

## Current Setup ✅

- Geist Variable is already installed via `next/font/google`
- CSS variables are configured: `--font-geist-sans` and `--font-geist-mono`
- Global font is set to Geist Variable in `globals.css`

## How to Use Geist Variable

### 1. Basic Usage

```jsx
// Add font-sans class to any text element
<h1 className="text-2xl font-bold font-sans">Heading with Geist</h1>
<p className="text-base font-sans">Body text with Geist</p>
```

### 2. Font Weight Options

```jsx
<h1 className="font-light font-sans">Light (300)</h1>
<p className="font-normal font-sans">Normal (400)</p>
<p className="font-medium font-sans">Medium (500)</p>
<p className="font-semibold font-sans">Semi Bold (600)</p>
<h1 className="font-bold font-sans">Bold (700)</h1>
```

### 3. Common Text Patterns

```jsx
// Page Headings
<h1 className="text-3xl font-bold font-sans text-gray-900">
  Main Heading
</h1>

// Section Headings
<h2 className="text-xl font-semibold font-sans text-gray-800">
  Section Title
</h2>

// Body Text
<p className="text-base font-sans text-gray-600">
  Regular paragraph text
</p>

// Small Text / Captions
<span className="text-sm font-sans text-gray-500">
  Caption or helper text
</span>

// Buttons
<button className="px-4 py-2 font-medium font-sans bg-blue-600 text-white">
  Action Button
</button>
```

### 4. Using the Font Utility (Optional)

Import the font utilities for consistent typography:

```jsx
import { fontClasses } from '@/styles/fonts';

// Use predefined combinations
<h1 className={fontClasses.heading}>Consistent Heading</h1>
<p className={fontClasses.body}>Body text</p>
<span className={fontClasses.caption}>Caption text</span>
```

## Best Practices

1. **Always include `font-sans`** when you want to use Geist Variable
2. **Use consistent font weights** across similar elements
3. **Combine with appropriate text sizes** for better hierarchy
4. **Test on different screen sizes** as Geist Variable scales well

## Examples from Your Components

```jsx
// Header navigation
<button className="px-3 py-3 text-sm font-medium font-sans">
  Nav Item
</button>

// Modal titles
<h2 className="text-lg font-medium text-[#0C5271] font-sans">
  Modal Title
</h2>

// Feature cards
<h3 className="font-semibold font-sans text-gray-900 mb-2">
  Feature Title
</h3>
<p className="text-sm font-sans text-gray-600">
  Feature description
</p>
```

## Fallback Fonts

If Geist Variable fails to load, the system will fallback to:

1. `system-ui`
2. `sans-serif`

This ensures your app always looks professional even with network issues.
