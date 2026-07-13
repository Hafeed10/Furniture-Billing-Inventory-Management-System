import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton,
  InputAdornment,
  Chip,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  Add, 
  Search, 
  Edit, 
  Delete, 
  Warning, 
  LocationOn,
  Image as ImageIcon,
  QrCode,
  AutoAwesome,
  GridView,
  ViewList
} from '@mui/icons-material';
import { db, Product, Category } from '../db/db';
import { useAppStore } from '../store/store';

const generateUniqueBarcode = (existingProducts: Product[]): string => {
  const prefix = '890'; // Indian manufacturer code prefix for mock standard
  let isUnique = false;
  let newBarcode = '';
  while (!isUnique) {
    const randomPart = Math.floor(100000000 + Math.random() * 900000000).toString();
    newBarcode = prefix + randomPart;
    isUnique = !existingProducts.some(p => p.barcode === newBarcode);
  }
  return newBarcode;
};

const autoGenerateImage = (name: string, categoryId: string): string => {
  const cleanName = name.toLowerCase();
  
  // Sofa keywords
  if (cleanName.includes('sofa') || cleanName.includes('couch') || cleanName.includes('recliner')) {
    const sofaImages = [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80'
    ];
    return sofaImages[Math.floor(Math.random() * sofaImages.length)];
  }
  
  // Bed & Wardrobe keywords
  if (cleanName.includes('bed') || cleanName.includes('mattress') || cleanName.includes('wardrobe') || cleanName.includes('cupboard')) {
    const bedImages = [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80'
    ];
    return bedImages[Math.floor(Math.random() * bedImages.length)];
  }
  
  // Dining / Table keywords
  if (cleanName.includes('dining') || cleanName.includes('table') || cleanName.includes('desk')) {
    const tableImages = [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1530018607912-eff2df114f11?auto=format&fit=crop&w=600&q=80'
    ];
    return tableImages[Math.floor(Math.random() * tableImages.length)];
  }
  
  // Chair keywords
  if (cleanName.includes('chair') || cleanName.includes('stool')) {
    const chairImages = [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598191381897-c87ca5754988?auto=format&fit=crop&w=600&q=80'
    ];
    return chairImages[Math.floor(Math.random() * chairImages.length)];
  }
  
  // Cabinet / TV Unit / Storage keywords
  if (cleanName.includes('cabinet') || cleanName.includes('tv') || cleanName.includes('stand') || cleanName.includes('shelf') || cleanName.includes('drawer')) {
    const cabinetImages = [
      'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1607473037863-24db567318e1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'
    ];
    return cabinetImages[Math.floor(Math.random() * cabinetImages.length)];
  }
  
  // Category-based fallback
  if (categoryId === 'cat-1') {
    return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'; // Sofa
  } else if (categoryId === 'cat-2') {
    return 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80'; // Bed
  } else if (categoryId === 'cat-3') {
    return 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80'; // Dining
  } else if (categoryId === 'cat-4') {
    return 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80'; // Office Chair
  } else if (categoryId === 'cat-5') {
    return 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?auto=format&fit=crop&w=600&q=80'; // TV Unit
  }
  
  // Global generic fallback
  return 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80';
};

export const Products: React.FC = () => {
  const dbRevision = useAppStore(state => state.dbRevision);
  const triggerDbUpdate = useAppStore(state => state.triggerDbUpdate);
  const currentUser = useAppStore(state => state.currentUser);

  // Lists
  const products = useMemo(() => db.getProducts(), [dbRevision]);
  const categories = useMemo(() => db.getCategories(), [dbRevision]);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  // Form Dialog
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Form fields
  const [code, setCode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [catId, setCatId] = useState('');
  const [brand, setBrand] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [gstRate, setGstRate] = useState(18);
  const [stockQty, setStockQty] = useState(0);
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Access Control check
  const canModify = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  const handleOpen = (prod: Product | null = null) => {
    if (!canModify) return;
    if (prod) {
      setEditProduct(prod);
      setCode(prod.code);
      setBarcode(prod.barcode || '');
      setName(prod.name);
      setCatId(prod.categoryId);
      setBrand(prod.brand);
      setMaterial(prod.material);
      setColor(prod.color);
      setSize(prod.size);
      setPurchasePrice(prod.purchasePrice);
      setSellingPrice(prod.sellingPrice);
      setGstRate(prod.gstRate);
      setStockQty(prod.stockQty);
      setWarehouseLocation(prod.warehouseLocation);
      setImageUrl(prod.image || '');
    } else {
      setEditProduct(null);
      setCode('');
      setBarcode(generateUniqueBarcode(products));
      setName('');
      setCatId(categories[0]?.id || '');
      setBrand('');
      setMaterial('');
      setColor('');
      setSize('');
      setPurchasePrice(0);
      setSellingPrice(0);
      setGstRate(18);
      setStockQty(0);
      setWarehouseLocation('');
      setImageUrl('');
    }
    setOpen(true);
  };

  const handleSave = () => {
    if (!code || !name || !catId || !purchasePrice || !sellingPrice) {
      alert('Please fill in all required fields.');
      return;
    }

    const prodData: Product = {
      id: editProduct ? editProduct.id : `prod-${Date.now()}`,
      code,
      barcode,
      name,
      categoryId: catId,
      brand,
      material,
      color,
      size,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      gstRate: Number(gstRate),
      stockQty: Number(stockQty),
      warehouseLocation,
      image: imageUrl
    };

    db.saveProduct(prodData);
    
    // Log direct adjustment transaction for audit if new product has stock
    if (!editProduct && prodData.stockQty > 0) {
      db.adjustStock(prodData.id, prodData.stockQty, 'in', 'Initial Stock Setup');
    }

    triggerDbUpdate();
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!canModify) return;
    if (window.confirm('Are you sure you want to delete this product?')) {
      db.deleteProduct(id);
      triggerDbUpdate();
    }
  };

  const handleAutofillCategories = () => {
    const INITIAL_CATEGORIES: Category[] = [
      { id: 'cat-1', name: 'Sofas & Recliners' },
      { id: 'cat-2', name: 'Beds & Wardrobes' },
      { id: 'cat-3', name: 'Dining Tables' },
      { id: 'cat-4', name: 'Office Chairs & Desks' },
      { id: 'cat-5', name: 'TV Units & Cabinets' }
    ];
    INITIAL_CATEGORIES.forEach(cat => {
      db.saveCategory(cat);
    });
    if (!catId) {
      setCatId('cat-1');
    }
    triggerDbUpdate();
  };

  // Image Upload Simulate (base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered List
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.code.toLowerCase().includes(search.toLowerCase()) ||
                            (p.barcode && p.barcode.includes(search));
      const matchesCat = selectedCat === 'All' || p.categoryId === selectedCat;
      return matchesSearch && matchesCat;
    });
  }, [products, search, selectedCat]);

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Product Management
        </Typography>
        {canModify && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Add New Product
          </Button>
        )}
      </Box>

      {categories.length === 0 && (
        <Box sx={{ mb: 4 }}>
          <Alert 
            severity="warning" 
            action={
              <Button color="primary" variant="contained" size="small" onClick={handleAutofillCategories}>
                Autofill 5 Categories
              </Button>
            }
          >
            No categories found. Click the button to automatically create 5 default categories (Sofas, Beds, Dining, Office, TV Units) to begin adding products.
          </Alert>
        </Box>
      )}

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Search by Name, Code, or Barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="Filter Category"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <MenuItem value="All">All Categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={(e, val) => val && setViewType(val)}
            aria-label="view type"
            sx={{ height: 56 }}
          >
            <ToggleButton value="grid" aria-label="grid view" title="Grid View">
              <GridView />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view" title="List View">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      {/* Product Display */}
      {viewType === 'grid' ? (
        <Grid container spacing={3}>
          {filteredProducts.map((prod) => {
            const category = categories.find(c => c.id === prod.categoryId);
            const isLowStock = prod.stockQty <= 5;
            return (
              <Grid item xs={12} sm={6} md={4} key={prod.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box 
                    sx={{ 
                      height: 180, 
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1f2937' : '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    {prod.image ? (
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <ImageIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.3 }} />
                    )}

                    {isLowStock && (
                      <Chip 
                        icon={<Warning sx={{ fontSize: '14px !important' }} />}
                        label={`Low Stock: ${prod.stockQty}`} 
                        color="error" 
                        size="small"
                        sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 700 }}
                      />
                    )}
                    <Chip 
                      label={category?.name || 'Uncategorized'} 
                      size="small"
                      variant="outlined"
                      sx={{ position: 'absolute', top: 10, left: 10, bgcolor: 'background.paper' }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {prod.code}
                    </Typography>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1, height: 56, overflow: 'hidden' }}>
                      {prod.name}
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Brand</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{prod.brand || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Material</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{prod.material || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Selling Price</Typography>
                        <Typography variant="body1" color="primary" sx={{ fontWeight: 700 }}>
                          ₹{prod.sellingPrice.toLocaleString('en-IN')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Stock Available</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: isLowStock ? 'error.main' : 'text.primary' }}>
                          {prod.stockQty} units
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {prod.warehouseLocation || 'Warehouse Floor'}
                      </Typography>
                    </Box>
                  </CardContent>
                  {canModify && (
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <IconButton size="small" color="primary" onClick={() => handleOpen(prod)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(prod.id)}>
                        <Delete />
                      </IconButton>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            );
          })}

          {filteredProducts.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography color="text.secondary">No products found matching filters.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand / Material</TableCell>
                <TableCell align="right">Selling Price</TableCell>
                <TableCell align="right">Stock Available</TableCell>
                <TableCell>Location</TableCell>
                {canModify && <TableCell align="center">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((prod) => {
                const category = categories.find(c => c.id === prod.categoryId);
                const isLowStock = prod.stockQty <= 5;
                return (
                  <TableRow key={prod.id}>
                    <TableCell>
                      {prod.image ? (
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} 
                        />
                      ) : (
                        <Box sx={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', borderRadius: 4 }}>
                          <ImageIcon sx={{ color: 'text.secondary', fontSize: 24, opacity: 0.5 }} />
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{prod.code}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{prod.name}</TableCell>
                    <TableCell>
                      <Chip label={category?.name || 'Uncategorized'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{prod.brand || 'N/A'}</Typography>
                      <Typography variant="caption" color="text.secondary">{prod.material || 'N/A'}</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ₹{prod.sellingPrice.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: isLowStock ? 'error.main' : 'text.primary' }}>
                      {prod.stockQty} units
                    </TableCell>
                    <TableCell>{prod.warehouseLocation || 'Warehouse Floor'}</TableCell>
                    {canModify && (
                      <TableCell align="center">
                        <IconButton size="small" color="primary" onClick={() => handleOpen(prod)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(prod.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={canModify ? 9 : 8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No products found matching filters.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* CRUD Dialog Form */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                required
                fullWidth 
                label="Product Code" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Barcode / SKU (Optional)" 
                value={barcode} 
                onChange={(e) => setBarcode(e.target.value)} 
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        color="primary"
                        title="Generate Barcode"
                        onClick={() => setBarcode(generateUniqueBarcode(products))}
                        edge="end"
                      >
                        <QrCode />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField 
                required
                fullWidth 
                label="Product Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              {categories.length > 0 ? (
                <TextField
                  required
                  fullWidth
                  select
                  label="Category"
                  value={catId}
                  onChange={(e) => setCatId(e.target.value)}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </TextField>
              ) : (
                <Button 
                  variant="outlined" 
                  color="warning" 
                  fullWidth 
                  onClick={handleAutofillCategories}
                  sx={{ height: 56 }}
                >
                  Autofill Categories
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Brand" 
                value={brand} 
                onChange={(e) => setBrand(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Material" 
                value={material} 
                onChange={(e) => setMaterial(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Dimensions / Size" 
                value={size} 
                onChange={(e) => setSize(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                required
                fullWidth 
                type="number"
                label="Purchase Price (₹)" 
                value={purchasePrice} 
                onChange={(e) => setPurchasePrice(Number(e.target.value))} 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                required
                fullWidth 
                type="number"
                label="Selling Price (₹)" 
                value={sellingPrice} 
                onChange={(e) => setSellingPrice(Number(e.target.value))} 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="GST Rate (%)"
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
              >
                <MenuItem value={0}>0%</MenuItem>
                <MenuItem value={5}>5%</MenuItem>
                <MenuItem value={12}>12%</MenuItem>
                <MenuItem value={18}>18%</MenuItem>
                <MenuItem value={28}>28%</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                required
                fullWidth 
                type="number"
                label="Stock Quantity" 
                value={stockQty} 
                onChange={(e) => setStockQty(Number(e.target.value))} 
                disabled={!!editProduct} // Inwards should be registered via Purchase orders
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Warehouse Location" 
                value={warehouseLocation} 
                onChange={(e) => setWarehouseLocation(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                    fullWidth
                    sx={{ height: 48 }}
                  >
                    Upload Product Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageFileChange}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<AutoAwesome />}
                    fullWidth
                    sx={{ height: 48 }}
                    onClick={() => setImageUrl(autoGenerateImage(name, catId))}
                  >
                    Auto-Generate Image
                  </Button>
                </Grid>
              </Grid>
              {imageUrl && (
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <img src={imageUrl} alt="Preview" style={{ maxHeight: 150, borderRadius: 8 }} />
                  <Button 
                    size="small" 
                    color="error" 
                    variant="text"
                    onClick={() => setImageUrl('')}
                  >
                    Remove Image
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save Product</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
