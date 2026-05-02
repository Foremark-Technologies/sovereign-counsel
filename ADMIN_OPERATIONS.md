# Admin Operations Guide

## User Invitations (Invite-Only Model)

### How to Invite a New User

**Endpoint:** `POST /api/v1/users/invite`

**Body:**
```json
{
  "email": "newlawyer@firm.com",
  "roleId": "role-uuid-here",
  "organizationId": "org-uuid-here"  // Optional, uses logged-in user's org
}
```

**Response:**
```json
{
  "data": {
    "id": "invite-id",
    "email": "newlawyer@firm.com",
    "token": "invite-token-xyz",
    "expiresAt": "2026-05-03T..."
  }
}
```

### Step-by-Step Invite Flow

1. **Admin logs in** as admin@testfirm.com
2. **Admin invites user:**
   ```bash
   curl -X POST http://localhost:4000/api/v1/users/invite \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "associate@firm.com",
       "roleId": "associate-role-id"
     }'
   ```
3. **User receives email** with invite link (when email is configured)
4. **User clicks link** → Redirected to: `http://localhost:5000/#/accept-invite?token=xyz`
5. **User fills form:**
   - First name
   - Last name
   - Password
6. **User clicks "Join Organization"**
7. **User logged in** → Dashboard visible

---

## Role Management

### Get All Roles

**Endpoint:** `GET /api/v1/users/roles`

**Response:**
```json
{
  "data": [
    {
      "id": "role-1",
      "name": "Admin",
      "permissions": ["users:read", "users:create", ...]
    },
    {
      "id": "role-2",
      "name": "Associate",
      "permissions": ["matters:read", "tasks:create", ...]
    }
  ]
}
```

### Create Custom Role (Future)

```bash
curl -X POST http://localhost:4000/api/v1/roles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Senior Associate",
    "permissions": [
      "matters:read",
      "matters:create",
      "matters:update",
      "tasks:read",
      "tasks:create",
      "documents:read",
      "documents:create"
    ]
  }'
```

---

## Matter Assignment & Visibility

### Assign User to Matter

**Endpoint:** `POST /api/v1/matters/assign-user`

**Body:**
```json
{
  "matterId": "matter-uuid",
  "userId": "user-uuid",
  "role": "OWNER"  // or LEAD, ASSOCIATE, etc.
}
```

### Set Matter Visibility

**When creating matter:** `POST /api/v1/matters`

```json
{
  "matterTitle": "Tata Realty v Sunrise Developers",
  "clientName": "Tata Realty",
  "practiceArea": "Real Estate",
  "court": "High Court, Mumbai",
  "visibilityLevel": "PRIVATE",  // PRIVATE, TEAM, or ORG
  "nextHearingDate": "2026-05-15"
}
```

**Visibility Levels:**
- `PRIVATE` — Only assigned users see it
- `TEAM` — Team members see it (if they're on the same team)
- `ORG` — All org members see it

### Manually Share Matter

**Endpoint:** `POST /api/v1/matters/share` (if implemented)

Allows admin to grant one user explicit access to a matter without assigning them as an owner.

---

## User Suspension & Deactivation

Currently in schema, ready to implement:

```bash
PATCH /api/v1/users/{userId}
{
  "status": "SUSPENDED"  // or ACTIVE, ARCHIVED
}
```

---

## Audit & Compliance

### View Audit Logs

**Endpoint:** `GET /api/v1/audit-logs` (if implemented)

Returns all actions with:
- User who performed action
- Entity type (matter, task, document, etc.)
- Action (created, updated, deleted)
- Timestamp
- IP address

---

## Dashboard Overview (Admin)

**Endpoint:** `GET /api/v1/dashboard/summary`

Returns org-wide metrics:
- Total active matters
- Pending deadlines
- Upcoming hearings
- Billing status
- User activity
- Document uploads

---

## Troubleshooting as Admin

### Q: User can't log in after invite
**A:** 
1. Check invite token hasn't expired (24 hours)
2. Verify email matches exactly
3. Resend invite to get new token
4. Check user status is ACTIVE (not SUSPENDED)

### Q: User can see matters they shouldn't
**A:**
1. Check matter visibility level
2. Remove user from MatterAssignee table if unneeded
3. Check user's role doesn't have `matters:read` for ORG-level

### Q: New user can't see dashboard metrics
**A:**
1. Verify user has `dashboard:read` permission
2. Check role was created with seed script
3. User may need to log out and back in

### Q: Invite token invalid
**A:**
1. Tokens expire in 24 hours by default
2. Generate new invite to get fresh token
3. Verify token wasn't manually edited

---

## Security Checklist

- ✅ No public signup (invite only)
- ✅ Passwords hashed with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Matter-level privacy
- ✅ Audit logging enabled
- ⚠️ TODO: Email verification
- ⚠️ TODO: Two-factor authentication
- ⚠️ TODO: Rate limiting
- ⚠️ TODO: Session management

---

## Default Test Data

After running `seed-roles.js`:

**Organization:** Test Law Firm
**Admin User:** admin@testfirm.com / password123
**Roles Created:**
- Admin (all permissions)
- Managing Partner (high-level permissions)
- Partner (team-level permissions)
- Associate (limited permissions)
- Paralegal (task-based permissions)
- Finance (billing-only permissions)

