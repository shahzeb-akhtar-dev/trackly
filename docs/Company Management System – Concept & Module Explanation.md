# **Company Task & Time Management System**

**Final Architecture & Auth Foundation**  
This document is the single source of truth to start **database design, backend APIs, and frontend pages**.

---

## **0\. System Login & Ownership Flow (READ FIRST)**

This flow must be understood **before designing the database**.

### **Core Principle**

* **Users log in, not tenants**  
* Tenant defines SaaS isolation  
* Company defines business ownership  
* Company ownership is a **relation**, not a flag

### **Login Flow (Step-by-Step)**

1. User opens login screen  
2. User provides:  
   * Email  
   * Password  
   * Tenant identifier (subdomain or code)  
3. System resolves tenant  
4. System validates tenant user  
5. System validates company user  
6. Auth context is created:

{

  "tenant\_id": 1,

  "company\_id": 15,

  "user\_id": 342,

  "role\_id": 4

}

### **Ownership Validation**

A user is **Company Owner** if:

companies.owner\_user\_id \= users.id

No `is_owner` flag exists in users table.

### **Owner Rules (Hard Constraints)**

* Owner cannot be deleted  
* Owner cannot be demoted  
* Owner is hidden from normal user list  
* Owner bypasses RBAC restrictions

---

## **1\. Tenant Model (Static – System Level)**

* Tenant already exists (seeded manually)  
* No UI to create or manage tenants  
* Tenant is used for:  
  * SaaS isolation  
  * Pricing (external system)  
  * Billing (external system)

**Table:** `tenants`

---

## **2\. Company Model**

* Each company belongs to one tenant  
* Each company has exactly **one owner**  
* All business data belongs to company

**Key Responsibilities**

* Users  
* Tasks  
* Time logs  
* Attendance  
* Payroll  
* Reports

**Table:** `companies`

---

## **3\. Authentication (No Signup)**

### **Pages**

/auth/login

/auth/forgot-password

/auth/reset-password

/auth/verify-email

### **Rules**

* Signup disabled  
* Users are invited by company owner  
* Tenant identifier required at login

---

## **4\. Settings Module (Admin & Owner)**

Main route:

/settings

### **Sub Pages**

/settings/company-profile

/settings/departments

/settings/roles-permissions

/settings/approval-flow

/settings/users

/settings/users/:id

### **Notes**

* One user \= one role  
* Owner is excluded from user list  
* Roles & permissions fully configurable

---

## **5\. User Management**

### **Routes**

/settings/users

/settings/users/:id

### **Capabilities**

* Invite user  
* Assign role (dropdown)  
* Assign department  
* Activate / deactivate user

### **Restrictions**

* Owner cannot be edited or deleted

---

## **6\. Task Management**

Main route:

/task-management

### **Sub Pages**

/task-management/projects

/task-management/tasks

/task-management/kanban-board

### **Task Flow**

* Task created by Manager / HR  
* Assigned to user  
* Linked to project  
* Has multiple stages  
* Auto-moves or manual move  
* Review stage supported

---

## **7\. Global Time Tracking (CORE MODULE)**

**This is NOT a page — it is a system-level module**

### **UI Placement**

* Always visible in header

### **Rules**

* One active timer per user  
* Task selection mandatory  
* Only pending assigned tasks selectable

### **Data Generated**

* Time logs linked to:  
  * User  
  * Task  
  * Project  
  * Company

### **Edit Policy**

* Time logs immutable  
* Edit requires approval request

---

## **8\. Time Management**

Main route:

/time-management

### **Sub Pages**

/time-management/personal

/time-management/workforce

### **Requests**

* Edit time  
* Leave / time off  
* Overtime

All requests go through approval flow.

---

## **9\. Attendance & Analytics**

### **Analytics Module**

* User task progress  
* Attendance summary  
* Productivity metrics

---

## **10\. Payroll Module**

Main route:

/payroll

### **Features**

* Salary configuration  
* Payroll run  
* Payslips  
* History

### **Dependency**

Payroll is calculated from:

* Approved time logs  
* Attendance  
* Overtime  
* Leave

---

## **11\. Reports**

Main route:

/reports

### **Sub Pages**

/reports/attendance

/reports/tasks

/reports/payroll

Role-based visibility.

---

## **12\. Chat Module**

Main route:

/chat

### **Features**

* Internal messaging  
* Optional task-linked chat

---

## **13\. Approval Engine (Central)**

Used by:

* Time edit requests  
* Leave requests  
* Overtime  
* Role changes

Approval levels:

* Manager  
* HR  
* Owner (override)

---

## **14\. End-to-End System Flow**

Task Assignment

   ↓

Global Time Tracking

   ↓

Time Logs

   ↓

Approvals

   ↓

Attendance

   ↓

Payroll

   ↓

Reports

---

## **15\. Ready for DB Design**

This document is **final and stable**.

You can now safely start:

* Database schema  
* ER diagrams  
* Backend APIs  
* Frontend routing

---

**Next Step:**  
Start DB diagram with one module at a time.

