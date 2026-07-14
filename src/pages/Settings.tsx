import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Divider,
  Alert,
  Chip,
  CircularProgress
} from '@mui/material';
import { 
  Save, 
  CloudDownload, 
  CloudUpload,
  LaptopMac,
  CheckCircle,
  Refresh,
  ArrowCircleUp,
  Info,
  GetApp
} from '@mui/icons-material';
import { db, StoreSettings } from '../db/db';
import { useAppStore } from '../store/store';

export const Settings: React.FC = () => {
  const dbRevision = useAppStore(state => state.dbRevision);
  const triggerDbUpdate = useAppStore(state => state.triggerDbUpdate);
  const currentUser = useAppStore(state => state.currentUser);
  
  // Desktop App / Update States
  const installPrompt = useAppStore(state => state.installPrompt);
  const isUpdateAvailable = useAppStore(state => state.isUpdateAvailable);
  const swRegistration = useAppStore(state => state.swRegistration);
  const setInstallPrompt = useAppStore(state => state.setInstallPrompt);

  const isStandalone = useMemo(() => {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone || 
           document.referrer.includes('android-app://');
  }, []);

  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updateCheckStatus, setUpdateCheckStatus] = useState<'idle' | 'checking' | 'updated' | 'no-update' | 'error'>('idle');

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

  const handleCheckUpdates = async () => {
    setCheckingUpdates(true);
    setUpdateCheckStatus('checking');
    
    if (swRegistration) {
      try {
        await swRegistration.update();
      } catch (err) {
        console.error('Service worker update check failed', err);
      }
    }

    setTimeout(() => {
      setCheckingUpdates(false);
      if (isUpdateAvailable || (swRegistration && swRegistration.waiting)) {
        setUpdateCheckStatus('updated');
        setMessage({ type: 'success', text: 'A new version of DecoCraft is available! Select Reload to update.' });
      } else {
        setUpdateCheckStatus('no-update');
        setMessage({ type: 'success', text: 'You are running the latest version of DecoCraft Furnishers.' });
      }
      setTimeout(() => {
        setMessage(null);
        setUpdateCheckStatus('idle');
      }, 5000);
    }, 1500);
  };

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setInstallPrompt(null);
        }
      });
    }
  };

  const handleApplyUpdate = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
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

        {/* Right Side: Backups & Desktop Tools */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Backup & Database Tools Card */}
            <Paper sx={{ p: 4, boxSizing: 'border-box' }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Backup & Database Tools
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Export your current showroom database containing products, customers, suppliers, purchases, deliveries, invoices, and transaction logs. You can restore it anytime.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

            {/* Desktop App & Updates Card */}
            <Paper sx={{ p: 4, boxSizing: 'border-box' }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Desktop App & Live Updates
              </Typography>
              
              {/* App Mode Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LaptopMac color="primary" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>App Status</Typography>
                </Box>
                <Chip 
                  label={isStandalone ? "Desktop App" : "Web Browser"} 
                  color={isStandalone ? "success" : "info"}
                  size="small"
                  variant="filled"
                  sx={{ fontWeight: 700 }}
                />
              </Box>

              {/* Install PWA section */}
              {!isStandalone && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Install DecoCraft on your computer for a standalone window, offline functionality, and a desktop shortcut.
                  </Typography>
                  {installPrompt ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      startIcon={<GetApp />}
                      onClick={handleInstallClick}
                      fullWidth
                      sx={{ 
                        height: 48, 
                        fontWeight: 800,
                        backgroundImage: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                        boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
                        '&:hover': {
                          backgroundImage: 'linear-gradient(135deg, #db2777 0%, #7c3aed 100%)',
                        }
                      }}
                    >
                      Install Desktop App
                    </Button>
                  ) : (
                    <Box sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1.5, display: 'flex', gap: 1 }}>
                      <Info fontSize="small" sx={{ mt: 0.2 }} />
                      <Typography variant="caption" sx={{ lineHeight: 1.3 }}>
                        To install this app on your desktop, click the Install option (💻 or ⊕) in your browser's address bar.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              <Divider sx={{ my: 2.5 }} />

              {/* Updates Section */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Current Client Version:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>v1.0.4</Typography>
                </Box>

                {isUpdateAvailable ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Alert severity="warning" sx={{ py: 0.5 }}>
                      A new desktop update is ready to install!
                    </Alert>
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      className="animate-pulse"
                      startIcon={<ArrowCircleUp className="animate-bounce" />}
                      onClick={handleApplyUpdate}
                      fullWidth
                      sx={{ 
                        height: 48,
                        fontWeight: 800,
                        boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)'
                      }}
                    >
                      Reload & Update Now
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    disabled={checkingUpdates}
                    startIcon={checkingUpdates ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
                    onClick={handleCheckUpdates}
                    fullWidth
                    sx={{ height: 48, fontWeight: 700 }}
                  >
                    {checkingUpdates ? "Checking updates..." : "Check for Updates"}
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
