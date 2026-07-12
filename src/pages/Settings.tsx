import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Divider,
  Alert
} from '@mui/material';
import { Save, CloudDownload, CloudUpload } from '@mui/icons-material';
import { db, StoreSettings } from '../db/db';
import { useAppStore } from '../store/store';

export const Settings: React.FC = () => {
  const dbRevision = useAppStore(state => state.dbRevision);
  const triggerDbUpdate = useAppStore(state => state.triggerDbUpdate);
  const currentUser = useAppStore(state => state.currentUser);

  // Guard access
  const isAllowed = currentUser?.role === 'admin';

  const settings = useMemo(() => db.getSettings(), [dbRevision]);

  // Form Fields
  const [storeName, setStoreName] = useState(settings.storeName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [gstNumber, setGstNumber] = useState(settings.gstNumber);
  const [invoicePrefix, setInvoicePrefix] = useState(settings.invoicePrefix);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isAllowed) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">
          Access Denied: Only users with the **Admin** role can access system configuration settings.
        </Alert>
      </Box>
    );
  }

  const handleSave = () => {
    db.saveSettings({
      ...settings,
      storeName,
      logoText: `🛋️ ${storeName.split(' ')[0]}`,
      address,
      phone,
      email,
      gstNumber,
      invoicePrefix
    });

    triggerDbUpdate();
    setMessage({ type: 'success', text: 'System configuration updated successfully.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleBackup = () => {
    const backupStr = db.exportBackup();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(backupStr);
    
    const exportFileDefaultName = `decocraft_billing_backup_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const success = db.importBackup(text);
        if (success) {
          triggerDbUpdate();
          setMessage({ type: 'success', text: 'Database restored successfully! Reloading contents...' });
        } else {
          setMessage({ type: 'error', text: 'Failed to restore. Invalid backup file format.' });
        }
        setTimeout(() => setMessage(null), 3000);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Settings
      </Typography>

      {message && <Alert severity={message.type} sx={{ mb: 3 }}>{message.text}</Alert>}

      <Grid container spacing={3}>
        {/* Left Side: Store profile & invoice prefixes */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Store Profile Settings
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Showroom Store Name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GSTIN Registration Number"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Store Billing Address"
                  multiline
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Invoice Configuration</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Invoice Number Prefix"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Save />}
                  onClick={handleSave}
                  sx={{ height: 48 }}
                >
                  Save Store Settings
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Side: Backups & Restores */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, height: '100%', boxSizing: 'border-box' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Backup & Database Tools
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Export your current showroom database containing products, customers, suppliers, purchases, deliveries, invoices, and transaction logs. You can restore it anytime.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                startIcon={<CloudDownload />}
                onClick={handleBackup}
                fullWidth
                sx={{ height: 48 }}
              >
                Export Showroom Database
              </Button>

              <Button
                variant="outlined"
                color="warning"
                size="large"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ height: 48 }}
              >
                Restore Showroom Database
                <input
                  type="file"
                  hidden
                  accept=".json"
                  onChange={handleRestore}
                />
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
