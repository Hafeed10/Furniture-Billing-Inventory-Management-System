// Types for Database Entities

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'manager' | 'sales' | 'accountant';
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  code: string;
  barcode?: string;
  name: string;
  categoryId: string;
  brand: string;
  material: string;
  color: string;
  size: string;
  purchasePrice: number;
  sellingPrice: number;
  gstRate: number; // e.g. 18 for 18%
  stockQty: number;
  warehouseLocation: string;
  image?: string; // base64 or URL
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  gstNumber?: string;
  outstandingBalance: number;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  contactPerson: string;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  saleDate: string; // ISO string
  subtotal: number;
  discount: number;
  gstAmount: number;
  deliveryCharge: number;
  installationCharge: number;
  advancePayment: number;
  balanceDue: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI';
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
  createdBy: string; // User ID
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  quantity: number;
  sellingPrice: number;
  purchasePrice: number;
  gstRate: number;
  gstAmount: number;
  total: number;
}

export interface Purchase {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  purchaseDate: string;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending';
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  productName: string;
  quantity: number;
  purchasePrice: number;
  total: number;
}

export interface Delivery {
  id: string;
  saleId: string;
  deliveryDate: string;
  deliveryAddress: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  driverName?: string;
  installationStatus: 'Pending' | 'Installed';
}

export interface StockTransaction {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  date: string;
  referenceId?: string; // saleId, purchaseId, or 'audit'
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  logoText: string;
  address: string;
  phone: string;
  email: string;
  gstNumber: string;
  defaultGstRate: number;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  nextPurchaseNumber: number;
}

// Initial Seed Data
const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Sofas & Recliners' },
  { id: 'cat-2', name: 'Beds & Wardrobes' },
  { id: 'cat-3', name: 'Dining Tables' },
  { id: 'cat-4', name: 'Office Chairs & Desks' },
  { id: 'cat-5', name: 'TV Units & Cabinets' }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    code: 'SOF-TEK-03',
    barcode: '890123456001',
    name: 'Teak Wood 3-Seater Sofa',
    categoryId: 'cat-1',
    brand: 'RoyalOak',
    material: 'Teak Wood & Fabric',
    color: 'Royal Blue',
    size: '72 x 34 x 32 inches',
    purchasePrice: 18000,
    sellingPrice: 28500,
    gstRate: 18,
    stockQty: 8,
    warehouseLocation: 'Bay A-3',
    image: ''
  },
  {
    id: 'prod-2',
    code: 'BED-KIN-STR',
    barcode: '890123456002',
    name: 'King Size Hydraulic Storage Bed',
    categoryId: 'cat-2',
    brand: 'Sleepwell',
    material: 'Engineered Wood',
    color: 'Walnut Finish',
    size: '78 x 72 x 36 inches',
    purchasePrice: 22000,
    sellingPrice: 35000,
    gstRate: 18,
    stockQty: 4,
    warehouseLocation: 'Bay B-1',
    image: ''
  },
  {
    id: 'prod-3',
    code: 'CHR-OFF-ERG',
    barcode: '890123456003',
    name: 'Ergonomic High-Back Office Chair',
    categoryId: 'cat-4',
    brand: 'Featherlite',
    material: 'Nylon Mesh & Metal',
    color: 'Charcoal Black',
    size: '26 x 26 x 48 inches',
    purchasePrice: 4500,
    sellingPrice: 7800,
    gstRate: 18,
    stockQty: 15,
    warehouseLocation: 'Bay D-4',
    image: ''
  },
  {
    id: 'prod-4',
    code: 'DIN-GLS-06',
    barcode: '890123456004',
    name: 'Glass Top 6-Seater Dining Table',
    categoryId: 'cat-3',
    brand: 'Durian',
    material: 'Tempered Glass & Solid Wood',
    color: 'Mahogany Finish',
    size: '60 x 36 x 30 inches',
    purchasePrice: 15000,
    sellingPrice: 24900,
    gstRate: 18,
    stockQty: 2,
    warehouseLocation: 'Bay C-2',
    image: ''
  },
  {
    id: 'prod-5',
    code: 'CAB-TV-MDN',
    barcode: '890123456005',
    name: 'Modern TV Console Cabinet',
    categoryId: 'cat-5',
    brand: 'Godrej Interio',
    material: 'MDF & Oak Veneer',
    color: 'Teak & White',
    size: '48 x 16 x 20 inches',
    purchasePrice: 6000,
    sellingPrice: 9900,
    gstRate: 18,
    stockQty: 12,
    warehouseLocation: 'Bay E-1',
    image: ''
  },
  {
    id: 'prod-6',
    code: 'WRD-PLY-4D',
    barcode: '890123456006',
    name: '4-Door Plywood Wardrobe',
    categoryId: 'cat-2',
    brand: 'Durian',
    material: 'Plywood & Laminate',
    color: 'Oak Finish',
    size: '72 x 20 x 78 inches',
    purchasePrice: 28000,
    sellingPrice: 42000,
    gstRate: 18,
    stockQty: 3,
    warehouseLocation: 'Bay B-3',
    image: ''
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Ananya Sharma',
    phone: '9876543210',
    address: 'Flat 402, Green Glen Layout, Bangalore',
    email: 'ananya.sharma@example.com',
    gstNumber: '29ABCDE1234F1Z5',
    outstandingBalance: 0
  },
  {
    id: 'cust-2',
    name: 'Rajesh Patel',
    phone: '9823456789',
    address: '12, MG Road, Pune',
    email: 'rajesh.patel@example.com',
    outstandingBalance: 6500
  },
  {
    id: 'cust-3',
    name: 'Vikram Singh',
    phone: '9112345678',
    address: 'Sector 15, Noida, UP',
    email: 'vikram.singh@example.com',
    outstandingBalance: 0
  }
];

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'supp-1',
    name: 'Apex Wood Crafts',
    phone: '8023456789',
    address: 'Industrial Area, Phase 2, Jaipur, Rajasthan',
    email: 'info@apexwoodcrafts.com',
    contactPerson: 'Harish Mehta'
  },
  {
    id: 'supp-2',
    name: 'Comfort Foam & Fabric Co.',
    phone: '2287654321',
    address: 'MIDC, Andheri East, Mumbai',
    email: 'sales@comfortfoam.com',
    contactPerson: 'Sanjay Jain'
  }
];

// Settings
const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'DecoCraft Furnishers',
  logoText: '🛋️ DecoCraft',
  address: '100 Feet Ring Road, JP Nagar 3rd Phase, Bangalore - 560078',
  phone: '+91 80 4912 3456',
  email: 'billing@decocraft.com',
  gstNumber: '29AAAAA1111A1Z1',
  defaultGstRate: 18,
  invoicePrefix: 'DC-INV-',
  nextInvoiceNumber: 104,
  nextPurchaseNumber: 102
};

// Seed historical sales & purchases over the past 3 months
const seedSales = (): { sales: Sale[]; saleItems: SaleItem[]; deliveries: Delivery[]; transactions: StockTransaction[] } => {
  const sales: Sale[] = [];
  const saleItems: SaleItem[] = [];
  const deliveries: Delivery[] = [];
  const transactions: StockTransaction[] = [];

  const now = new Date();
  
  // Sale 1: 45 days ago
  const date1 = new Date();
  date1.setDate(now.getDate() - 45);
  const s1Id = 'sale-1';
  sales.push({
    id: s1Id,
    invoiceNumber: 'DC-INV-101',
    customerId: 'cust-1',
    saleDate: date1.toISOString(),
    subtotal: 28500,
    discount: 1500,
    gstAmount: 4860, // 18% of (28500 - 1500)
    deliveryCharge: 800,
    installationCharge: 500,
    advancePayment: 32660,
    balanceDue: 0,
    totalAmount: 32660, // (27000 + 4860 + 800 + 500)
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    createdBy: 'user-sales'
  });
  saleItems.push({
    id: 'sitem-1',
    saleId: s1Id,
    productId: 'prod-1',
    productName: 'Teak Wood 3-Seater Sofa',
    quantity: 1,
    sellingPrice: 28500,
    purchasePrice: 18000,
    gstRate: 18,
    gstAmount: 4860,
    total: 32660
  });
  deliveries.push({
    id: 'del-1',
    saleId: s1Id,
    deliveryDate: date1.toISOString(),
    deliveryAddress: 'Flat 402, Green Glen Layout, Bangalore',
    status: 'Delivered',
    driverName: 'Ramesh Singh',
    installationStatus: 'Installed'
  });
  transactions.push({
    id: 'tx-1',
    productId: 'prod-1',
    type: 'out',
    quantity: 1,
    date: date1.toISOString(),
    referenceId: s1Id,
    notes: 'Sale DC-INV-101'
  });

  // Sale 2: 20 days ago
  const date2 = new Date();
  date2.setDate(now.getDate() - 20);
  const s2Id = 'sale-2';
  sales.push({
    id: s2Id,
    invoiceNumber: 'DC-INV-102',
    customerId: 'cust-2',
    saleDate: date2.toISOString(),
    subtotal: 35000,
    discount: 2000,
    gstAmount: 5940, // 18% of (35000 - 2000)
    deliveryCharge: 1200,
    installationCharge: 800,
    advancePayment: 34440,
    balanceDue: 6500, // Total = 33000 + 5940 + 1200 + 800 = 40940. Paid 34440.
    totalAmount: 40940,
    paymentMethod: 'Card',
    paymentStatus: 'Partial',
    createdBy: 'user-sales'
  });
  saleItems.push({
    id: 'sitem-2',
    saleId: s2Id,
    productId: 'prod-2',
    productName: 'King Size Hydraulic Storage Bed',
    quantity: 1,
    sellingPrice: 35000,
    purchasePrice: 22000,
    gstRate: 18,
    gstAmount: 5940,
    total: 40940
  });
  deliveries.push({
    id: 'del-2',
    saleId: s2Id,
    deliveryDate: date2.toISOString(),
    deliveryAddress: '12, MG Road, Pune',
    status: 'Delivered',
    driverName: 'Amit Kumar',
    installationStatus: 'Installed'
  });
  transactions.push({
    id: 'tx-2',
    productId: 'prod-2',
    type: 'out',
    quantity: 1,
    date: date2.toISOString(),
    referenceId: s2Id,
    notes: 'Sale DC-INV-102'
  });

  // Sale 3: 1 day ago (Pending delivery & payment)
  const date3 = new Date();
  date3.setDate(now.getDate() - 1);
  const s3Id = 'sale-3';
  sales.push({
    id: s3Id,
    invoiceNumber: 'DC-INV-103',
    customerId: 'cust-3',
    saleDate: date3.toISOString(),
    subtotal: 15600, // 2 office chairs
    discount: 600,
    gstAmount: 2700, // 18% of (15600 - 600)
    deliveryCharge: 500,
    installationCharge: 0,
    advancePayment: 18200,
    balanceDue: 0,
    totalAmount: 18200,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    createdBy: 'user-sales'
  });
  saleItems.push({
    id: 'sitem-3',
    saleId: s3Id,
    productId: 'prod-3',
    productName: 'Ergonomic High-Back Office Chair',
    quantity: 2,
    sellingPrice: 7800,
    purchasePrice: 4500,
    gstRate: 18,
    gstAmount: 2700,
    total: 18200
  });
  deliveries.push({
    id: 'del-3',
    saleId: s3Id,
    deliveryDate: date3.toISOString(),
    deliveryAddress: 'Sector 15, Noida, UP',
    status: 'Pending',
    installationStatus: 'Pending'
  });
  transactions.push({
    id: 'tx-3',
    productId: 'prod-3',
    type: 'out',
    quantity: 2,
    date: date3.toISOString(),
    referenceId: s3Id,
    notes: 'Sale DC-INV-103'
  });

  return { sales, saleItems, deliveries, transactions };
};

const seedPurchases = (): { purchases: Purchase[]; purchaseItems: PurchaseItem[]; transactions: StockTransaction[] } => {
  const purchases: Purchase[] = [];
  const purchaseItems: PurchaseItem[] = [];
  const transactions: StockTransaction[] = [];

  const now = new Date();
  const pDate1 = new Date();
  pDate1.setDate(now.getDate() - 30);
  const p1Id = 'purch-1';

  purchases.push({
    id: p1Id,
    purchaseNumber: 'DC-PUR-101',
    supplierId: 'supp-1',
    purchaseDate: pDate1.toISOString(),
    totalAmount: 90000, // 5 Teak Wood Sofa frames
    paymentStatus: 'Paid'
  });

  purchaseItems.push({
    id: 'pitem-1',
    purchaseId: p1Id,
    productId: 'prod-1',
    productName: 'Teak Wood 3-Seater Sofa',
    quantity: 5,
    purchasePrice: 18000,
    total: 90000
  });

  transactions.push({
    id: 'ptx-1',
    productId: 'prod-1',
    type: 'in',
    quantity: 5,
    date: pDate1.toISOString(),
    referenceId: p1Id,
    notes: 'Purchase DC-PUR-101'
  });

  return { purchases, purchaseItems, transactions };
};

// Database Initialization Helper
export const initDb = () => {
  if (!localStorage.getItem('dc_settings')) {
    localStorage.setItem('dc_settings', JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem('dc_categories')) {
    localStorage.setItem('dc_categories', JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem('dc_products')) {
    localStorage.setItem('dc_products', JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem('dc_customers')) {
    localStorage.setItem('dc_customers', JSON.stringify(INITIAL_CUSTOMERS));
  }
  if (!localStorage.getItem('dc_suppliers')) {
    localStorage.setItem('dc_suppliers', JSON.stringify(INITIAL_SUPPLIERS));
  }

  // Seed transactions
  if (!localStorage.getItem('dc_sales')) {
    const data = seedSales();
    localStorage.setItem('dc_sales', JSON.stringify(data.sales));
    localStorage.setItem('dc_sale_items', JSON.stringify(data.saleItems));
    localStorage.setItem('dc_deliveries', JSON.stringify(data.deliveries));
    localStorage.setItem('dc_stock_transactions', JSON.stringify(data.transactions));
  }

  if (!localStorage.getItem('dc_purchases')) {
    const data = seedPurchases();
    localStorage.setItem('dc_purchases', JSON.stringify(data.purchases));
    localStorage.setItem('dc_purchase_items', JSON.stringify(data.purchaseItems));

    // Append to existing stock transactions
    const existingTx = JSON.parse(localStorage.getItem('dc_stock_transactions') || '[]');
    localStorage.setItem('dc_stock_transactions', JSON.stringify([...existingTx, ...data.transactions]));
  }
};

// Database Access Functions
export const db = {
  getSettings: (): StoreSettings => {
    initDb();
    return JSON.parse(localStorage.getItem('dc_settings')!);
  },
  saveSettings: (settings: StoreSettings) => {
    localStorage.setItem('dc_settings', JSON.stringify(settings));
  },
  getCategories: (): Category[] => {
    initDb();
    return JSON.parse(localStorage.getItem('dc_categories')!);
  },
  saveCategory: (category: Category) => {
    const list = db.getCategories();
    const idx = list.findIndex(c => c.id === category.id);
    if (idx >= 0) list[idx] = category;
    else list.push(category);
    localStorage.setItem('dc_categories', JSON.stringify(list));
  },
  getProducts: (): Product[] => {
    initDb();
    return JSON.parse(localStorage.getItem('dc_products')!);
  },
  saveProduct: (product: Product) => {
    const list = db.getProducts();
    const idx = list.findIndex(p => p.id === product.id);
    if (idx >= 0) list[idx] = product;
    else list.push(product);
    localStorage.setItem('dc_products', JSON.stringify(list));
  },
  deleteProduct: (id: string) => {
    const list = db.getProducts();
    const filtered = list.filter(p => p.id !== id);
    localStorage.setItem('dc_products', JSON.stringify(filtered));
  },
  getCustomers: (): Customer[] => {
    initDb();
    return JSON.parse(localStorage.getItem('dc_customers')!);
  },
  saveCustomer: (customer: Customer) => {
    const list = db.getCustomers();
    const idx = list.findIndex(c => c.id === customer.id);
    if (idx >= 0) list[idx] = customer;
    else list.push(customer);
    localStorage.setItem('dc_customers', JSON.stringify(list));
  },
  getSuppliers: (): Supplier[] => {
    initDb();
    return JSON.parse(localStorage.getItem('dc_suppliers')!);
  },
  saveSupplier: (supplier: Supplier) => {
    const list = db.getSuppliers();
    const idx = list.findIndex(s => s.id === supplier.id);
    if (idx >= 0) list[idx] = supplier;
    else list.push(supplier);
    localStorage.setItem('dc_suppliers', JSON.stringify(list));
  },
  getSales: (): Sale[] => {
    initDb();
    return JSON.parse(localStorage.getItem('dc_sales')!);
  },
  getSaleItems: (): SaleItem[] => {
    initDb();
    return JSON.parse(localStorage.getItem('dc_sale_items')!);
  },
  getPurchases: (): Purchase[] => {
    initDb();
    return JSON.parse(localStorage.getItem('dc_purchases')!);
  },
  getPurchaseItems: (): PurchaseItem[] => {
    initDb();
    return JSON.parse(localStorage.getItem('dc_purchase_items')!);
  },
  getDeliveries: (): Delivery[] => {
    initDb();
    return JSON.parse(localStorage.getItem('dc_deliveries')!);
  },
  saveDelivery: (delivery: Delivery) => {
    const list = db.getDeliveries();
    const idx = list.findIndex(d => d.id === delivery.id);
    if (idx >= 0) list[idx] = delivery;
    else list.push(delivery);
    localStorage.setItem('dc_deliveries', JSON.stringify(list));
  },
  getStockTransactions: (): StockTransaction[] => {
    initDb();
    return JSON.parse(localStorage.getItem('dc_stock_transactions')!);
  },

  // Record a complete Sale (debiting stock, creating stock transactions, adding sale/items, adding delivery, updating customer balance)
  recordSale: (
    saleData: Omit<Sale, 'id' | 'invoiceNumber' | 'saleDate'>,
    items: Omit<SaleItem, 'id' | 'saleId'>[]
  ): Sale => {
    const settings = db.getSettings();
    const invoiceNumber = `${settings.invoicePrefix}${settings.nextInvoiceNumber}`;
    const saleId = `sale-${Date.now()}`;
    const saleDate = new Date().toISOString();

    const newSale: Sale = {
      ...saleData,
      id: saleId,
      invoiceNumber,
      saleDate
    };

    // Save sale
    const salesList = db.getSales();
    salesList.push(newSale);
    localStorage.setItem('dc_sales', JSON.stringify(salesList));

    // Save sale items & Stock Transactions & update stock quantities
    const saleItemsList = db.getSaleItems();
    const productsList = db.getProducts();
    const txList = db.getStockTransactions();

    items.forEach((item, index) => {
      const sItem: SaleItem = {
        ...item,
        id: `sitem-${Date.now()}-${index}`,
        saleId
      };
      saleItemsList.push(sItem);

      // Decrement product stock
      const pIdx = productsList.findIndex(p => p.id === item.productId);
      if (pIdx >= 0) {
        productsList[pIdx].stockQty = Math.max(0, productsList[pIdx].stockQty - item.quantity);
      }

      // Add Stock transaction
      txList.push({
        id: `tx-${Date.now()}-${index}`,
        productId: item.productId,
        type: 'out',
        quantity: item.quantity,
        date: saleDate,
        referenceId: saleId,
        notes: `Sale ${invoiceNumber}`
      });
    });

    localStorage.setItem('dc_sale_items', JSON.stringify(saleItemsList));
    localStorage.setItem('dc_products', JSON.stringify(productsList));
    localStorage.setItem('dc_stock_transactions', JSON.stringify(txList));

    // Update Customer Outstanding balance
    if (newSale.balanceDue > 0) {
      const customerList = db.getCustomers();
      const cIdx = customerList.findIndex(c => c.id === newSale.customerId);
      if (cIdx >= 0) {
        customerList[cIdx].outstandingBalance += newSale.balanceDue;
        localStorage.setItem('dc_customers', JSON.stringify(customerList));
      }
    }

    // Create a Delivery entry if there is a shipping/delivery address
    const cust = db.getCustomers().find(c => c.id === newSale.customerId);
    const deliveriesList = db.getDeliveries();
    deliveriesList.push({
      id: `del-${Date.now()}`,
      saleId,
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString(), // Estimated 2 days from now
      deliveryAddress: cust ? cust.address : 'Store Pickup',
      status: 'Pending',
      installationStatus: 'Pending'
    });
    localStorage.setItem('dc_deliveries', JSON.stringify(deliveriesList));

    // Update Invoice counter
    settings.nextInvoiceNumber += 1;
    db.saveSettings(settings);

    return newSale;
  },

  // Record a Supplier Purchase (crediting stock, creating stock transactions, adding purchase/items)
  recordPurchase: (
    purchaseData: Omit<Purchase, 'id' | 'purchaseNumber' | 'purchaseDate'>,
    items: Omit<PurchaseItem, 'id' | 'purchaseId'>[]
  ): Purchase => {
    const settings = db.getSettings();
    const purchaseNumber = `DC-PUR-${settings.nextPurchaseNumber}`;
    const purchaseId = `purch-${Date.now()}`;
    const purchaseDate = new Date().toISOString();

    const newPurchase: Purchase = {
      ...purchaseData,
      id: purchaseId,
      purchaseNumber,
      purchaseDate
    };

    // Save purchase
    const purchasesList = db.getPurchases();
    purchasesList.push(newPurchase);
    localStorage.setItem('dc_purchases', JSON.stringify(purchasesList));

    // Save items & stock
    const purchaseItemsList = db.getPurchaseItems();
    const productsList = db.getProducts();
    const txList = db.getStockTransactions();

    items.forEach((item, index) => {
      const pItem: PurchaseItem = {
        ...item,
        id: `pitem-${Date.now()}-${index}`,
        purchaseId
      };
      purchaseItemsList.push(pItem);

      // Increment product stock
      const pIdx = productsList.findIndex(p => p.id === item.productId);
      if (pIdx >= 0) {
        productsList[pIdx].stockQty += item.quantity;
      }

      // Add stock transaction
      txList.push({
        id: `tx-${Date.now()}-${index}`,
        productId: item.productId,
        type: 'in',
        quantity: item.quantity,
        date: purchaseDate,
        referenceId: purchaseId,
        notes: `Purchase ${purchaseNumber}`
      });
    });

    localStorage.setItem('dc_purchase_items', JSON.stringify(purchaseItemsList));
    localStorage.setItem('dc_products', JSON.stringify(productsList));
    localStorage.setItem('dc_stock_transactions', JSON.stringify(txList));

    // Update settings
    settings.nextPurchaseNumber += 1;
    db.saveSettings(settings);

    return newPurchase;
  },

  // Adjust product stock directly
  adjustStock: (productId: string, quantity: number, type: 'in' | 'out' | 'adjustment', notes: string) => {
    const productsList = db.getProducts();
    const pIdx = productsList.findIndex(p => p.id === productId);
    if (pIdx >= 0) {
      const product = productsList[pIdx];
      if (type === 'in') {
        product.stockQty += quantity;
      } else if (type === 'out') {
        product.stockQty = Math.max(0, product.stockQty - quantity);
      } else if (type === 'adjustment') {
        product.stockQty = quantity; // Absolute adjustment
      }
      localStorage.setItem('dc_products', JSON.stringify(productsList));

      // Record transaction
      const txList = db.getStockTransactions();
      txList.push({
        id: `tx-${Date.now()}`,
        productId,
        type,
        quantity,
        date: new Date().toISOString(),
        referenceId: 'audit',
        notes
      });
      localStorage.setItem('dc_stock_transactions', JSON.stringify(txList));
    }
  },

  // Record a Customer payment to settle outstanding balance
  recordCustomerPayment: (customerId: string, amountPaid: number) => {
    const customerList = db.getCustomers();
    const cIdx = customerList.findIndex(c => c.id === customerId);
    if (cIdx >= 0) {
      customerList[cIdx].outstandingBalance = Math.max(0, customerList[cIdx].outstandingBalance - amountPaid);
      localStorage.setItem('dc_customers', JSON.stringify(customerList));
    }
  },

  // Export full database as string
  exportBackup: (): string => {
    initDb();
    const backupObj = {
      settings: JSON.parse(localStorage.getItem('dc_settings')!),
      categories: JSON.parse(localStorage.getItem('dc_categories')!),
      products: JSON.parse(localStorage.getItem('dc_products')!),
      customers: JSON.parse(localStorage.getItem('dc_customers')!),
      suppliers: JSON.parse(localStorage.getItem('dc_suppliers')!),
      sales: JSON.parse(localStorage.getItem('dc_sales')!),
      sale_items: JSON.parse(localStorage.getItem('dc_sale_items')!),
      purchases: JSON.parse(localStorage.getItem('dc_purchases')!),
      purchase_items: JSON.parse(localStorage.getItem('dc_purchase_items')!),
      deliveries: JSON.parse(localStorage.getItem('dc_deliveries')!),
      stock_transactions: JSON.parse(localStorage.getItem('dc_stock_transactions')!)
    };
    return JSON.stringify(backupObj, null, 2);
  },

  // Import database from string
  importBackup: (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (
        data.settings &&
        data.products &&
        data.categories &&
        data.customers &&
        data.suppliers &&
        data.sales
      ) {
        localStorage.setItem('dc_settings', JSON.stringify(data.settings));
        localStorage.setItem('dc_categories', JSON.stringify(data.categories));
        localStorage.setItem('dc_products', JSON.stringify(data.products));
        localStorage.setItem('dc_customers', JSON.stringify(data.customers));
        localStorage.setItem('dc_suppliers', JSON.stringify(data.suppliers));
        localStorage.setItem('dc_sales', JSON.stringify(data.sales));
        localStorage.setItem('dc_sale_items', JSON.stringify(data.sale_items || []));
        localStorage.setItem('dc_purchases', JSON.stringify(data.purchases || []));
        localStorage.setItem('dc_purchase_items', JSON.stringify(data.purchase_items || []));
        localStorage.setItem('dc_deliveries', JSON.stringify(data.deliveries || []));
        localStorage.setItem('dc_stock_transactions', JSON.stringify(data.stock_transactions || []));
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
