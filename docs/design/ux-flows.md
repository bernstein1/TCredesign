# UX Flows & State Machines

Detailed user experience flows, state machines, and interaction patterns for all key member and admin journeys on the TouchCare unified platform.

---

## Table of Contents

1. [Onboarding Flow](#onboarding-flow)
2. [Authentication Flow](#authentication-flow)
3. [Dashboard & Task Completion](#dashboard--task-completion)
4. [Messaging & Case Management](#messaging--case-management)
5. [Document Management](#document-management)
6. [Wallet Access & Sharing](#wallet-access--sharing)
7. [Appointment Scheduling](#appointment-scheduling)
8. [Account Settings](#account-settings)
9. [Admin: Case Handling](#admin-case-handling)
10. [Admin: Notification Campaigns](#admin-notification-campaigns)

---

## Onboarding Flow

### Three-Phase Progressive Model

#### Overview State Machine

```
[Start] → Phase 1: Core Identity → [Account Created]
          ↓
          Phase 2: Essential Setup → [Dashboard Access Granted]
          ↓
          Phase 3: Deferred Configuration → [Onboarding Complete]
```

### Phase 1: Core Identity (~30 seconds)

**Goal**: Create account with minimal friction.

**Steps**:

1. **Welcome Screen**
   - Hero: "Welcome to TouchCare"
   - Subheading: "Your health benefits, simplified"
   - Primary CTA: "Get Started"
   - Secondary: "Already have an account? Sign in"

2. **Identity Input**
   - Fields:
     - Email or phone (single field, smart detection)
     - First name
     - Last name
   - Smart features:
     - Auto-detect email vs phone format
     - Numeric keyboard for phone
     - Email keyboard for email
   - Validation:
     - Real-time email/phone format check
     - Duplicate account check (if exists → redirect to login)

3. **Employer Verification**
   - Two paths:

     **Path A: Invite Link**
     - URL contains employer code: `touchcare.com/register?employer=ACME2024`
     - Pre-fill employer
     - Show: "You're joining Acme Corporation"
     - Single-tap continue

     **Path B: Manual Entry**
     - Search field: "Search for your employer"
     - Autocomplete dropdown as user types
     - Select employer from list
     - Fallback: "Don't see your employer? Contact support"

4. **Verification**
   - Send verification code to email/phone
   - Auto-detect and pre-select delivery method
   - 6-digit code entry
   - Auto-advance on 6th digit
   - Resend code after 60s countdown
   - "Didn't receive? Try SMS" toggle

5. **Account Created**
   - Success animation (checkmark)
   - Message: "You're in! Let's set up your account."
   - Auto-advance to Phase 2 after 1.5s

**UI Pattern**:
- Single-column mobile layout
- Progress indicator: "Step 1 of 3" or 33% progress bar
- Large input fields (min 48px height)
- Auto-focus on first field
- Generous spacing (24px between fields)

**Edge Cases**:
- Email already exists → "Account exists. Sign in instead?"
- Employer not found → Contact support flow
- Verification timeout → Resend with new code
- Wrong code 3x → Lock for 5 minutes, show support contact

---

### Phase 2: Essential Setup (2-3 minutes)

**Goal**: Collect minimum required info to access dashboard.

**Steps**:

1. **Date of Birth**
   - Label: "When's your birthday?"
   - Date picker (mobile-optimized)
   - Validation: Must be 18+ (or employer min age)
   - Helper text: "We need this to verify your coverage"

2. **Terms & Consent**
   - Scrollable terms summary
   - Checkboxes:
     - "I agree to Terms of Service" (required)
     - "I agree to Privacy Policy" (required)
     - "Send me helpful tips" (optional, pre-checked)
   - Links to full documents (open in modal or new tab)

3. **Complete**
   - Success message: "You're all set!"
   - Show: "You can now access your dashboard"
   - CTA: "Go to Dashboard"
   - Note: "You can complete your profile later"

**UI Pattern**:
- Progress indicator: "Step 2 of 3" or 66%
- Each step on separate screen (mobile)
- Clear back button
- Validation before advancing
- Auto-save on each step

**State Update**:
- `onboarding_status: 'essential_complete'`
- User can now access dashboard with incomplete profile

---

### Phase 3: Deferred Configuration (post-login)

**Goal**: Complete profile via Task Bar prompts.

**Trigger**: Task Bar on dashboard shows incomplete tasks.

**Tasks** (examples):
1. Add address
2. Add emergency contact
3. Upload profile photo
4. Add dependent information
5. Verify phone number
6. Review plan documents

**UX**:
- Tasks appear in Task Bar (persistent on dashboard)
- User can complete in any order
- Clicking task navigates to relevant settings page
- Progress indicator shows X of Y complete
- Celebration when all tasks done

**Completion**:
- State: `onboarding_status: 'complete'`
- Task Bar auto-hides or shows minimal "All set!" message
- Confetti animation

---

### Error Handling

**Network Errors**:
- Show retry button
- Preserve form data (don't clear inputs)
- Friendly message: "Connection issue. Please try again."

**Validation Errors**:
- Inline below field (red text + icon)
- Prevent form submission until fixed
- Clear error on input change

**Server Errors**:
- Generic message: "Something went wrong. Please try again."
- Option to contact support
- Log error details for debugging

---

## Authentication Flow

### State Machine

```
[Logged Out]
    ↓
    Choose Login Method
    ├─→ Email/Phone (Passwordless)
    │     ↓
    │   Enter Email/Phone → Send Code → Verify Code → [Logged In]
    │
    ├─→ Google SSO → OAuth Flow → [Logged In]
    │
    ├─→ Microsoft SSO → OAuth Flow → [Logged In]
    │
    └─→ Biometric (Trusted Device) → FaceID/TouchID → [Logged In]
```

### Passwordless Email/Phone Flow

**Steps**:

1. **Login Screen**
   - Input: Email or phone
   - Smart detection (@ = email, + or digits = phone)
   - Primary CTA: "Continue"
   - Secondary: "Sign in with Google" / "Sign in with Microsoft"
   - Link: "Don't have an account? Sign up"

2. **Verification Method**
   - If email: "We'll send a code to your email"
   - If phone: "We'll send a code via SMS"
   - Show masked destination: "We sent a code to m****@example.com"
   - Option to change method: "Use phone instead"

3. **Code Entry**
   - 6-digit code input
   - Auto-advance on completion
   - Resend after 60s countdown
   - "Didn't receive? Check spam folder"

4. **Trust Device (Optional)**
   - Checkbox: "Remember this device for 30 days"
   - Enables biometric on next login

5. **Success**
   - Redirect to:
     - Dashboard (default)
     - Deep link (if user clicked email link)
     - Onboarding (if incomplete)

**UI Patterns**:
- Centered card on desktop
- Full-screen on mobile
- Loading spinner during verification
- Auto-focus on code input
- Paste support for code (detect clipboard)

---

### SSO Flow

**Steps**:

1. **Login Screen**
   - Button: "Continue with Google" (Google logo + text)
   - Button: "Continue with Microsoft"

2. **OAuth Redirect**
   - Redirect to provider
   - User authenticates on Google/Microsoft
   - Consent screen (first time)

3. **Callback**
   - Receive OAuth code
   - Exchange for tokens
   - Create/update user
   - Issue session token

4. **Success**
   - Redirect to dashboard
   - First-time users → onboarding Phase 2 (skip Phase 1)

**Error Handling**:
- User cancels OAuth → Return to login with message
- OAuth fails → "Unable to sign in. Please try again."
- Account not found → Option to create account or contact support

---

### Biometric (Trusted Device)

**Steps**:

1. **Login Screen** (returning user on trusted device)
   - Show: "Welcome back, Jane!"
   - Primary CTA: "Sign in with Face ID"
   - Secondary: "Use email instead"

2. **Biometric Prompt**
   - OS-level FaceID/TouchID/Windows Hello prompt
   - User authenticates

3. **Success**
   - Instant login (no code required)
   - Redirect to dashboard

**Fallback**:
- Biometric fails → Fall back to email/phone code
- Device no longer trusted (expired) → Full login flow

---

### Session Management

**Idle Timeout**:
- 30 minutes of inactivity → Show warning modal
- Modal: "You've been idle. You'll be logged out in 2 minutes."
- CTA: "Stay logged in" (extends session)
- After 2 min → Auto logout → Redirect to login

**Session Expiration**:
- Access token expires after 1 hour
- Use refresh token to get new access token (automatic, transparent)
- Refresh token expires after 30 days → Full re-login required

**Multi-Device**:
- User can be logged in on multiple devices
- "Active Sessions" in settings shows all devices
- Option to "Log out of other devices"

---

## Dashboard & Task Completion

### Dashboard Layout (Mobile)

```
[Top Bar: Logo, Notifications Bell, Avatar]
    ↓
[Task Bar] (if incomplete tasks)
    ↓
[Active Cases] (if any)
    ↓
[Notifications Feed] (recent 3)
    ↓
[Upcoming Appointments] (next 1-2)
    ↓
[Quick Actions] (grid or list)
    ↓
[Bottom Navigation: Home, Cases, Documents, Wallet, Account]
```

### Task Bar Behavior

**States**:
- **Collapsed** (default): Shows count badge "3 tasks remaining"
- **Expanded**: Shows full task list with checkboxes and CTAs
- **Minimized** (all complete): Shows "All set! ✓" with collapse option
- **Hidden** (dismissed): User can manually hide; re-appears if new task added

**Interactions**:
1. Tap header → Toggle expand/collapse
2. Tap task CTA → Navigate to task destination
3. Task auto-completes when condition met
4. Completion animation: Checkmark fade-in
5. All complete → Confetti animation + "You're all set!" message

**Task Completion Logic**:
- Backend checks completion conditions on each dashboard load
- Frontend polls or uses WebSocket for real-time updates
- Example condition: "Add dependent" → `dependent_count > 0`

---

### Active Cases Section

**States**:
- **Empty**: "No active cases. Start a conversation to get help."
- **Populated**: Shows 2-3 most recent cases

**Case Card**:
- Subject line (truncated)
- Status badge (Open, Waiting on you, Resolved)
- Last message preview (1 line)
- Timestamp (relative: "5 min ago")
- Unread badge
- Agent avatar

**Interactions**:
- Tap card → Navigate to case thread
- "View all" link → Navigate to Cases inbox

---

### Notifications Feed

**States**:
- **Empty**: "You're all caught up!"
- **Populated**: Shows 3 most recent

**Notification Item**:
- Type icon (case, appointment, document, alert)
- Title (bold)
- Body (1-2 lines)
- Timestamp
- Unread indicator (dot or background color)

**Interactions**:
- Tap notification → Navigate to related resource
- Swipe left → Mark as read or delete
- "View all" → Navigate to full notifications page
- Tap bell icon in top bar → Dropdown with recent notifications

---

### Quick Actions

**Grid Layout** (mobile):
- 2x2 or 3x2 grid
- Icon + label per action

**Actions**:
- Start New Case
- View ID Card
- Schedule Appointment
- View Documents
- Upload Document
- Contact Support

**Desktop**:
- Persistent sidebar or card on dashboard

---

## Messaging & Case Management

### Case Creation Flow

**Steps**:

1. **Issue Type Selection**
   - Grid of issue types (cards with icons):
     - Claims
     - Benefits Questions
     - Provider Search
     - Coverage
     - Billing
     - Technical Support
     - Other
   - User taps one → Advance

2. **Subject & Message**
   - Input: Subject (required, max 100 chars)
   - Input: Message (required, max 500 chars)
   - Textarea grows as user types
   - Attachment button (upload images/docs)

3. **Attachments** (optional)
   - Upload from device or camera
   - Show thumbnails
   - Remove button per attachment
   - Max 5 attachments, 10MB each

4. **Submit**
   - CTA: "Send Message"
   - Loading state while creating
   - Success: "We've received your message!"
   - Auto-navigate to case thread after 1s

**Edge Cases**:
- Unsaved draft → "Save draft" prompt on back navigation
- Upload fails → Retry or remove attachment
- Network error → "Message not sent. Retry?"

---

### Case Thread View

**Layout**:

```
[Header]
  - Subject (editable on tap)
  - Status badge
  - Agent info (avatar, name, presence)
  - Actions: Resolve, Settings

[Message Thread]
  - Scrollable message bubbles (reverse-chronological)
  - Member messages (left/blue)
  - Admin messages (right/gray)
  - System messages (centered, small)
  - Timestamps (relative, absolute on hover)

[Composer] (bottom)
  - Text input (grows to 5 lines max)
  - Attachment button
  - Send button (disabled when empty)
```

**Interactions**:

1. **Send Message**
   - Type in composer
   - Tap send or press Enter (desktop)
   - Message appears in thread immediately (optimistic UI)
   - Spinner while sending
   - Checkmark when delivered
   - Error state if failed → Retry option

2. **Attachment**
   - Tap attachment icon
   - Choose file from device or camera
   - Upload progress indicator
   - Thumbnail preview in composer
   - Remove attachment option

3. **Edit Subject**
   - Tap subject in header
   - Inline edit field
   - Save on blur or Enter
   - Cancel on Esc

4. **Resolve Case**
   - Tap "Resolve" button
   - Confirmation modal: "Mark this case as resolved?"
   - CTA: "Yes, resolve" / "Cancel"
   - Success toast: "Case resolved!"
   - Option to rate experience (1-5 stars)

5. **Real-Time Updates**
   - WebSocket connection for live updates
   - New message appears immediately
   - Typing indicator when agent is typing
   - Read receipts (checkmarks)

**States**:
- **Loading**: Skeleton loaders for messages
- **Empty**: "No messages yet" (shouldn't happen, always has initial message)
- **Error**: "Unable to load messages. Tap to retry."

---

### Case Inbox (List View)

**Filters**:
- All (default)
- Open
- Resolved

**Sort**:
- Most recent (default)
- Unread first
- Oldest

**Search**:
- Full-text search across subject and messages
- Autocomplete as user types
- Clear search button

**List Item**:
- Subject (bold if unread)
- Last message preview
- Timestamp
- Status badge
- Unread count
- Agent avatar

**Interactions**:
- Tap item → Open thread
- Swipe left → Archive or Mark as resolved
- Pull to refresh

---

## Document Management

### Document Library View

**Layout**:

```
[Tabs/Sidebar: Categories]
  - All Documents
  - Insurance Cards & IDs
  - Claims & EOBs
  - Policies
  - Letters
  - Receipts

[Filters & Search]
  - Search bar (full-text)
  - Filter: Date range, Type, Status
  - Sort: Date, Name, Type

[Document Grid/List]
  - Card view (mobile default)
  - List view (option)
  - Each card:
    - Thumbnail
    - Name
    - Type icon
    - Date
    - Pinned indicator
    - Quick actions (download, share)

[FAB: Upload Document]
```

**Interactions**:

1. **View Document**
   - Tap card → Open preview modal (mobile: full-screen)
   - PDF renderer with zoom, scroll, page navigation
   - Actions: Download, Share, Print

2. **Upload Document**
   - Tap FAB → Upload sheet
   - Choose file or camera
   - Name input (auto-filled from filename)
   - Category dropdown
   - Document type dropdown
   - Notes (optional)
   - CTA: "Upload"
   - Progress indicator
   - Success toast: "Document uploaded!"

3. **Pin/Unpin**
   - Tap pin icon on card
   - Pinned docs appear at top of list

4. **Search**
   - Type in search bar
   - Results update in real-time
   - Highlight matching text in OCR content

**Empty States**:
- No documents in category: "No documents yet. Upload your first document!"
- No search results: "No documents match your search."

---

### Document Preview Flow

**Steps**:

1. **Open Preview**
   - Tap document card
   - Transition: Expand from card position
   - Full-screen overlay (mobile) or modal (desktop)

2. **Preview UI**
   - Top bar:
     - Close button
     - Document name
     - Actions: Download, Share, Print
   - PDF viewer:
     - Scrollable pages
     - Pinch to zoom
     - Page indicator "Page 2 of 5"
     - Next/previous page buttons (desktop)

3. **Share**
   - Tap share button
   - Options:
     - Generate shareable link (with optional password)
     - Email document
     - Download locally
   - Share link modal:
     - Link (copy button)
     - Expiration options (24h, 7 days, custom)
     - Password toggle
     - "Create link" CTA

4. **Close**
   - Tap close or swipe down (mobile)
   - Transition: Collapse back to card

---

## Wallet Access & Sharing

### Wallet View

**Layout**:

```
[Top Bar]
  - Title: "My Wallet"
  - Dependent switcher (dropdown)
  - Settings icon

[Card Stack] (vertical scroll)
  - Insurance ID (Medical) — Primary, always on top
  - Insurance ID (Dental)
  - Insurance ID (Vision)
  - Personal Info Card
  - Emergency Contacts
  - Allergies & Conditions
  - Current Medications

[Actions] (bottom or as buttons on cards)
  - Share Wallet
  - Add to Apple/Google Wallet
  - Download as PDF
```

**Interactions**:

1. **View Card Detail**
   - Tap card → Expand to full-screen
   - Show front (default)
   - Flip animation to show back (swipe or tap "Flip" button)
   - Brightness auto-increases (for showing to providers)
   - Pinch to zoom

2. **Share Wallet**
   - Tap "Share" button
   - Modal:
     - Generate shareable link
     - Set expiration (24h default)
     - Optional password
     - "Create Share Link" CTA
   - Copy link to clipboard
   - Share via SMS, email, etc.

3. **Add to Apple/Google Wallet**
   - Tap "Add to Wallet" button
   - Generate wallet pass file
   - Open OS wallet app
   - Confirm add

4. **Download as PDF**
   - Tap "Download" button
   - Generate PDF with all cards
   - Download or share

5. **Dependent Switcher**
   - Tap dropdown
   - List of dependents + "My Wallet"
   - Select → Load dependent's wallet

**States**:
- **Loading**: Skeleton loaders for cards
- **Empty**: "No cards yet. Add insurance info in settings."
- **Error**: "Unable to load wallet. Tap to retry."

---

### Shared Wallet View (Public)

**Steps**:

1. **Access Link**
   - User (provider/friend) clicks shared link
   - Format: `touchcare.com/share/wallet/{token}`

2. **Password Prompt** (if protected)
   - Input: Password
   - Submit → Validate
   - Wrong password → "Incorrect password"

3. **View Wallet**
   - Read-only wallet view
   - Same card stack layout
   - No edit or share options
   - Footer: "Shared via TouchCare" + logo

4. **Expiration**
   - After expiration time → "This link has expired"
   - Or after max views → "This link is no longer available"

---

## Appointment Scheduling

### Scheduling Flow (Embedded Iframe)

**Steps**:

1. **Navigate to Appointments**
   - From dashboard "Quick Actions"
   - Or from main nav

2. **Appointments Page**
   - List upcoming appointments
   - CTA: "Schedule New Appointment"

3. **Schedule New**
   - Tap "Schedule New"
   - Embed iframe: `https://touchcare.as.me/schedule`
   - Iframe shows TouchCare scheduling interface
   - User selects:
     - Consultation type
     - Consultant (or auto-assign)
     - Date & time
     - Phone or video
   - User completes booking on iframe

4. **Confirmation**
   - Iframe shows confirmation
   - Webhook fires to our backend → Sync appointment
   - Our UI refreshes → Show new appointment in list
   - Confirmation email sent

**Syncing**:
- Webhook endpoint receives booking data
- Create `Appointment` record
- Link to `Member` and `Consultant`
- Send confirmation notification to member

---

### Appointment Detail View

**Layout**:

```
[Header]
  - Consultation type
  - Date & time (with countdown if <24h)
  - Consultant info (avatar, name, title)

[Details]
  - Format (phone/video)
  - Duration
  - Preparation instructions

[Actions]
  - Join Call (if video, enabled 10 min before)
  - Add to Calendar (.ics download)
  - Reschedule
  - Cancel

[Notes] (after completion)
  - Consultant notes (if shared)
  - Follow-up tasks
```

**Interactions**:

1. **Join Video Call**
   - Button appears 10 minutes before scheduled time
   - Tap → Open video URL in new tab or in-app
   - If before time → "Call not ready yet"

2. **Add to Calendar**
   - Tap → Download .ics file
   - Opens in calendar app

3. **Reschedule**
   - Tap → Return to scheduling iframe
   - Pre-select same consultation type
   - Choose new time
   - Confirm → Update appointment

4. **Cancel**
   - Tap → Confirmation modal
   - Show cancellation policy (if <24h, may charge fee)
   - Input: Reason (optional)
   - CTA: "Confirm Cancellation"
   - Success toast: "Appointment cancelled"

---

### Appointment Reminders

**Email Reminders**:
- 24 hours before
- 1 hour before

**SMS Reminders** (if enabled):
- 1 hour before

**In-App Notification**:
- 10 minutes before (when join button activates)

**UI**:
- Notification in feed
- Banner on dashboard if appointment is today

---

## Account Settings

### Settings Navigation

**Mobile**:
- Accordion-style sections
- Tap section → Expand to show options

**Desktop**:
- Left sidebar navigation
- Right content pane

**Sections**:
1. Profile
2. Account & Security
3. Notifications & Alerts
4. Privacy & Data
5. Accessibility
6. Dependents
7. Connected Accounts
8. Billing & Plan Info
9. Help & Support

---

### Profile Editing Flow

**Steps**:

1. **Profile View**
   - Display all profile fields (read-only)
   - "Edit Profile" button

2. **Edit Mode**
   - Tap "Edit Profile" → Enable editing
   - Fields become inputs
   - Change avatar (tap to upload)
   - Save / Cancel buttons

3. **Save Changes**
   - Tap "Save"
   - Validation
   - Loading state
   - Success toast: "Profile updated!"

**Inline Editing** (alternative):
- Each field has edit icon
- Tap icon → Field becomes editable
- Save on blur or Enter
- Cancel on Esc

---

### Notification Preferences

**Layout**:

```
Email Notifications
  [Toggle: Enable email notifications]
  ├─ Case Updates [Checkbox]
  ├─ Appointment Reminders [Checkbox]
  ├─ Document Uploads [Checkbox]
  ├─ Security Alerts [Checkbox, disabled (always on)]
  ├─ Marketing [Checkbox]
  └─ Tips & Recommendations [Checkbox]

SMS Notifications
  [Toggle: Enable SMS notifications]
  ├─ Case Updates [Checkbox]
  ├─ Appointment Reminders [Checkbox]
  └─ Security Alerts [Checkbox, disabled (always on)]

Push Notifications
  [Toggle: Enable push notifications]
  └─ (Similar checkboxes)

In-App Notifications
  [Toggle: Enable in-app notifications]
  ├─ Show badges [Checkbox]
  └─ Play sound [Checkbox]
```

**Interactions**:
- Toggle master switch → Disable all sub-options
- Individual checkboxes → Granular control
- Auto-save on change (no submit button)
- Toast confirmation: "Preferences saved"

---

### Dependents Management

**List View**:
- Card per dependent
- Name, DOB, relationship
- Edit / Remove buttons

**Add Dependent Flow**:

1. Tap "Add Dependent"
2. Form:
   - First name
   - Last name
   - Date of birth (date picker)
   - Relationship (dropdown)
   - Gender (optional)
3. Submit → Success toast
4. New card appears in list

**Edit Dependent**:
- Tap "Edit" → Pre-filled form
- Update fields
- Submit → Success

**Remove Dependent**:
- Tap "Remove" → Confirmation modal
- Warning: "This will remove access to their records"
- Confirm → Success

---

## Admin: Case Handling

### Case Inbox (Admin)

**Layout**:

```
[Filters & Queues]
  - My Cases
  - Unassigned
  - Team Queue
  - All Cases

[Filters]
  - Status, Priority, Issue Type
  - SLA breach indicator

[Case List]
  - Table view (desktop) or cards (mobile)
  - Columns: Subject, Member, Status, Priority, Assigned To, Last Updated, SLA

[Actions]
  - Bulk assign
  - Export
```

**Interactions**:

1. **Claim Unassigned Case**
   - Tap case in "Unassigned" queue
   - Auto-assigns to current admin
   - Opens case thread

2. **Assign Case**
   - Click "Assign" dropdown
   - Search for admin or team
   - Select → Assign
   - Case moves to assignee's queue

3. **Filter by SLA Breach**
   - Toggle "SLA Breach" filter
   - Highlight cases in red

---

### Case Thread (Admin)

**Layout**: Similar to member view, plus:

**Admin Actions**:
- Assign
- Change status
- Escalate
- Add internal note (not visible to member)
- Use quick reply templates

**Interactions**:

1. **Reply to Member**
   - Type in composer
   - Send → Member receives notification

2. **Add Internal Note**
   - Toggle "Internal Note" checkbox
   - Type note
   - Send → Visible only to admins (yellow background)

3. **Use Template**
   - Click "Templates" dropdown
   - Select template (e.g., "Dental Coverage Explanation")
   - Template text populates composer
   - Edit as needed
   - Send

4. **Change Status**
   - Click status dropdown
   - Select: Open, In Progress, Waiting on Member, Resolved
   - Optional: Add resolution summary
   - Submit → Member notified

5. **Escalate**
   - Click "Escalate"
   - Modal: Select supervisor
   - Add escalation reason
   - Submit → Case reassigned + supervisor notified

---

## Admin: Notification Campaigns

### Send Notification Flow

**Steps**:

1. **Communication Center → Send Notification**

2. **Compose**
   - Type: Announcement, Action Required, Reminder, Tip
   - Title (max 50 chars)
   - Body (max 500 chars, rich text)
   - CTA (optional):
     - Text (max 20 chars)
     - URL (internal or external)

3. **Target Audience**
   - Options:
     - All members
     - Specific employer(s)
     - Specific plan(s)
     - Specific tier(s)
     - Individual members (search)
   - Show estimated recipient count

4. **Select Channels**
   - In-app (always on, can't disable)
   - Push (checkbox)
   - Email (checkbox)
   - SMS (checkbox, flagged as urgent)
   - Show estimated reach per channel

5. **Schedule**
   - Send now (default)
   - Schedule later:
     - Date picker
     - Time picker
     - Timezone selector

6. **Preview**
   - Show previews for:
     - In-app notification
     - Push notification (mobile UI mockup)
     - Email (rendered template)
     - SMS (text preview)
   - "Send Test" button (sends to admin's account)

7. **Send / Schedule**
   - CTA: "Send Now" or "Schedule"
   - Confirmation: "Send to X members?"
   - Submit → Processing

8. **Confirmation**
   - Success: "Notification sent!" or "Notification scheduled"
   - Redirect to notification detail page

---

### Notification Campaign Detail

**Layout**:

```
[Header]
  - Title
  - Status badge (Sent, Scheduled, Sending)
  - Sent/Scheduled date

[Content Preview]
  - Title, body, CTA

[Audience]
  - Estimated vs actual recipients
  - Target filters

[Analytics]
  - Delivered count
  - Read count
  - Clicked count
  - Email bounced count
  - SMS bounced count
  - Unsubscribed count

[Charts]
  - Delivery over time
  - Engagement rate

[Actions]
  - Edit (if scheduled)
  - Cancel (if scheduled)
  - Duplicate
```

---

This UX flows document provides comprehensive interaction patterns and state machines for implementation. All flows are designed for clarity, error resilience, and accessibility.
