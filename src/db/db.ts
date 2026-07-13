import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = 'https://cruxppwwdjudpzdsoemd.supabase.co';
const supabaseAnonKey = 'sb_publishable_ODAUQowKiS36ONqKOXfDtw_p1BanbJ3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export interface Subscription {
  id: string;
  userId: string;
  planName: string;
  amount: number;
  paymentMethod: string;
  status: string;
  activatedAt: string;
  transactionId: string;
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

// Database Initialization Helper (local cache setup)
export const initDb = () => {
  // We initialize fallback arrays in localStorage so json parsing does not throw exceptions
  if (!localStorage.getItem('dc_settings')) {
    localStorage.setItem('dc_settings', JSON.stringify(INITIAL_SETTINGS));
  }
  const localCats = localStorage.getItem('dc_categories');
  if (!localCats || JSON.parse(localCats).length === 0) {
    localStorage.setItem('dc_categories', JSON.stringify(INITIAL_CATEGORIES));
  }
  const localProducts = localStorage.getItem('dc_products');
  if (!localProducts || JSON.parse(localProducts).length === 0) {
    localStorage.setItem('dc_products', JSON.stringify(INITIAL_PRODUCTS));
  }
  const localCustomers = localStorage.getItem('dc_customers');
  if (!localCustomers || JSON.parse(localCustomers).length === 0) {
    localStorage.setItem('dc_customers', JSON.stringify(INITIAL_CUSTOMERS));
  }
  const localSuppliers = localStorage.getItem('dc_suppliers');
  if (!localSuppliers || JSON.parse(localSuppliers).length === 0) {
    localStorage.setItem('dc_suppliers', JSON.stringify(INITIAL_SUPPLIERS));
  }
  
  // Sales & related history seeding
  const localSales = localStorage.getItem('dc_sales');
  if (!localSales || JSON.parse(localSales).length === 0) {
    const salesData = seedSales();
    localStorage.setItem('dc_sales', JSON.stringify(salesData.sales));
    
    if (!localStorage.getItem('dc_sale_items') || JSON.parse(localStorage.getItem('dc_sale_items')!).length === 0) {
      localStorage.setItem('dc_sale_items', JSON.stringify(salesData.saleItems));
    }
    if (!localStorage.getItem('dc_deliveries') || JSON.parse(localStorage.getItem('dc_deliveries')!).length === 0) {
      localStorage.setItem('dc_deliveries', JSON.stringify(salesData.deliveries));
    }
    if (!localStorage.getItem('dc_stock_transactions') || JSON.parse(localStorage.getItem('dc_stock_transactions')!).length === 0) {
      localStorage.setItem('dc_stock_transactions', JSON.stringify(salesData.transactions));
    }
  } else {
    if (!localStorage.getItem('dc_sale_items')) {
      localStorage.setItem('dc_sale_items', JSON.stringify([]));
    }
    if (!localStorage.getItem('dc_deliveries')) {
      localStorage.setItem('dc_deliveries', JSON.stringify([]));
    }
    if (!localStorage.getItem('dc_stock_transactions')) {
      localStorage.setItem('dc_stock_transactions', JSON.stringify([]));
    }
  }

  // Purchases & related history seeding
  const localPurchases = localStorage.getItem('dc_purchases');
  if (!localPurchases || JSON.parse(localPurchases).length === 0) {
    const purchasesData = seedPurchases();
    localStorage.setItem('dc_purchases', JSON.stringify(purchasesData.purchases));
    
    if (!localStorage.getItem('dc_purchase_items') || JSON.parse(localStorage.getItem('dc_purchase_items')!).length === 0) {
      localStorage.setItem('dc_purchase_items', JSON.stringify(purchasesData.purchaseItems));
    }
    
    const localTxStr = localStorage.getItem('dc_stock_transactions');
    const txList = localTxStr ? JSON.parse(localTxStr) : [];
    purchasesData.transactions.forEach(ptx => {
      if (!txList.some((t: any) => t.id === ptx.id)) {
        txList.push(ptx);
      }
    });
    localStorage.setItem('dc_stock_transactions', JSON.stringify(txList));
  } else {
    if (!localStorage.getItem('dc_purchase_items')) {
      localStorage.setItem('dc_purchase_items', JSON.stringify([]));
    }
  }
};

// Helper function to sync and merge local cache with Supabase tables
const syncTable = async <T extends { id: string }>(
  tableName: string,
  remoteList: T[] | null,
  localKey: string
) => {
  if (!remoteList) return;

  const localStr = localStorage.getItem(localKey);
  const localList: T[] = localStr ? JSON.parse(localStr) : [];

  // Merge remote and local: remote wins in case of ID conflict
  const mergedMap = new Map<string, T>();
  localList.forEach(item => mergedMap.set(item.id, item));
  remoteList.forEach(item => mergedMap.set(item.id, item));

  const mergedList = Array.from(mergedMap.values());
  localStorage.setItem(localKey, JSON.stringify(mergedList));

  // Identify local-only items that need to be sent to Supabase
  const unsyncedItems = localList.filter(
    localItem => !remoteList.some(remoteItem => remoteItem.id === localItem.id)
  );

  if (unsyncedItems.length > 0) {
    console.log(`Syncing ${unsyncedItems.length} local-only items for table '${tableName}' to Supabase...`);
    for (const item of unsyncedItems) {
      const { error } = await supabase.from(tableName).upsert(item);
      if (error) {
        console.warn(`Failed to sync local item ${item.id} in table '${tableName}' to Supabase:`, error);
      }
    }
  }
};

// Database Access Layer with background Supabase sync
export const db = {
  // Supabase Seed Function: seeds the database if it is empty
  checkAndSeedSupabase: async () => {
    try {
      const { data, error } = await supabase.from('settings').select('id');
      if (error) {
        console.warn('Supabase settings table check failed, it might not exist yet:', error);
        return;
      }
      if (!data || data.length === 0) {
        console.log('Supabase tables are empty, seeding database...');
        
        // Seed settings
        await supabase.from('settings').insert({ id: 'default', ...INITIAL_SETTINGS });
        // Seed categories
        await supabase.from('categories').insert(INITIAL_CATEGORIES);
        // Seed products
        await supabase.from('products').insert(INITIAL_PRODUCTS);
        // Seed customers
        await supabase.from('customers').insert(INITIAL_CUSTOMERS);
        // Seed suppliers
        await supabase.from('suppliers').insert(INITIAL_SUPPLIERS);

        // Seed historical sales & purchases
        const salesData = seedSales();
        const purchasesData = seedPurchases();

        if (salesData.sales.length > 0) await supabase.from('sales').insert(salesData.sales);
        if (salesData.saleItems.length > 0) await supabase.from('sale_items').insert(salesData.saleItems);
        if (salesData.deliveries.length > 0) await supabase.from('deliveries').insert(salesData.deliveries);
        
        const combinedTx = [...salesData.transactions, ...purchasesData.transactions];
        if (combinedTx.length > 0) await supabase.from('stock_transactions').insert(combinedTx);

        if (purchasesData.purchases.length > 0) await supabase.from('purchases').insert(purchasesData.purchases);
        if (purchasesData.purchaseItems.length > 0) await supabase.from('purchase_items').insert(purchasesData.purchaseItems);

        console.log('Seeded Supabase database successfully!');
      }
    } catch (err) {
      console.warn('Error during Supabase seeding (check database connection and tables):', err);
    }
  },

  // Supabase Fetch/Sync Function: retrieves everything from Supabase and fills localStorage
  syncFromSupabase: async (triggerUpdate?: () => void) => {
    try {
      const fetchTable = async (tableName: string) => {
        const { data, error } = await supabase.from(tableName).select('*');
        if (error) throw error;
        return data;
      };

      const [
        settings,
        categories,
        products,
        customers,
        suppliers,
        sales,
        saleItems,
        purchases,
        purchaseItems,
        deliveries,
        stockTransactions
      ] = await Promise.all([
        fetchTable('settings'),
        fetchTable('categories'),
        fetchTable('products'),
        fetchTable('customers'),
        fetchTable('suppliers'),
        fetchTable('sales'),
        fetchTable('sale_items'),
        fetchTable('purchases'),
        fetchTable('purchase_items'),
        fetchTable('deliveries'),
        fetchTable('stock_transactions')
      ]);

      if (settings && settings.length > 0) {
        localStorage.setItem('dc_settings', JSON.stringify(settings[0]));
      }

      await Promise.all([
        syncTable('categories', categories, 'dc_categories'),
        syncTable('products', products, 'dc_products'),
        syncTable('customers', customers, 'dc_customers'),
        syncTable('suppliers', suppliers, 'dc_suppliers'),
        syncTable('sales', sales, 'dc_sales'),
        syncTable('sale_items', saleItems, 'dc_sale_items'),
        syncTable('purchases', purchases, 'dc_purchases'),
        syncTable('purchase_items', purchaseItems, 'dc_purchase_items'),
        syncTable('deliveries', deliveries, 'dc_deliveries'),
        syncTable('stock_transactions', stockTransactions, 'dc_stock_transactions')
      ]);

      // Fallback for categories if empty after sync
      const localCatsStr = localStorage.getItem('dc_categories');
      const localCats = localCatsStr ? JSON.parse(localCatsStr) : [];
      if (localCats.length === 0) {
        const INITIAL_CATEGORIES = [
          { id: 'cat-1', name: 'Sofas & Recliners' },
          { id: 'cat-2', name: 'Beds & Wardrobes' },
          { id: 'cat-3', name: 'Dining Tables' },
          { id: 'cat-4', name: 'Office Chairs & Desks' },
          { id: 'cat-5', name: 'TV Units & Cabinets' }
        ];
        localStorage.setItem('dc_categories', JSON.stringify(INITIAL_CATEGORIES));
        for (const cat of INITIAL_CATEGORIES) {
          try {
            const { error } = await supabase.from('categories').upsert(cat);
            if (error) {
              console.error('Seeding category failed:', error);
            }
          } catch (err) {
            console.error('Seeding category failed with exception:', err);
          }
        }
      }

      if (triggerUpdate) {
        triggerUpdate();
      }
      console.log('Successfully synced and merged all tables with Supabase!');
    } catch (err) {
      console.warn('Could not sync from Supabase (tables may not exist or are empty):', err);
    }
  },

  getSettings: (): StoreSettings => {
    initDb();
    return JSON.parse(localStorage.getItem('dc_settings')!);
  },
  saveSettings: (settings: StoreSettings) => {
    localStorage.setItem('dc_settings', JSON.stringify(settings));
    supabase.from('settings').upsert({ id: 'default', ...settings }).then(({ error }) => {
      if (error) console.error('Failed to sync settings to Supabase:', error);
    });
  },
  getCategories: (): Category[] => {
    initDb();
    const categoriesStr = localStorage.getItem('dc_categories');
    let list = categoriesStr ? JSON.parse(categoriesStr) : [];
    if (list.length === 0) {
      list = INITIAL_CATEGORIES;
      localStorage.setItem('dc_categories', JSON.stringify(list));
      INITIAL_CATEGORIES.forEach(cat => {
        supabase.from('categories').upsert(cat).then(({ error }) => {
          if (error) console.error('Seeding category failed:', error);
        });
      });
    }
    return list;
  },
  saveCategory: (category: Category) => {
    const list = db.getCategories();
    const idx = list.findIndex(c => c.id === category.id);
    if (idx >= 0) list[idx] = category;
    else list.push(category);
    localStorage.setItem('dc_categories', JSON.stringify(list));
    supabase.from('categories').upsert(category).then(({ error }) => {
      if (error) console.error('Failed to sync category to Supabase:', error);
    });
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
    supabase.from('products').upsert(product).then(({ error }) => {
      if (error) console.error('Failed to sync product to Supabase:', error);
    });
  },
  deleteProduct: (id: string) => {
    const list = db.getProducts();
    const filtered = list.filter(p => p.id !== id);
    localStorage.setItem('dc_products', JSON.stringify(filtered));
    supabase.from('products').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Failed to delete product from Supabase:', error);
    });
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
    supabase.from('customers').upsert(customer).then(({ error }) => {
      if (error) console.error('Failed to sync customer to Supabase:', error);
    });
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
    supabase.from('suppliers').upsert(supplier).then(({ error }) => {
      if (error) console.error('Failed to sync supplier to Supabase:', error);
    });
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
    supabase.from('deliveries').upsert(delivery).then(({ error }) => {
      if (error) console.error('Failed to sync delivery to Supabase:', error);
    });
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

    // Save sale locally
    const salesList = db.getSales();
    salesList.push(newSale);
    localStorage.setItem('dc_sales', JSON.stringify(salesList));

    // Save sale items & Stock Transactions & update stock quantities locally
    const saleItemsList = db.getSaleItems();
    const productsList = db.getProducts();
    const txList = db.getStockTransactions();

    const dbSaleItems: SaleItem[] = [];
    const dbTxList: StockTransaction[] = [];

    items.forEach((item, index) => {
      const sItem: SaleItem = {
        ...item,
        id: `sitem-${Date.now()}-${index}`,
        saleId
      };
      saleItemsList.push(sItem);
      dbSaleItems.push(sItem);

      // Decrement product stock
      const pIdx = productsList.findIndex(p => p.id === item.productId);
      if (pIdx >= 0) {
        productsList[pIdx].stockQty = Math.max(0, productsList[pIdx].stockQty - item.quantity);
      }

      // Add Stock transaction
      const stx: StockTransaction = {
        id: `tx-${Date.now()}-${index}`,
        productId: item.productId,
        type: 'out',
        quantity: item.quantity,
        date: saleDate,
        referenceId: saleId,
        notes: `Sale ${invoiceNumber}`
      };
      txList.push(stx);
      dbTxList.push(stx);
    });

    localStorage.setItem('dc_sale_items', JSON.stringify(saleItemsList));
    localStorage.setItem('dc_products', JSON.stringify(productsList));
    localStorage.setItem('dc_stock_transactions', JSON.stringify(txList));

    // Update Customer Outstanding balance locally
    if (newSale.balanceDue > 0) {
      const customerList = db.getCustomers();
      const cIdx = customerList.findIndex(c => c.id === newSale.customerId);
      if (cIdx >= 0) {
        customerList[cIdx].outstandingBalance += newSale.balanceDue;
        localStorage.setItem('dc_customers', JSON.stringify(customerList));
      }
    }

    // Create a Delivery entry locally
    const cust = db.getCustomers().find(c => c.id === newSale.customerId);
    const deliveriesList = db.getDeliveries();
    const newDelivery: Delivery = {
      id: `del-${Date.now()}`,
      saleId,
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString(), // Estimated 2 days from now
      deliveryAddress: cust ? cust.address : 'Store Pickup',
      status: 'Pending',
      installationStatus: 'Pending'
    };
    deliveriesList.push(newDelivery);
    localStorage.setItem('dc_deliveries', JSON.stringify(deliveriesList));

    // Update Invoice counter locally
    settings.nextInvoiceNumber += 1;
    localStorage.setItem('dc_settings', JSON.stringify(settings));

    // Sync all writes to Supabase in background
    (async () => {
      try {
        await supabase.from('sales').insert(newSale);
        await supabase.from('sale_items').insert(dbSaleItems);
        
        // Update product stocks
        for (const item of items) {
          const p = productsList.find(x => x.id === item.productId);
          if (p) await supabase.from('products').upsert(p);
        }
        
        await supabase.from('stock_transactions').insert(dbTxList);
        
        if (newSale.balanceDue > 0) {
          const c = db.getCustomers().find(x => x.id === newSale.customerId);
          if (c) await supabase.from('customers').upsert(c);
        }
        
        await supabase.from('deliveries').insert(newDelivery);
        await supabase.from('settings').upsert({ id: 'default', ...settings });
      } catch (err) {
        console.error('Error syncing recorded sale to Supabase:', err);
      }
    })();

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

    // Save purchase locally
    const purchasesList = db.getPurchases();
    purchasesList.push(newPurchase);
    localStorage.setItem('dc_purchases', JSON.stringify(purchasesList));

    // Save items & stock locally
    const purchaseItemsList = db.getPurchaseItems();
    const productsList = db.getProducts();
    const txList = db.getStockTransactions();

    const dbPurchaseItems: PurchaseItem[] = [];
    const dbTxList: StockTransaction[] = [];

    items.forEach((item, index) => {
      const pItem: PurchaseItem = {
        ...item,
        id: `pitem-${Date.now()}-${index}`,
        purchaseId
      };
      purchaseItemsList.push(pItem);
      dbPurchaseItems.push(pItem);

      // Increment product stock
      const pIdx = productsList.findIndex(p => p.id === item.productId);
      if (pIdx >= 0) {
        productsList[pIdx].stockQty += item.quantity;
      }

      // Add stock transaction
      const stx: StockTransaction = {
        id: `tx-${Date.now()}-${index}`,
        productId: item.productId,
        type: 'in',
        quantity: item.quantity,
        date: purchaseDate,
        referenceId: purchaseId,
        notes: `Purchase ${purchaseNumber}`
      };
      txList.push(stx);
      dbTxList.push(stx);
    });

    localStorage.setItem('dc_purchase_items', JSON.stringify(purchaseItemsList));
    localStorage.setItem('dc_products', JSON.stringify(productsList));
    localStorage.setItem('dc_stock_transactions', JSON.stringify(txList));

    // Update settings counter locally
    settings.nextPurchaseNumber += 1;
    localStorage.setItem('dc_settings', JSON.stringify(settings));

    // Sync all writes to Supabase in background
    (async () => {
      try {
        await supabase.from('purchases').insert(newPurchase);
        await supabase.from('purchase_items').insert(dbPurchaseItems);
        
        // Update product stocks
        for (const item of items) {
          const p = productsList.find(x => x.id === item.productId);
          if (p) await supabase.from('products').upsert(p);
        }

        await supabase.from('stock_transactions').insert(dbTxList);
        await supabase.from('settings').upsert({ id: 'default', ...settings });
      } catch (err) {
        console.error('Error syncing recorded purchase to Supabase:', err);
      }
    })();

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
      const newTx: StockTransaction = {
        id: `tx-${Date.now()}`,
        productId,
        type,
        quantity,
        date: new Date().toISOString(),
        referenceId: 'audit',
        notes
      };
      txList.push(newTx);
      localStorage.setItem('dc_stock_transactions', JSON.stringify(txList));

      // Write updates to Supabase
      supabase.from('products').upsert(product).then(({ error }) => {
        if (error) console.error('Failed to sync stock qty adjustment to Supabase:', error);
      });
      supabase.from('stock_transactions').insert(newTx).then(({ error }) => {
        if (error) console.error('Failed to sync stock adjustment transaction to Supabase:', error);
      });
    }
  },

  // Record a Customer payment to settle outstanding balance
  recordCustomerPayment: (customerId: string, amountPaid: number) => {
    const customerList = db.getCustomers();
    const cIdx = customerList.findIndex(c => c.id === customerId);
    if (cIdx >= 0) {
      customerList[cIdx].outstandingBalance = Math.max(0, customerList[cIdx].outstandingBalance - amountPaid);
      localStorage.setItem('dc_customers', JSON.stringify(customerList));
      
      // Write updates to Supabase
      supabase.from('customers').upsert(customerList[cIdx]).then(({ error }) => {
        if (error) console.error('Failed to sync customer payment to Supabase:', error);
      });
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

        // Sync full backup import to Supabase
        (async () => {
          try {
            await supabase.from('settings').upsert({ id: 'default', ...data.settings });
            await supabase.from('categories').upsert(data.categories);
            await supabase.from('products').upsert(data.products);
            await supabase.from('customers').upsert(data.customers);
            await supabase.from('suppliers').upsert(data.suppliers);
            await supabase.from('sales').upsert(data.sales);
            if (data.sale_items && data.sale_items.length > 0) await supabase.from('sale_items').upsert(data.sale_items);
            if (data.purchases && data.purchases.length > 0) await supabase.from('purchases').upsert(data.purchases);
            if (data.purchase_items && data.purchase_items.length > 0) await supabase.from('purchase_items').upsert(data.purchase_items);
            if (data.deliveries && data.deliveries.length > 0) await supabase.from('deliveries').upsert(data.deliveries);
            if (data.stock_transactions && data.stock_transactions.length > 0) await supabase.from('stock_transactions').upsert(data.stock_transactions);
          } catch (err) {
            console.error('Failed to sync full database backup to Supabase:', err);
          }
        })();

        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  deleteSaleSilent: (id: string) => {
    const salesList = db.getSales();
    const sale = salesList.find(s => s.id === id);
    if (sale) {
      // 1. Revert customer outstanding balance if there was balance due
      if (sale.balanceDue > 0) {
        const customerList = db.getCustomers();
        const cIdx = customerList.findIndex(c => c.id === sale.customerId);
        if (cIdx >= 0) {
          customerList[cIdx].outstandingBalance = Math.max(0, customerList[cIdx].outstandingBalance - sale.balanceDue);
          localStorage.setItem('dc_customers', JSON.stringify(customerList));
          supabase.from('customers').upsert(customerList[cIdx]).then(({ error }) => {
            if (error) console.error('Failed to sync customer balance update on sale deletion:', error);
          });
        }
      }
      
      // 2. Revert product stock quantities
      const saleItemsList = db.getSaleItems();
      const itemsToRevert = saleItemsList.filter(si => si.saleId === id);
      const productsList = db.getProducts();
      itemsToRevert.forEach(item => {
        const pIdx = productsList.findIndex(p => p.id === item.productId);
        if (pIdx >= 0) {
          productsList[pIdx].stockQty += item.quantity;
        }
      });
      localStorage.setItem('dc_products', JSON.stringify(productsList));
      productsList.forEach(p => {
        supabase.from('products').upsert(p).then(({ error }) => {
          if (error) console.error('Failed to sync product stock update on sale deletion:', error);
        });
      });
    }

    // 3. Update localStorage for all related tables
    localStorage.setItem('dc_sales', JSON.stringify(db.getSales().filter(s => s.id !== id)));
    localStorage.setItem('dc_sale_items', JSON.stringify(db.getSaleItems().filter(si => si.saleId !== id)));
    localStorage.setItem('dc_deliveries', JSON.stringify(db.getDeliveries().filter(d => d.saleId !== id)));
    localStorage.setItem('dc_stock_transactions', JSON.stringify(db.getStockTransactions().filter(t => t.referenceId !== id)));

    // 4. Sync deletions to Supabase
    supabase.from('sales').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Failed to sync sale deletion:', error);
    });
    supabase.from('sale_items').delete().eq('saleId', id).then(({ error }) => {
      if (error) console.error('Failed to sync sale items deletion:', error);
    });
    supabase.from('deliveries').delete().eq('saleId', id).then(({ error }) => {
      if (error) console.error('Failed to sync delivery deletion:', error);
    });
    supabase.from('stock_transactions').delete().eq('referenceId', id).then(({ error }) => {
      if (error) console.error('Failed to sync stock transaction deletion:', error);
    });
  },

  deleteSale: (id: string) => {
    db.deleteSaleSilent(id);
  },

  cleanupDuplicateSales: () => {
    const salesStr = localStorage.getItem('dc_sales');
    if (!salesStr) return;
    const sales: Sale[] = JSON.parse(salesStr);
    const duplicatesToDelete: string[] = [];
    const processed = new Set<string>();

    for (let i = 0; i < sales.length; i++) {
      const s1 = sales[i];
      if (processed.has(s1.id)) continue;

      for (let j = i + 1; j < sales.length; j++) {
        const s2 = sales[j];
        if (processed.has(s2.id)) continue;

        const isSameCustomer = s1.customerId === s2.customerId;
        const isSameTotal = s1.totalAmount === s2.totalAmount;
        const timeDiff = Math.abs(new Date(s1.saleDate).getTime() - new Date(s2.saleDate).getTime());
        const isWithinTime = timeDiff < 120000; // 2 minutes

        if (isSameCustomer && isSameTotal && isWithinTime) {
          // We found duplicates!
          // Decide which one to keep
          let toKeep = s1;
          let toDelete = s2;

          if (s2.paymentStatus === 'Paid' && s1.paymentStatus !== 'Paid') {
            toKeep = s2;
            toDelete = s1;
          }

          duplicatesToDelete.push(toDelete.id);
          processed.add(s1.id);
          processed.add(s2.id);
          break;
        }
      }
    }

    if (duplicatesToDelete.length > 0) {
      console.log(`Auto-cleanup found duplicate sales to delete:`, duplicatesToDelete);
      duplicatesToDelete.forEach(id => {
        db.deleteSaleSilent(id);
      });
    }
  },

  updateSaleStatus: (saleId: string, newStatus: 'Paid' | 'Pending' | 'Partial') => {
    const salesList = db.getSales();
    const idx = salesList.findIndex(s => s.id === saleId);
    if (idx >= 0) {
      const sale = salesList[idx];
      const oldStatus = sale.paymentStatus;
      const oldBalanceDue = sale.balanceDue;
      
      if (oldStatus === newStatus) return;

      // 1. Calculate new balance due and advance payment
      let newBalanceDue = 0;
      let newAdvancePayment = sale.totalAmount;

      if (newStatus === 'Pending') {
        newBalanceDue = sale.totalAmount;
        newAdvancePayment = 0;
      } else if (newStatus === 'Partial') {
        if (oldStatus === 'Paid') {
          newAdvancePayment = Math.floor(sale.totalAmount / 2);
          newBalanceDue = sale.totalAmount - newAdvancePayment;
        } else {
          newAdvancePayment = sale.advancePayment || Math.floor(sale.totalAmount / 2);
          newBalanceDue = sale.totalAmount - newAdvancePayment;
        }
      }

      // 2. Adjust customer outstanding balance
      const customerList = db.getCustomers();
      const cIdx = customerList.findIndex(c => c.id === sale.customerId);
      if (cIdx >= 0) {
        customerList[cIdx].outstandingBalance = Math.max(
          0,
          customerList[cIdx].outstandingBalance - oldBalanceDue + newBalanceDue
        );
        localStorage.setItem('dc_customers', JSON.stringify(customerList));
        supabase.from('customers').upsert(customerList[cIdx]).then(({ error }) => {
          if (error) console.error('Failed to sync customer balance update on sale status change:', error);
        });
      }

      // 3. Update sale fields
      sale.paymentStatus = newStatus;
      sale.balanceDue = newBalanceDue;
      sale.advancePayment = newAdvancePayment;
      salesList[idx] = sale;
      localStorage.setItem('dc_sales', JSON.stringify(salesList));

      // 4. Sync sale to Supabase
      supabase.from('sales').upsert(sale).then(({ error }) => {
        if (error) console.error('Failed to sync sale status change to Supabase:', error);
      });
    }
  },

  getSubscriptions: (): Subscription[] => {
    const saved = localStorage.getItem('dc_subscriptions');
    return saved ? JSON.parse(saved) : [];
  },

  recordSubscription: (userId: string, planName: string, amount: number, paymentMethod: string, transactionId?: string): Subscription => {
    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      userId,
      planName,
      amount,
      paymentMethod,
      status: 'Active',
      activatedAt: new Date().toISOString(),
      transactionId: transactionId || `TXN-PHONEPE-${Date.now()}`
    };

    // Save locally
    const subsList = db.getSubscriptions();
    subsList.push(newSubscription);
    localStorage.setItem('dc_subscriptions', JSON.stringify(subsList));

    // Save subscription flags
    localStorage.setItem('dc_is_subscribed', 'true');
    if (!localStorage.getItem('dc_trial_start')) {
      localStorage.setItem('dc_trial_start', new Date().toISOString());
    }

    // Sync to Supabase in background
    (async () => {
      try {
        const { error } = await supabase.from('subscriptions').insert(newSubscription);
        if (error) {
          console.warn('Subscription sync to Supabase skipped (make sure public.subscriptions table is created in your dashboard SQL Editor):', error.message);
        }
      } catch (err) {
        console.error('Failed to insert subscription record in Supabase:', err);
      }
    })();

    return newSubscription;
  }
};
