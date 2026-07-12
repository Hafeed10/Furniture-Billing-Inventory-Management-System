import React, { useMemo } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { 
  TrendingUp, 
  LocalShipping, 
  Warning, 
  AttachMoney, 
  Receipt,
  PointOfSale
} from '@mui/icons-material';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { db } from '../db/db';
import { useAppStore } from '../store/store';

const COLORS = ['#818cf8', '#22d3ee', '#34d399', '#fbbf24', '#f87171'];

export const Dashboard: React.FC = () => {
  const dbRevision = useAppStore(state => state.dbRevision);

  // Load calculations reactively based on dbRevision
  const stats = useMemo(() => {
    const sales = db.getSales();
    const deliveries = db.getDeliveries();
    const products = db.getProducts();
    const customers = db.getCustomers();
    const categories = db.getCategories();

    const todayStr = new Date().toISOString().split('T')[0];
    
    // 1. Today's sales
    const todaySales = sales
      .filter(s => s.saleDate.startsWith(todayStr))
      .reduce((sum, s) => sum + s.totalAmount, 0);

    // 2. Pending Deliveries
    const pendingDel = deliveries.filter(d => d.status !== 'Delivered').length;

    // 3. Pending Payments
    const pendingPayments = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);

    // 4. Low stock items
    const lowStockList = products.filter(p => p.stockQty <= 5);
    const lowStockCount = lowStockList.length;

    // 5. Monthly Revenue
    const curMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
    const monthlyRev = sales
      .filter(s => s.saleDate.startsWith(curMonth))
      .reduce((sum, s) => sum + s.totalAmount, 0);

    // 6. Chart: Monthly revenue trend (group sales by month/day)
    // For demo: group by date or month of past sales
    const salesByMonth: { [key: string]: number } = {};
    sales.forEach(s => {
      const monthName = new Date(s.saleDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      salesByMonth[monthName] = (salesByMonth[monthName] || 0) + s.totalAmount;
    });
    
    const chartData = Object.keys(salesByMonth).map(month => ({
      name: month,
      Revenue: salesByMonth[month]
    })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    // 7. Chart: Product Category Distribution
    const catSales: { [key: string]: number } = {};
    const saleItems = db.getSaleItems();
    
    saleItems.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const cat = categories.find(c => c.id === prod?.categoryId);
      const catName = cat ? cat.name : 'Other';
      catSales[catName] = (catSales[catName] || 0) + item.total;
    });

    const pieData = Object.keys(catSales).map(catName => ({
      name: catName,
      value: catSales[catName]
    }));

    // Recent 5 sales
    const recentSales = [...sales]
      .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
      .slice(0, 5);

    return {
      todaySales,
      pendingDel,
      pendingPayments,
      lowStockCount,
      lowStockList,
      monthlyRev,
      chartData,
      pieData,
      recentSales,
      customers
    };
  }, [dbRevision]);

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 800 }}>
        Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Today's Sales
                </Typography>
                <PointOfSale sx={{ color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                ₹{stats.todaySales.toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Pending Deliveries
                </Typography>
                <LocalShipping sx={{ color: 'info.main' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {stats.pendingDel}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Pending Payments
                </Typography>
                <AttachMoney sx={{ color: 'success.main' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                ₹{stats.pendingPayments.toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Low-Stock Items
                </Typography>
                <Warning sx={{ color: stats.lowStockCount > 0 ? 'error.main' : 'text.secondary' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {stats.lowStockCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Monthly Revenue
                </Typography>
                <TrendingUp sx={{ color: 'secondary.main' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                ₹{stats.monthlyRev.toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Sales Trend (Revenue)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                <Area type="monotone" dataKey="Revenue" stroke="#818cf8" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Category Distribution
            </Typography>
            {stats.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Sales']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', height: '80%', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">No Sales Data</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Tables and Alerts */}
      <Grid container spacing={3}>
        {/* Recent Invoices */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Recent Sales Invoices
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentSales.map((sale) => {
                    const customer = stats.customers.find(c => c.id === sale.customerId);
                    return (
                      <TableRow key={sale.id}>
                        <TableCell sx={{ fontWeight: 600 }}>{sale.invoiceNumber}</TableCell>
                        <TableCell>{customer?.name || 'Walk-in Customer'}</TableCell>
                        <TableCell>{new Date(sale.saleDate).toLocaleDateString('en-IN')}</TableCell>
                        <TableCell>₹{sale.totalAmount.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <Chip 
                            label={sale.paymentStatus} 
                            size="small"
                            color={
                              sale.paymentStatus === 'Paid' ? 'success' : 
                              sale.paymentStatus === 'Partial' ? 'warning' : 'error'
                            } 
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {stats.recentSales.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No invoices recorded yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Low-Stock Alerts (≤5)
            </Typography>
            {stats.lowStockList.length > 0 ? (
              <List>
                {stats.lowStockList.map((product) => (
                  <ListItem key={product.id} divider>
                    <ListItemIcon>
                      <Warning color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={product.name} 
                      secondary={`Code: ${product.code} | Location: ${product.warehouseLocation}`} 
                    />
                    <Chip 
                      label={`${product.stockQty} left`} 
                      color="error" 
                      variant="outlined" 
                      size="small" 
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ display: 'flex', py: 4, alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">All products are well stocked! 🎉</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
