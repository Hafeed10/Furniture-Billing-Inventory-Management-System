# Furniture Billing & Inventory Management System PRD

## Product Name

**Furniture Billing & Inventory Management System**

## Purpose

A Windows desktop application for furniture stores to manage products,
inventory, sales, purchases, customers, suppliers, deliveries, and
invoices.

## Target Users

-   Furniture showrooms
-   Home furniture stores
-   Office furniture dealers
-   Wholesale furniture distributors
-   Custom furniture manufacturers

# Main Modules

## 1. Login

### Features

-   Admin login
-   Sales staff login
-   Manager login
-   Role-based permissions

## 2. Dashboard

### Widgets

-   Today's sales
-   Pending deliveries
-   Pending payments
-   Low-stock items
-   Monthly revenue

## 3. Product Management

### Fields

-   Product Code
-   Barcode (Optional)
-   Product Name
-   Category (Sofa, Bed, Chair, Table, Wardrobe, etc.)
-   Brand
-   Material (Wood, Steel, Plastic, MDF, etc.)
-   Color
-   Size / Dimensions
-   Purchase Price
-   Selling Price
-   GST / Tax
-   Stock Quantity
-   Warehouse Location
-   Product Images

## 4. Customer Management

-   Customer Name
-   Phone Number
-   Address
-   Email
-   GST Number
-   Purchase History
-   Outstanding Balance

## 5. Supplier Management

-   Supplier Details
-   Purchase History
-   Contact Information
-   Payment Status

## 6. Sales & Billing

-   Search Products
-   Add Items to Invoice
-   Quantity Selection
-   Item/Bill Discount
-   GST Calculation
-   Delivery Charge
-   Installation Charge
-   Advance Payment
-   Balance Due
-   Cash / Card / UPI Payments
-   Print Invoice

## 7. Delivery Management

-   Delivery Date
-   Delivery Address
-   Delivery Status
-   Driver Details
-   Installation Status

## 8. Purchase Management

-   Record Purchases
-   Automatic Stock Update
-   Supplier Invoices
-   Purchase Returns

## 9. Inventory

-   Current Stock
-   Low Stock Alerts
-   Stock Adjustments
-   Warehouse Tracking

## 10. Reports

-   Daily Sales
-   Monthly Sales
-   Product-wise Sales
-   Profit Report
-   Customer Balance Report
-   Purchase Report
-   GST Report
-   Inventory Report

## 11. User Management

-   Admin
-   Manager
-   Sales Executive
-   Accountant

## 12. Settings

-   Store Name & Logo
-   GST Settings
-   Invoice Format
-   Printer Settings
-   Backup & Restore

# Suggested Technology Stack

  Layer              Technology                  Purpose
  ------------------ --------------------------- ---------------------
  Frontend           React.js + TypeScript       User Interface
  UI Components      Material UI (MUI)           Responsive UI
  State Management   Redux Toolkit / Zustand     Application State
  Routing            React Router                Navigation
  Forms              React Hook Form + Zod       Validation
  Backend            Node.js + Express.js        REST API
  Authentication     Supabase Auth               User Authentication
  Database           Supabase PostgreSQL         Business Data
  Storage            Supabase Storage            Images & Documents
  Realtime           Supabase Realtime           Live Updates
  Reporting          PDFKit / Puppeteer          PDF Invoices
  Charts             Recharts                    Analytics
  Desktop            Electron                    Windows Desktop App
  Deployment         Docker + Nginx (Optional)   Self-hosting

# Database Tables

-   Users
-   Customers
-   Suppliers
-   Categories
-   Products
-   Purchases
-   PurchaseItems
-   Sales
-   SaleItems
-   Payments
-   Deliveries
-   StockTransactions

# Future Features

-   Multi-branch Support
-   Barcode Scanning
-   QR Code Payments
-   EMI / Payment Plans
-   Customer Loyalty Program
-   Mobile App for Sales Staff
-   Cloud Backup & Synchronization
