# TouchCare Interactive Prototype

An interactive, high-fidelity web mockup of the TouchCare unified platform, built using HTML, CSS, and JavaScript.

## 🎯 Overview

This prototype demonstrates the complete user experience for the TouchCare Member Portal, including:

- **Login & Authentication** - Passwordless login with verification codes, SSO options
- **Onboarding** - Progressive 3-phase onboarding flow
- **Dashboard** - Centralized home view with task bar, cases, notifications, appointments
- **Cases (Messaging)** - Inbox, thread views, and case creation
- **Documents** - Document library with categories and search
- **Wallet** - Digital health insurance cards (coming soon)
- **Settings** - Account preferences and management (coming soon)

## 🚀 Getting Started

### Option 1: Open Directly in Browser

1. Navigate to the `prototype` folder
2. Open `index.html` in your web browser
3. The prototype will load immediately - no server required!

### Option 2: Use a Local Server (Recommended for Development)

```bash
# Using Python 3
cd prototype
python3 -m http.server 8000

# Using Node.js (http-server)
cd prototype
npx http-server -p 8000

# Then open: http://localhost:8000
```

## 📱 Features & Interactions

### 🔐 Login Flow

1. **Start Screen**: Enter email or phone (pre-filled with `jane@example.com`)
2. **Click "Continue"**: Simulated loading → Verification screen
3. **Code Entry**: Enter any 6-digit code (auto-advances between inputs)
   - Or type all 6 digits at once - it will auto-fill and verify
4. **Automatic Verification**: Logs you into the dashboard

**Shortcuts**:
- Click "Sign up" to jump to onboarding
- SSO buttons show toast notifications (not fully implemented)

### 📝 Onboarding

- **3-Phase Progressive Model**: Demonstrates the phased approach
- All form fields are mock - click "Continue" to proceed to dashboard

### 🏠 Dashboard

**Interactive Elements**:
- **Task Bar**: Click header to expand/collapse
- **Task Items**: Click incomplete tasks to navigate to relevant sections
- **Case Cards**: Click to view case detail
- **Notifications**: Visual-only (click for toast message)
- **Quick Actions**: Navigate to different sections
- **Navigation**: Bottom nav (mobile) or sidebar (desktop)

### 💬 Cases (Messages)

- **Case Inbox**: View all cases with status badges
- **Case Detail**: Full conversation thread with message composer
- **Filters**: Visual tabs (All/Open/Resolved)
- **New Case**: Button navigates to creation flow (coming soon)

### 📄 Documents

- **Pinned Documents**: Special highlighting for important docs
- **Document Cards**: Hover effects and visual feedback
- **Categories**: Tab navigation
- **Actions**: Click documents for toast notification (preview not fully implemented)

### 🗺️ Navigation

**Desktop (> 1024px)**:
- Left sidebar with navigation
- Click any nav item to switch views
- Active state highlighting

**Mobile (< 1024px)**:
- Bottom navigation bar (5 items)
- Top bar with page title and actions
- Badge indicators for unread counts

**Cross-View Navigation**:
- Click logo to return to dashboard
- Use nav items to switch between sections
- Back buttons return to previous view

## 🎨 Design System

### Color Palette

**Primary (Indigo)**: `#22357E` - Background, 90% coverage
**Accent (Coral)**: `#FF6B5D` - CTAs, highlights
**Secondary (Teal)**: `#0095A0` - Secondary emphasis

### Typography

**Headings**: Montserrat, bold, geometric
**Body**: Inter, clean and readable

### Components

All components follow the TouchCare design system:
- Buttons (Primary, Secondary, Tertiary)
- Cards (Elevated, Outlined)
- Inputs (Focus states, validation-ready)
- Badges (Status indicators)
- Icons (Heroicons style, inline SVG)

## 📂 File Structure

```
prototype/
├── index.html              # Main HTML with Login, Onboarding, Dashboard
├── views-additional.html   # Cases, Documents, and other views (to be merged)
├── styles.css              # Complete design system + component styles
├── app.js                  # All interactions and navigation logic
├── assets/                 # Images and icons (optional)
└── README.md               # This file
```

## 🔧 Mock Functionality

**What Works**:
- ✅ View switching / navigation
- ✅ Form interactions (code input, expand/collapse)
- ✅ Hover states and visual feedback
- ✅ Toast notifications
- ✅ Loading overlays
- ✅ Responsive layout (mobile/tablet/desktop)

**What's Mocked** (visual only):
- ❌ Authentication (no real backend)
- ❌ Data persistence (refreshing resets state)
- ❌ Real-time messaging
- ❌ Document preview
- ❌ File uploads
- ❌ Search functionality
- ❌ SSO integration

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (bottom nav, single column)
- **Tablet**: 768-1024px (bottom nav, 2-column grid)
- **Desktop**: > 1024px (sidebar, multi-column grid)

## 🎯 User Flows Demonstrated

1. **Login → Dashboard**: Complete authentication flow
2. **Dashboard → Case Detail**: Navigate and view conversation
3. **Dashboard → Documents**: Browse document library
4. **Task Completion**: Visual task bar interactions
5. **Cross-Section Navigation**: Seamless view switching

## 🛠️ Extending the Prototype

### Adding a New View

1. Add a new `<section id="your-view" class="view">` in `index.html`
2. Include the app layout structure (top bar, sidebar, main content, bottom nav)
3. Add navigation links with `onclick="app.navigateTo('your-view')"`
4. Update active states in `app.js` if needed

### Adding Interactions

1. Add function to `app` object in `app.js`
2. Call via `onclick="app.yourFunction()"`
3. Use `app.showToast()` for user feedback
4. Use `app.showLoading()` / `app.hideLoading()` for async actions

## ✨ Key Features

### Design System Implementation
- ✅ CSS Variables for theming
- ✅ Design tokens (colors, spacing, typography)
- ✅ Reusable components
- ✅ Consistent styling

### Accessibility
- ✅ Semantic HTML
- ✅ Keyboard navigation (tab order)
- ✅ Focus indicators
- ✅ ARIA labels where needed
- ✅ Screen reader friendly structure

### Mobile-First
- ✅ Touch-friendly tap targets (min 44px)
- ✅ Bottom navigation for thumb reach
- ✅ Responsive grid layouts
- ✅ Optimized for small screens

### Modern UX Patterns
- ✅ Skeleton loading states (via CSS)
- ✅ Toast notifications
- ✅ Smooth transitions
- ✅ Hover effects
- ✅ Progressive disclosure (task bar)

## 🔄 Next Steps

To turn this into a production app:

1. **Backend Integration**: Connect to REST/GraphQL APIs
2. **State Management**: Add React/Vue/Svelte with proper state
3. **Real Authentication**: Implement passwordless auth flow
4. **Real-Time**: WebSocket integration for messaging
5. **Data Persistence**: Connect to database
6. **File Handling**: Implement document upload/preview
7. **Testing**: Add unit, integration, and E2E tests
8. **Performance**: Optimize bundle size, lazy loading
9. **Accessibility**: Full WCAG 2.1 AA audit
10. **PWA**: Add service workers for offline support

## 📞 Support

This is a visual prototype for design and UX validation. For questions about the full implementation plan, see the comprehensive documentation in `/docs`.

## 📄 License

Internal TouchCare prototype - Not for production use.

---

**Built with** ❤️ **by the TouchCare Product Team**
