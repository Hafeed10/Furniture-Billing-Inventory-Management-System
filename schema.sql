-- deco-craft-furniture SQL Schema for Supabase
-- Paste this script directly in the SQL Editor on your Supabase Dashboard

-- 1. DROP existing tables if any to ensure clean init
drop table if exists stock_transactions cascade;
drop table if exists deliveries cascade;
drop table if exists purchase_items cascade;
drop table if exists purchases cascade;
drop table if exists sale_items cascade;
drop table if exists sales cascade;
drop table if exists suppliers cascade;
drop table if exists customers cascade;
drop table if exists products cascade;
drop table if exists categories cascade;
drop table if exists settings cascade;

-- 2. CREATE tables matching billing-software interfaces

-- settings table
create table settings (
  id text primary key default 'default',
  "storeName" text not null,
  "logoText" text not null,
  address text not null,
  phone text not null,
  email text not null,
  "gstNumber" text not null,
  "defaultGstRate" numeric not null,
  "invoicePrefix" text not null,
  "nextInvoiceNumber" numeric not null,
  "nextPurchaseNumber" numeric not null
);

-- categories table
create table categories (
  id text primary key,
  name text not null
);

-- products table
create table products (
  id text primary key,
  code text not null,
  barcode text,
  name text not null,
  "categoryId" text references categories(id) on delete set null,
  brand text,
  material text,
  color text,
  size text,
  "purchasePrice" numeric not null,
  "sellingPrice" numeric not null,
  "gstRate" numeric not null,
  "stockQty" numeric not null,
  "warehouseLocation" text,
  image text
);

-- customers table
create table customers (
  id text primary key,
  name text not null,
  phone text not null,
  address text not null,
  email text not null,
  "gstNumber" text,
  "outstandingBalance" numeric not null default 0
);

-- suppliers table
create table suppliers (
  id text primary key,
  name text not null,
  phone text not null,
  address text not null,
  email text not null,
  "contactPerson" text
);

-- sales table
create table sales (
  id text primary key,
  "invoiceNumber" text not null,
  "customerId" text references customers(id) on delete set null,
  "saleDate" text not null,
  subtotal numeric not null,
  discount numeric not null,
  "gstAmount" numeric not null,
  "deliveryCharge" numeric not null,
  "installationCharge" numeric not null,
  "advancePayment" numeric not null,
  "balanceDue" numeric not null,
  "totalAmount" numeric not null,
  "paymentMethod" text not null,
  "paymentStatus" text not null,
  "createdBy" text not null
);

-- sale_items table
create table sale_items (
  id text primary key,
  "saleId" text references sales(id) on delete cascade,
  "productId" text references products(id) on delete set null,
  "productName" text not null,
  quantity numeric not null,
  "sellingPrice" numeric not null,
  "purchasePrice" numeric not null,
  "gstRate" numeric not null,
  "gstAmount" numeric not null,
  total numeric not null
);

-- purchases table
create table purchases (
  id text primary key,
  "purchaseNumber" text not null,
  "supplierId" text references suppliers(id) on delete set null,
  "purchaseDate" text not null,
  "totalAmount" numeric not null,
  "paymentStatus" text not null
);

-- purchase_items table
create table purchase_items (
  id text primary key,
  "purchaseId" text references purchases(id) on delete cascade,
  "productId" text references products(id) on delete set null,
  "productName" text not null,
  quantity numeric not null,
  "purchasePrice" numeric not null,
  total numeric not null
);

-- deliveries table
create table deliveries (
  id text primary key,
  "saleId" text references sales(id) on delete cascade,
  "deliveryDate" text not null,
  "deliveryAddress" text not null,
  status text not null,
  "driverName" text,
  "installationStatus" text not null
);

-- stock_transactions table
create table stock_transactions (
  id text primary key,
  "productId" text references products(id) on delete set null,
  type text not null,
  quantity numeric not null,
  date text not null,
  "referenceId" text,
  notes text
);

-- 3. DISABLE Row Level Security (RLS) on all tables for public access via anon key
alter table settings disable row level security;
alter table categories disable row level security;
alter table products disable row level security;
alter table customers disable row level security;
alter table suppliers disable row level security;
alter table sales disable row level security;
alter table sale_items disable row level security;
alter table purchases disable row level security;
alter table purchase_items disable row level security;
alter table deliveries disable row level security;
alter table stock_transactions disable row level security;
