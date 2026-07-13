import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Grid,
  Card,
  CardContent,
  IconButton,
  TextField,
  MenuItem
} from '@mui/material';
import { Download, Delete } from '@mui/icons-material';
import { db } from '../db/db';
import { useAppStore } from '../store/store';

export const Reports: React.FC = () => {
  const dbRevision = useAppStore(state => state.dbRevision);
  const triggerDbUpdate = useAppStore(state => state.triggerDbUpdate);

  const handleDeleteSale = (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice? This will revert customer balances, product stock quantities, and remove all associated records.')) {
      db.deleteSale(id);
      triggerDbUpdate();
    }
  };

  const handleStatusChange = (saleId: string, newStatus: 'Paid' | 'Pending' | 'Partial') => {
    db.updateSaleStatus(saleId, newStatus);
    triggerDbUpdate();
  };

  const [activeTab, setActiveTab] = useState(0);

  // Load datasets (excluding seed/demo records so reports only represent real customer transactions)
  const sales = useMemo(() => {
    return db.getSales().filter(s => s.id !== 'sale-1' && s.id !== 'sale-2' && s.id !== 'sale-3');
  }, [dbRevision]);

  const saleItems = useMemo(() => {
    return db.getSaleItems().filter(item => item.saleId !== 'sale-1' && item.saleId !== 'sale-2' && item.saleId !== 'sale-3');
  }, [dbRevision]);

  const products = useMemo(() => db.getProducts(), [dbRevision]);

  const customers = useMemo(() => {
    return db.getCustomers().filter(c => c.id !== 'cust-1' && c.id !== 'cust-2' && c.id !== 'cust-3');
  }, [dbRevision]);

  const purchases = useMemo(() => {
    return db.getPurchases().filter(p => p.id !== 'purch-1');
  }, [dbRevision]);

  const purchaseItems = useMemo(() => {
    return db.getPurchaseItems().filter(item => item.purchaseId !== 'purch-1');
  }, [dbRevision]);

  // Tab 0: Sales (Daily / Monthly)
  const salesReportData = useMemo(() => {
    return sales.map(s => {
      const cust = customers.find(c => c.id === s.customerId);
      return {
        id: s.id,
        invoiceNumber: s.invoiceNumber,
        customerName: cust?.name || 'Walk-in',
        date: new Date(s.saleDate).toLocaleDateString('en-IN'),
        subtotal: s.subtotal,
        discount: s.discount,
        gst: s.gstAmount,
        total: s.totalAmount,
        status: s.paymentStatus
      };
    });
  }, [sales, customers]);

  // Tab 1: Product-wise sales & Profits
  const productSalesReportData = useMemo(() => {
    const list: { [key: string]: { name: string; code: string; qty: number; revenue: number; cost: number; profit: number } } = {};
    
    saleItems.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const key = item.productId;
      if (!list[key]) {
        list[key] = {
          name: item.productName,
          code: prod?.code || 'N/A',
          qty: 0,
          revenue: 0,
          cost: 0,
          profit: 0
        };
      }
      list[key].qty += item.quantity;
      list[key].revenue += item.total;
      list[key].cost += item.purchasePrice * item.quantity;
      list[key].profit += (item.sellingPrice - item.purchasePrice) * item.quantity;
    });

    return Object.values(list);
  }, [saleItems, products]);

  // Tab 2: Customer Outstanding Balance Report
  const customerBalanceReportData = useMemo(() => {
    return customers.filter(c => c.outstandingBalance > 0).map(c => ({
      name: c.name,
      phone: c.phone,
      gst: c.gstNumber || 'N/A',
      balance: c.outstandingBalance
    }));
  }, [customers]);

  // Tab 3: Purchase Report
  const purchaseReportData = useMemo(() => {
    const suppliers = db.getSuppliers();
    return purchases.map(p => {
      const supp = suppliers.find(s => s.id === p.supplierId);
      return {
        purchaseNumber: p.purchaseNumber,
        supplierName: supp?.name || 'Unknown',
        date: new Date(p.purchaseDate).toLocaleDateString('en-IN'),
        total: p.totalAmount,
        status: p.paymentStatus
      };
    });
  }, [purchases]);

  // Tab 4: GST Report
  const gstReportData = useMemo(() => {
    // Collect sales GST
    const collected = sales.reduce((sum, s) => sum + s.gstAmount, 0);
    // Collect purchase GST
    // For simplicity, assume purchases have 18% GST standard or calculated
    const paid = purchases.reduce((sum, p) => sum + (p.totalAmount * 0.18), 0);
    const netPayable = collected - paid;

    return {
      collected,
      paid,
      netPayable
    };
  }, [sales, purchases]);

  // Tab 5: Inventory Valuation Report
  const inventoryReportData = useMemo(() => {
    const list = products.map(p => {
      const costValue = p.stockQty * p.purchasePrice;
      const retailValue = p.stockQty * p.sellingPrice;
      return {
        code: p.code,
        name: p.name,
        stock: p.stockQty,
        costPrice: p.purchasePrice,
        retailPrice: p.sellingPrice,
        costValue,
        retailValue
      };
    });

    const totalCostValue = list.reduce((sum, item) => sum + item.costValue, 0);
    const totalRetailValue = list.reduce((sum, item) => sum + item.retailValue, 0);

    return {
      items: list,
      totalCostValue,
      totalRetailValue
    };
  }, [products]);

  // Export to CSV helper
  const handleExportCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerExport = () => {
    if (activeTab === 0) {
      const headers = ['Invoice Number', 'Customer Name', 'Date', 'Subtotal', 'Discount', 'GST Collected', 'Total Amount', 'Status'];
      const rows = salesReportData.map(d => [d.invoiceNumber, d.customerName, d.date, d.subtotal, d.discount, d.gst, d.total, d.status]);
      handleExportCSV('sales_report.csv', headers, rows);
    } else if (activeTab === 1) {
      const headers = ['Product Code', 'Product Name', 'Quantity Sold', 'Revenue (₹)', 'Purchase Cost (₹)', 'Net Profit (₹)'];
      const rows = productSalesReportData.map(d => [d.code, d.name, d.qty, d.revenue, d.cost, d.profit]);
      handleExportCSV('product_profitability_report.csv', headers, rows);
    } else if (activeTab === 2) {
      const headers = ['Customer Name', 'Phone', 'GSTIN', 'Outstanding Balance (₹)'];
      const rows = customerBalanceReportData.map(d => [d.name, d.phone, d.gst, d.balance]);
      handleExportCSV('customer_balance_report.csv', headers, rows);
    } else if (activeTab === 3) {
      const headers = ['Purchase Number', 'Supplier Name', 'Date', 'Total Cost (₹)', 'Status'];
      const rows = purchaseReportData.map(d => [d.purchaseNumber, d.supplierName, d.date, d.total, d.status]);
      handleExportCSV('purchase_report.csv', headers, rows);
    } else if (activeTab === 5) {
      const headers = ['Product Code', 'Product Name', 'Current Stock', 'Purchase Price (₹)', 'Selling Price (₹)', 'Valuation at Cost (₹)', 'Valuation at Retail (₹)'];
      const rows = inventoryReportData.items.map(d => [d.code, d.name, d.stock, d.costPrice, d.retailPrice, d.costValue, d.retailValue]);
      handleExportCSV('inventory_valuation_report.csv', headers, rows);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Reports & Analytics
        </Typography>
        {activeTab !== 4 && (
          <Button variant="outlined" startIcon={<Download />} onClick={triggerExport}>
            Export CSV
          </Button>
        )}
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Sales Summary" />
          <Tab label="Product Performance" />
          <Tab label="Customer Balances" />
          <Tab label="Purchase History" />
          <Tab label="GST Report" />
          <Tab label="Inventory Valuation" />
        </Tabs>
      </Paper>

      {/* Tab Contents */}
      
      {/* 1. Sales Summary */}
      {activeTab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice No</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="right">Discount</TableCell>
                <TableCell align="right">GST Collected</TableCell>
                <TableCell align="right">Grand Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesReportData.map((d) => (
                <TableRow key={d.invoiceNumber}>
                  <TableCell sx={{ fontWeight: 600 }}>{d.invoiceNumber}</TableCell>
                  <TableCell>{d.customerName}</TableCell>
                  <TableCell>{d.date}</TableCell>
                  <TableCell align="right">₹{d.subtotal.toLocaleString('en-IN')}</TableCell>
                  <TableCell align="right">₹{d.discount.toLocaleString('en-IN')}</TableCell>
                  <TableCell align="right">₹{d.gst.toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>₹{d.total.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      value={d.status}
                      onChange={(e) => handleStatusChange(d.id, e.target.value as 'Paid' | 'Pending' | 'Partial')}
                      size="small"
                      variant="standard"
                      sx={{ 
                        width: 105,
                        '& .MuiInput-underline:before': { borderBottom: 'none' },
                        '& .MuiInput-underline:after': { borderBottom: 'none' },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                        '& .MuiSelect-select': {
                          py: 0.5,
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: d.status === 'Paid' ? 'success.main' : d.status === 'Partial' ? 'warning.main' : 'error.main'
                        }
                      }}
                    >
                      <MenuItem value="Paid">Paid</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Partial">Partial</MenuItem>
                    </TextField>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="error" onClick={() => handleDeleteSale(d.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {salesReportData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">No sales recorded</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 2. Product wise performance */}
      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell align="center">Qty Sold</TableCell>
                <TableCell align="right">Gross Revenue</TableCell>
                <TableCell align="right">Inventory Cost</TableCell>
                <TableCell align="right">Net Profit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productSalesReportData.map((d) => (
                <TableRow key={d.code}>
                  <TableCell>{d.code}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{d.name}</TableCell>
                  <TableCell align="center">{d.qty}</TableCell>
                  <TableCell align="right">₹{d.revenue.toLocaleString('en-IN')}</TableCell>
                  <TableCell align="right">₹{d.cost.toLocaleString('en-IN')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main' }}>
                    ₹{d.profit.toLocaleString('en-IN')}
                  </TableCell>
                </TableRow>
              ))}
              {productSalesReportData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No items sold yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 3. Customer Balances */}
      {activeTab === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>GSTIN</TableCell>
                <TableCell align="right">Outstanding Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerBalanceReportData.map((d) => (
                <TableRow key={d.phone}>
                  <TableCell sx={{ fontWeight: 600 }}>{d.name}</TableCell>
                  <TableCell>{d.phone}</TableCell>
                  <TableCell>{d.gst}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'error.main' }}>
                    ₹{d.balance.toLocaleString('en-IN')}
                  </TableCell>
                </TableRow>
              ))}
              {customerBalanceReportData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No outstanding balances! All paid. 🎉</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 4. Purchases */}
      {activeTab === 3 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Purchase Order</TableCell>
                <TableCell>Supplier Details</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell align="right">Total Cost</TableCell>
                <TableCell>Payment Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseReportData.map((d) => (
                <TableRow key={d.purchaseNumber}>
                  <TableCell sx={{ fontWeight: 600 }}>{d.purchaseNumber}</TableCell>
                  <TableCell>{d.supplierName}</TableCell>
                  <TableCell>{d.date}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>₹{d.total.toLocaleString('en-IN')}</TableCell>
                  <TableCell>{d.status}</TableCell>
                </TableRow>
              ))}
              {purchaseReportData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No restock orders recorded</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 5. GST Report */}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'success.dark', color: '#fff' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>GST Collected (Sales)</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  ₹{gstReportData.collected.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'error.dark', color: '#fff' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Input Tax Credit (Purchase GST Paid)</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  ₹{gstReportData.paid.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: gstReportData.netPayable >= 0 ? 'warning.dark' : 'info.dark', color: '#fff' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Net Payable GST (Collected - Credit)</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  ₹{gstReportData.netPayable.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* 6. Inventory Valuation */}
      {activeTab === 5 && (
        <Box>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">Total Asset Value (Cost price)</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    ₹{inventoryReportData.totalCostValue.toLocaleString('en-IN')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">Total Value at Retail (Selling price)</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }} color="primary">
                    ₹{inventoryReportData.totalRetailValue.toLocaleString('en-IN')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="center">Stock Available</TableCell>
                  <TableCell align="right">Cost Price</TableCell>
                  <TableCell align="right">Retail Price</TableCell>
                  <TableCell align="right">Total Value (Cost)</TableCell>
                  <TableCell align="right">Total Value (Retail)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryReportData.items.map((d) => (
                  <TableRow key={d.code}>
                    <TableCell>{d.code}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{d.name}</TableCell>
                    <TableCell align="center">{d.stock}</TableCell>
                    <TableCell align="right">₹{d.costPrice.toLocaleString('en-IN')}</TableCell>
                    <TableCell align="right">₹{d.retailPrice.toLocaleString('en-IN')}</TableCell>
                    <TableCell align="right">₹{d.costValue.toLocaleString('en-IN')}</TableCell>
                    <TableCell align="right">₹{d.retailValue.toLocaleString('en-IN')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};
