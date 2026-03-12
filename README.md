Main tables WE NEED

1) users
id
name
email
password
role
created_at
updated_at

2) categories
id
name
created_at
updated_at

3) products
id
category_id
name
barcode
price
stock
image
description
status
created_at
updated_at

4) customers //optional
id
name
phone
email
address
created_at
updated_at

5) sales
id
invoice_no
customer_id
user_id
sale_date
subtotal
discount
tax
total
paid_amount
balance
payment_method
created_at
updated_at

6) sale_items

id
sale_id
product_id
quantity
price
total
created_at
updated_at


//Models we need 

User.php
Category.php
Product.php
Customer.php
Sale.php
SaleItem.php

//Controllers we need

CategoryController
ProductController
CustomerController
SaleController
DashboardController
UserController
ReportController


//PAGES FOR ADMIN
Dashboard
Categories
Products
Customers
POS / New Sale
Sales History
Reports
Users
Settings
Logout


//PAGES FOR CESHIER:
Dashboard
POS / New Sale
Sales History
Logout


EASY DEVLPMNT ORDR

Phase 1
Auth system
Dashboard layout

Phase 2
Category CRUD

Phase 3
Product CRUD

Phase 4
Customer CRUD

Phase 5
POS sale page

Phase 6
Save sale + sale items

Phase 7
Stock reduction logic

Phase 8
Sales history

Phase 9
Reports

Phase 10
User roles and permissions