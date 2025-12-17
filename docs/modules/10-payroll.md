# Payroll Module

## 📁 Project Structure Overview

This module relates to the following project structure:

```
trackly/
├── docs/
│   └── modules/
│       ├── 00-authentication.md
│       ├── 01-tenant.md
│       ├── 02-company.md
│       ├── 03-settings.md
│       ├── 04-users.md
│       ├── 05-roles-permissions.md
│       ├── 06-task-management.md
│       ├── 07-time-tracking-global.md
│       ├── 08-time-management.md
│       ├── 09-attendance.md
│       ├── 10-payroll.md          ← YOU ARE HERE
│       └── ... (3 more modules)
├── app/
│   ├── pages/
│   │   └── payroll/
│   │       ├── index.vue (TODO) ← Payroll dashboard
│   │       ├── salary-config.vue (TODO) ← Salary settings
│   │       ├── runs.vue (TODO) ← Payroll runs list
│   │       ├── runs/
│   │       │   ├── [id].vue (TODO) ← Run details
│   │       │   └── create.vue (TODO) ← Create new run
│   │       └── payslips/
│   │           └── [id].vue (TODO) ← View payslip
│   ├── components/
│   │   └── payroll/
│   │       ├── SalaryConfigForm.vue (TODO)
│   │       ├── PayrollRunForm.vue (TODO)
│   │       ├── PayslipView.vue (TODO)
│   │       ├── PayrollTable.vue (TODO)
│   │       └── SalaryBreakdown.vue (TODO)
│   ├── composables/
│   │   └── payroll/
│   │       ├── usePayroll.ts ← Payroll management
│   │       ├── useSalaryConfig.ts ← Salary configuration
│   │       ├── usePayslip.ts ← Payslip generation
│   │       └── usePayrollCalculation.ts ← Calculation logic
│   ├── types/
│   │   ├── payroll.ts
│   │   ├── salary.ts
│   │   └── payslip.ts
│   └── assets/css/
│       └── main.css
├── backend/
│   ├── migrations/
│   │   └── 011_create_payroll_tables.sql
│   ├── routes/
│   │   └── payroll/
│   │       ├── salary-config.ts
│   │       ├── payroll-runs.ts
│   │       ├── payslips.ts
│   │       └── payroll-history.ts
│   ├── services/
│   │   ├── PayrollCalculator.ts ← Gross/Net calculation
│   │   ├── PayslipGenerator.ts ← PDF generation
│   │   └── TaxCalculator.ts ← Tax calculations
│   ├── jobs/
│   │   └── processPayrollRun.ts ← Payroll processing
│   └── models/
│       ├── SalaryConfiguration.ts
│       ├── SalaryDeduction.ts
│       ├── PayrollRun.ts
│       ├── Payslip.ts
│       ├── PayrollItem.ts
│       └── PayrollHistory.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/payroll/` for dashboard, salary config, runs, and payslips
- **Components**: `app/components/payroll/` for forms, tables, and payslip view
- **State Management**: `app/composables/payroll/` for payroll operations and calculations
- **Type Definitions**: `app/types/payroll.ts`, `app/types/salary.ts`, `app/types/payslip.ts`
- **Backend**: `backend/routes/payroll/` for all payroll APIs
- **Services**: PayrollCalculator, PayslipGenerator, TaxCalculator
- **Jobs**: Background job for processing payroll runs

---

## 1. Purpose
Manage salary configuration, run payroll, generate payslips, and maintain payroll history. Payroll calculated from approved time logs, attendance, overtime, and leave data. Integrated with time tracking and approval systems.

## 2. Routes / Pages
- `/payroll` - Payroll hub
- `/payroll/configuration` - Salary setup, tax/deduction rules
- `/payroll/run` - Payroll runs, execution
- `/payroll/payslips` - View/download payslips
- `/payroll/payslips/:id` - Payslip detail
- `/payroll/reports` - Payroll reports

## 3. Actors & Roles
- **HR/Payroll Admin** - Can configure salary, run payroll, manage payslips
- **Owner** - Full payroll access, can override calculations
- **Finance** (if role exists) - Can approve payroll runs, audit
- **Regular User** - Can view own payslips only

## 4. Database Tables

### `salary_configurations`
```
id (PK)
company_id (FK)
user_id (FK)
effective_from (date)
effective_to (date) nullable
employment_type (full-time | part-time | contract | hourly)
salary_amount (decimal)
salary_currency
salary_frequency (monthly | bi-weekly | weekly | daily | hourly)
pay_period_start_day (integer) - day of month or day of week
hourly_rate (decimal) nullable - for hourly employees
overtime_multiplier (decimal) - default 1.5x
weekend_multiplier (decimal) - default 2x
status (active | inactive)
created_by_user_id (FK)
created_at
updated_at
```

### `salary_deductions`
```
id (PK)
company_id (FK)
name (UNIQUE per company)
description
deduction_type (fixed | percentage | variable)
amount (decimal) - for fixed
percentage (decimal) - for percentage type
effective_from (date)
effective_to (date) nullable
is_tax (boolean)
is_mandatory (boolean)
status (active | inactive)
created_at
updated_at
```

### `salary_components`
```
id (PK)
company_id (FK)
name (UNIQUE per company)
description
component_type (earning | deduction | tax)
calculation_method (fixed | percentage_salary | formula)
formula (string) nullable - e.g., "salary * 0.5"
status (active | inactive)
created_at
```

### `employee_deductions`
```
id (PK)
company_id (FK)
user_id (FK)
salary_deduction_id (FK)
effective_from (date)
effective_to (date) nullable
amount (decimal) - if variable per employee
status (active | inactive)
created_at
updated_at
```

### `payroll_runs`
```
id (PK)
company_id (FK)
created_by_user_id (FK)
pay_period_start (date)
pay_period_end (date)
frequency (monthly | bi-weekly | weekly)
status (draft | pending_approval | approved | processed | payroll_sent)
total_gross_amount (decimal)
total_net_amount (decimal)
total_tax_amount (decimal)
total_deductions_amount (decimal)
employee_count (integer)
processed_at (timestamp) nullable
approved_by_user_id (FK) nullable
approval_notes (string) nullable
created_at
updated_at
```

### `payslips`
```
id (PK)
company_id (FK)
payroll_run_id (FK)
user_id (FK)
pay_period_start (date)
pay_period_end (date)
employee_id (string) - company-specific ID
basic_salary (decimal)
earnings: [
  { component_id, name, amount }
] - JSON array
gross_salary (decimal)
deductions: [
  { deduction_id, name, amount }
] - JSON array
taxes (decimal)
net_salary (decimal)
ytd_gross (decimal) - year-to-date
ytd_net (decimal)
ytd_taxes (decimal)
status (draft | issued | payment_processed)
issued_date (timestamp)
payment_date (timestamp) nullable
pdf_url (string)
created_at
updated_at
```

### `payroll_items`
```
id (PK)
payslip_id (FK)
item_type (earning | deduction | tax)
name
amount (decimal)
notes (string)
created_at
```

### `payroll_audit_log`
```
id (PK)
company_id (FK)
payroll_run_id (FK)
actor_user_id (FK)
action (string: created, approved, processed, payslip_generated, payment_sent)
data (JSON)
created_at
```

## 5. Relationships
- `salary_configurations.company_id` → `companies.id`
- `salary_configurations.user_id` → `users.id`
- `salary_configurations.created_by_user_id` → `users.id`
- `salary_deductions.company_id` → `companies.id`
- `salary_components.company_id` → `companies.id`
- `employee_deductions.company_id` → `companies.id`
- `employee_deductions.user_id` → `users.id`
- `employee_deductions.salary_deduction_id` → `salary_deductions.id`
- `payroll_runs.company_id` → `companies.id`
- `payroll_runs.created_by_user_id` → `users.id`
- `payroll_runs.approved_by_user_id` → `users.id` (nullable)
- `payslips.company_id` → `companies.id`
- `payslips.payroll_run_id` → `payroll_runs.id`
- `payslips.user_id` → `users.id`
- `payroll_items.payslip_id` → `payslips.id`

## 6. API Endpoints

### Salary Configuration

#### Get Salary Configuration
```
GET /api/payroll/salary/:user_id
Headers: Authorization: Bearer {token}
Response: {
  user_id, employment_type, salary_amount, salary_frequency,
  hourly_rate, overtime_multiplier, weekend_multiplier,
  effective_from, effective_to, status
}
```

#### Create Salary Configuration
```
POST /api/payroll/salary
Headers: Authorization: Bearer {token}
Body: {
  user_id,
  employment_type,
  salary_amount,
  salary_frequency,
  pay_period_start_day,
  hourly_rate,
  overtime_multiplier,
  weekend_multiplier,
  effective_from
}
Response: { id, user_id, ... }
```

#### Update Salary Configuration
```
PUT /api/payroll/salary/:user_id
Headers: Authorization: Bearer {token}
Body: { salary_amount, hourly_rate, multipliers, ... }
Response: { id, user_id, ... }
```

#### List Salary Deductions
```
GET /api/payroll/deductions
Headers: Authorization: Bearer {token}
Response: {
  deductions: [
    { id, name, type, amount, is_tax, is_mandatory, status }
  ]
}
```

#### Create Salary Deduction
```
POST /api/payroll/deductions
Headers: Authorization: Bearer {token}
Body: {
  name,
  description,
  deduction_type,
  amount,
  percentage,
  is_tax,
  is_mandatory,
  effective_from
}
Response: { id, name, ... }
```

#### Assign Deduction to Employee
```
POST /api/payroll/employee-deductions
Headers: Authorization: Bearer {token}
Body: {
  user_id,
  salary_deduction_id,
  amount,
  effective_from
}
Response: { id, user_id, ... }
```

### Payroll Runs

#### Create Payroll Run
```
POST /api/payroll/runs
Headers: Authorization: Bearer {token}
Body: {
  pay_period_start,
  pay_period_end,
  frequency,
  employee_filter: { department_id, user_ids } (optional)
}
Response: {
  id, status: "draft", pay_period_start, pay_period_end,
  total_gross_amount, employee_count
}
```

#### Get Payroll Run
```
GET /api/payroll/runs/:id
Headers: Authorization: Bearer {token}
Response: {
  id, status, pay_period_start, pay_period_end,
  total_gross_amount, total_net_amount, total_tax_amount,
  employee_count, created_by, created_at, approved_by (if approved)
}
```

#### List Payroll Runs
```
GET /api/payroll/runs?status=&date_from=&date_to=&page=1&limit=20
Headers: Authorization: Bearer {token}
Response: {
  runs: [
    { id, status, pay_period, total_amount, employee_count, created_at }
  ]
}
```

#### Calculate Payroll Run
```
POST /api/payroll/runs/:id/calculate
Headers: Authorization: Bearer {token}
Response: {
  status: "calculated",
  total_gross,
  total_net,
  total_tax,
  payslips_count,
  preview: { sample_payslips: [...] }
}
```

#### Approve Payroll Run
```
POST /api/payroll/runs/:id/approve
Headers: Authorization: Bearer {token}
Body: {
  approval_notes: string (optional)
}
Response: {
  status: "approved",
  approved_by,
  approved_at
}
```

#### Process Payroll Run
```
POST /api/payroll/runs/:id/process
Headers: Authorization: Bearer {token}
Body: {
  payment_method: (bank_transfer | check | cash)
}
Response: {
  status: "processed",
  payslips_generated: integer,
  processed_at
}
```

#### Reject Payroll Run
```
POST /api/payroll/runs/:id/reject
Headers: Authorization: Bearer {token}
Body: {
  reason: string
}
Response: {
  status: "draft",
  message: "Payroll run returned to draft"
}
```

### Payslips

#### Get User Payslips
```
GET /api/payroll/payslips?date_from=&date_to=&page=1&limit=20
Headers: Authorization: Bearer {token}
Response: {
  payslips: [
    {
      id, pay_period, basic_salary, gross_salary,
      deductions, taxes, net_salary, issued_date
    }
  ]
}
```

#### Get Payslip Detail
```
GET /api/payroll/payslips/:id
Headers: Authorization: Bearer {token}
Response: {
  id, user: { id, name }, payroll_run: { id, date_range },
  basic_salary, earnings: [ ... ], deductions: [ ... ],
  taxes, gross_salary, net_salary,
  ytd_gross, ytd_net, ytd_taxes,
  issued_date, payment_date, status
}
```

#### Download Payslip (PDF)
```
GET /api/payroll/payslips/:id/download
Headers: Authorization: Bearer {token}
Response: PDF file
```

#### Email Payslip
```
POST /api/payroll/payslips/:id/email
Headers: Authorization: Bearer {token}
Body: {
  recipient_email,
  message: string (optional)
}
Response: { message: "Payslip emailed" }
```

### Payroll Reports

#### Get Payroll Summary
```
GET /api/payroll/reports/summary?date_from=&date_to=
Headers: Authorization: Bearer {token}
Response: {
  period: "Jan 1 - Jan 31, 2024",
  total_employees_paid: 45,
  total_gross_payroll: 450000,
  total_net_payroll: 380000,
  total_taxes: 70000,
  total_deductions: 50000
}
```

#### Get Department Payroll
```
GET /api/payroll/reports/department?department_id=&date_from=&date_to=
Headers: Authorization: Bearer {token}
Response: {
  department: { id, name },
  total_gross, total_net, total_taxes,
  employee_summary: [
    { user_id, name, gross_salary, net_salary }
  ]
}
```

#### Get Tax Report
```
GET /api/payroll/reports/taxes?date_from=&date_to=
Headers: Authorization: Bearer {token}
Response: {
  period,
  total_tax_withheld,
  tax_by_type: [ ... ],
  ytd_taxes,
  tax_filing_ready: boolean
}
```

#### Export Payroll Report (CSV/Excel)
```
GET /api/payroll/reports/export?format=csv&date_from=&date_to=
Headers: Authorization: Bearer {token}
Response: File download
```

## 7. Page Flow (Step-by-Step)

### Salary Configuration (HR Setup)
1. HR navigates to `/payroll/configuration`
2. Sees list of employees without salary configured
3. Clicks "Add Salary" for employee
4. Form opens:
   - Employment Type (full-time, part-time, contract, hourly)
   - Salary Amount
   - Salary Frequency (monthly, bi-weekly, weekly)
   - Pay Period Start Day
   - Hourly Rate (if hourly)
   - Overtime Multiplier (default 1.5)
   - Weekend Multiplier (default 2)
5. HR fills form
6. HR clicks "Save"
7. Frontend validates: salary > 0, all required fields
8. Frontend sends `POST /api/payroll/salary`
9. Backend creates salary_configurations row
10. Backend logs configuration created
11. Frontend shows success: "Salary configured for {employee}"
12. HR can now assign deductions (optional):
    - Clicks "Assign Deductions"
    - Selects deduction checkboxes: Health Insurance, Pension, etc.
    - Can set custom amounts (if variable)
    - Saves via `POST /api/payroll/employee-deductions`

### Payroll Run Creation & Calculation
1. HR navigates to `/payroll/run`
2. Sees option: "Create New Payroll Run"
3. Clicks button
4. Form opens:
   - Pay Period Start Date (date picker)
   - Pay Period End Date (date picker)
   - Frequency (monthly, bi-weekly, weekly)
   - Employee Filter (optional: department, specific users)
5. HR fills dates (e.g., Jan 1 - Jan 31, 2024)
6. HR clicks "Create"
7. Frontend validates dates
8. Frontend sends `POST /api/payroll/runs`
9. Backend creates payroll_runs row with status = draft
10. Backend logs creation
11. Frontend redirects to payroll run detail
12. Shows: "Payroll Run Created (Draft)"
13. Shows: "Ready to calculate? Click Calculate to proceed"
14. HR clicks "Calculate" button
15. Frontend sends `POST /api/payroll/runs/:id/calculate`
16. Backend:
    - Fetches all active employees (salary configured)
    - For each employee, calculates:
      - Basic salary for period
      - Approved time logs → overtime hours → overtime pay
      - Leave deductions
      - Attendance deductions (if absence penalties)
      - Gross salary = basic + overtime + bonuses - leave deductions
      - Taxes = gross * tax_rate (or formula)
      - Deductions = assigned deductions (fixed + percentage)
      - Net salary = gross - taxes - deductions
      - YTD calculations
    - Creates payslips rows with all calculated amounts
    - Stores summary in payroll_runs: total_gross, total_net, etc.
17. Backend logs calculation completed
18. Frontend shows: "Payroll Calculated"
19. Shows summary card: "Gross: 450,000 | Net: 380,000 | Count: 45 employees"
20. Shows preview table: Sample payslips with calculations
21. HR can:
    - View breakdown by department
    - View warnings (e.g., "Employee X has no salary config")
    - Download preview as Excel
    - Proceed to approval

### Payroll Approval
1. HR clicks "Approve" button on payroll run
2. Modal appears: "Approve Payroll Run?"
3. Shows summary: Gross, Net, Tax, Employee Count
4. HR can add notes: "Approved for Jan 2024"
5. HR clicks "Approve"
6. Frontend sends `POST /api/payroll/runs/:id/approve`
7. Backend updates payroll_runs.status = approved
8. Backend sets approved_by_user_id, approved_at
9. Backend logs approval
10. Notification sent to Finance (if role exists): "Payroll approved, awaiting final processing"
11. Frontend shows: "Status: Approved" with green badge
12. HR can now "Process" payroll

### Payroll Processing
1. HR clicks "Process" button
2. Modal appears: "Process Payroll?"
3. Shows: "This will finalize payslips and mark as ready for payment"
4. Payment method dropdown: Bank Transfer, Check, Cash
5. HR selects method + clicks "Process"
6. Frontend sends `POST /api/payroll/runs/:id/process`
7. Backend:
    - Updates payroll_runs.status = processed
    - Updates all payslips.status = issued
    - Generates PDF payslips for each employee
    - Records issued_date timestamp
    - Creates payment batch (if payment_method set)
    - Logs processing
8. Backend sends email to each employee: "Your payslip is ready"
    - Link to download payslip: `/payroll/payslips/:id`
    - Summary: Gross, Deductions, Net
9. Frontend shows: "Status: Processed"
10. Shows: "45 payslips issued, emails sent"

### User Views Payslip
1. User receives email: "Your payslip for Jan 1-31, 2024 is ready"
2. User clicks link or navigates to `/payroll/payslips`
3. Frontend fetches `GET /api/payroll/payslips?date_from=today-90&date_to=today`
4. Displays list of recent payslips:
   - Period, Gross, Net, Date Issued
   - Action: View, Download
5. User clicks on payslip
6. Navigates to `/payroll/payslips/:id`
7. Frontend fetches payslip detail
8. Displays payslip layout (like PDF):

   **Header**: Company Name, Logo, Pay Period
   
   **Employee Info**: Name, ID, Department, Position
   
   **Earnings Section**:
   - Basic Salary: 15,000
   - Overtime (10 hrs @ 1.5x): 300
   - Bonus: 0
   - **Gross Salary: 15,300**

   **Deductions Section**:
   - Health Insurance: 1,000
   - Pension: 1,000
   - **Total Deductions: 2,000**

   **Taxes Section**:
   - Income Tax: 1,500
   - Social Security: 459
   - **Total Taxes: 1,959**

   **Summary**:
   - **Gross Salary: 15,300**
   - **Total Deductions: 2,000**
   - **Total Taxes: 1,959**
   - **Net Salary: 11,341**

   **YTD (Year-to-Date)**:
   - YTD Gross: 30,600
   - YTD Taxes: 3,918
   - YTD Net: 22,682

9. User can:
   - Download as PDF: `GET /api/payroll/payslips/:id/download`
   - Print
   - Share (email): `POST /api/payroll/payslips/:id/email`
10. File saved or printed

### Payroll Reports
1. Finance/Owner navigates to `/payroll/reports`
2. Options available:
   - Summary Report
   - Department Report
   - Tax Report
   - Payslip Export
3. Clicks "Summary Report"
4. Fetches `GET /api/payroll/reports/summary?date_from=2024-01-01&date_to=2024-01-31`
5. Shows:
   - Period: Jan 1 - Jan 31, 2024
   - Total Employees Paid: 45
   - Total Gross Payroll: 450,000
   - Total Net Payroll: 380,000
   - Total Taxes Withheld: 70,000
6. Can download as CSV/Excel
7. Clicks "Tax Report"
8. Shows tax breakdown: Federal, State, Social Security
9. YTD tax totals
10. Can export for tax filing

## 8. Business Rules

### Hard Constraints
- **Salary Configuration Required**: Cannot process payroll for users without salary config
- **Positive Salary**: salary_amount > 0
- **Valid Frequency**: Must be monthly, bi-weekly, weekly, or daily
- **No Negative Net**: If calculated net < 0, flag as error
- **Approved Time Only**: Only approved time logs count in payroll calculation
- **Payroll Immutable**: Once processed, cannot edit payroll run or payslips
- **Deduction Amount Limit**: Deductions + taxes cannot exceed gross salary (validation check)
- **Valid Multipliers**: Overtime/weekend multipliers >= 1.0
- **YTD Calculations**: YTD must accumulate from beginning of fiscal year

### Soft Constraints
- Payroll should be processed monthly (company policy)
- All salary configs should be reviewed annually
- Deductions should be reviewed quarterly
- Tax rates should be updated when laws change
- Payslips should be issued within 3 days of payroll run end date

## 9. Edge Cases

### Invalid Scenarios
- Attempt to process payroll with no employees → Reject: "No eligible employees"
- Employee has no salary config → Skip employee, warn HR
- Calculated net salary < 0 → Flag error, require manual review
- Deductions > gross salary → Warn: "Deductions exceed gross"
- Retroactive payroll for past period → Allow only with approval
- Employee hired mid-period → Pro-rate salary for partial period
- Hourly employee with no time logs → Gross salary = 0 (if no minimum guarantee)

### Recovery Paths
- Payroll calculation error → Reject payroll run, fix salary config, recalculate
- Payslip shows wrong amount → HR can regenerate if not yet processed
- Employee disputes payslip → HR can provide details of calculation
- Tax rate incorrect → Update rate, recalculate for current + future periods
- Overpayment detected → HR can issue correction payslip (negative amounts)

## 10. Security Notes

### Access Control
- User can view only own payslips
- Manager cannot view employee payslips (HR/Owner only)
- HR can create/approve/process payroll
- Owner can override approvals
- Finance can audit but not modify

### Validation
- All monetary amounts validated as decimal, >= 0
- Tax calculations audited for accuracy
- Multipliers validated: >= 1.0
- Deduction percentages: 0-100
- Salary frequency validated against enum
- All calculations server-side (client-side UI only)

### Audit Logging
- Every salary config created/updated logged
- Every payroll run state change logged
- Every payslip generation logged
- Approval chain logged with approver/timestamp
- Calculations logged with parameters for audit trail

### Data Privacy
- Payslips encrypted at rest (sensitive financial data)
- Payslip PDFs can only be accessed by user + HR/Owner
- Payroll reports aggregated (no individual detail visible to managers)
- No payroll data in general reports visible to non-finance users
- Archive payslips for 7+ years (legal/tax requirement)

### Financial Security
- Double-check payroll calculations: Gross = Basic + Additions - Deductions
- Reconcile payroll totals monthly
- Separate approval + processing (2-person rule)
- Audit trail for all changes
- Regular reconciliation with bank payments
