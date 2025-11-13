# Data Models

Comprehensive entity-relationship diagram and detailed data model specifications for the TouchCare unified platform.

---

## Table of Contents

1. [Entity-Relationship Diagram](#entity-relationship-diagram)
2. [Core Entities](#core-entities)
3. [Member & Identity Entities](#member--identity-entities)
4. [Communication Entities](#communication-entities)
5. [Document Entities](#document-entities)
6. [Scheduling Entities](#scheduling-entities)
7. [Configuration Entities](#configuration-entities)
8. [Analytics & Audit Entities](#analytics--audit-entities)
9. [Multi-Tenancy Strategy](#multi-tenancy-strategy)
10. [Indexing Strategy](#indexing-strategy)
11. [Data Retention & Privacy](#data-retention--privacy)

---

## Entity-Relationship Diagram

```
┌─────────────────┐         ┌──────────────────┐
│    Employer     │────────<│      Plan        │
└────────┬────────┘         └─────────┬────────┘
         │                            │
         │ 1:N                        │ 1:N
         │                            │
         ▼                            ▼
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│     Member      │───────<>│    Dependent     │         │   MemberTier     │
└────────┬────────┘         └──────────────────┘         └────────┬─────────┘
         │                                                         │
         │ 1:1                                                     │ N:1
         ▼                                                         │
┌─────────────────┐                                                │
│  MemberProfile  │                                                │
└────────┬────────┘                                                │
         │                                                         │
         │ 1:N              ┌──────────────────┐                  │
         ├─────────────────>│      Case        │<─────────────────┘
         │                  └────────┬─────────┘
         │                           │ 1:N
         │                           ▼
         │                  ┌──────────────────┐
         │                  │     Message      │
         │                  └──────────────────┘
         │
         │ 1:N              ┌──────────────────┐         ┌──────────────────┐
         ├─────────────────>│    Document      │────────<│  DocumentCategory│
         │                  └────────┬─────────┘         └──────────────────┘
         │                           │ 1:N
         │                           ▼
         │                  ┌──────────────────┐
         │                  │ DocumentVersion  │
         │                  └──────────────────┘
         │
         │ 1:1              ┌──────────────────┐
         ├─────────────────>│      Wallet      │
         │                  └────────┬─────────┘
         │                           │ 1:N
         │                           ▼
         │                  ┌──────────────────┐
         │                  │       Card       │
         │                  └──────────────────┘
         │
         │ 1:N              ┌──────────────────┐         ┌──────────────────┐
         ├─────────────────>│   Appointment    │────────<│   Consultant     │
         │                  └────────┬─────────┘         └──────────────────┘
         │                           │ N:1
         │                           ▼
         │                  ┌──────────────────┐
         │                  │ConsultationType  │
         │                  └──────────────────┘
         │
         │ 1:N              ┌──────────────────┐
         ├─────────────────>│  Notification    │
         │                  └────────┬─────────┘
         │                           │ N:1
         │                           ▼
         │                  ┌──────────────────┐
         │                  │NotificationTemplate
         │                  └──────────────────┘
         │
         │ 1:N              ┌──────────────────┐
         ├─────────────────>│     Session      │
         │                  └──────────────────┘
         │
         │ 1:N              ┌──────────────────┐
         ├─────────────────>│  TrustedDevice   │
         │                  └──────────────────┘
         │
         │ 1:1              ┌──────────────────┐
         └─────────────────>│ MemberSettings   │
                            └──────────────────┘


┌─────────────────┐         ┌──────────────────┐
│   AdminUser     │────────<│       Role       │
└────────┬────────┘         └────────┬─────────┘
         │                            │ 1:N
         │ N:N (assigned_cases)       ▼
         │                   ┌──────────────────┐
         └──────────────────>│    Permission    │
                             └──────────────────┘


┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  BrandingConfig │────────<│    ThemeToken    │         │   AssetUpload    │
└────────┬────────┘         └──────────────────┘         └──────────────────┘
         │ 1:1
         ▼
┌─────────────────┐
│    Employer     │
└─────────────────┘


┌─────────────────┐         ┌──────────────────┐
│     Service     │────────<│ ServiceEligibility│
└────────┬────────┘         └────────┬─────────┘
         │                            │
         │ 1:N                        │ N:1
         ▼                            ▼
┌─────────────────┐         ┌──────────────────┐
│ ServiceCategory │         │       Plan       │
└─────────────────┘         └──────────────────┘


┌─────────────────┐         ┌──────────────────┐
│   TaskBarTask   │────────<│ MemberTaskStatus │
└─────────────────┘         └────────┬─────────┘
                                     │ N:1
                                     ▼
                            ┌──────────────────┐
                            │      Member      │
                            └──────────────────┘
```

---

## Core Entities

### Employer

Represents a company/organization that provides TouchCare as a benefit.

```typescript
interface Employer {
  id: UUID;
  name: string;
  slug: string; // URL-friendly identifier (e.g., "acme-corp")
  domain?: string; // Custom domain (e.g., "benefits.acme.com")
  industry?: string;
  employee_count?: number;
  contact_email: string;
  contact_phone?: string;
  address?: Address;

  // Configuration
  branding_config_id?: UUID; // → BrandingConfig
  onboarding_config: JSON; // Custom onboarding flow configuration
  feature_flags: JSON; // Enabled features per employer

  // Status
  status: 'active' | 'inactive' | 'suspended';
  contract_start_date?: Date;
  contract_end_date?: Date;

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
  created_by: UUID; // → AdminUser
}

// Indexes
indexes:
  - slug (unique)
  - domain (unique)
  - status
```

### Plan

A benefits package configuration within an employer.

```typescript
interface Plan {
  id: UUID;
  employer_id: UUID; // → Employer
  name: string; // e.g., "Standard Plan", "Premium Plan"
  code: string; // e.g., "STD-001"

  // Coverage details
  plan_type: 'medical' | 'dental' | 'vision' | 'comprehensive';
  coverage_level: 'individual' | 'family';
  carrier_name?: string;
  policy_number?: string;

  // Eligibility
  eligible_employee_types: string[]; // e.g., ["full-time", "part-time"]
  waiting_period_days?: number;

  // TouchCare tier mapping
  tier_id: UUID; // → MemberTier (Standard, TouchCare Blue, etc.)

  // Service access
  available_services: UUID[]; // → Service (which services members can access)

  // Effective dates
  effective_date: Date;
  termination_date?: Date;

  // Status
  status: 'active' | 'inactive';

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - employer_id
  - code (unique within employer)
  - status
  - [employer_id, status]
```

### MemberTier

Defines service tier levels (Standard, TouchCare Blue, Custom).

```typescript
interface MemberTier {
  id: UUID;
  name: string; // "Standard", "TouchCare Blue", "Custom Premium"
  slug: string; // "standard", "blue", "custom-premium"

  // Visual theming
  theme_config: JSON; // Theme overlay tokens
  badge_config?: JSON; // Badge appearance (icon, color, tooltip)

  // Service priority
  case_priority_level: number; // Higher = more priority (1-10)
  sla_first_response_minutes: number; // e.g., 60 for Standard, 15 for Blue
  sla_resolution_hours: number;

  // Feature access
  feature_flags: JSON; // Premium-only features

  // Ordering
  display_order: number; // For admin UI

  // Status
  is_default: boolean; // Default tier for new members
  status: 'active' | 'inactive';

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - slug (unique)
  - is_default
```

---

## Member & Identity Entities

### Member

Core user entity representing a primary member account.

```typescript
interface Member {
  id: UUID;

  // Identity
  email: string; // Primary login identifier
  email_verified: boolean;
  email_verified_at?: DateTime;
  phone?: string; // Optional, can be used for SMS login
  phone_verified: boolean;
  phone_verified_at?: DateTime;

  // Basic info
  first_name: string;
  last_name: string;
  preferred_name?: string;
  date_of_birth: Date;
  gender?: 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say';

  // Employer relationship
  employer_id: UUID; // → Employer
  plan_id: UUID; // → Plan
  employee_id?: string; // Employer's internal employee ID
  tier_id: UUID; // → MemberTier

  // Address
  address?: Address;
  mailing_address?: Address; // If different from physical

  // Emergency contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;

  // Account status
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  onboarding_status: 'incomplete' | 'essential_complete' | 'complete';
  onboarding_completed_at?: DateTime;

  // Preferences
  preferred_language: string; // ISO 639-1 code (e.g., "en", "es")
  timezone: string; // IANA timezone (e.g., "America/New_York")

  // Authentication
  last_login_at?: DateTime;
  last_login_ip?: string;
  login_count: number;

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
  created_by?: UUID; // → AdminUser (if admin-created)
  deleted_at?: DateTime; // Soft delete
}

// Indexes
indexes:
  - email (unique)
  - phone (unique, where not null)
  - employer_id
  - plan_id
  - tier_id
  - status
  - [employer_id, status]
  - [plan_id, status]

// Address sub-type
type Address = {
  street_line_1: string;
  street_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};
```

### MemberProfile

Extended profile information (1:1 with Member).

```typescript
interface MemberProfile {
  id: UUID;
  member_id: UUID; // → Member (unique)

  // Medical information
  allergies?: string[]; // List of allergies
  medical_conditions?: string[]; // List of conditions
  current_medications?: Medication[];

  // Provider preferences
  preferred_pharmacy_name?: string;
  preferred_pharmacy_address?: string;
  primary_care_provider?: string;

  // Profile photo
  avatar_url?: string;

  // Privacy settings
  share_profile_with_dependents: boolean;

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

type Medication = {
  name: string;
  dosage?: string;
  frequency?: string;
};

// Indexes
indexes:
  - member_id (unique)
```

### Dependent

Family members covered under a primary member's plan.

```typescript
interface Dependent {
  id: UUID;
  primary_member_id: UUID; // → Member

  // Identity
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  gender?: 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say';

  // Relationship
  relationship: 'spouse' | 'partner' | 'child' | 'parent' | 'other';

  // Account (optional - adult dependents may have login)
  email?: string; // If dependent has own login
  phone?: string;
  has_account_access: boolean; // Can dependent log in?
  account_access_level: 'view_only' | 'limited' | 'full';

  // Medical info
  allergies?: string[];
  medical_conditions?: string[];
  current_medications?: Medication[];

  // Coverage
  plan_id: UUID; // → Plan (may differ from primary member)
  member_id_number?: string; // Insurance member ID

  // Status
  status: 'active' | 'inactive';
  coverage_start_date: Date;
  coverage_end_date?: Date;

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - primary_member_id
  - email (unique, where not null)
  - status
  - [primary_member_id, status]
```

### Session

Active user sessions for authentication.

```typescript
interface Session {
  id: UUID;
  member_id?: UUID; // → Member (null if admin session)
  admin_user_id?: UUID; // → AdminUser

  // Session data
  token_hash: string; // Hashed session token
  refresh_token_hash?: string;

  // Device info
  device_id?: string; // Device fingerprint
  device_name?: string; // e.g., "iPhone 13 Pro"
  device_type: 'mobile' | 'tablet' | 'desktop';
  user_agent: string;
  ip_address: string;

  // Geolocation
  country?: string;
  city?: string;

  // Session lifecycle
  created_at: DateTime;
  last_active_at: DateTime;
  expires_at: DateTime;

  // Revocation
  revoked: boolean;
  revoked_at?: DateTime;
  revoked_reason?: string;
}

// Indexes
indexes:
  - token_hash (unique)
  - member_id
  - admin_user_id
  - expires_at
  - [member_id, revoked]
```

### TrustedDevice

Devices trusted for passwordless login.

```typescript
interface TrustedDevice {
  id: UUID;
  member_id: UUID; // → Member

  // Device identification
  device_id: string; // Fingerprint
  device_name: string;
  device_type: 'mobile' | 'tablet' | 'desktop';

  // Trust settings
  trusted_at: DateTime;
  expires_at: DateTime; // e.g., 30 days

  // Last usage
  last_used_at: DateTime;

  // Revocation
  revoked: boolean;
  revoked_at?: DateTime;

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - member_id
  - device_id
  - [member_id, revoked]
  - expires_at
```

### MemberSettings

Member preferences and settings (1:1 with Member).

```typescript
interface MemberSettings {
  id: UUID;
  member_id: UUID; // → Member (unique)

  // Notification preferences
  notifications: {
    email: {
      enabled: boolean;
      case_updates: boolean;
      appointment_reminders: boolean;
      document_uploads: boolean;
      security_alerts: boolean; // Cannot be disabled
      marketing: boolean;
      tips: boolean;
    };
    sms: {
      enabled: boolean;
      case_updates: boolean;
      appointment_reminders: boolean;
      security_alerts: boolean;
    };
    push: {
      enabled: boolean;
      case_updates: boolean;
      appointment_reminders: boolean;
      document_uploads: boolean;
    };
    in_app: {
      enabled: boolean;
      show_badges: boolean;
      play_sound: boolean;
    };
  };

  // Accessibility preferences
  accessibility: {
    font_size: 'small' | 'medium' | 'large' | 'extra-large';
    high_contrast: boolean;
    reduce_motion: boolean;
    theme: 'light' | 'dark' | 'system';
  };

  // Privacy preferences
  privacy: {
    allow_analytics: boolean;
    allow_marketing: boolean;
    share_data_with_employer: boolean; // Aggregate only
  };

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - member_id (unique)
```

---

## Communication Entities

### Case

Support conversation thread between member and admin.

```typescript
interface Case {
  id: UUID;

  // Participants
  member_id: UUID; // → Member
  dependent_id?: UUID; // → Dependent (if case is about a dependent)

  // Assignment
  assigned_to?: UUID; // → AdminUser
  assigned_team?: string; // Team name or ID

  // Case details
  subject: string; // Member-editable title
  issue_type: 'claims' | 'benefits' | 'provider_search' | 'coverage' | 'billing' | 'technical' | 'other';
  priority: 'low' | 'normal' | 'high' | 'urgent'; // Auto-set based on tier

  // Status
  status: 'open' | 'in_progress' | 'waiting_on_member' | 'waiting_on_admin' | 'resolved' | 'closed';
  resolution: string; // Admin-entered resolution summary

  // Service context (if related to specific service)
  service_id?: UUID; // → Service

  // SLA tracking
  created_at: DateTime;
  first_response_at?: DateTime;
  resolved_at?: DateTime;
  closed_at?: DateTime;

  // Engagement metrics
  message_count: number;
  member_message_count: number;
  admin_message_count: number;

  // Member satisfaction
  satisfaction_rating?: number; // 1-5 stars
  satisfaction_feedback?: string;

  // Metadata
  updated_at: DateTime;
  last_message_at: DateTime;
  last_message_by: 'member' | 'admin';
}

// Indexes
indexes:
  - member_id
  - assigned_to
  - status
  - priority
  - issue_type
  - created_at (descending)
  - [member_id, status]
  - [assigned_to, status]
  - [status, priority]
```

### Message

Individual message within a Case.

```typescript
interface Message {
  id: UUID;
  case_id: UUID; // → Case

  // Sender
  sender_type: 'member' | 'admin' | 'system';
  sender_id?: UUID; // Member or AdminUser ID

  // Content
  content: string; // Markdown-supported text
  content_type: 'text' | 'rich_text';

  // Attachments
  attachments?: Attachment[];

  // System message metadata (if sender_type = 'system')
  system_event?: 'case_opened' | 'case_assigned' | 'case_resolved' | 'status_changed';

  // Read receipts
  read_by_member: boolean;
  read_by_member_at?: DateTime;
  read_by_admin: boolean;
  read_by_admin_at?: DateTime;

  // Internal note (admin only)
  is_internal_note: boolean; // Not visible to member

  // Metadata
  created_at: DateTime;
  updated_at?: DateTime; // If edited
  deleted_at?: DateTime; // Soft delete
}

type Attachment = {
  id: UUID;
  file_name: string;
  file_size: number; // bytes
  file_type: string; // MIME type
  file_url: string; // S3/CDN URL
  thumbnail_url?: string; // For images
};

// Indexes
indexes:
  - case_id
  - sender_id
  - created_at
  - [case_id, created_at]
  - [case_id, is_internal_note] (to filter internal notes)
```

### Notification

In-app, push, email, and SMS notifications.

```typescript
interface Notification {
  id: UUID;

  // Recipient
  member_id: UUID; // → Member

  // Notification content
  type: 'case_update' | 'appointment_reminder' | 'document_upload' | 'security_alert' | 'tip' | 'announcement' | 'action_required';
  title: string;
  body: string;

  // CTA
  cta_text?: string; // e.g., "View Case"
  cta_url?: string; // Deep link

  // Delivery channels
  channels: {
    in_app: boolean;
    push: boolean;
    email: boolean;
    sms: boolean;
  };

  // Delivery status
  sent_at?: DateTime;
  delivered_in_app: boolean;
  delivered_push: boolean;
  delivered_email: boolean;
  delivered_sms: boolean;

  // Engagement
  read: boolean;
  read_at?: DateTime;
  clicked: boolean;
  clicked_at?: DateTime;

  // Related entities
  related_entity_type?: 'case' | 'appointment' | 'document';
  related_entity_id?: UUID;

  // Admin-sent notifications
  sent_by_admin?: UUID; // → AdminUser
  notification_campaign_id?: UUID; // → NotificationCampaign (for bulk sends)

  // Metadata
  created_at: DateTime;
  expires_at?: DateTime; // Auto-archive old notifications
}

// Indexes
indexes:
  - member_id
  - type
  - read
  - created_at (descending)
  - [member_id, read, created_at]
  - notification_campaign_id
```

### NotificationCampaign

Bulk notification sends (admin-initiated).

```typescript
interface NotificationCampaign {
  id: UUID;

  // Campaign details
  title: string; // Internal name
  notification_type: 'announcement' | 'action_required' | 'reminder' | 'tip';

  // Content
  notification_title: string;
  notification_body: string;
  cta_text?: string;
  cta_url?: string;

  // Audience
  target_audience: JSON; // Segmentation rules (employer_id, plan_id, tier_id, etc.)
  estimated_recipients: number;
  actual_recipients: number; // After send

  // Channels
  channels: {
    in_app: boolean;
    push: boolean;
    email: boolean;
    sms: boolean;
  };

  // Scheduling
  scheduled_at?: DateTime;
  sent_at?: DateTime;

  // Status
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';

  // Analytics
  delivered_count: number;
  read_count: number;
  clicked_count: number;
  bounced_email_count: number;
  bounced_sms_count: number;
  unsubscribed_count: number;

  // Metadata
  created_by: UUID; // → AdminUser
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - status
  - created_by
  - scheduled_at
  - sent_at
```

---

## Document Entities

### DocumentCategory

Categorization for documents.

```typescript
interface DocumentCategory {
  id: UUID;

  // Category details
  name: string; // e.g., "Insurance Cards & IDs"
  slug: string; // e.g., "insurance-cards"
  description?: string;
  icon?: string; // Icon identifier

  // Hierarchy
  parent_category_id?: UUID; // → DocumentCategory (for nested categories)

  // Ordering
  display_order: number;

  // Auto-pinning rules
  auto_pin: boolean; // Auto-pin documents in this category

  // Visibility
  visible_to_members: boolean;

  // Status
  status: 'active' | 'inactive';

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - slug (unique)
  - parent_category_id
  - display_order
```

### Document

Member documents (EOBs, policies, ID cards, receipts, etc.).

```typescript
interface Document {
  id: UUID;

  // Ownership
  member_id?: UUID; // → Member (null if employer/plan-level doc)
  dependent_id?: UUID; // → Dependent
  employer_id?: UUID; // → Employer (for employer-wide docs)
  plan_id?: UUID; // → Plan (for plan-level docs)

  // Document details
  name: string; // Human-readable name
  category_id: UUID; // → DocumentCategory
  document_type: 'eob' | 'policy' | 'id_card' | 'claim' | 'letter' | 'receipt' | 'enrollment' | 'other';

  // File storage
  file_url: string; // S3/CDN URL
  file_name: string;
  file_size: number; // bytes
  file_type: string; // MIME type (e.g., "application/pdf")
  thumbnail_url?: string; // Preview thumbnail

  // OCR & metadata
  ocr_text?: string; // Extracted text for search
  extracted_metadata?: JSON; // AI-extracted fields (claim amount, dates, etc.)

  // Versioning
  version: number; // Current version
  is_latest_version: boolean;

  // Visibility
  pinned: boolean;
  pinned_at?: DateTime;

  // Status
  status: 'active' | 'archived';

  // Dates
  effective_date?: Date;
  expiration_date?: Date;

  // Upload tracking
  uploaded_by_type: 'member' | 'admin' | 'system';
  uploaded_by_id?: UUID;

  // Engagement
  view_count: number;
  last_viewed_at?: DateTime;
  download_count: number;

  // Notifications
  member_notified: boolean; // Was member notified of this doc?

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
  deleted_at?: DateTime; // Soft delete
}

// Indexes
indexes:
  - member_id
  - category_id
  - document_type
  - status
  - pinned
  - [member_id, status, category_id]
  - [member_id, pinned]
  - effective_date
  - expiration_date
  - ocr_text (full-text search index)
```

### DocumentVersion

Document version history.

```typescript
interface DocumentVersion {
  id: UUID;
  document_id: UUID; // → Document

  // Version details
  version: number;

  // File storage
  file_url: string;
  file_name: string;
  file_size: number;

  // Change tracking
  change_summary?: string;
  uploaded_by_type: 'member' | 'admin' | 'system';
  uploaded_by_id?: UUID;

  // Metadata
  created_at: DateTime;
}

// Indexes
indexes:
  - document_id
  - version
  - [document_id, version]
```

### ShareLink

Temporary shareable links for documents/wallet.

```typescript
interface ShareLink {
  id: UUID;
  token: string; // Short random string (e.g., 12 chars)

  // Linked resource
  resource_type: 'document' | 'wallet';
  resource_id: UUID; // Document or Wallet ID

  // Access control
  password_hash?: string; // Optional password protection
  max_views?: number; // Limit number of views
  current_views: number;

  // Expiration
  expires_at: DateTime;

  // Creator
  created_by_member_id: UUID; // → Member

  // Revocation
  revoked: boolean;
  revoked_at?: DateTime;

  // Metadata
  created_at: DateTime;
}

// Indexes
indexes:
  - token (unique)
  - resource_id
  - expires_at
  - [token, revoked]
```

---

## Scheduling Entities

### Consultant

TouchCare consultants who provide scheduled consultations.

```typescript
interface Consultant {
  id: UUID;

  // Identity
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;

  // Credentials
  title: string; // e.g., "Licensed Benefits Consultant"
  credentials?: string[]; // e.g., ["LCSW", "MBA"]
  bio?: string;
  avatar_url?: string;

  // Specialties
  specialties: string[]; // e.g., ["claims", "benefits", "mental_health"]

  // Availability
  calendar_id?: string; // External calendar integration ID
  timezone: string;

  // Status
  status: 'active' | 'inactive' | 'on_leave';

  // Performance
  total_consultations: number;
  average_rating?: number;

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - email (unique)
  - status
```

### ConsultationType

Types of consultations offered.

```typescript
interface ConsultationType {
  id: UUID;

  // Type details
  name: string; // e.g., "Benefits Review", "Claims Assistance"
  slug: string;
  description: string;

  // Scheduling
  duration_minutes: number; // e.g., 30, 60
  format: 'phone' | 'video' | 'both';

  // Instructions
  preparation_instructions?: string; // What members should have ready

  // Availability
  booking_window_days: number; // How far in advance can member book
  cancellation_window_hours: number; // Minimum notice for cancellation
  buffer_minutes: number; // Buffer between appointments

  // Status
  status: 'active' | 'inactive';

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - slug (unique)
  - status
```

### Appointment

Scheduled consultation between member and consultant.

```typescript
interface Appointment {
  id: UUID;

  // Participants
  member_id: UUID; // → Member
  dependent_id?: UUID; // → Dependent (if appointment is for dependent)
  consultant_id: UUID; // → Consultant

  // Appointment details
  consultation_type_id: UUID; // → ConsultationType
  format: 'phone' | 'video';

  // Scheduling
  scheduled_at: DateTime;
  duration_minutes: number;
  timezone: string; // Member's timezone

  // Contact info
  phone_number?: string; // For phone consultations
  video_meeting_url?: string; // For video (Zoom, Meet, etc.)
  video_meeting_id?: string;

  // Status
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  cancellation_reason?: string;
  cancelled_by: 'member' | 'consultant' | 'system';
  cancelled_at?: DateTime;

  // Completion
  completed_at?: DateTime;
  consultant_notes?: string; // Private notes
  follow_up_required: boolean;
  follow_up_tasks?: string[];

  // Reminders sent
  reminder_sent_24h: boolean;
  reminder_sent_1h: boolean;

  // External calendar sync
  external_event_id?: string; // Google Calendar, Outlook event ID

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - member_id
  - consultant_id
  - status
  - scheduled_at
  - [member_id, scheduled_at]
  - [consultant_id, scheduled_at]
  - [status, scheduled_at]
```

---

## Wallet Entities

### Wallet

Member's digital health wallet (1:1 with Member).

```typescript
interface Wallet {
  id: UUID;
  member_id: UUID; // → Member (unique)

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - member_id (unique)
```

### Card

Individual cards within a wallet (ID cards, personal info, etc.).

```typescript
interface Card {
  id: UUID;
  wallet_id: UUID; // → Wallet
  owner_type: 'member' | 'dependent';
  owner_id: UUID; // Member or Dependent ID

  // Card type
  card_type: 'insurance_medical' | 'insurance_dental' | 'insurance_vision' | 'personal_info' | 'emergency_contact' | 'allergies' | 'medications';

  // Card content (JSON varies by type)
  front_data: JSON; // Front of card (member ID, name, etc.)
  back_data?: JSON; // Back of card (contact info, etc.)

  // Visual
  front_image_url?: string; // Pre-generated image of card front
  back_image_url?: string;
  qr_code_data?: string; // QR code content
  qr_code_url?: string;

  // Ordering
  display_order: number;

  // Status
  status: 'active' | 'inactive' | 'expired';
  effective_date?: Date;
  expiration_date?: Date;

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Insurance card front_data example:
type InsuranceCardFront = {
  member_name: string;
  member_id: string;
  group_number: string;
  plan_name: string;
  carrier_name: string;
  carrier_logo_url?: string;
  effective_date: string;
  rx_bin?: string;
  rx_pcn?: string;
  rx_group?: string;
};

// Insurance card back_data example:
type InsuranceCardBack = {
  customer_service_phone: string;
  claims_address: string;
  pharmacy_phone?: string;
  authorization_phone?: string;
  website?: string;
};

// Indexes
indexes:
  - wallet_id
  - owner_id
  - card_type
  - status
  - [wallet_id, display_order]
```

---

## Service Entities

### Service

Partner or internal services available to members.

```typescript
interface Service {
  id: UUID;

  // Service details
  name: string;
  slug: string;
  description: string;
  service_type: 'partner' | 'internal';

  // Category
  category: 'clinical' | 'mental_health' | 'wellness' | 'administrative' | 'other';

  // Branding
  logo_url?: string; // For partner services

  // Access methods
  access_methods: {
    call_directly: boolean;
    create_case: boolean;
  };

  // Contact details (if call_directly enabled)
  contact_phone?: string;
  contact_hours?: string;
  contact_timezone?: string;
  contact_email?: string;

  // Instructions
  preparation_instructions?: string; // "What to have ready"

  // Case routing (if create_case enabled)
  case_routing_team?: string; // Which team receives cases
  case_auto_response?: string; // Auto-reply template
  case_expected_response_time?: string; // e.g., "within 24 hours"

  // Eligibility
  // (See ServiceEligibility entity for complex rules)

  // Ordering
  display_order: number;

  // Status
  status: 'active' | 'inactive';

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - slug (unique)
  - service_type
  - category
  - status
  - display_order
```

### ServiceEligibility

Defines which members can access which services.

```typescript
interface ServiceEligibility {
  id: UUID;
  service_id: UUID; // → Service

  // Eligibility rules (OR logic across rules)
  employer_id?: UUID; // → Employer (if service is employer-specific)
  plan_id?: UUID; // → Plan
  tier_id?: UUID; // → MemberTier

  // Custom rules (JSON)
  custom_rules?: JSON; // e.g., { "employee_type": "full-time" }

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - service_id
  - employer_id
  - plan_id
  - tier_id
  - [service_id, employer_id]
  - [service_id, plan_id]
```

---

## Configuration Entities

### BrandingConfig

White-label branding configuration per employer.

```typescript
interface BrandingConfig {
  id: UUID;
  employer_id: UUID; // → Employer (unique)

  // Logos
  logo_light_url?: string; // For light backgrounds
  logo_dark_url?: string; // For dark backgrounds
  logo_square_url?: string; // Square icon/avatar
  favicon_url?: string;

  // Colors
  primary_color?: string; // Hex color
  secondary_color?: string;
  accent_color?: string;

  // Typography
  font_family_heading?: string; // Google Font name or custom
  font_family_body?: string;

  // Theme tokens (full override)
  theme_tokens?: JSON; // Complete design token override

  // Domain
  custom_domain?: string; // e.g., "benefits.acme.com"

  // Preview
  preview_mode: boolean; // Show preview vs live

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
  published_at?: DateTime; // When changes were last published
}

// Indexes
indexes:
  - employer_id (unique)
```

### TaskBarTask

Global task definitions for task bar.

```typescript
interface TaskBarTask {
  id: UUID;

  // Task details
  title: string; // e.g., "Add dependent information"
  active_title: string; // e.g., "Adding dependent information"
  description?: string;
  cta_text: string; // e.g., "Add Dependents"
  cta_url: string; // Internal route, e.g., "/account/dependents"

  // Configuration
  required: boolean; // Required vs optional

  // Auto-dismiss rules
  auto_dismiss_on: JSON; // Conditions for auto-completion
  // Example: { "dependent_count": { ">=": 1 } }

  // Ordering
  display_order: number;

  // Visibility rules
  visible_for_employers?: UUID[]; // Employer IDs (empty = all)
  visible_for_plans?: UUID[]; // Plan IDs

  // Status
  status: 'active' | 'inactive';

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - status
  - display_order
```

### MemberTaskStatus

Per-member task completion status.

```typescript
interface MemberTaskStatus {
  id: UUID;
  member_id: UUID; // → Member
  task_id: UUID; // → TaskBarTask

  // Status
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  completed_at?: DateTime;
  dismissed_at?: DateTime;

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Indexes
indexes:
  - member_id
  - task_id
  - status
  - [member_id, status]
  - [member_id, task_id] (unique combination)
```

---

## Admin Entities

### AdminUser

Admin users who manage the platform.

```typescript
interface AdminUser {
  id: UUID;

  // Identity
  email: string; // Login identifier
  email_verified: boolean;
  first_name: string;
  last_name: string;
  avatar_url?: string;

  // Role
  role_id: UUID; // → Role

  // Scoping (for Employer Admins)
  scoped_to_employer_id?: UUID; // → Employer (null = global access)

  // Authentication
  password_hash?: string; // If using password auth
  two_factor_enabled: boolean;
  two_factor_secret?: string;

  // SSO
  sso_provider?: 'google' | 'microsoft';
  sso_provider_id?: string;

  // Status
  status: 'active' | 'inactive' | 'suspended';
  last_login_at?: DateTime;

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
  created_by?: UUID; // → AdminUser
}

// Indexes
indexes:
  - email (unique)
  - role_id
  - scoped_to_employer_id
  - status
```

### Role

Admin role definitions.

```typescript
interface Role {
  id: UUID;

  // Role details
  name: string; // "Super Admin", "Support Agent", etc.
  slug: string; // "super_admin", "support_agent"
  description?: string;

  // Permissions (array of permission strings)
  permissions: string[]; // e.g., ["member.view", "member.edit", "case.view", "case.reply"]

  // Hierarchy
  level: number; // Higher = more privileges (1-10)

  // Status
  status: 'active' | 'inactive';
  is_system_role: boolean; // Cannot be deleted

  // Metadata
  created_at: DateTime;
  updated_at: DateTime;
}

// Permission string format: "resource.action[.scope]"
// Examples:
//   - "member.view"
//   - "member.edit"
//   - "member.edit.scoped" (can only edit within scoped employer)
//   - "case.view.assigned" (can only view assigned cases)
//   - "config.branding.edit"

// Indexes
indexes:
  - slug (unique)
  - status
```

---

## Analytics & Audit Entities

### AuditLog

Audit trail for sensitive actions.

```typescript
interface AuditLog {
  id: UUID;

  // Actor
  actor_type: 'admin' | 'member' | 'system';
  actor_id?: UUID; // AdminUser or Member ID

  // Action
  action: string; // e.g., "member.profile.edit", "case.status.change", "document.delete"
  resource_type: string; // e.g., "member", "case", "document"
  resource_id: UUID;

  // Changes
  changes?: JSON; // Before/after snapshot

  // Context
  ip_address?: string;
  user_agent?: string;

  // Metadata
  created_at: DateTime;
}

// Indexes
indexes:
  - actor_id
  - resource_type
  - resource_id
  - action
  - created_at (descending)
  - [resource_type, resource_id, created_at]
```

### AnalyticsEvent

Event tracking for analytics.

```typescript
interface AnalyticsEvent {
  id: UUID;

  // Event details
  event_name: string; // e.g., "page_view", "case_created", "document_downloaded"
  event_category: string; // e.g., "engagement", "support", "documents"

  // User
  member_id?: UUID; // → Member
  session_id?: UUID; // → Session

  // Event properties
  properties: JSON; // Custom event properties

  // Context
  page_url?: string;
  referrer?: string;
  device_type: 'mobile' | 'tablet' | 'desktop';

  // Metadata
  created_at: DateTime;
}

// Indexes
indexes:
  - event_name
  - event_category
  - member_id
  - created_at
  - [event_name, created_at]
```

---

## Multi-Tenancy Strategy

### Approach

TouchCare uses a **shared database, multi-tenant architecture** with data isolation at the application layer.

### Tenant Isolation

1. **Employer-level isolation**:
   - All member-related data includes `employer_id` foreign key
   - Queries always filtered by employer context
   - Row-Level Security (RLS) policies in PostgreSQL enforce isolation

2. **Admin access scoping**:
   - `AdminUser.scoped_to_employer_id` limits access to specific employer
   - API middleware injects employer filter based on admin scope

3. **White-label support**:
   - `BrandingConfig` linked to `Employer`
   - Frontend loads branding based on domain or employer_id
   - CSS variables updated dynamically

### Example RLS Policy (PostgreSQL)

```sql
-- Members table: admins can only see members from their scoped employer
CREATE POLICY admin_employer_scope ON members
  FOR SELECT TO admin_role
  USING (
    employer_id = current_setting('app.current_employer_id')::uuid
    OR current_setting('app.admin_is_super')::boolean = true
  );
```

### Tenant Context Injection

**Backend (Node.js example):**
```typescript
// Middleware to set tenant context
app.use((req, res, next) => {
  const admin = req.user as AdminUser;
  if (admin.scoped_to_employer_id) {
    req.employerId = admin.scoped_to_employer_id;
  } else {
    // Super admin - no employer filter unless explicitly requested
    req.employerId = req.query.employer_id || null;
  }
  next();
});
```

**Frontend:**
```typescript
// Admin client requests always include employer context
const fetchMembers = async (employerId?: string) => {
  const params = employerId ? { employer_id: employerId } : {};
  return api.get('/admin/members', { params });
};
```

---

## Indexing Strategy

### Performance Indexes

All tables should have:
- **Primary key index** (auto-created)
- **Foreign key indexes** (for JOIN performance)
- **Status/filter indexes** (commonly filtered columns)
- **Composite indexes** for common query patterns

### Example Composite Indexes

```sql
-- Members: frequently queried by employer + status
CREATE INDEX idx_members_employer_status ON members(employer_id, status);

-- Cases: frequently queried by member + status
CREATE INDEX idx_cases_member_status ON cases(member_id, status);

-- Cases: admin inbox query (assigned_to + status)
CREATE INDEX idx_cases_assigned_status ON cases(assigned_to, status);

-- Documents: member document library (member + status + category)
CREATE INDEX idx_documents_member_status_category ON documents(member_id, status, category_id);

-- Messages: case thread (case_id + created_at for chronological order)
CREATE INDEX idx_messages_case_created ON messages(case_id, created_at DESC);

-- Notifications: member feed (member_id + read + created_at)
CREATE INDEX idx_notifications_member_read_created ON notifications(member_id, read, created_at DESC);

-- Appointments: member upcoming (member_id + scheduled_at)
CREATE INDEX idx_appointments_member_scheduled ON appointments(member_id, scheduled_at);
```

### Full-Text Search Indexes

```sql
-- Documents: OCR text search
CREATE INDEX idx_documents_ocr_text_fts ON documents USING GIN(to_tsvector('english', ocr_text));

-- Cases: subject/resolution search
CREATE INDEX idx_cases_subject_fts ON cases USING GIN(to_tsvector('english', subject || ' ' || COALESCE(resolution, '')));

-- Messages: content search
CREATE INDEX idx_messages_content_fts ON messages USING GIN(to_tsvector('english', content));
```

---

## Data Retention & Privacy

### HIPAA Compliance

- **Encryption at rest**: All PII and PHI encrypted using AES-256
- **Encryption in transit**: TLS 1.3 for all connections
- **Access logging**: All PHI access logged to `AuditLog`
- **Data minimization**: Only collect necessary fields
- **Right to deletion**: Member can request account deletion

### Soft Deletes

Most entities use soft delete pattern:
- `deleted_at` column (nullable DateTime)
- Queries filter `WHERE deleted_at IS NULL`
- Permanent deletion after retention period (e.g., 90 days)

### Data Retention Policies

| Entity | Retention Period | Notes |
|--------|------------------|-------|
| Member | 7 years after account closure | HIPAA requirement |
| Case & Message | 7 years | HIPAA requirement |
| Document | 7 years | HIPAA requirement |
| Notification | 1 year | Auto-archive old notifications |
| Session | 90 days after expiration | Security audit trail |
| AuditLog | 7 years | Compliance requirement |
| AnalyticsEvent | 2 years | Business analytics |

### Anonymization

For deleted accounts:
- Personal identifiers replaced with anonymized IDs
- Names replaced with "Deleted User"
- Email/phone removed
- Documents and cases retained for compliance (anonymized)

---

This completes the data models specification. All entities are defined with clear relationships, constraints, and indexing strategies for optimal performance and compliance.
