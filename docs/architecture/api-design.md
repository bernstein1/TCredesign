# API Design

Complete REST and WebSocket API specifications with request/response schemas for the TouchCare unified platform.

---

## Table of Contents

1. [API Architecture](#api-architecture)
2. [Authentication & Authorization](#authentication--authorization)
3. [Common Patterns](#common-patterns)
4. [Member Portal APIs](#member-portal-apis)
5. [Admin Portal APIs](#admin-portal-apis)
6. [WebSocket APIs](#websocket-apis)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)
9. [API Versioning](#api-versioning)

---

## API Architecture

### Base URLs

```
Production Member API:     https://api.touchcare.com/v1
Production Admin API:      https://api.touchcare.com/admin/v1
WebSocket (Real-time):     wss://ws.touchcare.com
```

### Technology Stack

- **Protocol**: REST (JSON) + GraphQL (optional for complex queries) + WebSocket (real-time)
- **Authentication**: JWT (JSON Web Tokens)
- **Content-Type**: `application/json`
- **Character Encoding**: UTF-8

### REST API Conventions

- **HTTP Methods**:
  - `GET`: Retrieve resources
  - `POST`: Create resources
  - `PATCH`: Partial update
  - `PUT`: Full update (rarely used)
  - `DELETE`: Remove resources

- **Status Codes**:
  - `200 OK`: Successful GET/PATCH/PUT
  - `201 Created`: Successful POST
  - `204 No Content`: Successful DELETE
  - `400 Bad Request`: Invalid request data
  - `401 Unauthorized`: Missing or invalid auth token
  - `403 Forbidden`: Insufficient permissions
  - `404 Not Found`: Resource not found
  - `409 Conflict`: Resource conflict (e.g., duplicate email)
  - `422 Unprocessable Entity`: Validation errors
  - `429 Too Many Requests`: Rate limit exceeded
  - `500 Internal Server Error`: Server error
  - `503 Service Unavailable`: Maintenance mode

- **Response Envelope**:
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": {
      "timestamp": "2025-11-13T10:30:00Z",
      "request_id": "req_abc123"
    }
  }
  ```

- **Error Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input data",
      "details": [
        {
          "field": "email",
          "message": "Email is required"
        }
      ]
    },
    "meta": {
      "timestamp": "2025-11-13T10:30:00Z",
      "request_id": "req_abc123"
    }
  }
  ```

- **Pagination**:
  ```json
  {
    "success": true,
    "data": [ ... ],
    "meta": {
      "pagination": {
        "page": 1,
        "per_page": 20,
        "total": 150,
        "total_pages": 8
      }
    }
  }
  ```

  Query parameters: `?page=1&per_page=20`

- **Filtering & Sorting**:
  - Filter: `?status=open&priority=high`
  - Sort: `?sort_by=created_at&sort_order=desc`
  - Search: `?q=search+term`

---

## Authentication & Authorization

### Member Authentication

#### 1. Initiate Login (Passwordless)

**Endpoint**: `POST /auth/login/initiate`

**Request**:
```json
{
  "identifier": "member@example.com", // email or phone
  "identifier_type": "email", // "email" or "phone"
  "device_info": {
    "device_id": "device_fingerprint_hash",
    "device_name": "iPhone 13 Pro",
    "device_type": "mobile",
    "user_agent": "Mozilla/5.0..."
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "verification_id": "ver_abc123",
    "delivery_method": "email", // or "sms"
    "masked_destination": "m****@example.com",
    "expires_in": 600 // seconds
  }
}
```

#### 2. Verify Code

**Endpoint**: `POST /auth/login/verify`

**Request**:
```json
{
  "verification_id": "ver_abc123",
  "code": "123456"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 3600, // seconds
    "member": {
      "id": "mem_abc123",
      "email": "member@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "onboarding_status": "complete",
      "tier": {
        "id": "tier_standard",
        "name": "Standard",
        "slug": "standard"
      }
    }
  }
}
```

#### 3. SSO Login (Google/Microsoft)

**Endpoint**: `POST /auth/sso/initiate`

**Request**:
```json
{
  "provider": "google", // "google" or "microsoft"
  "redirect_uri": "https://app.touchcare.com/auth/callback"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "authorization_url": "https://accounts.google.com/o/oauth2/auth?..."
  }
}
```

**Callback Endpoint**: `POST /auth/sso/callback`

**Request**:
```json
{
  "provider": "google",
  "code": "auth_code_from_provider",
  "state": "csrf_token"
}
```

**Response**: Same as verify code response (token + member info).

#### 4. Refresh Token

**Endpoint**: `POST /auth/refresh`

**Request**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

#### 5. Logout

**Endpoint**: `POST /auth/logout`

**Headers**: `Authorization: Bearer {token}`

**Response** (204 No Content)

### Admin Authentication

Admin authentication follows similar patterns but uses different endpoints:

- `POST /admin/auth/login` (email + password or SSO)
- `POST /admin/auth/2fa/verify` (if 2FA enabled)
- `POST /admin/auth/refresh`
- `POST /admin/auth/logout`

### Authorization Headers

All authenticated requests must include:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### JWT Payload

**Member Token**:
```json
{
  "sub": "mem_abc123", // member_id
  "type": "member",
  "employer_id": "emp_xyz789",
  "tier_id": "tier_standard",
  "iat": 1699900000,
  "exp": 1699903600
}
```

**Admin Token**:
```json
{
  "sub": "admin_abc123", // admin_user_id
  "type": "admin",
  "role_id": "role_support_agent",
  "scoped_employer_id": null, // or employer_id if scoped
  "permissions": ["member.view", "case.reply", ...],
  "iat": 1699900000,
  "exp": 1699903600
}
```

---

## Common Patterns

### Standardized Timestamps

All timestamps in ISO 8601 format with UTC timezone:
```json
"created_at": "2025-11-13T10:30:00.000Z"
```

### Resource IDs

All resource IDs prefixed with resource type:
```
mem_abc123   → Member
dep_xyz789   → Dependent
case_123456  → Case
doc_abcdef   → Document
appt_111222  → Appointment
```

### Soft Deletes

Deleted resources return `404` for standard requests. Include `?include_deleted=true` to retrieve soft-deleted items (admin only).

### Eager Loading

Use `?include=` to eagerly load related resources:
```
GET /cases/case_123?include=messages,member
```

### Field Selection

Use `?fields=` to limit returned fields:
```
GET /members/mem_abc123?fields=id,first_name,last_name,email
```

---

## Member Portal APIs

### Onboarding & Registration

#### 1. Start Registration (Phase 1)

**Endpoint**: `POST /onboarding/register`

**Request**:
```json
{
  "email": "newmember@example.com",
  "phone": "+14155551234",
  "first_name": "Jane",
  "last_name": "Doe",
  "employer_code": "ACME2024", // From invite link or manual entry
  "device_info": {
    "device_id": "device_fingerprint",
    "device_type": "mobile"
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "member_id": "mem_abc123",
    "verification_id": "ver_xyz789",
    "onboarding_status": "incomplete",
    "next_step": "verify_email"
  }
}
```

#### 2. Complete Essential Setup (Phase 2)

**Endpoint**: `PATCH /onboarding/member/{member_id}/essential`

**Headers**: `Authorization: Bearer {token}`

**Request**:
```json
{
  "date_of_birth": "1990-05-15",
  "terms_accepted": true,
  "terms_version": "2024-01-01",
  "privacy_policy_accepted": true,
  "privacy_policy_version": "2024-01-01"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "member_id": "mem_abc123",
    "onboarding_status": "essential_complete",
    "can_access_dashboard": true
  }
}
```

#### 3. Update Deferred Fields (Phase 3)

**Endpoint**: `PATCH /onboarding/member/{member_id}/deferred`

**Request**:
```json
{
  "address": {
    "street_line_1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94105",
    "country": "US"
  },
  "emergency_contact_name": "John Doe",
  "emergency_contact_phone": "+14155559999",
  "emergency_contact_relationship": "spouse"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "member_id": "mem_abc123",
    "onboarding_status": "complete",
    "completed_at": "2025-11-13T10:45:00Z"
  }
}
```

#### 4. Employer Lookup/Verification

**Endpoint**: `GET /onboarding/employers/lookup?q={query}`

**Request Query**: `?q=Acme`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "employer_id": "emp_acme",
      "name": "Acme Corporation",
      "invite_code": "ACME2024"
    }
  ]
}
```

### Dashboard

#### Get Dashboard Summary

**Endpoint**: `GET /dashboard`

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "member": {
      "id": "mem_abc123",
      "first_name": "Jane",
      "preferred_name": null,
      "tier": {
        "name": "TouchCare Blue",
        "badge_visible": true
      }
    },
    "task_bar": {
      "enabled": true,
      "tasks": [
        {
          "task_id": "task_001",
          "title": "Add dependent information",
          "active_title": "Adding dependent information",
          "description": "Add your family members to your account",
          "cta_text": "Add Dependents",
          "cta_url": "/account/dependents",
          "required": true,
          "status": "pending"
        },
        {
          "task_id": "task_002",
          "title": "Upload insurance card",
          "active_title": "Uploading insurance card",
          "cta_text": "Upload Card",
          "cta_url": "/documents/upload",
          "required": true,
          "status": "completed",
          "completed_at": "2025-11-12T14:20:00Z"
        }
      ],
      "total_tasks": 5,
      "completed_tasks": 3,
      "completion_percentage": 60
    },
    "active_cases": {
      "count": 2,
      "cases": [
        {
          "case_id": "case_123",
          "subject": "Question about dental coverage",
          "status": "open",
          "last_message_preview": "Thank you for reaching out...",
          "last_message_at": "2025-11-13T09:15:00Z",
          "unread_count": 1,
          "agent": {
            "name": "Sarah Johnson",
            "avatar_url": "https://..."
          }
        }
      ],
      "has_more": false
    },
    "notifications": {
      "unread_count": 4,
      "recent": [
        {
          "notification_id": "notif_001",
          "type": "case_update",
          "title": "New message in your case",
          "body": "Sarah replied to your dental coverage question",
          "cta_text": "View Case",
          "cta_url": "/cases/case_123",
          "read": false,
          "created_at": "2025-11-13T09:15:00Z"
        }
      ]
    },
    "upcoming_appointments": [
      {
        "appointment_id": "appt_456",
        "consultation_type": "Benefits Review",
        "scheduled_at": "2025-11-15T14:00:00Z",
        "duration_minutes": 30,
        "format": "video",
        "consultant": {
          "name": "Dr. Emily Chen",
          "title": "Benefits Consultant"
        },
        "can_join": false,
        "join_available_at": "2025-11-15T13:50:00Z"
      }
    ],
    "quick_actions": [
      {
        "id": "start_case",
        "label": "Start New Case",
        "icon": "message",
        "url": "/cases/new"
      },
      {
        "id": "view_wallet",
        "label": "View ID Card",
        "icon": "wallet",
        "url": "/wallet"
      }
    ]
  }
}
```

### Cases (Messaging)

#### 1. List Cases

**Endpoint**: `GET /cases`

**Query Parameters**:
- `status`: `open`, `resolved`, `all` (default: `all`)
- `sort_by`: `last_message_at`, `created_at` (default: `last_message_at`)
- `sort_order`: `asc`, `desc` (default: `desc`)
- `page`, `per_page`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "case_id": "case_123",
      "subject": "Question about dental coverage",
      "issue_type": "benefits",
      "status": "open",
      "priority": "normal",
      "last_message_preview": "Thank you for reaching out...",
      "last_message_at": "2025-11-13T09:15:00Z",
      "last_message_by": "admin",
      "unread_count": 1,
      "message_count": 5,
      "agent": {
        "admin_id": "admin_001",
        "name": "Sarah Johnson",
        "avatar_url": "https://..."
      },
      "created_at": "2025-11-10T10:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 12,
      "total_pages": 1
    }
  }
}
```

#### 2. Get Case Thread

**Endpoint**: `GET /cases/{case_id}`

**Query**: `?include=messages`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "case_id": "case_123",
    "subject": "Question about dental coverage",
    "issue_type": "benefits",
    "status": "open",
    "priority": "normal",
    "assigned_to": {
      "admin_id": "admin_001",
      "name": "Sarah Johnson",
      "title": "Benefits Specialist",
      "avatar_url": "https://...",
      "is_online": true
    },
    "messages": [
      {
        "message_id": "msg_001",
        "sender_type": "member",
        "sender": {
          "member_id": "mem_abc123",
          "name": "Jane Doe"
        },
        "content": "Hi, I have a question about my dental coverage limits.",
        "attachments": [],
        "created_at": "2025-11-10T10:00:00Z",
        "read_by_admin": true
      },
      {
        "message_id": "msg_002",
        "sender_type": "admin",
        "sender": {
          "admin_id": "admin_001",
          "name": "Sarah Johnson"
        },
        "content": "Thank you for reaching out! I'd be happy to help...",
        "attachments": [
          {
            "attachment_id": "att_001",
            "file_name": "dental_coverage_summary.pdf",
            "file_size": 245000,
            "file_type": "application/pdf",
            "file_url": "https://cdn.touchcare.com/...",
            "thumbnail_url": null
          }
        ],
        "created_at": "2025-11-10T10:15:00Z",
        "read_by_member": true
      }
    ],
    "created_at": "2025-11-10T10:00:00Z",
    "updated_at": "2025-11-13T09:15:00Z"
  }
}
```

#### 3. Create Case

**Endpoint**: `POST /cases`

**Request**:
```json
{
  "subject": "Need help with claim",
  "issue_type": "claims",
  "initial_message": "I submitted a claim last week but haven't received an update.",
  "service_id": null, // Optional: if related to specific service
  "attachments": ["att_upload_001", "att_upload_002"] // Pre-uploaded attachment IDs
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "case_id": "case_789",
    "subject": "Need help with claim",
    "status": "open",
    "created_at": "2025-11-13T10:50:00Z"
  }
}
```

#### 4. Send Message

**Endpoint**: `POST /cases/{case_id}/messages`

**Request**:
```json
{
  "content": "Thank you! That's very helpful.",
  "attachments": ["att_upload_003"]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "message_id": "msg_999",
    "content": "Thank you! That's very helpful.",
    "created_at": "2025-11-13T11:00:00Z"
  }
}
```

#### 5. Upload Attachment

**Endpoint**: `POST /cases/attachments`

**Content-Type**: `multipart/form-data`

**Request**:
```
file: [binary data]
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "attachment_id": "att_upload_003",
    "file_name": "receipt.jpg",
    "file_size": 125000,
    "file_url": "https://cdn.touchcare.com/temp/...",
    "expires_at": "2025-11-13T12:00:00Z" // Temporary URL, must attach to message within 1 hour
  }
}
```

#### 6. Update Case Status (Member)

**Endpoint**: `PATCH /cases/{case_id}`

**Request**:
```json
{
  "subject": "Updated subject", // Optional: edit subject
  "status": "resolved" // Member can mark as resolved
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "case_id": "case_123",
    "status": "resolved"
  }
}
```

#### 7. Rate Case (Satisfaction)

**Endpoint**: `POST /cases/{case_id}/rating`

**Request**:
```json
{
  "rating": 5, // 1-5 stars
  "feedback": "Sarah was very helpful and resolved my issue quickly!"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "case_id": "case_123",
    "rating": 5,
    "feedback_submitted": true
  }
}
```

### Documents

#### 1. List Documents

**Endpoint**: `GET /documents`

**Query Parameters**:
- `category`: Category slug (e.g., `insurance-cards`, `claims-eobs`)
- `status`: `active`, `archived` (default: `active`)
- `pinned`: `true`, `false`
- `search`: Full-text search query
- `sort_by`: `created_at`, `name`, `effective_date`
- `page`, `per_page`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "document_id": "doc_abc123",
      "name": "Medical Insurance Card 2025",
      "category": {
        "category_id": "cat_insurance",
        "name": "Insurance Cards & IDs",
        "slug": "insurance-cards"
      },
      "document_type": "id_card",
      "file_url": "https://cdn.touchcare.com/docs/...",
      "thumbnail_url": "https://cdn.touchcare.com/thumbs/...",
      "file_type": "application/pdf",
      "file_size": 150000,
      "pinned": true,
      "effective_date": "2025-01-01",
      "expiration_date": null,
      "created_at": "2025-01-05T08:00:00Z"
    }
  ],
  "meta": {
    "pagination": { ... }
  }
}
```

#### 2. Get Document Detail

**Endpoint**: `GET /documents/{document_id}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "document_id": "doc_abc123",
    "name": "Medical Insurance Card 2025",
    "category": { ... },
    "document_type": "id_card",
    "file_url": "https://cdn.touchcare.com/docs/...",
    "file_name": "insurance_card_2025.pdf",
    "file_size": 150000,
    "file_type": "application/pdf",
    "thumbnail_url": "https://cdn.touchcare.com/thumbs/...",
    "pinned": true,
    "effective_date": "2025-01-01",
    "view_count": 12,
    "download_count": 3,
    "extracted_metadata": {
      "member_id": "12345678",
      "group_number": "ABC123",
      "effective_date": "2025-01-01"
    },
    "created_at": "2025-01-05T08:00:00Z"
  }
}
```

#### 3. Upload Document

**Endpoint**: `POST /documents`

**Content-Type**: `multipart/form-data`

**Request**:
```
file: [binary data]
name: "My Receipt"
category_id: "cat_receipts"
document_type: "receipt"
notes: "Prescription receipt from 11/10"
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "document_id": "doc_new123",
    "name": "My Receipt",
    "file_url": "https://cdn.touchcare.com/docs/...",
    "created_at": "2025-11-13T11:10:00Z"
  }
}
```

#### 4. Pin/Unpin Document

**Endpoint**: `PATCH /documents/{document_id}/pin`

**Request**:
```json
{
  "pinned": true
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "document_id": "doc_abc123",
    "pinned": true
  }
}
```

#### 5. Search Documents

**Endpoint**: `GET /documents/search?q={query}`

**Query**: `?q=claim+dental&category=claims-eobs`

**Response**: Same as List Documents with search-ranked results.

#### 6. Get Document Categories

**Endpoint**: `GET /documents/categories`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "category_id": "cat_insurance",
      "name": "Insurance Cards & IDs",
      "slug": "insurance-cards",
      "icon": "id-card",
      "document_count": 3,
      "new_count": 0
    },
    {
      "category_id": "cat_eobs",
      "name": "Claims & EOBs",
      "slug": "claims-eobs",
      "icon": "document-text",
      "document_count": 12,
      "new_count": 2
    }
  ]
}
```

### Wallet

#### 1. Get Wallet

**Endpoint**: `GET /wallet`

**Query**: `?dependent_id=dep_xyz` (optional, to get dependent's wallet)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "wallet_id": "wallet_mem_abc123",
    "owner": {
      "type": "member",
      "id": "mem_abc123",
      "name": "Jane Doe"
    },
    "cards": [
      {
        "card_id": "card_001",
        "card_type": "insurance_medical",
        "display_order": 1,
        "status": "active",
        "front_data": {
          "member_name": "Jane Doe",
          "member_id": "12345678",
          "group_number": "ABC123",
          "plan_name": "Acme Health Plan",
          "carrier_name": "Blue Cross",
          "carrier_logo_url": "https://...",
          "effective_date": "2025-01-01",
          "rx_bin": "004336",
          "rx_pcn": "ACME",
          "rx_group": "ABC123"
        },
        "back_data": {
          "customer_service_phone": "1-800-555-1234",
          "claims_address": "PO Box 12345, City, ST 12345",
          "pharmacy_phone": "1-800-555-5678",
          "website": "https://bluecross.com"
        },
        "front_image_url": "https://cdn.touchcare.com/cards/...",
        "back_image_url": "https://cdn.touchcare.com/cards/...",
        "qr_code_url": "https://cdn.touchcare.com/qr/...",
        "expiration_date": null
      },
      {
        "card_id": "card_002",
        "card_type": "emergency_contact",
        "display_order": 5,
        "front_data": {
          "contact_name": "John Doe",
          "contact_phone": "+14155559999",
          "relationship": "spouse"
        }
      }
    ]
  }
}
```

#### 2. Update Card

**Endpoint**: `PATCH /wallet/cards/{card_id}`

**Request**:
```json
{
  "front_data": {
    "contact_name": "John Doe Sr.",
    "contact_phone": "+14155559999",
    "relationship": "spouse"
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "card_id": "card_002",
    "front_data": { ... }
  }
}
```

#### 3. Create Share Link

**Endpoint**: `POST /wallet/share`

**Request**:
```json
{
  "dependent_id": null, // Or dependent ID to share their wallet
  "expires_in_hours": 24,
  "password": "optional_password"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "share_link_id": "share_abc123",
    "token": "abc123xyz789",
    "url": "https://touchcare.com/share/wallet/abc123xyz789",
    "expires_at": "2025-11-14T11:30:00Z",
    "password_protected": true
  }
}
```

#### 4. Get Shared Wallet (Public)

**Endpoint**: `GET /share/wallet/{token}`

**Query**: `?password=optional_password` (if password-protected)

**Response** (200 OK): Returns wallet data (no auth required, but validates token).

### Appointments

#### 1. List Appointments

**Endpoint**: `GET /appointments`

**Query**: `?status=scheduled&sort_by=scheduled_at&sort_order=asc`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "appointment_id": "appt_456",
      "consultation_type": {
        "type_id": "consult_type_001",
        "name": "Benefits Review",
        "duration_minutes": 30
      },
      "scheduled_at": "2025-11-15T14:00:00Z",
      "timezone": "America/New_York",
      "format": "video",
      "consultant": {
        "consultant_id": "consultant_001",
        "name": "Dr. Emily Chen",
        "title": "Benefits Consultant",
        "avatar_url": "https://..."
      },
      "video_meeting_url": "https://zoom.us/j/...",
      "status": "scheduled",
      "can_join": false,
      "join_available_at": "2025-11-15T13:50:00Z", // 10 min before
      "can_cancel": true,
      "cancellation_deadline": "2025-11-14T14:00:00Z" // 24h before
    }
  ]
}
```

#### 2. Get Appointment Detail

**Endpoint**: `GET /appointments/{appointment_id}`

**Response**: Same as list item with additional details.

#### 3. Cancel Appointment

**Endpoint**: `POST /appointments/{appointment_id}/cancel`

**Request**:
```json
{
  "cancellation_reason": "Scheduling conflict"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "appointment_id": "appt_456",
    "status": "cancelled",
    "cancelled_at": "2025-11-13T11:30:00Z"
  }
}
```

#### 4. Join Appointment (Video)

**Endpoint**: `GET /appointments/{appointment_id}/join`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "video_meeting_url": "https://zoom.us/j/...",
    "meeting_id": "123-456-789",
    "passcode": "abcd1234"
  }
}
```

**Note**: Scheduling new appointments happens via embedded iframe (`https://touchcare.as.me/schedule`). After booking, a webhook syncs the appointment to our system.

### Services

#### Get Services

**Endpoint**: `GET /services`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "service_id": "service_001",
      "name": "Mental Health Support",
      "slug": "mental-health",
      "description": "24/7 mental health crisis support and counseling",
      "service_type": "partner",
      "category": "mental_health",
      "logo_url": "https://...",
      "access_methods": {
        "call_directly": true,
        "create_case": true
      },
      "contact_phone": "1-800-555-HELP",
      "contact_hours": "24/7",
      "preparation_instructions": "Have your member ID ready"
    }
  ]
}
```

### Account Settings

#### 1. Get Profile

**Endpoint**: `GET /account/profile`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "member_id": "mem_abc123",
    "email": "member@example.com",
    "email_verified": true,
    "phone": "+14155551234",
    "phone_verified": true,
    "first_name": "Jane",
    "last_name": "Doe",
    "preferred_name": null,
    "date_of_birth": "1990-05-15",
    "gender": "female",
    "address": {
      "street_line_1": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94105",
      "country": "US"
    },
    "emergency_contact_name": "John Doe",
    "emergency_contact_phone": "+14155559999",
    "emergency_contact_relationship": "spouse",
    "preferred_language": "en",
    "timezone": "America/Los_Angeles",
    "avatar_url": "https://..."
  }
}
```

#### 2. Update Profile

**Endpoint**: `PATCH /account/profile`

**Request**:
```json
{
  "preferred_name": "J",
  "phone": "+14155551234",
  "address": { ... }
}
```

**Response** (200 OK): Returns updated profile.

#### 3. Upload Avatar

**Endpoint**: `POST /account/profile/avatar`

**Content-Type**: `multipart/form-data`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "avatar_url": "https://cdn.touchcare.com/avatars/..."
  }
}
```

#### 4. Get Settings

**Endpoint**: `GET /account/settings`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "notifications": {
      "email": {
        "enabled": true,
        "case_updates": true,
        "appointment_reminders": true,
        "document_uploads": true,
        "security_alerts": true,
        "marketing": false,
        "tips": true
      },
      "sms": { ... },
      "push": { ... },
      "in_app": { ... }
    },
    "accessibility": {
      "font_size": "medium",
      "high_contrast": false,
      "reduce_motion": false,
      "theme": "system"
    },
    "privacy": {
      "allow_analytics": true,
      "allow_marketing": false,
      "share_data_with_employer": false
    }
  }
}
```

#### 5. Update Settings

**Endpoint**: `PATCH /account/settings`

**Request**:
```json
{
  "notifications": {
    "email": {
      "marketing": false
    }
  },
  "accessibility": {
    "theme": "dark"
  }
}
```

**Response** (200 OK): Returns updated settings.

#### 6. Manage Dependents

**List**: `GET /account/dependents`

**Add**: `POST /account/dependents`
```json
{
  "first_name": "John Jr.",
  "last_name": "Doe",
  "date_of_birth": "2015-03-20",
  "relationship": "child",
  "gender": "male"
}
```

**Update**: `PATCH /account/dependents/{dependent_id}`

**Remove**: `DELETE /account/dependents/{dependent_id}`

#### 7. Get Sessions

**Endpoint**: `GET /account/security/sessions`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "session_id": "sess_abc123",
      "device_name": "iPhone 13 Pro",
      "device_type": "mobile",
      "ip_address": "192.168.1.1",
      "location": "San Francisco, CA",
      "last_active_at": "2025-11-13T11:00:00Z",
      "is_current": true
    }
  ]
}
```

#### 8. Revoke Session

**Endpoint**: `DELETE /account/security/sessions/{session_id}`

**Response** (204 No Content)

#### 9. Export Account Data

**Endpoint**: `POST /account/export`

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "export_id": "export_abc123",
    "status": "processing",
    "estimated_completion": "2025-11-13T12:00:00Z"
  }
}
```

**Check Status**: `GET /account/export/{export_id}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "export_id": "export_abc123",
    "status": "completed",
    "download_url": "https://cdn.touchcare.com/exports/...",
    "expires_at": "2025-11-20T12:00:00Z"
  }
}
```

### Notifications

#### 1. List Notifications

**Endpoint**: `GET /notifications`

**Query**: `?read=false&type=case_update&page=1&per_page=20`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "notification_id": "notif_001",
      "type": "case_update",
      "title": "New message in your case",
      "body": "Sarah replied to your dental coverage question",
      "cta_text": "View Case",
      "cta_url": "/cases/case_123",
      "read": false,
      "created_at": "2025-11-13T09:15:00Z",
      "related_entity_type": "case",
      "related_entity_id": "case_123"
    }
  ],
  "meta": {
    "unread_count": 4
  }
}
```

#### 2. Mark as Read

**Endpoint**: `PATCH /notifications/{notification_id}/read`

**Response** (200 OK)

#### 3. Mark All as Read

**Endpoint**: `POST /notifications/read-all`

**Response** (200 OK)

---

## Admin Portal APIs

### Member Management

#### 1. List Members

**Endpoint**: `GET /admin/members`

**Query**:
- `employer_id`: Filter by employer
- `plan_id`: Filter by plan
- `tier_id`: Filter by tier
- `status`: Filter by status
- `search`: Search by name, email, phone, employee_id
- `sort_by`, `sort_order`, `page`, `per_page`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "member_id": "mem_abc123",
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "jane@example.com",
      "phone": "+14155551234",
      "employer": {
        "employer_id": "emp_acme",
        "name": "Acme Corporation"
      },
      "plan": {
        "plan_id": "plan_std",
        "name": "Standard Plan"
      },
      "tier": {
        "tier_id": "tier_blue",
        "name": "TouchCare Blue"
      },
      "status": "active",
      "onboarding_status": "complete",
      "created_at": "2025-01-15T10:00:00Z",
      "last_login_at": "2025-11-13T08:00:00Z"
    }
  ],
  "meta": {
    "pagination": { ... }
  }
}
```

#### 2. Get Member Detail

**Endpoint**: `GET /admin/members/{member_id}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "member_id": "mem_abc123",
    "email": "jane@example.com",
    "phone": "+14155551234",
    "first_name": "Jane",
    "last_name": "Doe",
    "date_of_birth": "1990-05-15",
    "employer": { ... },
    "plan": { ... },
    "tier": { ... },
    "address": { ... },
    "dependents": [ ... ],
    "profile": {
      "allergies": ["peanuts"],
      "medical_conditions": ["asthma"],
      "current_medications": [ ... ]
    },
    "account_stats": {
      "total_cases": 5,
      "open_cases": 1,
      "total_appointments": 3,
      "total_documents": 12
    },
    "created_at": "2025-01-15T10:00:00Z",
    "last_login_at": "2025-11-13T08:00:00Z"
  }
}
```

#### 3. Update Member

**Endpoint**: `PATCH /admin/members/{member_id}`

**Request**:
```json
{
  "tier_id": "tier_blue",
  "status": "active",
  "first_name": "Jane",
  "address": { ... }
}
```

**Response** (200 OK): Returns updated member.

**Audit**: Logged to `AuditLog` with before/after snapshot.

#### 4. Bulk Import Members

**Endpoint**: `POST /admin/members/import`

**Content-Type**: `multipart/form-data`

**Request**:
```
file: [CSV file]
employer_id: "emp_acme"
plan_id: "plan_std"
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "import_id": "import_abc123",
    "status": "processing",
    "total_rows": 150
  }
}
```

**Check Status**: `GET /admin/members/import/{import_id}`

#### 5. Impersonate Member (View As)

**Endpoint**: `POST /admin/members/{member_id}/impersonate`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "impersonation_token": "eyJhbGciOiJIUzI1NiIs...",
    "member_id": "mem_abc123",
    "expires_in": 3600
  }
}
```

**Note**: Frontend switches to member view using impersonation token. All actions are read-only and logged.

### Case Management

#### 1. Get Case Inbox

**Endpoint**: `GET /admin/cases`

**Query**:
- `assigned_to`: `me`, `unassigned`, `team`, or admin_id
- `status`: `open`, `in_progress`, etc.
- `priority`: `high`, `urgent`, etc.
- `sla_breach`: `true` (cases breaching SLA)
- `sort_by`, `sort_order`, `page`, `per_page`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "case_id": "case_123",
      "subject": "Question about dental coverage",
      "member": {
        "member_id": "mem_abc123",
        "name": "Jane Doe",
        "tier": {
          "name": "TouchCare Blue",
          "priority_level": 10
        }
      },
      "status": "open",
      "priority": "high",
      "assigned_to": {
        "admin_id": "admin_001",
        "name": "Sarah Johnson"
      },
      "sla": {
        "first_response_due_at": "2025-11-13T10:15:00Z",
        "first_response_breached": false,
        "resolution_due_at": "2025-11-14T10:00:00Z"
      },
      "unread_count": 1,
      "last_message_at": "2025-11-13T09:00:00Z",
      "created_at": "2025-11-13T10:00:00Z"
    }
  ]
}
```

#### 2. Assign Case

**Endpoint**: `PATCH /admin/cases/{case_id}/assign`

**Request**:
```json
{
  "assigned_to": "admin_002", // Or null to unassign
  "assigned_team": "benefits_team"
}
```

**Response** (200 OK)

#### 3. Change Case Status

**Endpoint**: `PATCH /admin/cases/{case_id}/status`

**Request**:
```json
{
  "status": "resolved",
  "resolution": "Provided member with dental coverage summary and confirmed limits."
}
```

**Response** (200 OK)

#### 4. Reply to Case

**Endpoint**: `POST /admin/cases/{case_id}/messages`

**Request**:
```json
{
  "content": "Thank you for reaching out! Here's the information...",
  "attachments": ["att_001"],
  "is_internal_note": false // Internal notes not visible to member
}
```

**Response** (201 Created)

#### 5. Escalate Case

**Endpoint**: `POST /admin/cases/{case_id}/escalate`

**Request**:
```json
{
  "escalate_to": "admin_supervisor_001",
  "reason": "Complex benefits question requiring supervisor review"
}
```

**Response** (200 OK)

#### 6. Get Case Analytics

**Endpoint**: `GET /admin/cases/analytics`

**Query**: `?start_date=2025-11-01&end_date=2025-11-30&employer_id=emp_acme`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "total_cases": 120,
    "open_cases": 15,
    "resolved_cases": 105,
    "avg_first_response_minutes": 45,
    "avg_resolution_hours": 8,
    "sla_compliance_rate": 0.95,
    "satisfaction_avg": 4.7,
    "by_issue_type": {
      "claims": 40,
      "benefits": 35,
      "coverage": 25,
      "other": 20
    }
  }
}
```

### Document Management

#### 1. Upload Document (Admin)

**Endpoint**: `POST /admin/documents`

**Content-Type**: `multipart/form-data`

**Request**:
```
file: [binary]
name: "2025 Benefits Summary"
category_id: "cat_policies"
target_type: "employer" // "member", "employer", "plan"
target_id: "emp_acme" // member_id, employer_id, or plan_id
effective_date: "2025-01-01"
notify_members: true
```

**Response** (201 Created)

#### 2. Bulk Upload

**Endpoint**: `POST /admin/documents/bulk`

**Request**: Similar to single upload, but accepts multiple files.

### Communication Center

#### 1. Send Notification

**Endpoint**: `POST /admin/communications/notifications`

**Request**:
```json
{
  "title": "Important Plan Update",
  "body": "Your plan benefits have been updated for 2025...",
  "type": "announcement",
  "cta_text": "View Details",
  "cta_url": "/documents",
  "target_audience": {
    "employer_ids": ["emp_acme"],
    "plan_ids": [],
    "tier_ids": [],
    "member_ids": [] // Specific members
  },
  "channels": {
    "in_app": true,
    "push": true,
    "email": true,
    "sms": false
  },
  "schedule": {
    "send_now": false,
    "scheduled_at": "2025-11-15T09:00:00Z"
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "notification_campaign_id": "campaign_abc123",
    "status": "scheduled",
    "estimated_recipients": 1200,
    "scheduled_at": "2025-11-15T09:00:00Z"
  }
}
```

#### 2. Get Notification Campaign

**Endpoint**: `GET /admin/communications/notifications/{campaign_id}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "notification_campaign_id": "campaign_abc123",
    "title": "Important Plan Update",
    "body": "...",
    "status": "sent",
    "estimated_recipients": 1200,
    "actual_recipients": 1200,
    "sent_at": "2025-11-15T09:00:00Z",
    "analytics": {
      "delivered_count": 1200,
      "read_count": 850,
      "clicked_count": 320,
      "bounced_email_count": 5,
      "unsubscribed_count": 2
    }
  }
}
```

### Platform Configuration

#### 1. Get Branding Config

**Endpoint**: `GET /admin/config/branding/{employer_id}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "branding_config_id": "brand_acme",
    "employer_id": "emp_acme",
    "logo_light_url": "https://...",
    "logo_dark_url": "https://...",
    "primary_color": "#0066CC",
    "secondary_color": "#FF6B5D",
    "custom_domain": "benefits.acme.com",
    "preview_mode": false,
    "published_at": "2025-11-01T10:00:00Z"
  }
}
```

#### 2. Update Branding Config

**Endpoint**: `PATCH /admin/config/branding/{employer_id}`

**Request**:
```json
{
  "primary_color": "#0066CC",
  "preview_mode": true
}
```

**Response** (200 OK)

#### 3. Publish Branding Changes

**Endpoint**: `POST /admin/config/branding/{employer_id}/publish`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "published_at": "2025-11-13T12:00:00Z",
    "preview_mode": false
  }
}
```

#### 4. Manage Task Bar

**Endpoint**: `GET /admin/config/taskbar/tasks`

**Response**: List of all tasks.

**Endpoint**: `PATCH /admin/config/taskbar/tasks/{task_id}`

**Request**: Update task configuration.

#### 5. Get Tier Analytics

**Endpoint**: `GET /admin/config/tiers/analytics`

**Response**:
```json
{
  "success": true,
  "data": {
    "tiers": [
      {
        "tier_id": "tier_standard",
        "name": "Standard",
        "member_count": 5000,
        "avg_cases_per_member": 2.3,
        "avg_satisfaction": 4.5
      },
      {
        "tier_id": "tier_blue",
        "name": "TouchCare Blue",
        "member_count": 500,
        "avg_cases_per_member": 3.1,
        "avg_satisfaction": 4.9
      }
    ]
  }
}
```

### Analytics & Reports

#### 1. Get Dashboard Metrics

**Endpoint**: `GET /admin/analytics/dashboard`

**Query**: `?start_date=2025-11-01&end_date=2025-11-30`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "active_members": 5500,
    "new_members_this_period": 120,
    "open_cases": 45,
    "cases_resolved_24h": 12,
    "avg_response_time_minutes": 42,
    "member_satisfaction_avg": 4.7,
    "tier_distribution": {
      "Standard": 5000,
      "TouchCare Blue": 500
    }
  }
}
```

#### 2. Export Report

**Endpoint**: `POST /admin/analytics/reports/export`

**Request**:
```json
{
  "report_type": "case_volume",
  "start_date": "2025-11-01",
  "end_date": "2025-11-30",
  "format": "csv", // or "xlsx", "pdf"
  "filters": {
    "employer_id": "emp_acme"
  }
}
```

**Response** (202 Accepted): Returns export job ID, check status similar to member data export.

---

## WebSocket APIs

### Real-Time Messaging

**WebSocket URL**: `wss://ws.touchcare.com`

### Connection

**Client → Server**: Authenticate on connect

```json
{
  "type": "auth",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Server → Client**: Acknowledgment

```json
{
  "type": "auth_success",
  "user_id": "mem_abc123",
  "user_type": "member"
}
```

### Subscribe to Events

**Client → Server**: Subscribe to case updates

```json
{
  "type": "subscribe",
  "channel": "case",
  "case_id": "case_123"
}
```

**Server → Client**: Subscription confirmed

```json
{
  "type": "subscribed",
  "channel": "case",
  "case_id": "case_123"
}
```

### Real-Time Events

#### New Message in Case

**Server → Client**:

```json
{
  "type": "message.new",
  "channel": "case",
  "case_id": "case_123",
  "data": {
    "message_id": "msg_999",
    "sender_type": "admin",
    "sender": {
      "admin_id": "admin_001",
      "name": "Sarah Johnson"
    },
    "content": "Thank you for reaching out...",
    "created_at": "2025-11-13T12:00:00Z"
  }
}
```

#### Message Read Receipt

**Client → Server**: Mark message as read

```json
{
  "type": "message.read",
  "case_id": "case_123",
  "message_id": "msg_999"
}
```

**Server → Client**: Broadcast read receipt

```json
{
  "type": "message.read_receipt",
  "case_id": "case_123",
  "message_id": "msg_999",
  "read_by": "member",
  "read_at": "2025-11-13T12:01:00Z"
}
```

#### Typing Indicator

**Client → Server**: User is typing

```json
{
  "type": "typing.start",
  "case_id": "case_123"
}
```

**Server → Client**: Broadcast typing indicator

```json
{
  "type": "typing.indicator",
  "case_id": "case_123",
  "user_type": "admin",
  "user_name": "Sarah Johnson"
}
```

#### Case Status Change

**Server → Client**:

```json
{
  "type": "case.status_changed",
  "case_id": "case_123",
  "old_status": "open",
  "new_status": "resolved",
  "changed_by": "admin",
  "changed_at": "2025-11-13T12:05:00Z"
}
```

### Notifications Stream

**Client → Server**: Subscribe to notifications

```json
{
  "type": "subscribe",
  "channel": "notifications"
}
```

**Server → Client**: New notification

```json
{
  "type": "notification.new",
  "data": {
    "notification_id": "notif_999",
    "type": "appointment_reminder",
    "title": "Appointment Tomorrow",
    "body": "Your appointment with Dr. Chen is tomorrow at 2pm",
    "cta_text": "View Appointment",
    "cta_url": "/appointments/appt_456"
  }
}
```

### Presence (Admin Only)

**Server → Client**: Agent online/offline

```json
{
  "type": "presence.update",
  "admin_id": "admin_001",
  "status": "online" // "online", "away", "offline"
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [ ... ] // Optional validation errors
  },
  "meta": {
    "timestamp": "2025-11-13T12:00:00Z",
    "request_id": "req_abc123"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 422 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate email) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Maintenance mode |

### Validation Error Details

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "code": "REQUIRED",
        "message": "Email is required"
      },
      {
        "field": "date_of_birth",
        "code": "INVALID_FORMAT",
        "message": "Date must be in YYYY-MM-DD format"
      }
    ]
  }
}
```

---

## Rate Limiting

### Rate Limit Headers

All API responses include rate limit headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1699900000
```

### Rate Limits by Endpoint Type

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Auth endpoints | 10 requests | 15 minutes |
| Read operations (GET) | 1000 requests | 1 hour |
| Write operations (POST/PATCH) | 500 requests | 1 hour |
| File uploads | 50 requests | 1 hour |
| WebSocket connections | 5 connections | Per user |

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 300 // seconds
  }
}
```

**HTTP Status**: 429

**Headers**:
```
Retry-After: 300
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699900300
```

---

## API Versioning

### Versioning Strategy

- **URL versioning**: `/v1/`, `/v2/`
- **Major version changes**: Breaking changes (field removals, type changes)
- **Minor version changes**: Additive changes (new fields, new endpoints)
- **Deprecation policy**: 6-month notice before version sunset

### Version Header

Clients can optionally specify API version via header:

```
X-API-Version: 2025-11-13
```

### Deprecation Warnings

Deprecated endpoints return warning header:

```
X-API-Deprecation: This endpoint is deprecated and will be removed on 2026-05-01
X-API-Sunset: 2026-05-01
```

### Changelog

API changelog available at: `GET /v1/changelog`

---

This completes the API design specification with comprehensive endpoints, request/response schemas, real-time patterns, error handling, and versioning strategy.
