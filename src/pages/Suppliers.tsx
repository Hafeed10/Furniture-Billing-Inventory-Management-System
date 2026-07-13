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
  Grid
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import { db, Supplier } from '../db/db';
import { useAppStore } from '../store/store';

export const Suppliers: React.FC = () => {
  const dbRevision = useAppStore(state => state.dbRevision);
  const triggerDbUpdate = useAppStore(state => state.triggerDbUpdate);

  const suppliers = useMemo(() => db.getSuppliers(), [dbRevision]);

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');

  const filtered = useMemo(() => {
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(search.toLowerCase())) ||
      s.phone.includes(search)
    );
  }, [suppliers, search]);

  const handleOpen = () => {
    setName('');
    setPhone('');
    setAddress('');
    setEmail('');
    setContactPerson('');
    setOpen(true);
  };

  const handleSave = () => {
    if (!name || !phone) {
      alert('Name and Phone are required.');
      return;
    }

    db.saveSupplier({
      id: `supp-${Date.now()}`,
      name,
      phone,
      address,
      email,
      contactPerson
    });

    triggerDbUpdate();
    setOpen(false);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Supplier Management
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpen}>
          Add Supplier
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search suppliers by Name, Contact Person, or Phone..."
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
              <TableCell>Supplier Name</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Office Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((supp) => (
              <TableRow key={supp.id}>
                <TableCell sx={{ fontWeight: 600 }}>{supp.name}</TableCell>
                <TableCell>{supp.contactPerson}</TableCell>
                <TableCell>{supp.phone}</TableCell>
                <TableCell>{supp.email || 'N/A'}</TableCell>
                <TableCell>{supp.address || 'N/A'}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No suppliers registered</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Form */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Supplier</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                required
                fullWidth 
                label="Supplier Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Contact Person" 
                value={contactPerson} 
                onChange={(e) => setContactPerson(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                required
                fullWidth 
                label="Phone Number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Office Address" 
                multiline
                rows={2}
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save Supplier</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
