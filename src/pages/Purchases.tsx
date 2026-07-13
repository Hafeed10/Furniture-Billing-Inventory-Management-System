import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
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
  Divider,
  Autocomplete,
  InputAdornment
} from '@mui/material';
import { Add, Delete, PointOfSale } from '@mui/icons-material';
import { db, Product, Supplier, Purchase, PurchaseItem } from '../db/db';
import { useAppStore } from '../store/store';

export const Purchases: React.FC = () => {
  const dbRevision = useAppStore(state => state.dbRevision);
  const triggerDbUpdate = useAppStore(state => state.triggerDbUpdate);

  const products = useMemo(() => db.getProducts(), [dbRevision]);
  const suppliers = useMemo(() => db.getSuppliers(), [dbRevision]);
  const purchaseOrders = useMemo(() => db.getPurchases(), [dbRevision]);

  // Form State
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [items, setItems] = useState<{ product: Product; quantity: number; costPrice: number }[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');

  // Search autocomplete
  const [searchProduct, setSearchProduct] = useState<Product | null>(null);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
  }, [items]);

  const handleAddItem = (prod: Product) => {
    const idx = items.findIndex(i => i.product.id === prod.id);
    if (idx >= 0) {
      const updated = [...items];
      updated[idx].quantity += 1;
      setItems(updated);
    } else {
      setItems([...items, { product: prod, quantity: 1, costPrice: prod.purchasePrice }]);
    }
    setSearchProduct(null);
  };

  const handleQtyChange = (prodId: string, val: number) => {
    const idx = items.findIndex(i => i.product.id === prodId);
    if (idx >= 0) {
      const updated = [...items];
      updated[idx].quantity = Math.max(1, val);
      setItems(updated);
    }
  };

  const handlePriceChange = (prodId: string, val: number) => {
    const idx = items.findIndex(i => i.product.id === prodId);
    if (idx >= 0) {
      const updated = [...items];
      updated[idx].costPrice = Math.max(0, val);
      setItems(updated);
    }
  };

  const handleRemoveItem = (prodId: string) => {
    setItems(items.filter(i => i.product.id !== prodId));
  };

  const handleSavePurchase = () => {
    if (!selectedSupplier) {
      alert('Please select a Supplier.');
      return;
    }
    if (items.length === 0) {
      alert('Add at least one item to purchase.');
      return;
    }

    const itemsInput = items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      purchasePrice: item.costPrice,
      total: item.costPrice * item.quantity
    }));

    db.recordPurchase(
      {
        supplierId: selectedSupplier.id,
        totalAmount,
        paymentStatus
      },
      itemsInput
    );

    triggerDbUpdate();
    alert('Purchase order registered and inventory stock updated successfully!');
    
    // reset form
    setSelectedSupplier(null);
    setItems([]);
    setPaymentStatus('Paid');
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Purchase Management
      </Typography>

      <Grid container spacing={3}>
        {/* Left Form: Create Purchase Order */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Record New Supplier Purchase
            </Typography>

            <Autocomplete
              options={suppliers}
              getOptionLabel={(option) => option.name}
              value={selectedSupplier}
              onChange={(_, newVal) => setSelectedSupplier(newVal)}
              renderInput={(params) => <TextField {...params} label="Select Supplier" />}
              sx={{ mb: 3 }}
            />

            <Autocomplete
              options={products}
              getOptionLabel={(option) => `${option.name} (${option.code})`}
              value={searchProduct}
              onChange={(_, newVal) => {
                if (newVal) handleAddItem(newVal);
              }}
              renderInput={(params) => <TextField {...params} label="Search Products to Restock..." />}
              sx={{ mb: 3 }}
            />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center" style={{ width: '110px' }}>Quantity</TableCell>
                    <TableCell align="right" style={{ width: '180px', whiteSpace: 'nowrap' }}>Purchase Cost (₹)</TableCell>
                    <TableCell align="right" style={{ width: '120px' }}>Total</TableCell>
                    <TableCell align="center" style={{ width: '60px' }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.product.id}>
                      <TableCell sx={{ fontWeight: 600 }}>{item.product.name}</TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQtyChange(item.product.id, parseInt(e.target.value))}
                          inputProps={{ min: 1, style: { textAlign: 'center' } }}
                          size="small"
                          style={{ width: '80px' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={item.costPrice}
                          onChange={(e) => handlePriceChange(item.product.id, Number(e.target.value))}
                          size="small"
                          style={{ width: '140px' }}
                          slotProps={{
                            input: {
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" style={{ fontWeight: 700 }}>
                        ₹{(item.costPrice * item.quantity).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="error" onClick={() => handleRemoveItem(item.product.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No items added. Search and select items to purchase.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Payment Status"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                >
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Pending">Pending / Unpaid</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6} sm={4} sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">Total Cost Price</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }} color="primary">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth 
                  size="large"
                  onClick={handleSavePurchase}
                  sx={{ height: 48 }}
                >
                  Record Purchase
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Table: Purchase Order logs */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Purchase Order Log
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseOrders.map((po) => {
                    const supp = suppliers.find(s => s.id === po.supplierId);
                    return (
                      <TableRow key={po.id}>
                        <TableCell sx={{ fontWeight: 600 }}>{po.purchaseNumber}</TableCell>
                        <TableCell>{supp?.name || 'Unknown Supplier'}</TableCell>
                        <TableCell>{new Date(po.purchaseDate).toLocaleDateString('en-IN')}</TableCell>
                        <TableCell align="right">₹{po.totalAmount.toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    );
                  })}
                  {purchaseOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No purchase records found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
