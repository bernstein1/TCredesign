# Design System

Complete design system specification including design tokens, component library, theming strategy, and accessibility requirements for the TouchCare unified platform.

---

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Component Library](#component-library)
3. [Theming Architecture](#theming-architecture)
4. [Typography](#typography)
5. [Accessibility](#accessibility)
6. [Responsive Design](#responsive-design)
7. [Motion & Animation](#motion--animation)
8. [Icons & Illustrations](#icons--illustrations)

---

## Design Tokens

Design tokens are the single source of truth for all visual design decisions. They enable consistent theming across base TouchCare, white-label clients, and TouchCare Blue premium tier.

### Token Structure

Tokens organized in three layers:

1. **Primitive tokens**: Raw values (colors, sizes)
2. **Semantic tokens**: Purpose-based references to primitives
3. **Component tokens**: Component-specific values

### Color Tokens

#### Base TouchCare Palette (Primitives)

**Primary (Indigo)**:
```css
--tc-color-indigo-900: #1A2866;
--tc-color-indigo-800: #22357E; /* Primary background, 90% coverage */
--tc-color-indigo-700: #2D4399;
--tc-color-indigo-600: #3851B4;
--tc-color-indigo-500: #4E6DD6;
--tc-color-indigo-400: #6B87E0;
--tc-color-indigo-300: #8FA5EA;
--tc-color-indigo-200: #B8C7F3;
--tc-color-indigo-100: #E1E8FB;
--tc-color-indigo-50: #F4F6FD;
```

**Accent (Coral)**:
```css
--tc-color-coral-900: #CC3624;
--tc-color-coral-800: #E64A39;
--tc-color-coral-700: #FF5D4D;
--tc-color-coral-600: #FF6B5D; /* Primary accent */
--tc-color-coral-500: #FF7F72;
--tc-color-coral-400: #FF9D93;
--tc-color-coral-300: #FFBBB4;
--tc-color-coral-200: #FFD9D5;
--tc-color-coral-100: #FFEEEC;
--tc-color-coral-50: #FFF7F6;
```

**Secondary (Teal)**:
```css
--tc-color-teal-900: #006770;
--tc-color-teal-800: #007D88;
--tc-color-teal-700: #0095A0; /* Secondary emphasis */
--tc-color-teal-600: #00A9B5;
--tc-color-teal-500: #1FBDCA;
--tc-color-teal-400: #4CCED8;
--tc-color-teal-300: #7DDDE5;
--tc-color-teal-200: #B3ECF1;
--tc-color-teal-100: #E0F8FA;
--tc-color-teal-50: #F2FCFD;
```

**Neutrals**:
```css
--tc-color-neutral-900: #0F1419;
--tc-color-neutral-800: #1F2937;
--tc-color-neutral-700: #374151;
--tc-color-neutral-600: #4B5563;
--tc-color-neutral-500: #6B7280;
--tc-color-neutral-400: #9CA3AF;
--tc-color-neutral-300: #D1D5DB;
--tc-color-neutral-200: #E5E7EB;
--tc-color-neutral-100: #F3F4F6;
--tc-color-neutral-50: #F9FAFB;
--tc-color-white: #FFFFFF;
--tc-color-black: #000000;
```

**Semantic (Status)**:
```css
--tc-color-success-700: #047857;
--tc-color-success-600: #059669;
--tc-color-success-500: #10B981;
--tc-color-success-100: #D1FAE5;
--tc-color-success-50: #ECFDF5;

--tc-color-warning-700: #B45309;
--tc-color-warning-600: #D97706;
--tc-color-warning-500: #F59E0B;
--tc-color-warning-100: #FEF3C7;
--tc-color-warning-50: #FFFBEB;

--tc-color-error-700: #B91C1C;
--tc-color-error-600: #DC2626;
--tc-color-error-500: #EF4444;
--tc-color-error-100: #FEE2E2;
--tc-color-error-50: #FEF2F2;

--tc-color-info-700: #1D4ED8;
--tc-color-info-600: #2563EB;
--tc-color-info-500: #3B82F6;
--tc-color-info-100: #DBEAFE;
--tc-color-info-50: #EFF6FF;
```

#### TouchCare Blue Palette (Premium Tier)

**Primary (Navy)**:
```css
--tc-blue-color-primary-900: #0A1E3D;
--tc-blue-color-primary-800: #0F2A52;
--tc-blue-color-primary-700: #153666;
--tc-blue-color-primary-600: #1C447B;
--tc-blue-color-primary-500: #235290;
```

**Accent (Gold)**:
```css
--tc-blue-color-accent-700: #B8860B;
--tc-blue-color-accent-600: #D4AF37; /* Champagne gold */
--tc-blue-color-accent-500: #E5C158;
--tc-blue-color-accent-400: #F0D576;
--tc-blue-color-accent-300: #F7E7A6;
```

#### Semantic Tokens (Light Theme)

```css
/* Backgrounds */
--color-bg-primary: var(--tc-color-indigo-800); /* 90% coverage */
--color-bg-secondary: var(--tc-color-indigo-700);
--color-bg-tertiary: var(--tc-color-indigo-900);
--color-bg-surface: var(--tc-color-white);
--color-bg-overlay: rgba(0, 0, 0, 0.5);

/* Text */
--color-text-primary: var(--tc-color-white);
--color-text-secondary: rgba(255, 255, 255, 0.8);
--color-text-tertiary: rgba(255, 255, 255, 0.6);
--color-text-on-surface: var(--tc-color-neutral-900);
--color-text-on-surface-secondary: var(--tc-color-neutral-600);
--color-text-inverse: var(--tc-color-neutral-900);

/* Interactive */
--color-interactive-primary: var(--tc-color-coral-600);
--color-interactive-primary-hover: var(--tc-color-coral-700);
--color-interactive-primary-active: var(--tc-color-coral-800);
--color-interactive-secondary: var(--tc-color-teal-700);
--color-interactive-secondary-hover: var(--tc-color-teal-800);

/* Borders */
--color-border-default: rgba(255, 255, 255, 0.2);
--color-border-subtle: rgba(255, 255, 255, 0.1);
--color-border-strong: rgba(255, 255, 255, 0.3);
--color-border-on-surface: var(--tc-color-neutral-300);

/* Feedback */
--color-feedback-success: var(--tc-color-success-500);
--color-feedback-warning: var(--tc-color-warning-500);
--color-feedback-error: var(--tc-color-error-500);
--color-feedback-info: var(--tc-color-info-500);
```

### Spacing Tokens

Based on 4px baseline grid:

```css
--spacing-0: 0;
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
--spacing-20: 5rem;    /* 80px */
--spacing-24: 6rem;    /* 96px */
--spacing-32: 8rem;    /* 128px */
```

### Border Radius Tokens

```css
--radius-none: 0;
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;  /* Pill shape */
```

### Shadow Tokens

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Typography Tokens

```css
/* Font Families */
--font-family-heading: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
--font-family-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-mono: 'JetBrains Mono', 'Courier New', monospace;

/* Font Sizes */
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
--font-size-5xl: 3rem;      /* 48px */
--font-size-6xl: 3.75rem;   /* 60px */

/* Font Weights */
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;

/* Line Heights */
--line-height-tight: 1.25;
--line-height-snug: 1.375;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
--line-height-loose: 2;

/* Letter Spacing */
--letter-spacing-tighter: -0.05em;
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
--letter-spacing-widest: 0.1em;
```

---

## Component Library

### Core Components

#### Button

**Variants**:
- `primary`: Filled coral accent button
- `secondary`: Outlined or teal button
- `tertiary`: Text-only button
- `ghost`: Transparent with hover state

**Sizes**:
- `sm`: Height 32px, padding 8px 12px
- `md`: Height 40px, padding 10px 16px (default)
- `lg`: Height 48px, padding 12px 24px
- `xl`: Height 56px, padding 14px 32px

**States**:
- Default
- Hover
- Active (pressed)
- Focus (keyboard)
- Disabled
- Loading

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
```

**CSS**:
```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-lg);
  transition: all 150ms ease;
  cursor: pointer;
  border: none;
  outline: none;
}

.button-primary {
  background-color: var(--color-interactive-primary);
  color: var(--tc-color-white);
  box-shadow: var(--shadow-sm);
}

.button-primary:hover {
  background-color: var(--color-interactive-primary-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.button-primary:active {
  background-color: var(--color-interactive-primary-active);
  box-shadow: var(--shadow-sm);
  transform: translateY(0);
}

.button-primary:focus-visible {
  outline: 2px solid var(--color-interactive-primary);
  outline-offset: 2px;
}

.button-primary:disabled {
  background-color: var(--tc-color-neutral-300);
  color: var(--tc-color-neutral-500);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
```

**Accessibility**:
- ARIA label when icon-only
- Keyboard focus indicator
- Loading state announced to screen readers
- Disabled state prevents interaction

#### Input (Text Field)

**Variants**:
- `text`, `email`, `tel`, `number`, `password`, `search`, `url`

**Sizes**:
- `sm`: Height 36px
- `md`: Height 44px (default)
- `lg`: Height 52px

**States**:
- Default
- Focus
- Error
- Disabled
- Read-only

**Props**:
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'search' | 'url';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
}
```

**Structure**:
```html
<div class="input-wrapper">
  <label class="input-label">Email</label>
  <div class="input-container">
    <input class="input" type="email" placeholder="you@example.com" />
  </div>
  <span class="input-helper-text">We'll never share your email</span>
</div>
```

**Accessibility**:
- Label associated with input via `for` attribute
- Error messages linked via `aria-describedby`
- Required inputs marked with `aria-required`
- Appropriate `autocomplete` attributes

#### Card

**Variants**:
- `flat`: No shadow
- `elevated`: Shadow on hover
- `outlined`: Border, no shadow
- `interactive`: Clickable with hover effects

**Props**:
```typescript
interface CardProps {
  variant?: 'flat' | 'elevated' | 'outlined' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
}
```

**CSS**:
```css
.card {
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.card-elevated {
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
}

.card-elevated:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-outlined {
  border: 1px solid var(--color-border-on-surface);
}

.card-interactive {
  cursor: pointer;
}

.card-interactive:hover {
  background-color: var(--tc-color-neutral-50);
}
```

#### Modal / Dialog

**Sizes**:
- `sm`: Max-width 400px
- `md`: Max-width 600px (default)
- `lg`: Max-width 800px
- `xl`: Max-width 1200px
- `full`: Full-screen

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title?: string;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}
```

**Accessibility**:
- Focus trap within modal
- Focus returns to trigger on close
- Esc key to close
- `aria-modal="true"`
- `role="dialog"`
- `aria-labelledby` pointing to title
- Overlay click to close (optional)

#### Toast / Notification

**Types**:
- `success`, `error`, `warning`, `info`, `neutral`

**Positions**:
- `top`, `top-right`, `top-left`, `bottom`, `bottom-right`, `bottom-left`

**Props**:
```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  title: string;
  description?: string;
  duration?: number; // Auto-dismiss after X ms
  closable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Accessibility**:
- `role="status"` or `role="alert"` for urgent toasts
- ARIA live region for screen reader announcements

#### Tabs

**Variants**:
- `line`: Underline indicator
- `enclosed`: Full background on active tab
- `pills`: Pill-shaped tabs

**Props**:
```typescript
interface TabsProps {
  variant?: 'line' | 'enclosed' | 'pills';
  defaultIndex?: number;
  onChange?: (index: number) => void;
  children: TabPanel[];
}

interface TabPanel {
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  content: ReactNode;
}
```

**Accessibility**:
- `role="tablist"` on container
- `role="tab"` on tab buttons
- `role="tabpanel"` on content
- Arrow key navigation
- Home/End keys to jump to first/last tab
- `aria-selected` on active tab
- `aria-controls` linking tab to panel

#### Badge / Chip

**Variants**:
- `solid`: Filled background
- `subtle`: Light background
- `outline`: Border only

**Colors**:
- `primary`, `secondary`, `success`, `warning`, `error`, `info`, `neutral`

**Sizes**:
- `sm`: Height 20px, font 12px
- `md`: Height 24px, font 14px (default)
- `lg`: Height 28px, font 14px

**Props**:
```typescript
interface BadgeProps {
  variant?: 'solid' | 'subtle' | 'outline';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  label: string;
  icon?: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}
```

#### Dropdown / Select

**Props**:
```typescript
interface SelectProps {
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

**Accessibility**:
- Native `<select>` for simple cases
- Custom dropdown with full keyboard support for complex cases
- ARIA combobox pattern for searchable selects
- Option highlighting on hover and keyboard navigation
- Type-ahead search

### Layout Components

#### Container

**Max Widths**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);
}

.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1536px; }
```

#### Stack

Vertical spacing between children:

```typescript
interface StackProps {
  spacing?: keyof typeof spacing; // '1', '2', '4', etc.
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
}
```

```css
.stack-vertical {
  display: flex;
  flex-direction: column;
}

.stack-horizontal {
  display: flex;
  flex-direction: row;
}

.stack-spacing-4 > * + * {
  margin-top: var(--spacing-4);
}
```

#### Grid

Responsive grid system:

```typescript
interface GridProps {
  cols?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: keyof typeof spacing;
}
```

```css
.grid {
  display: grid;
  gap: var(--spacing-4);
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
/* ... */
.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }

@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  /* ... */
}
```

---

## Theming Architecture

### Three-Layer Theming System

TouchCare supports three composable theme layers:

1. **Base TouchCare Theme**: Default indigo + coral
2. **White-Label Theme**: Client-specific branding (logo, colors)
3. **TouchCare Blue Theme**: Premium tier visual overlay

### Theme Composition

Themes are applied in order:
1. Load base theme tokens
2. Apply white-label overrides (if client has custom branding)
3. Apply TouchCare Blue overlay (if member is premium tier)

### Implementation

**CSS Variables Approach**:

```css
/* base-theme.css - Default TouchCare */
:root {
  --color-bg-primary: var(--tc-color-indigo-800);
  --color-interactive-primary: var(--tc-color-coral-600);
  /* ... */
}

/* white-label-theme.css - Acme Corp Example */
[data-client="acme"] {
  --color-bg-primary: #0066CC; /* Acme blue */
  --color-interactive-primary: #FF9500; /* Acme orange */
  --font-family-heading: 'Roboto', sans-serif;
  /* ... */
}

/* touchcare-blue-theme.css - Premium Overlay */
[data-tier="blue"] {
  --color-bg-primary: var(--tc-blue-color-primary-800);
  --color-interactive-primary: var(--tc-blue-color-accent-600);
  --badge-blue-visible: block; /* Show Blue badge */
  /* ... */
}
```

**Runtime Theme Loading**:

```typescript
// Apply themes based on member data
const applyTheme = (member: Member) => {
  const root = document.documentElement;

  // Apply white-label client theme
  if (member.employer.branding_config) {
    root.setAttribute('data-client', member.employer.slug);
    applyBrandingTokens(member.employer.branding_config);
  }

  // Apply TouchCare Blue overlay
  if (member.tier.slug === 'blue') {
    root.setAttribute('data-tier', 'blue');
  }
};

const applyBrandingTokens = (config: BrandingConfig) => {
  const root = document.documentElement;

  if (config.primary_color) {
    root.style.setProperty('--color-bg-primary', config.primary_color);
  }

  if (config.accent_color) {
    root.style.setProperty('--color-interactive-primary', config.accent_color);
  }

  // ... apply all custom tokens
};
```

### Dark Mode Support

TouchCare supports system-preferred or user-selected dark mode:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-surface: var(--tc-color-neutral-900);
    --color-text-on-surface: var(--tc-color-white);
    /* ... invert colors */
  }
}

[data-theme="dark"] {
  /* Manual dark mode override */
}
```

---

## Typography

### Type Scale

| Name | Size | Weight | Line Height | Use Case |
|------|------|--------|-------------|----------|
| `display-lg` | 60px | Bold | 1.1 | Hero headlines |
| `display-md` | 48px | Bold | 1.2 | Page titles |
| `display-sm` | 36px | Bold | 1.2 | Section titles |
| `heading-xl` | 30px | Semibold | 1.3 | Modal titles |
| `heading-lg` | 24px | Semibold | 1.3 | Card titles |
| `heading-md` | 20px | Semibold | 1.4 | Subsection titles |
| `heading-sm` | 18px | Semibold | 1.4 | Small headings |
| `body-lg` | 18px | Normal | 1.5 | Large body text |
| `body-md` | 16px | Normal | 1.5 | Default body text |
| `body-sm` | 14px | Normal | 1.5 | Small body text |
| `caption` | 12px | Normal | 1.4 | Captions, labels |
| `overline` | 12px | Semibold | 1.4 | Overline text (uppercase) |

### Emphasis Patterns

Per brand guidelines, emphasize **one** key word per headline:

```html
<!-- Correct -->
<h1 class="display-lg">
  Access your <span class="text-accent">benefits</span> anytime
</h1>

<!-- Incorrect: Multiple emphases -->
<h1 class="display-lg">
  <span class="text-accent">Access</span> your <span class="text-accent">benefits</span> anytime
</h1>
```

**Emphasis Options**:
- Coral color: `class="text-accent"`
- Italics: `class="italic"`
- **Not both** (avoid over-emphasis)

### Microcopy

Include `touchcare.com/____` link in marketing-like views:

```html
<footer class="microcopy">
  <a href="https://touchcare.com/member-portal" class="text-xs text-secondary">
    touchcare.com/member-portal
  </a>
</footer>
```

---

## Accessibility

### WCAG 2.1 AA Compliance

TouchCare meets WCAG 2.1 Level AA standards.

### Color Contrast

**Minimum Ratios**:
- Normal text (< 18px): 4.5:1
- Large text (≥ 18px or 14px bold): 3:1
- UI components and graphics: 3:1

**Validation**:
- All base theme colors tested and validated
- White-label admin UI shows contrast warnings if custom colors fail WCAG

### Keyboard Navigation

**Tab Order**:
- Logical tab order matches visual flow
- Skip links for main content

**Focus Indicators**:
- 2px outline with 2px offset
- Color: `--color-interactive-primary`
- Never remove focus indicators

**Keyboard Shortcuts**:
- All interactive elements accessible via Tab
- Enter/Space to activate buttons
- Arrow keys for menus, tabs, carousels
- Esc to close modals and dropdowns

### Screen Readers

**ARIA Landmarks**:
```html
<header role="banner">
<nav role="navigation" aria-label="Main">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">
```

**ARIA Labels**:
- All icon-only buttons have `aria-label`
- Form inputs have associated labels (not just placeholder)
- Live regions for dynamic content: `aria-live="polite"` or `"assertive"`

**Hidden Content**:
- Use `aria-hidden="true"` for decorative images
- Use `visually-hidden` class for screen-reader-only text

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Font Size & Zoom

- Base font size: 16px (1rem)
- All text scalable up to 200% without loss of functionality
- No fixed pixel heights on text containers

### Reduced Motion

Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Touch Targets

Minimum touch target size: **44x44px** (WCAG 2.1 AAA guideline).

All interactive elements meet this threshold on mobile:

```css
.button, .link, .icon-button {
  min-height: 44px;
  min-width: 44px;
}
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile-first approach */
/* xs: < 640px (default, no media query) */

@media (min-width: 640px) {  /* sm */
  /* Tablets, small laptops */
}

@media (min-width: 768px) {  /* md */
  /* Tablets landscape, laptops */
}

@media (min-width: 1024px) { /* lg */
  /* Desktops */
}

@media (min-width: 1280px) { /* xl */
  /* Large desktops */
}

@media (min-width: 1536px) { /* 2xl */
  /* Extra large screens */
}
```

### Mobile-First Patterns

**Single Column → Multi-Column**:
```css
.dashboard {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: single column */
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .dashboard {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .dashboard {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
  }
}
```

**Bottom Nav → Sidebar**:
```css
.nav-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  /* Bottom navigation styles */
}

@media (min-width: 1024px) {
  .nav-mobile {
    display: none;
  }

  .nav-desktop {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 240px;
    /* Sidebar styles */
  }
}
```

### Safe Areas (Mobile)

Respect iOS notch and Android gesture bars:

```css
.app {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

---

## Motion & Animation

### Timing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy */
```

### Duration

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### Animation Patterns

**Fade In**:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}
```

**Slide Up**:
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp var(--duration-normal) var(--ease-out);
}
```

**Scale In** (for modals):
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-enter {
  animation: scaleIn var(--duration-normal) var(--ease-out);
}
```

**Skeleton Loading**:
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--tc-color-neutral-200) 0%,
    var(--tc-color-neutral-100) 50%,
    var(--tc-color-neutral-200) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

### Micro-interactions

**Button Press**:
```css
.button:active {
  transform: scale(0.98);
}
```

**Card Hover**:
```css
.card-interactive {
  transition: all var(--duration-normal) var(--ease-out);
}

.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

**Task Completion Celebration**:
```css
@keyframes celebrate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.task-complete {
  animation: celebrate var(--duration-slow) var(--ease-spring);
}
```

---

## Icons & Illustrations

### Icon System

**Icon Library**: [Heroicons](https://heroicons.com/) (MIT license, clean line icons)

**Icon Sizes**:
- `xs`: 16px
- `sm`: 20px
- `md`: 24px (default)
- `lg`: 32px
- `xl`: 48px

**Usage**:
```typescript
interface IconProps {
  name: string; // Icon identifier
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string; // Defaults to currentColor
}
```

**Accessibility**:
- Decorative icons: `aria-hidden="true"`
- Semantic icons: Include `aria-label` or adjacent text

### Illustrations

**Style**: Flat, geometric, friendly

**Usage**:
- Empty states
- Error states
- Onboarding screens
- Hero sections

**Colors**: Use brand colors (indigo, coral, teal) for consistency.

---

This design system specification provides a complete foundation for building a consistent, accessible, and themeable TouchCare platform.
