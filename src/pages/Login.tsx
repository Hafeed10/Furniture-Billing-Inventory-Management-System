import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  InputAdornment, 
  IconButton,
  Alert
} from '@mui/material';
import { 
  Lock, 
  Person as UserIcon, 
  Visibility, 
  VisibilityOff,
  AdminPanelSettings,
  SupervisorAccount,
  PointOfSale,
  AccountBalance
} from '@mui/icons-material';
import { useAppStore } from '../store/store';

export const Login: React.FC = () => {
  const login = useAppStore(state => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in both username and password.');
      return;
    }

    // Direct password match for roles
    if (username.toLowerCase() === 'admin' && password === 'admin123') {
      login('Admin User', 'admin');
    } else if (username.toLowerCase() === 'manager' && password === 'manager123') {
      login('Manager User', 'manager');
    } else if (username.toLowerCase() === 'sales' && password === 'sales123') {
      login('Sales Executive', 'sales');
    } else if (username.toLowerCase() === 'accountant' && password === 'accountant123') {
      login('Accountant User', 'accountant');
    } else {
      setError('Invalid username or password. Check standard pre-fills below.');
    }
  };

  const handleQuickLogin = (role: 'admin' | 'manager' | 'sales' | 'accountant') => {
    login(`${role.charAt(0).toUpperCase() + role.slice(1)} Demo`, role);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'radial-gradient(circle at 50% 50%, #111827 0%, #030712 100%)' 
          : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%', border: 'none', boxShadow: 10 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
              🛋️ DecoCraft
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Furniture Billing & Inventory Management System
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {/* Login Form */}
          <form onSubmit={handleManualSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <UserIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              color="primary" 
              size="large" 
              sx={{ mt: 3, mb: 4, height: 48 }}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Predefined Logins */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 3 }}>
            <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}>
              Or quick-login as demo roles:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<AdminPanelSettings />} 
                  onClick={() => handleQuickLogin('admin')}
                  sx={{ height: 44 }}
                >
                  Admin
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<SupervisorAccount />} 
                  onClick={() => handleQuickLogin('manager')}
                  sx={{ height: 44 }}
                >
                  Manager
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<PointOfSale />} 
                  onClick={() => handleQuickLogin('sales')}
                  sx={{ height: 44 }}
                >
                  Sales
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<AccountBalance />} 
                  onClick={() => handleQuickLogin('accountant')}
                  sx={{ height: 44 }}
                >
                  Accountant
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
