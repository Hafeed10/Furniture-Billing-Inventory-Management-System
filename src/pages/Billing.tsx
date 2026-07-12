import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  MenuItem, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import { 
  Add, 
  Delete, 
  Print, 
  ShoppingCart, 
  PersonAdd,
  Clear
} from '@mui/icons-material';
import { db, Product, Customer, Sale, SaleItem } from '../db/db';
import { useAppStore } from '../store/store';

export const Billing: React.FC = () => {
  const dbRevision = useAppStore(state => state.dbRevision);
  const triggerDbUpdate = useAppStore(state => state.triggerDbUpdate);
  const currentUser = useAppStore(state => state.currentUser);

  // Lists
  const products = useMemo(() => db.getProducts(), [dbRevision]);
  const customers = useMemo(() => db.getCustomers(), [dbRevision]);
  const storeSettings = useMemo(() => db.getSettings(), [dbRevision]);

  // POS State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [installationCharge, setInstallationCharge] = useState<number>(0);
  const [advancePayment, setAdvancePayment] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('Cash');

  // Customer Add Form State
  const [openCustDialog, setOpenCustDialog] = useState(false);
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cAddress, setCAddress] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cGst, setCGst] = useState('');

  // Invoice Print Preview Dialog
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const [savedSale, setSavedSale] = useState<Sale | null>(null);
  const [savedSaleItems, setSavedSaleItems] = useState<SaleItem[]>([]);

  // Search product helper
  const [prodSearchVal, setProdSearchVal] = useState<Product | null>(null);

  // Cart math
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
  }, [cart]);

  const gstAmount = useMemo(() => {
    return cart.reduce((sum, item) => {
      const itemPrice = item.product.sellingPrice * item.quantity;
      const taxPart = itemPrice - (itemPrice / (1 + (item.product.gstRate / 100)));
      return sum + taxPart;
    }, 0);
  }, [cart]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discount) + Number(deliveryCharge) + Number(installationCharge);
  }, [subtotal, discount, deliveryCharge, installationCharge]);

  const balanceDue = useMemo(() => {
    return Math.max(0, totalAmount - advancePayment);
  }, [totalAmount, advancePayment]);

  const handleAddProductToCart = (prod: Product) => {
    if (prod.stockQty <= 0) {
      alert(`Warning: ${prod.name} is currently OUT of stock.`);
    }

    const idx = cart.findIndex(item => item.product.id === prod.id);
    if (idx >= 0) {
      const updated = [...cart];
      updated[idx].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { product: prod, quantity: 1 }]);
    }
    setProdSearchVal(null);
  };

  const handleQtyChange = (prodId: string, qty: number) => {
    const idx = cart.findIndex(item => item.product.id === prodId);
    if (idx >= 0) {
      const updated = [...cart];
      updated[idx].quantity = Math.max(1, qty);
      setCart(updated);
    }
  };

  const handleRemoveFromCart = (prodId: string) => {
    setCart(cart.filter(item => item.product.id !== prodId));
  };

  // Add customer action
  const handleAddCustomer = () => {
    if (!cName || !cPhone) {
      alert('Name and Phone are required.');
      return;
    }
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: cName,
      phone: cPhone,
      address: cAddress,
      email: cEmail,
      gstNumber: cGst,
      outstandingBalance: 0
    };
    db.saveCustomer(newCust);
    triggerDbUpdate();
    setSelectedCustomer(newCust);
    setOpenCustDialog(false);
    // clear fields
    setCName(''); setCPhone(''); setCAddress(''); setCEmail(''); setCGst('');
  };

  // Checkout and Save Sale
  const handleCheckout = () => {
    if (!selectedCustomer) {
      alert('Please select or add a Customer before printing.');
      return;
    }
    if (cart.length === 0) {
      alert('Cart is empty.');
      return;
    }

    const saleItemsInput = cart.map(item => {
      const itemTotal = item.product.sellingPrice * item.quantity;
      const gstAmt = itemTotal - (itemTotal / (1 + (item.product.gstRate / 100)));
      return {
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        sellingPrice: item.product.sellingPrice,
        purchasePrice: item.product.purchasePrice,
        gstRate: item.product.gstRate,
        gstAmount: gstAmt,
        total: itemTotal
      };
    });

    const paymentStatus = balanceDue === 0 ? 'Paid' : (advancePayment > 0 ? 'Partial' : 'Pending');

    const result = db.recordSale(
      {
        customerId: selectedCustomer.id,
        subtotal,
        discount,
        gstAmount,
        deliveryCharge: Number(deliveryCharge),
        installationCharge: Number(installationCharge),
        advancePayment: Number(advancePayment),
        balanceDue,
        totalAmount,
        paymentMethod,
        paymentStatus,
        createdBy: currentUser?.id || 'unknown'
      },
      saleItemsInput
    );

    // Save for print dialog
    const saleItems = db.getSaleItems().filter(si => si.saleId === result.id);
    setSavedSale(result);
    setSavedSaleItems(saleItems);

    triggerDbUpdate();
    setOpenPrintDialog(true);
  };

  // Clear POS
  const resetPOS = () => {
    setSelectedCustomer(null);
    setCart([]);
    setDiscount(0);
    setDeliveryCharge(0);
    setInstallationCharge(0);
    setAdvancePayment(0);
    setPaymentMethod('Cash');
    setSavedSale(null);
    setSavedSaleItems([]);
    setOpenPrintDialog(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Sales & Billing
      </Typography>

      <Grid container spacing={3}>
        {/* Left Side: Product selection & Cart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingCart /> Add Products to Bill
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
              <Autocomplete
                fullWidth
                options={products}
                getOptionLabel={(option) => `${option.name} (${option.code}) - Stock: ${option.stockQty}`}
                value={prodSearchVal}
                onChange={(_, newVal) => {
                  if (newVal) {
                    handleAddProductToCart(newVal);
                  }
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Search Furniture Products..." 
                    variant="outlined" 
                  />
                )}
              />
            </Box>

            {/* Cart Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Code</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell align="right">Price (GST Inc.)</TableCell>
                    <TableCell align="center" style={{ width: '120px' }}>Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.product.id}>
                      <TableCell>{item.product.code}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{item.product.name}</TableCell>
                      <TableCell align="right">₹{item.product.sellingPrice.toLocaleString('en-IN')}</TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQtyChange(item.product.id, parseInt(e.target.value))}
                          inputProps={{ min: 1 }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        ₹{(item.product.sellingPrice * item.quantity).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="error" onClick={() => handleRemoveFromCart(item.product.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {cart.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No items added to the cart yet. Select a product above.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right Side: Customer selection, billing stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Customer Details</Typography>
              <Button 
                startIcon={<PersonAdd />} 
                onClick={() => setOpenCustDialog(true)}
                size="small"
              >
                Add Customer
              </Button>
            </Box>

            <Autocomplete
              options={customers}
              getOptionLabel={(option) => `${option.name} (${option.phone})`}
              value={selectedCustomer}
              onChange={(_, newVal) => setSelectedCustomer(newVal)}
              renderInput={(params) => <TextField {...params} label="Search Registered Customer..." />}
              sx={{ mb: 2 }}
            />

            {selectedCustomer && (
              <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedCustomer.name}</Typography>
                <Typography variant="body2" color="text.secondary">{selectedCustomer.phone}</Typography>
                <Typography variant="body2" color="text.secondary">{selectedCustomer.address}</Typography>
                {selectedCustomer.gstNumber && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 600 }}>
                    GSTIN: {selectedCustomer.gstNumber}
                  </Typography>
                )}
                {selectedCustomer.outstandingBalance > 0 && (
                  <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 700 }}>
                    Previous Balance Due: ₹{selectedCustomer.outstandingBalance.toLocaleString('en-IN')}
                  </Typography>
                )}
              </Box>
            )}
          </Paper>

          {/* Pricing Calculations */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Bill Summary</Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Cart Subtotal (GST Inc.)</Typography>
                <Typography sx={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</Typography>
              </Box>
              
              <TextField
                fullWidth
                label="Bill Discount (₹)"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                size="small"
              />

              <TextField
                fullWidth
                label="Delivery Charge (₹)"
                type="number"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(Math.max(0, Number(e.target.value)))}
                size="small"
              />

              <TextField
                fullWidth
                label="Installation Charge (₹)"
                type="number"
                value={installationCharge}
                onChange={(e) => setInstallationCharge(Math.max(0, Number(e.target.value)))}
                size="small"
              />

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total Amount</Typography>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 800 }}>
                  ₹{totalAmount.toLocaleString('en-IN')}
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Advance Payment / Amount Paid (₹)"
                type="number"
                value={advancePayment}
                onChange={(e) => setAdvancePayment(Math.max(0, Number(e.target.value)))}
                size="small"
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="error.main" sx={{ fontWeight: 600 }}>Balance Due</Typography>
                <Typography color="error.main" sx={{ fontWeight: 700 }}>
                  ₹{balanceDue.toLocaleString('en-IN')}
                </Typography>
              </Box>

              <TextField
                fullWidth
                select
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                size="small"
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
              </TextField>

              <Button
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                startIcon={<Print />}
                onClick={handleCheckout}
                sx={{ mt: 2, height: 48 }}
              >
                Checkout & Print Invoice
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Customer Form dialog */}
      <Dialog open={openCustDialog} onClose={() => setOpenCustDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Customer</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
            <TextField 
              required
              fullWidth 
              label="Full Name" 
              value={cName} 
              onChange={(e) => setCName(e.target.value)} 
            />
            <TextField 
              required
              fullWidth 
              label="Phone Number" 
              value={cPhone} 
              onChange={(e) => setCPhone(e.target.value)} 
            />
            <TextField 
              fullWidth 
              label="Email Address" 
              value={cEmail} 
              onChange={(e) => setCEmail(e.target.value)} 
            />
            <TextField 
              fullWidth 
              label="Delivery Address" 
              multiline
              rows={2}
              value={cAddress} 
              onChange={(e) => setCAddress(e.target.value)} 
            />
            <TextField 
              fullWidth 
              label="GST Number (Optional)" 
              value={cGst} 
              onChange={(e) => setCGst(e.target.value)} 
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCustDialog(false)}>Cancel</Button>
          <Button onClick={handleAddCustomer} variant="contained" color="primary">Add Customer</Button>
        </DialogActions>
      </Dialog>

      {/* Invoice Print Preview Dialog */}
      <Dialog open={openPrintDialog} onClose={() => setOpenPrintDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="no-print">
          <span>Invoice Generated Successfully</span>
          <IconButton onClick={() => setOpenPrintDialog(false)}>
            <Clear />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Printable Area */}
          <Box id="print-section" sx={{ p: 4, fontFamily: 'monospace', color: '#000', bgcolor: '#fff', border: '1px solid #ddd' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#000' }}>
                {storeSettings.storeName}
              </Typography>
              <Typography variant="body2">{storeSettings.address}</Typography>
              <Typography variant="body2">Phone: {storeSettings.phone} | Email: {storeSettings.email}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>GSTIN: {storeSettings.gstNumber}</Typography>
              <Divider sx={{ my: 2, borderColor: '#000' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>
                Tax Invoice
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Billed To:</Typography>
                <Typography variant="body2">{selectedCustomer?.name}</Typography>
                <Typography variant="body2">Phone: {selectedCustomer?.phone}</Typography>
                <Typography variant="body2">Address: {selectedCustomer?.address}</Typography>
                {selectedCustomer?.gstNumber && <Typography variant="body2">GSTIN: {selectedCustomer?.gstNumber}</Typography>}
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body2"><strong>Invoice No:</strong> {savedSale?.invoiceNumber}</Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {savedSale ? new Date(savedSale.saleDate).toLocaleDateString('en-IN') : ''}
                </Typography>
                <Typography variant="body2"><strong>Payment Method:</strong> {savedSale?.paymentMethod}</Typography>
                <Typography variant="body2">
                  <strong>Payment Status:</strong> {savedSale ? savedSale.paymentStatus.toUpperCase() : ''}
                </Typography>
              </Grid>
            </Grid>

            {/* Invoice Items table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #000', textAlign: 'left' }}>
                  <th style={{ padding: '8px 0' }}>#</th>
                  <th>Product Details</th>
                  <th style={{ textAlign: 'right' }}>Rate (GST Inc)</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Tax (GST)</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {savedSaleItems.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px 0' }}>{idx + 1}</td>
                    <td>{item.productName} ({item.gstRate}% GST)</td>
                    <td style={{ textAlign: 'right' }}>₹{item.sellingPrice.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>₹{item.gstAmount.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>₹{item.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations Summary */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, mt: 2 }}>
              <Box sx={{ width: 280 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">₹{savedSale?.subtotal.toLocaleString('en-IN')}</Typography>
                </Box>
                {savedSale && savedSale.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Discount:</Typography>
                    <Typography variant="body2">-₹{savedSale.discount.toLocaleString('en-IN')}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">GST Amount (Included):</Typography>
                  <Typography variant="body2">₹{savedSale?.gstAmount.toFixed(2)}</Typography>
                </Box>
                {savedSale && savedSale.deliveryCharge > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Delivery Charge:</Typography>
                    <Typography variant="body2">₹{savedSale.deliveryCharge.toLocaleString('en-IN')}</Typography>
                  </Box>
                )}
                {savedSale && savedSale.installationCharge > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Installation Charge:</Typography>
                    <Typography variant="body2">₹{savedSale.installationCharge.toLocaleString('en-IN')}</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1, borderColor: '#000' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <Typography variant="body2">Grand Total:</Typography>
                  <Typography variant="body2">₹{savedSale?.totalAmount.toLocaleString('en-IN')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Advance Paid:</Typography>
                  <Typography variant="body2">₹{savedSale?.advancePayment.toLocaleString('en-IN')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#ff0000', fontWeight: 'bold' }}>
                  <Typography variant="body2">Balance Due:</Typography>
                  <Typography variant="body2">₹{savedSale?.balanceDue.toLocaleString('en-IN')}</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" sx={{ display: 'block', mt: 4, borderTop: '1px solid #000', pt: 1, width: 150, textAlign: 'center' }}>
                  Customer Signature
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ display: 'block', mt: 4, borderTop: '1px solid #000', pt: 1, width: 150, textAlign: 'center' }}>
                  Authorized Signatory
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions className="no-print">
          <Button onClick={resetPOS} color="inherit">Close & New Bill</Button>
          <Button onClick={handlePrint} variant="contained" color="secondary" startIcon={<Print />}>
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
