# Trackly Module Documentation Index

## 🗂️ Complete Module Overview

This index helps you quickly navigate the 14 modules that make up the Trackly SaaS platform. Each module includes:
- **Purpose**: What the module does
- **Routes**: Frontend pages/URL patterns
- **Key Files**: Where code lives
- **Database Tables**: Data model
- **API Endpoints**: Backend routes

---

## 📚 All 14 Modules

### **Module 00: Authentication**
**Purpose**: User login, signup (via invite), password recovery, and email verification

**Quick Links:**
- 📄 [Full Documentation](modules/00-authentication.md)
- 📍 **Pages**: `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`
- 📁 **Frontend**: `app/pages/auth/` | `app/composables/auth/useAuthLogin.ts`, `useAuthState.ts`
- 🗄️ **Backend**: `backend/routes/auth/` | Models: `User`, `Tenant`, `PasswordResetToken`

**Key Features:**
- Email/password login with tenant selection
- No self-signup (invite-only)
- Email verification required
- Password reset with token
- Multi-step authentication

---

### **Module 01: Tenant**
**Purpose**: Multi-tenancy isolation and tenant management (top-level SaaS containers)

**Quick Links:**
- 📄 [Full Documentation](modules/01-tenant.md)
- 📁 **Frontend**: `app/pages/settings/tenant*` | `app/composables/tenant/`
- 🗄️ **Backend**: `backend/routes/tenant/` | `backend/middleware/tenantResolver.ts`
- 🗃️ **Models**: `Tenant`, `TenantSettings`, `TenantAuditLog`

**Key Features:**
- Tenant seeding and management
- Tenant-level settings
- Complete data isolation
- Audit logging at tenant level

---

### **Module 02: Company**
**Purpose**: Business entities within tenants (company ownership, departments, settings)

**Quick Links:**
- 📄 [Full Documentation](modules/02-company.md)
- 📍 **Pages**: `/settings/company-profile`, `/settings/departments`
- 📁 **Frontend**: `app/pages/settings/company-*` | `app/components/company/`
- 🗄️ **Backend**: `backend/routes/company/`
- 🗃️ **Models**: `Company`, `Department`, `CompanySettings`

**Key Features:**
- Company ownership model (immutable owner)
- Department hierarchy
- Company-level settings
- Company audit trail

---

### **Module 03: Settings / Admin**
**Purpose**: Administrative configuration hub for roles, permissions, and approval workflows

**Quick Links:**
- 📄 [Full Documentation](modules/03-settings.md)
- 📍 **Pages**: `/settings`, `/settings/roles-permissions`, `/settings/approval-flow`
- 📁 **Frontend**: `app/pages/settings/` | `app/components/settings/`
- 🗄️ **Backend**: `backend/routes/settings/` → `roles/`, `permissions/`, `approval-workflows/`
- 🗃️ **Models**: `Role`, `Permission`, `ApprovalWorkflow`, `ApprovalStep`

**Key Features:**
- Role management and RBAC configuration
- Permission matrix
- Approval workflow builder
- Integration settings

---

### **Module 04: Users Management**
**Purpose**: Manage company users, invitations, roles, departments, and lifecycle

**Quick Links:**
- 📄 [Full Documentation](modules/04-users.md)
- 📍 **Pages**: `/settings/users`, `/settings/users/:id`, `/settings/users/invite`
- 📁 **Frontend**: `app/pages/settings/users*` | `app/components/users/`
- 🗄️ **Backend**: `backend/routes/users/` → `list`, `create`, `update`, `delete`, `invite`
- 🗃️ **Models**: `User`, `CompanyUser`, `UserInvitation`, `UserProfile`

**Key Features:**
- User list and search
- User invitations (via email)
- Role assignment
- Department assignment
- Activate/deactivate users
- Bulk operations

---

### **Module 05: Roles & Permissions**
**Purpose**: Role-based access control (RBAC) with granular permissions and role hierarchy

**Quick Links:**
- 📄 [Full Documentation](modules/05-roles-permissions.md)
- 📍 **Pages**: `/settings/roles-permissions`
- 📁 **Frontend**: `app/components/rbac/` | `app/composables/rbac/`
- 🗄️ **Backend**: `backend/routes/rbac/` → `roles/`, `permissions/`
- 🗃️ **Models**: `Role`, `Permission`, `RolePermission`, `PermissionDependency`
- 🛡️ **Middleware**: `requireRole.ts`, `requirePermission.ts`

**Key Features:**
- Custom role creation
- Permission granularity (module:action format)
- Owner bypass (always has all permissions)
- Permission dependencies
- Role hierarchy visualization

---

### **Module 06: Task Management**
**Purpose**: Create, assign, track, and manage tasks/projects with kanban board

**Quick Links:**
- 📄 [Full Documentation](modules/06-task-management.md)
- 📍 **Pages**: `/task-management`, `/task-management/projects`, `/task-management/kanban-board`
- 📁 **Frontend**: `app/pages/task-management/` | `app/components/tasks/`
- 🗄️ **Backend**: `backend/routes/tasks/` → `list`, `create`, `update`, `transition`, `comments`
- 🗃️ **Models**: `Project`, `Task`, `TaskStage`, `TaskTransition`, `TaskComment`

**Key Features:**
- Project and task hierarchy
- Task stages and workflows
- Kanban board view
- Task assignments
- Comments and collaboration
- Time log integration

---

### **Module 07: Global Time Tracking**
**Purpose**: System-level timer always visible in header, one active timer per user

**Quick Links:**
- 📄 [Full Documentation](modules/07-time-tracking-global.md)
- 📁 **Frontend**: Timer in `app/components/layout/Header.vue` | `app/composables/time-tracking/`
- 🗄️ **Backend**: `backend/routes/time-tracking/` → `start-timer`, `stop-timer`, `get-active-timer`
- 🗃️ **Models**: `Timer`, `TimeLog`, `TaskTimeLog`
- ⏲️ **Jobs**: `autoSaveTimerJob.ts` (periodic saves)

**Key Features:**
- Real-time timer in header
- Task selection (mandatory)
- Auto-save to time logs
- Immutable time logs
- Timer pause/resume

---

### **Module 08: Time Management**
**Purpose**: Leave requests, overtime, time edit requests with approval workflows

**Quick Links:**
- 📄 [Full Documentation](modules/08-time-management.md)
- 📍 **Pages**: `/time-management`, `/time-management/personal`, `/time-management/leave`, `/time-management/overtime`
- 📁 **Frontend**: `app/pages/time-management/` | `app/components/time-management/`
- 🗄️ **Backend**: `backend/routes/time-management/` → `leave-requests`, `overtime-requests`, `time-edit-requests`
- 🗃️ **Models**: `LeaveRequest`, `OvertimeRequest`, `TimeEditRequest`, `LeaveBalance`

**Key Features:**
- Leave request workflow
- Overtime approval
- Time edit requests
- Leave balance tracking with carryover
- Leave type management
- Approval integration

---

### **Module 09: Attendance & Analytics**
**Purpose**: Track attendance, calculate metrics, provide analytics dashboards

**Quick Links:**
- 📄 [Full Documentation](modules/09-attendance.md)
- 📍 **Pages**: `/analytics/attendance`, `/analytics/productivity`, `/analytics/workforce`
- 📁 **Frontend**: `app/pages/analytics/` | `app/components/analytics/`
- 🗄️ **Backend**: `backend/routes/analytics/` → `attendance`, `productivity`, `metrics`
- 🗃️ **Models**: `AttendanceRecord`, `ProductivityMetric`, `TeamMetric`
- ⏲️ **Jobs**: `generateAttendanceSummary.ts`, `calculateProductivityMetrics.ts`

**Key Features:**
- Attendance tracking
- Productivity metrics
- Team analytics
- Dashboards for different roles
- Trend analysis
- Export capabilities

---

### **Module 10: Payroll**
**Purpose**: Manage salary configuration, run payroll, generate payslips

**Quick Links:**
- 📄 [Full Documentation](modules/10-payroll.md)
- 📍 **Pages**: `/payroll`, `/payroll/salary-config`, `/payroll/runs`
- 📁 **Frontend**: `app/pages/payroll/` | `app/components/payroll/`
- 🗄️ **Backend**: `backend/routes/payroll/` → `salary-config`, `payroll-runs`, `payslips`
- 🗃️ **Models**: `SalaryConfiguration`, `PayrollRun`, `Payslip`, `PayrollItem`
- 📊 **Services**: `PayrollCalculator.ts`, `PayslipGenerator.ts`, `TaxCalculator.ts`

**Key Features:**
- Salary configuration per employee
- Payroll run creation
- Automatic calculation (gross/net)
- Deduction management
- Tax calculation
- Payslip generation and distribution

---

### **Module 11: Reports**
**Purpose**: Generate comprehensive reports (attendance, tasks, payroll, time tracking)

**Quick Links:**
- 📄 [Full Documentation](modules/11-reports.md)
- 📍 **Pages**: `/reports`, `/reports/attendance`, `/reports/tasks`, `/reports/payroll`
- 📁 **Frontend**: `app/pages/reports/` | `app/components/reports/`
- 🗄️ **Backend**: `backend/routes/reports/` → `list`, `create`, `export`, `schedule`
- 🗃️ **Models**: `Report`, `ReportConfig`, `ReportRun`, `ReportSchedule`
- 📊 **Services**: `ReportGenerator.ts`, `ReportExporter.ts` (PDF/Excel)

**Key Features:**
- Pre-built report templates
- Custom report builder
- Scheduled reports
- Export to PDF/Excel
- Role-based report visibility
- Data filtering and drill-down

---

### **Module 12: Chat / Messaging**
**Purpose**: Internal messaging system for company communication

**Quick Links:**
- 📄 [Full Documentation](modules/12-chat.md)
- 📍 **Pages**: `/chat`, `/chat/:conversationId`, `/chat/direct/:userId`
- 📁 **Frontend**: `app/pages/chat/` | `app/components/chat/`
- 🗄️ **Backend**: `backend/routes/chat/` → `conversations`, `messages`, `participants`, `reactions`
- 🗃️ **Models**: `Conversation`, `Message`, `MessageReaction`, `MessageMention`
- 🔌 **WebSocket**: Real-time messaging handlers

**Key Features:**
- Direct messaging
- Group conversations
- Task-linked chat
- Message reactions
- @mentions
- Read receipts
- Real-time notifications

---

### **Module 13: Approval Engine**
**Purpose**: Centralized approval workflow system for multi-level sign-offs

**Quick Links:**
- 📄 [Full Documentation](modules/13-approval-engine.md)
- 📍 **Pages**: `/approvals`, `/approvals/pending`
- 📁 **Frontend**: `app/pages/approvals/` | `app/components/approvals/`
- 🗄️ **Backend**: `backend/routes/approvals/` → `requests`, `workflows`, `decisions`
- 🗃️ **Models**: `ApprovalWorkflow`, `ApprovalRequest`, `ApprovalDecision`, `ApprovalEscalation`
- 📊 **Services**: `ApprovalEngine.ts`, `ApprovalEscalator.ts`, `ApprovalNotifier.ts`

**Key Features:**
- Configurable approval workflows
- Multi-level approvals
- Role-based or specific user approvers
- Escalation after X days
- Integration with all modules
- Notification system
- Audit trail

---

## 🔗 Module Dependencies

```
Authentication (00)
    ↓
├─→ Tenant (01)
│   ├─→ Company (02)
│   │   ├─→ Users (04)
│   │   ├─→ Roles & Permissions (05)
│   │   │   ↓
│   │   ├─→ Settings (03)
│   │   │   └─→ Approval Engine (13)
│   │   │       ↑
│   │   ├─→ Task Management (06)
│   │   │   └─→ Time Tracking (07)
│   │   │       ├─→ Time Management (08)
│   │   │       │   ├─→ Payroll (10)
│   │   │       │   └─→ Approval Engine (13)
│   │   │       └─→ Attendance (09)
│   │   │
│   │   ├─→ Chat (12)
│   │   └─→ Reports (11)
```

---

## 🚀 Quick Navigation

### By Feature Type

**User Management:**
- Module 04: Users Management
- Module 05: Roles & Permissions
- Module 00: Authentication

**Time Tracking:**
- Module 07: Global Time Tracking
- Module 08: Time Management
- Module 09: Attendance & Analytics

**Task Management:**
- Module 06: Task Management
- Module 12: Chat (for task discussions)

**Financial:**
- Module 10: Payroll
- Module 11: Reports (payroll reports)

**Administration:**
- Module 03: Settings / Admin
- Module 13: Approval Engine
- Module 01: Tenant
- Module 02: Company

**Communication:**
- Module 12: Chat / Messaging

---

### By Role

**For Developers:**
- Start with [00-authentication.md](modules/00-authentication.md) for architecture
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Check [UI-QUICK-REFERENCE.md](UI-QUICK-REFERENCE.md) for component patterns

**For Project Managers:**
- Review all 14 modules for scope understanding
- Use [COMPLETION-REPORT.md](COMPLETION-REPORT.md) for project status

**For Designers:**
- Review [UI-IMPLEMENTATION.md](UI-IMPLEMENTATION.md) for design system
- Check component usage in each module

**For QA/Testing:**
- Understand module flow using [ARCHITECTURE.md](ARCHITECTURE.md)
- Use module tables and API endpoints for test case creation

---

## 📖 File Organization

All module documentation is in: `docs/modules/`

```
docs/
├── modules/
│   ├── 00-authentication.md      ✅ Complete
│   ├── 01-tenant.md             ✅ Complete
│   ├── 02-company.md            ✅ Complete
│   ├── 03-settings.md           ✅ Complete
│   ├── 04-users.md              ✅ Complete
│   ├── 05-roles-permissions.md  ✅ Complete
│   ├── 06-task-management.md    ✅ Complete
│   ├── 07-time-tracking-global.md ✅ Complete
│   ├── 08-time-management.md    ✅ Complete
│   ├── 09-attendance.md         ✅ Complete
│   ├── 10-payroll.md            ✅ Complete
│   ├── 11-reports.md            ✅ Complete
│   ├── 12-chat.md               ✅ Complete
│   └── 13-approval-engine.md    ✅ Complete
├── ARCHITECTURE.md              ✅ Complete
├── UI-IMPLEMENTATION.md         ✅ Complete
├── UI-QUICK-REFERENCE.md        ✅ Complete
├── PROJECT-STRUCTURE-UPDATE.md  ✅ Complete
├── MODULES-INDEX.md (this file) ✅ Complete
└── ai-prompt.md                 ✅ Pattern template
```

---

## 🎯 Common Development Scenarios

### "I need to add a new feature to Task Management"
1. Read [06-task-management.md](modules/06-task-management.md)
2. Check the project structure section for file locations
3. Follow naming conventions shown
4. Add files in correct locations (pages, components, composables, types, backend)

### "I need to understand how approvals work"
1. Read [13-approval-engine.md](modules/13-approval-engine.md)
2. See where it's used: time management, payroll, user management
3. Check [ARCHITECTURE.md](ARCHITECTURE.md) for data flow

### "I'm onboarding a new developer"
1. Start with [ARCHITECTURE.md](ARCHITECTURE.md)
2. Have them read 2-3 complete modules
3. Show them [UI-QUICK-REFERENCE.md](UI-QUICK-REFERENCE.md) for patterns
4. Reference this index when they have questions

### "I need to modify the database schema"
1. Find the relevant module
2. Check the "Database Tables" section
3. Understand relationships with other tables
4. Create migration with version number

---

## 📞 Questions?

- **Structure questions**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **UI/Component questions**: See [UI-QUICK-REFERENCE.md](UI-QUICK-REFERENCE.md)
- **Feature specifications**: See the specific module file
- **File locations**: Check the module's project structure section
- **Module dependencies**: See the dependency diagram above

---

**Last Updated**: December 2024
**Total Modules**: 14
**Status**: ✅ All modules documented with project structure
**Version**: 1.0.0
