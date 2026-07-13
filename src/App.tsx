import React, { useState } from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashIcon, 
  ShoppingCart as POSIcon, 
  ListAlt as ProdIcon, 
  People as CustIcon, 
  LocalShipping as DeliveryIcon, 
  SupervisorAccount as SuppIcon, 
  LibraryBooks as ReportIcon, 
  Settings as SettingIcon,
  PointOfSale as PurchaseIcon,
  Brightness4, 
  Brightness7,
  Logout
} from '@mui/icons-material';
import { themeLight, themeDark } from './theme/theme';
import { useAppStore } from './store/store';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Billing } from './pages/Billing';
import { Customers } from './pages/Customers';
import { Suppliers } from './pages/Suppliers';
import { Purchases } from './pages/Purchases';
import { Deliveries } from './pages/Deliveries';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { db } from './db/db';

const drawerWidth = 260;

function App() {
  const { 
    currentUser, 
    currentPage, 
    themeMode, 
    dbRevision,
    logout, 
    setPage, 
    toggleTheme,
    triggerDbUpdate
  } = useAppStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }, [themeMode]);

  React.useEffect(() => {
    const initSync = async () => {
      await db.checkAndSeedSupabase();
      await db.syncFromSupabase(() => {
        triggerDbUpdate();
      });
    };
    initSync();
  }, [triggerDbUpdate]);

  const activeTheme = themeMode === 'light' ? themeLight : themeDark;
  const storeSettings = db.getSettings();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleProfileMenuClose();
    logout();
  };

  // If user is not logged in, show login page
  if (!currentUser) {
    return (
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        <Login />
      </ThemeProvider>
    );
  }

  // Page selection resolver
  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'billing': return <Billing />;
      case 'products': return <Products />;
      case 'customers': return <Customers />;
      case 'suppliers': return <Suppliers />;
      case 'purchases': return <Purchases />;
      case 'deliveries': return <Deliveries />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  // Define sidebar items based on role permission
  const menuItems = [
    { text: 'Dashboard', icon: <DashIcon />, page: 'dashboard', roles: ['admin', 'manager', 'sales', 'accountant'] },
    { text: 'Billing & POS', icon: <POSIcon />, page: 'billing', roles: ['admin', 'manager', 'sales', 'accountant'] },
    { text: 'Products', icon: <ProdIcon />, page: 'products', roles: ['admin', 'manager'] },
    { text: 'Customers', icon: <CustIcon />, page: 'customers', roles: ['admin', 'manager', 'sales', 'accountant'] },
    { text: 'Deliveries', icon: <DeliveryIcon />, page: 'deliveries', roles: ['admin', 'manager', 'sales'] },
    { text: 'Suppliers', icon: <SuppIcon />, page: 'suppliers', roles: ['admin', 'manager', 'accountant'] },
    { text: 'Purchases', icon: <PurchaseIcon />, page: 'purchases', roles: ['admin', 'manager'] },
    { text: 'Reports & Profits', icon: <ReportIcon />, page: 'reports', roles: ['admin', 'manager', 'accountant'] },
    { text: 'Settings', icon: <SettingIcon />, page: 'settings', roles: ['admin'] },
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" noWrap sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          {storeSettings.logoText || '🛋️ DecoCraft'}
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {visibleMenuItems.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => {
                  setPage(item.page);
                  setMobileOpen(false);
                }}
                selected={isActive}
                sx={{
                  bgcolor: isActive ? 'primary.light' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.primary',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    }
                  },
                  '&:hover': {
                    bgcolor: isActive ? 'primary.main' : 'action.hover',
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'primary.contrastText' : 'action.active' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      {/* Footer in Sidebar */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
          {currentUser.name.charAt(0)}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {currentUser.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
            {currentUser.role}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }} className="no-print">
        {/* Top Header App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap sx={{ fontWeight: 700, letterSpacing: 0.5, display: { xs: 'none', sm: 'block' } }}>
                {storeSettings.storeName}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Theme toggle */}
              <IconButton onClick={toggleTheme} color="inherit">
                {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>

              {/* User Dropdown */}
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                  {currentUser.name.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleLogoutClick} sx={{ gap: 1 }}>
                  <Logout fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar Navigations */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundImage: 'none' },
            }}
          >
            {drawerContent}
          </Drawer>

          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>

        {/* Core Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            width: { md: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Toolbar /> {/* spacing anchor under header */}
          <Box sx={{ flexGrow: 1 }}>
            {renderActivePage()}
          </Box>
        </Box>
      </Box>
      
      {/* Hidden print section, only used for raw print outputs */}
      <Box id="print-section" sx={{ display: 'none' }} />
    </ThemeProvider>
  );
}

export default App;
