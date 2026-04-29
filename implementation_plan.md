# Project CVR Association: Overview & Roadmap

## 1. What We Are Trying to Achieve

The objective is to build a **Full-Scale Enterprise Resource Planning (ERP) and Customer Relationship Management (CRM) System** tailored for the CVR Association. This system is designed to replace fragmented manual processes with a centralized, web-based platform that manages the entire lifecycle of business operations.

### Core Objectives:
*   **Centralized Data Management**: A single source of truth for Masters (Companies, Branches, Banks, etc.), Clients, and Employees.
*   **Operational Efficiency**: Automating registers (Incoming/Outgoing/Visitors) and task management to reduce manual paperwork.
*   **Financial Transparency**: Integrating accounting (Vouchers, Ledgers, Balance Sheets) directly into the workflow.
*   **Role-Based Access**: Providing tailored experiences for Super Admins, Admins, Employees, and Clients through dedicated dashboards.
*   **Mobile Readiness**: Developing dedicated apps for Clients and Employees to interact with the system on the go.

---

## 2. Roadmap for Achievement

### Phase 1: Foundation & Core Masters (Current)
*Focus: Database expansion and standardized Master CRUDs*
- [x] Base SPA Architecture (React + Vite + PHP API).
- [x] Multi-Role Authentication System.
- [ ] **Task**: Implement missing Master tables (Bank, Area, Unit, Dept, Designation, etc.).
- [ ] **Task**: Build unified "Master Management" UI.

### Phase 2: CRM & Task Management
*Focus: Client lifecycle and productivity*
- [ ] **Client Directory 2.0**: Enhanced profiles with document attachments.
- [ ] **Leads & Follow-ups**: Tracking potential clients and interaction history.
- [ ] **Quotations**: Generating and managing client quotes.
- [ ] **Task Engine**: Daily, Weekly, and Monthly task scheduling and assignment.

### Phase 3: Financial & Accounting Module
*Focus: Vouchers, Ledgers, and Basic Bookkeeping*
- [ ] **Voucher System**: Cash, Bank, and Journal Vouchers.
- [ ] **Chart of Accounts**: Defining Ledger Groups and Accounts.
- [ ] **Financial Reports**: Ledger views, Day Book, and Expense tracking.

### Phase 4: HR & Payroll Management
*Focus: Employee lifecycle and compensation*
- [ ] **Employee Profile 2.0**: Document management, Education, and Family details.
- [ ] **Attendance System**: Tracking daily presence and leaves.
- [ ] **Payroll Engine**: Salary calculation, payslip generation, and bonus tracking.

### Phase 5: Inventory, Sales & Purchase
*Focus: Physical goods and transactions*
- [ ] **Inventory Control**: Item Masters, Stock levels, and Low-stock alerts.
- [ ] **Purchase Management**: Purchase Orders (PO) and Supplier management.
- [ ] **Sales Workflow**: Delivery Challans (DC) and Invoicing.

### Phase 6: Advanced Analytics & Reporting
*Focus: Data-driven decision making*
- [ ] **Global Search**: Search across clients, employees, and registers.
- [ ] **Dashboard Charts**: Visualizing sales trends, expenses, and task completion.
- [ ] **Compliance Reports**: GST reports, Professional Tax, and PF/ESI (if applicable).

### Phase 7: Mobile Portals & Final Polish
*Focus: Accessibility and User Experience*
- [ ] **Client Portal App**: Mobile app for clients to view status, quotes, and files.
- [ ] **Employee App**: Mobile app for attendance and task reporting.
- [ ] **System Security Audit**: Permissions refinement and Activity Logs.
- [ ] **Final Deployment**: Production VPS optimization.
