import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Tabs,
  Tab,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Receipt,
  Download,
  Print,
  DateRange,
  PieChart,
  BarChart,
  Assessment,
  CheckCircle,
  Warning,
  Pending,
  Sync,
  MonetizationOn,
  LocalAtm,
  CreditCard,
  Phone,
} from '@mui/icons-material';

// Mock revenue data
const revenueData = {
  currentMonth: {
    total: 4526780,
    target: 5000000,
    collected: 4126780,
    pending: 400000,
    growth: 12.5,
  },
  previousMonth: {
    total: 4023450,
  },
  ytd: {
    total: 48567890,
    target: 55000000,
  },
};

// Revenue by category
const revenueByCategory = [
  { category: 'Title Registration', amount: 1250000, percentage: 27.6, color: '#0D9488' },
  { category: 'Stamp Duty', amount: 980000, percentage: 21.6, color: '#F59E0B' },
  { category: 'Land Rent', amount: 850000, percentage: 18.8, color: '#3B82F6' },
  { category: 'Survey Fees', amount: 620000, percentage: 13.7, color: '#8B5CF6' },
  { category: 'Search Fees', amount: 450000, percentage: 9.9, color: '#EC4899' },
  { category: 'Other Fees', amount: 376780, percentage: 8.3, color: '#6B7280' },
];

// Revenue by region
const revenueByRegion = [
  { region: 'Greater Accra', amount: 1850000, transactions: 1245, percentage: 40.9 },
  { region: 'Ashanti', amount: 980000, transactions: 678, percentage: 21.6 },
  { region: 'Western', amount: 520000, transactions: 345, percentage: 11.5 },
  { region: 'Northern', amount: 380000, transactions: 234, percentage: 8.4 },
  { region: 'Eastern', amount: 350000, transactions: 289, percentage: 7.7 },
  { region: 'Other Regions', amount: 446780, transactions: 456, percentage: 9.9 },
];

// Payment channels breakdown
const paymentChannels = [
  { channel: 'Mobile Money', amount: 2150000, percentage: 47.5, icon: <Phone />, color: '#FCD116' },
  { channel: 'Bank Transfer', amount: 1450000, percentage: 32.0, icon: <AccountBalance />, color: '#3B82F6' },
  { channel: 'Card Payment', amount: 750000, percentage: 16.6, icon: <CreditCard />, color: '#8B5CF6' },
  { channel: 'Cash', amount: 176780, percentage: 3.9, icon: <LocalAtm />, color: '#6B7280' },
];

// Reconciliation status
const reconciliationData = {
  totalTransactions: 3247,
  reconciled: 3189,
  pending: 45,
  failed: 13,
  lastReconciled: '2024-11-19T14:30:00',
};

// Recent transactions
const recentTransactions = [
  { id: 'TXN-001', date: '2024-11-19', type: 'Title Registration', amount: 3500, status: 'completed', region: 'Accra' },
  { id: 'TXN-002', date: '2024-11-19', type: 'Stamp Duty', amount: 12500, status: 'completed', region: 'Kumasi' },
  { id: 'TXN-003', date: '2024-11-19', type: 'Land Search', amount: 150, status: 'pending', region: 'Accra' },
  { id: 'TXN-004', date: '2024-11-18', type: 'Survey Fee', amount: 2500, status: 'completed', region: 'Takoradi' },
  { id: 'TXN-005', date: '2024-11-18', type: 'Land Rent', amount: 850, status: 'failed', region: 'Tamale' },
];

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function RevenueReportingPage() {
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const formatCurrency = (amount) => {
    return `GHS ${amount.toLocaleString('en-GH', { minimumFractionDigits: 0 })}`;
  };

  const collectionRate = (revenueData.currentMonth.collected / revenueData.currentMonth.target) * 100;
  const ytdRate = (revenueData.ytd.total / revenueData.ytd.target) * 100;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Revenue & Reconciliation Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Financial reporting, payment reconciliation, and revenue analytics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Download />} size="small">
            Export Report
          </Button>
          <Button variant="outlined" startIcon={<Print />} size="small">
            Print
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Time Period</InputLabel>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                label="Time Period"
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="quarter">This Quarter</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Region</InputLabel>
              <Select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                label="Region"
              >
                <MenuItem value="all">All Regions</MenuItem>
                <MenuItem value="accra">Greater Accra</MenuItem>
                <MenuItem value="ashanti">Ashanti</MenuItem>
                <MenuItem value="western">Western</MenuItem>
                <MenuItem value="northern">Northern</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Custom Date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date().toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Total Revenue */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Revenue (Month)
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    {formatCurrency(revenueData.currentMonth.total)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                    <Typography variant="caption" color="success.main">
                      +{revenueData.currentMonth.growth}% vs last month
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <MonetizationOn color="primary" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Collected */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Collected
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', my: 0.5, color: 'success.main' }}>
                    {formatCurrency(revenueData.currentMonth.collected)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {collectionRate.toFixed(1)}% of target
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <CheckCircle color="success" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pending Settlement
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', my: 0.5, color: 'warning.main' }}>
                    {formatCurrency(revenueData.currentMonth.pending)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {reconciliationData.pending} transactions
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <Pending color="warning" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* YTD */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Year-to-Date
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', my: 0.5 }}>
                    {formatCurrency(revenueData.ytd.total)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {ytdRate.toFixed(1)}% of annual target
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <Assessment color="info" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Collection Progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Monthly Collection Progress</Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                {formatCurrency(revenueData.currentMonth.collected)} collected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Target: {formatCurrency(revenueData.currentMonth.target)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={collectionRate}
              sx={{ height: 12, borderRadius: 6 }}
              color={collectionRate >= 80 ? 'success' : collectionRate >= 60 ? 'primary' : 'warning'}
            />
          </Box>
          <Alert severity={collectionRate >= 80 ? 'success' : 'info'} icon={collectionRate >= 80 ? <CheckCircle /> : <TrendingUp />}>
            {collectionRate >= 80
              ? `Excellent! ${(100 - collectionRate).toFixed(1)}% remaining to reach monthly target.`
              : `${(100 - collectionRate).toFixed(1)}% remaining. ${Math.ceil((revenueData.currentMonth.target - revenueData.currentMonth.collected) / 30)} days to collect outstanding amounts.`}
          </Alert>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="By Category" icon={<PieChart />} iconPosition="start" />
          <Tab label="By Region" icon={<BarChart />} iconPosition="start" />
          <Tab label="Payment Channels" icon={<CreditCard />} iconPosition="start" />
          <Tab label="Reconciliation" icon={<Sync />} iconPosition="start" />
        </Tabs>

        {/* By Category Tab */}
        <TabPanel value={tabValue} index={0}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Typography variant="subtitle2" gutterBottom>Revenue by Service Category</Typography>
                {revenueByCategory.map((item) => (
                  <Box key={item.category} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{item.category}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(item.amount)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{
                          flex: 1,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: '#E5E7EB',
                          '& .MuiLinearProgress-bar': { bgcolor: item.color }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 40 }}>
                        {item.percentage}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Summary</Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Categories</TableCell>
                        <TableCell align="right">{revenueByCategory.length}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Highest Revenue</TableCell>
                        <TableCell align="right">{revenueByCategory[0].category}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Average per Category</TableCell>
                        <TableCell align="right">
                          {formatCurrency(revenueData.currentMonth.total / revenueByCategory.length)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* By Region Tab */}
        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Region</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="right">Transactions</TableCell>
                    <TableCell align="right">Share</TableCell>
                    <TableCell>Progress</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueByRegion.map((item) => (
                    <TableRow key={item.region}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {item.region}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(item.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip label={item.transactions} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        {item.percentage}%
                      </TableCell>
                      <TableCell sx={{ width: 150 }}>
                        <LinearProgress
                          variant="determinate"
                          value={item.percentage}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </TabPanel>

        {/* Payment Channels Tab */}
        <TabPanel value={tabValue} index={2}>
          <CardContent>
            <Grid container spacing={3}>
              {paymentChannels.map((channel) => (
                <Grid item xs={12} sm={6} md={3} key={channel.channel}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: channel.color, mx: 'auto', mb: 1 }}>
                      {channel.icon}
                    </Avatar>
                    <Typography variant="subtitle2">{channel.channel}</Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ my: 1 }}>
                      {formatCurrency(channel.amount)}
                    </Typography>
                    <Chip
                      label={`${channel.percentage}%`}
                      size="small"
                      sx={{ bgcolor: channel.color, color: 'white' }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Alert severity="info" sx={{ mt: 3 }}>
              Mobile Money dominates with {paymentChannels[0].percentage}% of all transactions, reflecting Ghana's mobile-first payment culture.
            </Alert>
          </CardContent>
        </TabPanel>

        {/* Reconciliation Tab */}
        <TabPanel value={tabValue} index={3}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Reconciliation Status</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Reconciled"
                        secondary={`${reconciliationData.reconciled} transactions`}
                      />
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {((reconciliationData.reconciled / reconciliationData.totalTransactions) * 100).toFixed(1)}%
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Pending color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Pending"
                        secondary={`${reconciliationData.pending} transactions`}
                      />
                      <Typography variant="body2" fontWeight="bold" color="warning.main">
                        {((reconciliationData.pending / reconciliationData.totalTransactions) * 100).toFixed(1)}%
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Warning color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Failed"
                        secondary={`${reconciliationData.failed} transactions`}
                      />
                      <Typography variant="body2" fontWeight="bold" color="error.main">
                        {((reconciliationData.failed / reconciliationData.totalTransactions) * 100).toFixed(1)}%
                      </Typography>
                    </ListItem>
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" color="text.secondary">
                    Last reconciliation: {new Date(reconciliationData.lastReconciled).toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle2" gutterBottom>Recent Transactions</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Region</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentTransactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                              {txn.id}
                            </Typography>
                          </TableCell>
                          <TableCell>{txn.date}</TableCell>
                          <TableCell>{txn.type}</TableCell>
                          <TableCell>{txn.region}</TableCell>
                          <TableCell align="right">{formatCurrency(txn.amount)}</TableCell>
                          <TableCell>
                            <Chip
                              label={txn.status}
                              size="small"
                              color={
                                txn.status === 'completed' ? 'success' :
                                txn.status === 'pending' ? 'warning' : 'error'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>
      </Card>
    </Box>
  );
}
