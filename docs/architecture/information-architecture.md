# Information Architecture

Complete navigation structure, page hierarchy, permissions model, and routing strategy for the TouchCare unified platform.

---

## Table of Contents

1. [Member Portal Navigation](#member-portal-navigation)
2. [Admin Portal Navigation](#admin-portal-navigation)
3. [Permissions & Access Control](#permissions--access-control)
4. [Routing Strategy](#routing-strategy)
5. [Deep Linking](#deep-linking)

---

## Member Portal Navigation

### Primary Navigation Structure

The Member Portal uses a **mobile-first, hybrid navigation** pattern:

- **Mobile**: Bottom navigation bar (persistent) + hamburger menu for secondary items
- **Tablet**: Bottom navigation + expanded menu
- **Desktop**: Left sidebar (collapsible) + top bar

### Navigation Hierarchy

```
Member Portal
├── Dashboard (Home) 🏠
│   ├── Task Bar (persistent until complete)
│   ├── Active Messages (Cases preview)
│   ├── Notifications Feed
│   ├── Upcoming Appointments
│   └── Quick Actions (FAB/shortcuts)
│
├── Cases (Messages) 💬
│   ├── Inbox (list view)
│   │   ├── All
│   │   ├── Open
│   │   └── Resolved
│   ├── Thread View (conversation)
│   ├── New Case
│   └── Search
│
├── Documents 📄
│   ├── All Documents (grid/list)
│   ├── Categories (tabs/sidebar)
│   │   ├── Insurance Cards & IDs
│   │   ├── Benefit Summaries & Policies
│   │   ├── Claims & EOBs
│   │   ├── Enrollment
│   │   ├── Letters & Correspondence
│   │   └── Receipts & Invoices
│   ├── Pinned Documents
│   ├── Search & Filters
│   ├── Document Preview (modal/full-screen)
│   └── Upload Document
│
├── Wallet 💳
│   ├── My Cards
│   │   ├── Insurance ID (Medical)
│   │   ├── Dental ID
│   │   ├── Vision ID
│   │   ├── Personal Info Card
│   │   ├── Emergency Contacts
│   │   ├── Allergies & Conditions
│   │   └── Current Medications
│   ├── Dependent Cards (switcher)
│   ├── Card Actions (share, download, add to Apple/Google Wallet)
│   └── Edit Info
│
├── Appointments 📅
│   ├── Upcoming (chronological list)
│   ├── Past Appointments
│   ├── Schedule New
│   │   └── [Embedded https://touchcare.as.me/schedule]
│   └── Appointment Details
│       ├── Join Call (video/phone)
│       ├── Reschedule
│       ├── Cancel
│       └── Add to Calendar
│
├── Services 🔧
│   ├── All Services (card grid)
│   ├── TouchCare Services
│   ├── Partner Services
│   └── Service Detail
│       ├── Call Now
│       └── Message About This
│
└── Account (Settings) ⚙️
    ├── Profile
    ├── Account & Security
    │   ├── Login Methods
    │   ├── Two-Factor Auth
    │   ├── Trusted Devices
    │   └── Active Sessions
    ├── Notifications & Alerts
    ├── Privacy & Data
    ├── Accessibility
    ├── Dependents
    ├── Connected Accounts
    ├── Billing & Plan Info
    └── Help & Support
        ├── FAQs
        ├── Contact Support
        ├── Troubleshooting
        ├── Feedback
        └── Legal
```

### Mobile Navigation (Primary)

**Bottom Navigation Bar** (5 items max, always visible):

| Icon | Label | Route | Badge |
|------|-------|-------|-------|
| 🏠 | Home | `/dashboard` | Task count (if incomplete) |
| 💬 | Messages | `/cases` | Unread count |
| 📄 | Documents | `/documents` | New docs count |
| 💳 | Wallet | `/wallet` | — |
| ⚙️ | Account | `/account` | — |

**Top Bar** (contextual):
- Logo / Employer branding (left)
- Page title (center, on detail views)
- Notifications bell (right) with badge
- Profile avatar (right)

**Hamburger Menu** (secondary items):
- Appointments
- Services
- Help & Support
- Logout

**Floating Action Button (FAB)** (contextual, on relevant pages):
- Dashboard: "New Case" or "Quick Actions" sheet
- Cases: "New Case"
- Documents: "Upload Document"

### Desktop Navigation (Responsive)

**Left Sidebar** (persistent, collapsible):
- Logo at top
- Primary navigation (same as mobile bottom nav)
- Secondary navigation (Appointments, Services)
- Account at bottom
- Collapse/expand toggle

**Top Bar**:
- Search (global, expands to full width)
- Notifications (dropdown panel)
- Profile avatar → dropdown menu
  - View Profile
  - Settings
  - Help
  - Logout

### TouchCare Blue Navigation Enhancements

For premium members:
- **Blue badge** next to member name in top bar
- **"Your TouchCare Blue Benefits"** section in hamburger menu or dashboard
- **Priority Support indicator** in Cases section

### White-Label Considerations

Navigation is themeable:
- Logo replaced with employer/client logo
- Brand colors applied to active states and highlights
- Icons can be swapped if client prefers custom icon set
- Navigation structure remains consistent (UX consistency)

---

## Admin Portal Navigation

### Primary Navigation Structure

The Admin Portal uses a **desktop-first, dashboard-style layout**:

- **Desktop**: Persistent left sidebar + top bar + breadcrumbs
- **Tablet**: Collapsible sidebar + top bar
- **Mobile**: Hamburger menu + top bar (admin portal is desktop-optimized; mobile is functional but not primary use case)

### Navigation Hierarchy

```
Admin Portal
├── Overview (Dashboard) 📊
│   ├── Key Metrics
│   │   ├── Active Members
│   │   ├── Open Cases
│   │   ├── Cases Resolved (24h)
│   │   ├── Avg Response Time
│   │   └── Member Satisfaction
│   ├── Activity Feed
│   ├── Pending Tasks
│   └── Quick Actions
│
├── Member Management 👥
│   ├── Member Directory
│   │   ├── Search & Filters
│   │   ├── Member List (table)
│   │   └── Member Profile (detail view)
│   │       ├── Overview
│   │       ├── Personal Info
│   │       ├── Dependents
│   │       ├── Wallet & Cards
│   │       ├── Documents
│   │       ├── Cases
│   │       ├── Appointments
│   │       ├── Activity Log
│   │       └── Admin Actions
│   │           ├── Edit Profile
│   │           ├── Update Tier
│   │           ├── Impersonate (view as)
│   │           ├── Send Notification
│   │           └── Audit Log
│   ├── Bulk Actions
│   │   ├── Import Members (CSV)
│   │   ├── Export Members
│   │   └── Bulk Update
│   └── Dependents Management
│
├── Case Management 💬
│   ├── Case Inbox
│   │   ├── My Cases
│   │   ├── Unassigned
│   │   ├── Team Queue
│   │   ├── All Cases
│   │   └── Filters & Search
│   ├── Case Detail (thread view)
│   │   ├── Conversation
│   │   ├── Member Info (sidebar)
│   │   ├── Case Actions
│   │   │   ├── Assign
│   │   │   ├── Change Status
│   │   │   ├── Escalate
│   │   │   ├── Add Internal Note
│   │   │   └── Close/Resolve
│   │   └── Templates & Quick Replies
│   ├── SLA Dashboard
│   └── Case Analytics
│
├── Document Management 📄
│   ├── Document Library
│   │   ├── All Documents
│   │   ├── By Category
│   │   ├── By Employer/Plan
│   │   └── Search & Filters
│   ├── Upload Documents
│   │   ├── Single Upload
│   │   ├── Bulk Upload
│   │   └── Target Audience Selector
│   ├── Document Detail
│   │   ├── Preview
│   │   ├── Edit Metadata
│   │   ├── Version History
│   │   └── Visibility Rules
│   └── Categories Management
│
├── Communication Center 📢
│   ├── Send Notification
│   │   ├── Recipient Selection
│   │   ├── Compose
│   │   ├── Channel Selection
│   │   ├── Schedule
│   │   └── Preview & Send
│   ├── Notification History
│   │   ├── Sent
│   │   ├── Scheduled
│   │   ├── Drafts
│   │   └── Detail View (analytics)
│   └── Templates
│       ├── Email Templates
│       ├── SMS Templates
│       └── In-App Templates
│
├── Consultation Management 📅
│   ├── Calendar View
│   │   ├── Day/Week/Month
│   │   ├── Consultant Schedule
│   │   └── Appointment List
│   ├── Appointments
│   │   ├── Upcoming
│   │   ├── Past
│   │   └── Cancelled
│   ├── Appointment Detail
│   │   ├── Member Info
│   │   ├── Consultation Notes
│   │   ├── Follow-up Tasks
│   │   └── Actions (reschedule, cancel)
│   ├── Consultant Management
│   │   ├── Consultant List
│   │   ├── Availability Settings
│   │   └── Performance Metrics
│   └── Consultation Settings
│       ├── Types
│       ├── Duration & Formats
│       ├── Booking Rules
│       └── Reminder Settings
│
├── Services Management 🔧
│   ├── Service Directory
│   │   ├── All Services
│   │   ├── TouchCare Services
│   │   └── Partner Services
│   ├── Service Detail
│   │   ├── Basic Info
│   │   ├── Contact Details
│   │   ├── Eligibility Rules
│   │   ├── Case Routing
│   │   └── Usage Analytics
│   ├── Add/Edit Service
│   └── Service Ordering
│
├── Platform Configuration ⚙️
│   ├── Branding
│   │   ├── Logo Upload
│   │   ├── Color Palette
│   │   ├── Typography
│   │   ├── Favicon
│   │   └── Preview & Publish
│   ├── Tier Management
│   │   ├── Tier Definitions
│   │   ├── Member Assignment
│   │   └── Bulk Tier Update
│   ├── Task Bar Settings
│   │   ├── Enable/Disable
│   │   ├── Task List Configuration
│   │   ├── Ordering
│   │   └── Completion Analytics
│   ├── Onboarding Configuration
│   │   ├── Flow Customization
│   │   ├── Required/Optional Fields
│   │   ├── Conditional Logic
│   │   ├── Welcome Messages
│   │   └── A/B Testing
│   ├── Notification Defaults
│   │   ├── Default Preferences
│   │   ├── Channel Availability
│   │   └── Frequency Limits
│   └── General Settings
│       ├── Session Timeout
│       ├── Security Settings
│       └── Feature Flags
│
├── Employers & Plans 🏢
│   ├── Employer Directory
│   │   ├── Employer List
│   │   └── Employer Detail
│   │       ├── Overview
│   │       ├── Plans
│   │       ├── Members
│   │       ├── Branding Config
│   │       ├── Settings
│   │       └── Analytics
│   ├── Add/Edit Employer
│   ├── Plan Management
│   │   ├── Plan List
│   │   ├── Plan Detail
│   │   └── Add/Edit Plan
│   └── Enrollment Management
│
├── Analytics & Reports 📈
│   ├── Dashboard Metrics
│   │   ├── Member Growth
│   │   ├── Engagement
│   │   ├── Case Volume
│   │   └── Satisfaction Scores
│   ├── Case Analytics
│   │   ├── Volume & Trends
│   │   ├── SLA Performance
│   │   ├── Resolution Times
│   │   └── Agent Performance
│   ├── Member Analytics
│   │   ├── Active Users
│   │   ├── Feature Adoption
│   │   ├── Onboarding Completion
│   │   └── Task Bar Progress
│   ├── Communication Analytics
│   │   ├── Notification Performance
│   │   ├── Channel Effectiveness
│   │   └── Engagement Metrics
│   ├── Custom Reports
│   └── Export Data
│
├── Team & Permissions 👤
│   ├── Admin Users
│   │   ├── User List
│   │   ├── User Detail
│   │   └── Add/Edit User
│   ├── Roles & Permissions
│   │   ├── Role Definitions
│   │   └── Permission Matrix
│   ├── Teams
│   │   ├── Team List
│   │   ├── Team Members
│   │   └── Team Performance
│   └── Activity Audit Log
│
└── Help & Support ❓
    ├── Admin Documentation
    ├── Training Resources
    ├── Contact Tech Support
    └── System Status
```

### Admin Navigation Layout

**Left Sidebar** (persistent, grouped):

```
[TouchCare Logo]

Dashboard

MEMBERS & SUPPORT
├── Member Management
├── Case Management
└── Document Management

COMMUNICATION
├── Communication Center
└── Consultation Management

CONFIGURATION
├── Platform Configuration
├── Services Management
└── Employers & Plans

INSIGHTS
├── Analytics & Reports
└── Team & Permissions

[Help & Support]
[Admin Profile]
```

**Top Bar**:
- Breadcrumbs (showing navigation hierarchy)
- Global search (members, cases, documents)
- Notifications (system alerts for admins)
- Quick actions dropdown
- Admin profile → settings, logout

**Context-Specific Actions Bar** (appears below top bar on detail views):
- Relevant actions for current page
- Examples:
  - Member Profile: "Edit", "Send Notification", "Impersonate", "View Cases"
  - Case Detail: "Assign", "Escalate", "Resolve", "Add Note"

---

## Permissions & Access Control

### Role-Based Access Control (RBAC) Model

TouchCare uses a role-based permissions system with the following hierarchy:

#### Member Portal Roles

| Role | Description | Access |
|------|-------------|--------|
| **Primary Member** | Account owner | Full access to own profile, dependents, cases, documents, wallet, appointments, settings |
| **Dependent (Minor)** | Under 18 with limited account | View-only for personal info and documents; cannot initiate cases or change settings |
| **Dependent (Adult)** | 18+ with limited account | Full access to personal info and documents; can initiate cases; limited settings |
| **Authorized Representative** | Caregiver/guardian | Full access to member or dependent account on behalf of primary |

#### Admin Portal Roles

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full access to all platform features, configuration, and data; can manage all employers, members, admins |
| **Admin** | Full access to member support features; cannot modify platform configuration or branding |
| **Support Agent** | Access to case management, member profiles (read-only), document viewing; cannot edit configuration |
| **Support Manager** | Support Agent permissions + team management, case assignment, SLA dashboards, analytics |
| **Consultant** | Access to consultation calendar, appointment details, member info for scheduled consultations |
| **Employer Admin** | Scoped access to own employer's members, cases, and analytics; cannot access other employers |
| **Billing Admin** | Access to billing, plan management, enrollment; limited support features |
| **Analyst** | Read-only access to analytics, reports, and aggregate data; no PII access |

### Permission Matrix

Detailed permissions by role and resource:

#### Member Management

| Action | Super Admin | Admin | Support Agent | Support Manager | Consultant | Employer Admin |
|--------|-------------|-------|---------------|-----------------|------------|----------------|
| View all members | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (scoped) |
| View member profile | ✅ | ✅ | ✅ | ✅ | ✅ (scheduled only) | ✅ (scoped) |
| Edit member profile | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (scoped) |
| Delete member | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Impersonate member | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Bulk import/export | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (scoped) |
| Update tier | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

#### Case Management

| Action | Super Admin | Admin | Support Agent | Support Manager | Consultant | Employer Admin |
|--------|-------------|-------|---------------|-----------------|------------|----------------|
| View all cases | ✅ | ✅ | ✅ (assigned) | ✅ | ❌ | ✅ (scoped) |
| Reply to cases | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Assign cases | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Close/resolve cases | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Escalate cases | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View analytics | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (scoped) |

#### Platform Configuration

| Action | Super Admin | Admin | Support Agent | Support Manager | Employer Admin |
|--------|-------------|-------|---------------|-----------------|----------------|
| Modify branding | ✅ | ❌ | ❌ | ❌ | ✅ (own employer) |
| Manage task bar | ✅ | ❌ | ❌ | ❌ | ✅ (own employer) |
| Configure onboarding | ✅ | ❌ | ❌ | ❌ | ✅ (own employer) |
| Manage services | ✅ | ✅ | ❌ | ❌ | ❌ |
| Send notifications | ✅ | ✅ | ❌ | ✅ | ✅ (scoped) |
| Manage employers/plans | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage admin users | ✅ | ❌ | ❌ | ❌ | ❌ |

### Permission Implementation

**Backend:**
- Middleware checks role/permissions on every API request
- Permissions stored as JSON in `admin_users.permissions` or via `role.permissions`
- Scoped permissions use employer_id/plan_id filters in queries

**Frontend:**
- Permission-based component rendering (hide/show UI elements)
- Route guards prevent unauthorized navigation
- Permission context provider for easy permission checks

**Example Permission Check:**
```typescript
// Check if current admin can edit member profile
const canEdit = hasPermission('member.edit') ||
                (hasPermission('member.edit.scoped') &&
                 member.employer_id === currentAdmin.employer_id);
```

---

## Routing Strategy

### Member Portal Routes

```
Public Routes (unauthenticated):
  /                         → Landing page (marketing)
  /login                    → Login/auth flow
  /register                 → Registration/onboarding
  /verify                   → Email/SMS verification
  /reset-password           → Password reset (if applicable)
  /sso/callback             → OAuth callback

Authenticated Routes (member must be logged in):
  /dashboard                → Dashboard (home, default after login)

  /cases                    → Case inbox
  /cases/new                → New case creation
  /cases/:caseId            → Case thread detail

  /documents                → Document library (all)
  /documents/:category      → Documents by category
  /documents/:documentId    → Document preview/detail
  /documents/upload         → Upload document

  /wallet                   → Wallet (default: own cards)
  /wallet/:dependentId      → Dependent wallet
  /wallet/share             → Share wallet

  /appointments             → Appointments list
  /appointments/schedule    → Schedule new appointment (iframe embed)
  /appointments/:apptId     → Appointment detail
  /appointments/:apptId/join → Join video call

  /services                 → Services directory
  /services/:serviceId      → Service detail

  /account                  → Account settings (default: profile)
  /account/profile          → Profile settings
  /account/security         → Security settings
  /account/notifications    → Notification preferences
  /account/privacy          → Privacy settings
  /account/accessibility    → Accessibility settings
  /account/dependents       → Dependents management
  /account/connected        → Connected accounts
  /account/billing          → Billing & plan info
  /account/help             → Help & support

Shared/Deep Link Routes:
  /share/wallet/:token      → Publicly shareable wallet link (temp token)
  /share/document/:token    → Publicly shareable document link (temp token)
```

### Admin Portal Routes

```
Admin Routes (all require admin authentication):
  /admin                               → Admin dashboard (overview)

  /admin/members                       → Member directory
  /admin/members/:memberId             → Member profile detail
  /admin/members/import                → Bulk import
  /admin/members/export                → Export members

  /admin/cases                         → Case inbox
  /admin/cases/:caseId                 → Case detail
  /admin/cases/analytics               → Case analytics

  /admin/documents                     → Document library
  /admin/documents/upload              → Upload documents
  /admin/documents/:documentId         → Document detail
  /admin/documents/categories          → Manage categories

  /admin/communications                → Communication center
  /admin/communications/new            → Send notification
  /admin/communications/:notificationId → Notification detail
  /admin/communications/templates      → Templates

  /admin/consultations                 → Consultation calendar
  /admin/consultations/:apptId         → Appointment detail
  /admin/consultations/consultants     → Consultant management
  /admin/consultations/settings        → Consultation settings

  /admin/services                      → Services management
  /admin/services/new                  → Add service
  /admin/services/:serviceId           → Service detail

  /admin/config                        → Platform configuration (overview)
  /admin/config/branding               → Branding settings
  /admin/config/tiers                  → Tier management
  /admin/config/taskbar                → Task bar settings
  /admin/config/onboarding             → Onboarding configuration
  /admin/config/notifications          → Notification defaults
  /admin/config/general                → General settings

  /admin/employers                     → Employer directory
  /admin/employers/new                 → Add employer
  /admin/employers/:employerId         → Employer detail
  /admin/employers/:employerId/plans   → Employer plans

  /admin/analytics                     → Analytics dashboard
  /admin/analytics/cases               → Case analytics
  /admin/analytics/members             → Member analytics
  /admin/analytics/communications      → Communication analytics
  /admin/analytics/reports             → Custom reports

  /admin/team                          → Admin user management
  /admin/team/new                      → Add admin user
  /admin/team/:adminId                 → Admin user detail
  /admin/team/roles                    → Roles & permissions
  /admin/team/audit                    → Audit log

  /admin/help                          → Admin help & support
```

### Route Guards & Redirects

**Member Portal:**
- Unauthenticated users accessing `/dashboard` → redirect to `/login`
- Authenticated users accessing `/login` → redirect to `/dashboard`
- After successful login → redirect to `/dashboard` (or deep link if stored)
- Incomplete onboarding → redirect to `/register?step=X`
- Session expired → show modal, then redirect to `/login` with return URL

**Admin Portal:**
- Unauthenticated admins → redirect to `/admin/login`
- Insufficient permissions → show 403 error page with "Request Access" CTA
- Scoped admins (Employer Admin) → filter routes and data by employer_id

### URL Structure Best Practices

1. **Consistent naming**: Use plural nouns for collections (`/cases`, `/documents`)
2. **Resource hierarchy**: Reflect relationships in URLs (`/admin/employers/:id/plans`)
3. **Action routes**: Use verbs for actions (`/upload`, `/schedule`, `/new`)
4. **Query parameters**: Use for filters, search, pagination
   - Example: `/documents?category=eob&sort=date&page=2`
5. **Deep linking support**: All routes should be bookmarkable and shareable
6. **SEO-friendly**: Use descriptive slugs where applicable (less critical for authenticated apps)

---

## Deep Linking

### Member Deep Links

Support deep linking for key member actions:

```
Purpose: Direct access to specific features from emails, SMS, push notifications

Examples:
  touchcare.com/cases/12345
    → Opens specific case in member portal

  touchcare.com/documents/new-eob-notification
    → Opens documents page, highlights new EOB

  touchcare.com/appointments/56789
    → Opens appointment detail, shows join button if active

  touchcare.com/wallet?highlight=insurance-card
    → Opens wallet, scrolls to insurance card

  touchcare.com/dashboard?task=complete-profile
    → Opens dashboard, expands task bar, highlights specific task
```

### Share Links (Temporary Tokens)

For secure sharing:

```
touchcare.com/share/wallet/abc123token
  → Publicly accessible wallet view (expires in 24 hours)
  → No login required
  → Shows front/back of insurance card
  → Can be texted to provider's office

touchcare.com/share/document/xyz789token
  → Publicly accessible document preview
  → Expires after X views or 7 days
  → Optionally password-protected
```

### Admin Deep Links

```
touchcare.com/admin/members/12345
  → Opens member profile in admin portal

touchcare.com/admin/cases/67890?notify=true
  → Opens case, assigns to current admin, sends member notification

touchcare.com/admin/communications/new?template=appointment-reminder
  → Opens communication center with pre-selected template
```

### Implementation

**Token-based sharing:**
- Generate short-lived JWT tokens for share links
- Store token metadata in Redis (expiration, view count)
- Validate token on each access, increment view count
- Revoke after expiration or max views

**Deep link handling:**
- Store intended destination during login flow
- Redirect after successful authentication
- Validate permissions before redirecting (prevent unauthorized access)

---

## Mobile-Specific Navigation Patterns

### Bottom Navigation (Member Portal)

- **Fixed position**: Always visible at bottom of viewport
- **Active state**: Clear visual indicator (icon fill, text color, underline)
- **Badge support**: Unread counts, task counts
- **Tap behavior**: Instant navigation (no animation lag)
- **Safe area insets**: Respect iOS notch and Android gesture bars

### Gestures

- **Swipe back**: Navigate to previous page (iOS-style)
- **Swipe to dismiss**: Close modals and sheets
- **Pull to refresh**: Refresh dashboard, case inbox, document list
- **Swipe actions**: Archive/resolve cases, mark notifications as read

### Full-Screen Modals vs. Sheets

- **Full-screen modal**: Document preview, wallet card detail, case thread
- **Bottom sheet**: Quick actions, filters, simple forms
- **Slide-over**: Context-specific actions (share, download)

### Breadcrumbs on Mobile

- **Top bar back button**: Always show back arrow on detail views
- **Contextual title**: Show current page title in top bar
- **No full breadcrumbs**: Space-constrained; use back button instead

---

## Search & Discovery

### Global Search (Member Portal)

- **Search bar**: Accessible from top bar or dashboard
- **Scope**: Cases, documents, appointments, FAQs
- **Results grouping**: Group by type (Cases, Documents, etc.)
- **Recent searches**: Show recent search queries
- **Autocomplete**: Suggest as user types

### Admin Portal Search

- **Global search**: Members, cases, documents, employers
- **Fuzzy matching**: Handle typos and partial matches
- **Filters**: Refine by date, status, type, employer
- **Saved searches**: Save frequently used search queries

---

## Accessibility Navigation

### Keyboard Navigation

- **Tab order**: Logical flow through interactive elements
- **Skip links**: "Skip to main content" at top of page
- **Focus indicators**: Clear visual focus states (not just browser default)
- **Keyboard shortcuts**: Optional shortcuts for power users
  - `g` + `h` → Go to home
  - `g` + `c` → Go to cases
  - `g` + `d` → Go to documents
  - `/` → Focus search

### Screen Readers

- **ARIA labels**: Meaningful labels for all interactive elements
- **Landmarks**: Proper use of `<nav>`, `<main>`, `<aside>` tags
- **Live regions**: Announce dynamic content (new messages, notifications)
- **Heading hierarchy**: Proper H1-H6 structure for navigation

---

## Responsive Breakpoints

Define consistent breakpoints for responsive navigation:

```
Mobile:     < 768px   (bottom nav, hamburger menu, full-screen modals)
Tablet:     768-1024px (bottom nav or top tabs, split views)
Desktop:    1024-1440px (sidebar, multi-column layouts)
Large:      > 1440px  (wide sidebar, 3-column layouts, more whitespace)
```

---

This information architecture provides a complete navigation structure for implementation teams. All routes, permissions, and patterns are defined with consistency and scalability in mind.
