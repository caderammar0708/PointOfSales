==============================================
  POS SYSTEM - FULL STRUCTURE (IMPROVED)
==============================================

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DATABASE TABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1) users
   - id
   - name
   - email
   - password
   - role          (enum: 'admin', 'manager', 'cashier')
   - is_active     ← NEW: disable user without deleting
   - remember_token
   - created_at
   - updated_at

2) categories
   - id
   - name
   - description   ← NEW: optional but useful
   - created_at
   - updated_at

3) products
   - id
   - category_id
   - name
   - barcode
   - price
   - cost_price    ← NEW: for profit calculation in reports
   - stock
   - low_stock_alert  ← NEW: warn when stock is low
   - unit          ← NEW: pcs / kg / litre etc.
   - image
   - description
   - status        (enum: 'active', 'inactive')
   - created_at
   - updated_at

4) customers
   - id
   - name
   - phone
   - email
   - address
   - created_at
   - updated_at

5) sales
   - id
   - invoice_no      (unique)
   - customer_id     (nullable → walk-in customer)
   - user_id         (cashier who made the sale)
   - sale_date
   - subtotal
   - discount
   - tax
   - total
   - paid_amount
   - balance
   - payment_method  (enum: 'cash', 'card', 'online')
   - status          ← NEW (enum: 'completed', 'refunded', 'pending')
   - note            ← NEW: optional sale note
   - created_at
   - updated_at

6) sale_items
   - id
   - sale_id
   - product_id
   - quantity
   - unit_price      ← renamed from 'price' for clarity
   - discount        ← NEW: per-item discount
   - total
   - created_at
   - updated_at

7) stock_movements   ← NEW TABLE (very important)
   - id
   - product_id
   - type            (enum: 'sale', 'manual_in', 'manual_out', 'return')
   - quantity
   - reference_id    (sale_id or null)
   - note
   - user_id
   - created_at
   - updated_at

8) settings          ← NEW TABLE
   - id
   - key             (e.g. 'shop_name', 'tax_rate', 'currency')
   - value
   - created_at
   - updated_at


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MODELS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User.php
Category.php
Product.php
Customer.php
Sale.php
SaleItem.php
StockMovement.php   ← NEW
Setting.php         ← NEW


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CONTROLLERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AuthController          (handled by Breeze)
DashboardController
CategoryController
ProductController
CustomerController
SaleController
SaleItemController
StockMovementController ← NEW
ReportController
UserController
SettingController       ← NEW


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MIDDLEWARE / HELPERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CheckRole middleware     ← to protect routes by role
  e.g. Route::middleware('role:admin')


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PAGES (REACT / INERTIA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ADMIN:
  ├── Dashboard
  ├── Categories (index, create, edit)
  ├── Products   (index, create, edit)
  ├── Customers  (index, create, edit)
  ├── POS / New Sale
  ├── Sales History  (index, show/detail)
  ├── Stock Movements         ← NEW
  ├── Reports
  │     ├── Daily Sales
  │     ├── Product Sales
  │     └── Profit Report     ← NEW
  ├── Users      (index, create, edit)
  ├── Settings
  └── Logout

CASHIER:
  ├── Dashboard  (simple, shows today's sales)
  ├── POS / New Sale
  ├── Sales History  (own sales only)
  └── Logout


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DEVELOPMENT PHASES (REORDERED & IMPROVED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 1 — Foundation
  ✔ Laravel Breeze + Inertia + React setup
  ✔ Role field in users table
  ✔ CheckRole middleware
  ✔ Main layout (sidebar, topbar)
  ✔ Role-based route protection

Phase 2 — Settings
  ✔ Settings table + seeder (tax, shop name, currency)
  ✔ Settings page (admin only)

Phase 3 — Category CRUD
  ✔ Migration, Model, Controller, Pages

Phase 4 — Product CRUD
  ✔ Migration, Model, Controller, Pages
  ✔ Image upload
  ✔ Low stock indicator

Phase 5 — Customer CRUD
  ✔ Migration, Model, Controller, Pages

Phase 6 — POS Sale Page (UI)
  ✔ Product search / barcode scan
  ✔ Cart management
  ✔ Discount, tax, total calc (frontend)

Phase 7 — Save Sale (Backend)
  ✔ Create sale + sale_items
  ✔ Stock reduction logic
  ✔ Stock movement record
  ✔ Invoice number generation

Phase 8 — Sales History
  ✔ List all sales
  ✔ View single sale detail + items
  ✔ Role-based filtering (cashier sees own only)

Phase 9 — Reports
  ✔ Daily / Monthly sales report
  ✔ Best-selling products
  ✔ Profit report (price vs cost_price)

Phase 10 — Stock Management
  ✔ Manual stock adjustment
  ✔ Stock movement history log

Phase 11 — User Management (Admin)
  ✔ Create / edit / deactivate users
  ✔ Role assignment

Phase 12 — Polish & QA
  ✔ Receipt print view
  ✔ Low stock alerts
  ✔ Form validations
  ✔ Error handling
