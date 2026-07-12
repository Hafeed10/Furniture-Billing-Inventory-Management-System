import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Grid,
  Chip
} from '@mui/material';
import { Search, Payment } from '@mui/icons-material';
import { db, Customer } from '../db/db';
import { useAppStore } from '../store/store';

export const Customers: React.FC = () => {
  const dbRevision = useAppStore(state => state.dbRevision);
  const triggerDbUpdate = useAppStore(state => state.triggerDbUpdate);

  const customers = useMemo(() => db.getCustomers(), [dbRevision]);
  const sales = useMemo(() => db.getSales(), [dbRevision]);

  const [search, setSearch] = useState('');
  
  // Payment Dialog state
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);

  const filtered = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
    );
  }, [customers, search]);

  const handleOpenPay = (cust: Customer) => {
    setSelectedCust(cust);
    setPayAmount(cust.outstandingBalance);
    setOpenPayDialog(true);
  };

  const handleRecordPayment = () => {
    if (!selectedCust || payAmount <= 0) return;
    db.recordCustomerPayment(selectedCust.id, payAmount);
    triggerDbUpdate();
    setOpenPayDialog(false);
    setSelectedCust(null);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Customer Management
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search customers by Name, Phone, or Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Contact Phone</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>GSTIN</TableCell>
              <TableCell align="right">Outstanding Balance</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((cust) => {
              const hasBalance = cust.outstandingBalance > 0;
              return (
                <TableRow key={cust.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{cust.name}</TableCell>
                  <TableCell>{cust.phone}</TableCell>
                  <TableCell>{cust.email || 'N/A'}</TableCell>
                  <TableCell>{cust.address || 'N/A'}</TableCell>
                  <TableCell>
                    {cust.gstNumber ? (
                      <Chip label={cust.gstNumber} size="small" variant="outlined" />
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: hasBalance ? 'error.main' : 'text.primary' }}>
                    ₹{cust.outstandingBalance.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Payment />}
                      disabled={!hasBalance}
                      onClick={() => handleOpenPay(cust)}
                    >
                      Receive Payment
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">No customers found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Settle Balance Dialog */}
      <Dialog open={openPayDialog} onClose={() => setOpenPayDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Record Customer Payment</DialogTitle>
        <DialogContent dividers>
          {selectedCust && (
            <Grid container spacing={2} sx={{ py: 1 }}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Customer Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedCust.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Current Balance Due</Typography>
                <Typography variant="h6" color="error.main" sx={{ fontWeight: 700 }}>
                  ₹{selectedCust.outstandingBalance.toLocaleString('en-IN')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Amount Received (₹)"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Math.max(0, Number(e.target.value)))}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayDialog(false)}>Cancel</Button>
          <Button onClick={handleRecordPayment} variant="contained" color="success">
            Settle Balance
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
