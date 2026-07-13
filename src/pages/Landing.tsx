import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Container, 
  Paper,
  Divider,
  Stack
} from '@mui/material';
import { 
  ShoppingCart, 
  LocalShipping, 
  Assessment, 
  FlashOn, 
  CheckCircleOutline, 
  ArrowForward, 
  LockOpen
} from '@mui/icons-material';

interface LandingProps {
  onLaunchApp: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLaunchApp }) => {
  return (
    <Box sx={{ bgcolor: '#0b0f19', color: '#f3f4f6', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Navbar */}
      <Container maxWidth="lg" sx={{ py: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 1 }}>
          🛋️ DecoCraft
        </Typography>
        <Button 
          variant="contained" 
          onClick={onLaunchApp}
          sx={{ 
            bgcolor: '#4f46e5', 
            '&:hover': { bgcolor: '#4338ca' },
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            fontWeight: 700
          }}
        >
          Launch Portal
        </Button>
      </Container>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 12, textAlign: 'center' }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900, 
              mb: 3, 
              lineHeight: 1.15,
              fontSize: { xs: '2.5rem', md: '3.75rem' },
              background: 'linear-gradient(135deg, #ffffff 40%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Billing & Inventory Management for Furniture Showrooms
          </Typography>
          <Typography variant="h6" sx={{ color: '#9ca3af', mb: 5, fontWeight: 400, lineHeight: 1.6 }}>
            DecoCraft Furnishers point-of-sale automates invoicing, tracks multi-category warehouse inventory, manages deliveries with route optimization, and generates real-time tax logs.
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 8 }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={onLaunchApp}
              endIcon={<ArrowForward />}
              sx={{ 
                bgcolor: '#4f46e5', 
                '&:hover': { bgcolor: '#4338ca' },
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: 3,
                px: 4,
                py: 1.8,
                textTransform: 'none',
                boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)'
              }}
            >
              Start 1-Week Free Trial
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={onLaunchApp}
              sx={{ 
                color: '#fff', 
                borderColor: '#374151',
                '&:hover': { borderColor: '#4f46e5', bgcolor: 'rgba(79, 70, 229, 0.05)' },
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: 3,
                px: 4,
                py: 1.8,
                textTransform: 'none'
              }}
            >
              Sign In to Account
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Features Grid */}
      <Box sx={{ bgcolor: '#0f172a', py: 12 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 8, color: '#fff' }}>
            Everything You Need to Run Your Showroom
          </Typography>
          
          <Grid container spacing={4}>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', color: '#fff', height: '100%', borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ bgcolor: 'rgba(79, 70, 229, 0.15)', color: '#818cf8', width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <ShoppingCart />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Point of Sale & Invoicing</Typography>
                  <Typography sx={{ color: '#9ca3af', lineHeight: 1.6 }}>
                    Direct barcode lookup, tax calculation (GST inclusion/exclusion), discount controls, printing layouts, and advance/partial payment workflows.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', color: '#fff', height: '100%', borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ bgcolor: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <LocalShipping />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Smart Route Optimization</Typography>
                  <Typography sx={{ color: '#9ca3af', lineHeight: 1.6 }}>
                    Calculates delivery paths automatically, logs driver details, provides ETAs, and computes fuel metrics to reduce logistic costs.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', color: '#fff', height: '100%', borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <Assessment />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Automated Tax Logs & Profits</Typography>
                  <Typography sx={{ color: '#9ca3af', lineHeight: 1.6 }}>
                    Tracks daily and monthly net revenue, customer balance ledgers, Restock / PO records, and Input Tax Credit (ITC) logs dynamically.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* PWA Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Paper sx={{ bgcolor: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)', border: '1px solid #312e81', borderRadius: 6, p: { xs: 4, md: 8 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FlashOn sx={{ color: '#fbbf24' }} /> Works Offline & Installs as Desktop Application
              </Typography>
              <Typography sx={{ color: '#9ca3af', mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
                DecoCraft is a Progressive Web App (PWA). You can install it on your computer as a standalone desktop utility that runs fast, supports direct offline caching, and secures data offline until network recovery.
              </Typography>
              <Button 
                variant="contained" 
                color="warning" 
                onClick={onLaunchApp}
                sx={{ 
                  borderRadius: 3, 
                  px: 4, 
                  py: 1.5, 
                  textTransform: 'none', 
                  fontWeight: 700,
                  bgcolor: '#fbbf24',
                  color: '#0f172a',
                  '&:hover': { bgcolor: '#f59e0b' }
                }}
              >
                Install App Portal
              </Button>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Box sx={{ fontSize: 100, filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.2))' }}>
                💻
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Pricing / Trial Section */}
      <Box sx={{ bgcolor: '#0f172a', py: 12 }}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 2 }}>
            Simple, Transparent Pricing
          </Typography>
          <Typography align="center" sx={{ color: '#9ca3af', mb: 8, fontSize: '1.1rem' }}>
            No hidden charges. Start with full functionality for free and subscribe when ready.
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            
            {/* Free Trial */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: 4, height: '100%' }}>
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="h6" sx={{ color: '#818cf8', fontWeight: 700, mb: 1 }}>FREE DRILL</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, mb: 3 }}>₹0</Typography>
                  <Typography variant="subtitle2" sx={{ color: '#9ca3af', mb: 3 }}>1 Week Free Trial Access</Typography>
                  <Divider sx={{ borderColor: '#334155', mb: 3 }} />
                  
                  <Stack spacing={2} sx={{ mb: 4, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleOutline sx={{ color: '#34d399', fontSize: 20 }} />
                      <Typography variant="body2">7 Days Full Access</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleOutline sx={{ color: '#34d399', fontSize: 20 }} />
                      <Typography variant="body2">Unlimited Invoices & Products</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleOutline sx={{ color: '#34d399', fontSize: 20 }} />
                      <Typography variant="body2">No Credit Card Required</Typography>
                    </Box>
                  </Stack>

                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={onLaunchApp}
                    sx={{ 
                      borderColor: '#4f46e5', 
                      color: '#818cf8', 
                      borderRadius: 3, 
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 700,
                      '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.1)', borderColor: '#818cf8' }
                    }}
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Premium Monthly */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: '#1e293b', border: '2px solid #4f46e5', color: '#fff', borderRadius: 4, position: 'relative', height: '100%', boxShadow: '0 8px 30px rgba(79, 70, 229, 0.25)' }}>
                <Box sx={{ position: 'absolute', top: 16, right: 16, bgcolor: '#4f46e5', color: '#fff', px: 2, py: 0.5, borderRadius: 1.5, fontSize: '0.75rem', fontWeight: 800 }}>
                  POPULAR
                </Box>
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="h6" sx={{ color: '#a5b4fc', fontWeight: 700, mb: 1 }}>PROFESSIONAL</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>₹6,000</Typography>
                  <Typography variant="subtitle2" sx={{ color: '#a5b4fc', mb: 3 }}>per month subscription</Typography>
                  <Divider sx={{ borderColor: '#334155', mb: 3 }} />
                  
                  <Stack spacing={2} sx={{ mb: 4, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleOutline sx={{ color: '#34d399', fontSize: 20 }} />
                      <Typography variant="body2">Unlimited Everything</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleOutline sx={{ color: '#34d399', fontSize: 20 }} />
                      <Typography variant="body2">Automatic Database Cloud Backup</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleOutline sx={{ color: '#34d399', fontSize: 20 }} />
                      <Typography variant="body2">Multi-Role User Accounts</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleOutline sx={{ color: '#34d399', fontSize: 20 }} />
                      <Typography variant="body2">24/7 Premium Support</Typography>
                    </Box>
                  </Stack>

                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={onLaunchApp}
                    sx={{ 
                      bgcolor: '#4f46e5', 
                      borderRadius: 3, 
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 700,
                      '&:hover': { bgcolor: '#4338ca' }
                    }}
                  >
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Container maxWidth="lg" sx={{ py: 6, mt: 4 }}>
        <Divider sx={{ borderColor: '#1e293b', mb: 4 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            © {new Date().getFullYear()} DecoCraft Furnishers palakkad All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Made with 🛋️ and ☕
          </Typography>
        </Box>
      </Container>

    </Box>
  );
};
