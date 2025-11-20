import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent, FormControl, InputLabel,
  Select, MenuItem, Chip, Divider, LinearProgress
} from '@mui/material';

export default function AnalyticsDashboardPage() {
  const [region, setRegion] = useState('all');
  const [period, setPeriod] = useState('year');

  // Mock analytics data - enhanced metrics for land administration
  const stats = {
    totalParcels: 1247856,
    registeredTitles: 856432,
    pendingApplications: 12456,
    activeDisputes: 3421,
    monthlyTransactions: 4523,
    totalRevenue: 45600000,
    avgProcessingTime: 12,
    satisfactionRate: 87,
    registrationCoverage: 68.6,
    womenOnTitles: 42,
    jointTitles: 23,
    tier1Registrations: 28450,
    tier2Registrations: 14230,
    tier3Registrations: 3143,
    digitalAdoption: 62,
    revenueTarget: 52000000,
    collectionRate: 87.7
  };

  const regionalData = [
    { region: 'Greater Accra', parcels: 345000, titles: 289000, disputes: 890, revenue: 'GHS 15.2M' },
    { region: 'Ashanti', parcels: 287000, titles: 198000, disputes: 720, revenue: 'GHS 9.8M' },
    { region: 'Western', parcels: 156000, titles: 112000, disputes: 445, revenue: 'GHS 6.2M' },
    { region: 'Eastern', parcels: 134000, titles: 98000, disputes: 380, revenue: 'GHS 4.8M' },
    { region: 'Central', parcels: 112000, titles: 78000, disputes: 320, revenue: 'GHS 3.9M' },
    { region: 'Northern', parcels: 98000, titles: 45000, disputes: 410, revenue: 'GHS 2.8M' },
    { region: 'Volta', parcels: 67000, titles: 23000, disputes: 156, revenue: 'GHS 1.5M' },
    { region: 'Others', parcels: 48856, titles: 13432, disputes: 100, revenue: 'GHS 1.4M' }
  ];

  const landUseDistribution = [
    { type: 'Residential', percentage: 45, color: '#006B3F' },
    { type: 'Agricultural', percentage: 28, color: '#FCD116' },
    { type: 'Commercial', percentage: 15, color: '#CE1126' },
    { type: 'Industrial', percentage: 8, color: '#1976d2' },
    { type: 'Mixed Use', percentage: 4, color: '#9c27b0' }
  ];

  const monthlyTrends = [
    { month: 'Jan', registrations: 3200, transfers: 890, disputes: 45 },
    { month: 'Feb', registrations: 3450, transfers: 920, disputes: 52 },
    { month: 'Mar', registrations: 3800, transfers: 1050, disputes: 38 },
    { month: 'Apr', registrations: 4100, transfers: 980, disputes: 61 },
    { month: 'May', registrations: 4350, transfers: 1120, disputes: 55 },
    { month: 'Jun', registrations: 4200, transfers: 1080, disputes: 48 },
    { month: 'Jul', registrations: 4500, transfers: 1200, disputes: 42 },
    { month: 'Aug', registrations: 4800, transfers: 1150, disputes: 39 },
    { month: 'Sep', registrations: 4600, transfers: 1300, disputes: 51 },
    { month: 'Oct', registrations: 4900, transfers: 1280, disputes: 44 },
    { month: 'Nov', registrations: 5100, transfers: 1350, disputes: 37 }
  ];

  // Quarterly revenue data
  const quarterlyRevenue = [
    { quarter: 'Q1', value: 8.2, target: 10, collected: 7.8, outstanding: 0.4 },
    { quarter: 'Q2', value: 11.5, target: 12, collected: 10.9, outstanding: 0.6 },
    { quarter: 'Q3', value: 14.3, target: 15, collected: 13.8, outstanding: 0.5 },
    { quarter: 'Q4', value: 11.6, target: 15, collected: 10.2, outstanding: 1.4 },
  ];

  // Processing time improvement data
  const processingTimeData = [
    { month: 'Jan', days: 18, applications: 2890 },
    { month: 'Feb', days: 16, applications: 3120 },
    { month: 'Mar', days: 15, applications: 3450 },
    { month: 'Apr', days: 14, applications: 3680 },
    { month: 'May', days: 13, applications: 3920 },
    { month: 'Jun', days: 12, applications: 4150 },
    { month: 'Jul', days: 12, applications: 4380 },
    { month: 'Aug', days: 11, applications: 4520 },
    { month: 'Sep', days: 11, applications: 4680 },
    { month: 'Oct', days: 10, applications: 4850 },
    { month: 'Nov', days: 10, applications: 5020 },
  ];

  // Year over year comparison
  const yearComparison = {
    registrations: { current: 47000, previous: 39830, change: 18 },
    revenue: { current: 45.6, previous: 38.2, change: 19.4 },
    disputes: { current: 512, previous: 587, change: -12.8 },
    processing: { current: 10, previous: 18, change: -44.4 },
  };

  // Tiered registration monthly breakdown
  const tieredMonthly = [
    { month: 'Jan', tier1: 1800, tier2: 1100, tier3: 300 },
    { month: 'Feb', tier1: 1950, tier2: 1180, tier3: 320 },
    { month: 'Mar', tier1: 2150, tier2: 1300, tier3: 350 },
    { month: 'Apr', tier1: 2320, tier2: 1380, tier3: 400 },
    { month: 'May', tier1: 2480, tier2: 1450, tier3: 420 },
    { month: 'Jun', tier1: 2380, tier2: 1420, tier3: 400 },
    { month: 'Jul', tier1: 2560, tier2: 1520, tier3: 420 },
    { month: 'Aug', tier1: 2720, tier2: 1620, tier3: 460 },
    { month: 'Sep', tier1: 2600, tier2: 1560, tier3: 440 },
    { month: 'Oct', tier1: 2780, tier2: 1660, tier3: 460 },
    { month: 'Nov', tier1: 2900, tier2: 1720, tier3: 480 },
  ];

  return (
    <Box>
      <Box mb={4} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time land administration statistics and insights
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Region</InputLabel>
            <Select value={region} onChange={(e) => setRegion(e.target.value)} label="Region">
              <MenuItem value="all">All Regions</MenuItem>
              <MenuItem value="accra">Greater Accra</MenuItem>
              <MenuItem value="ashanti">Ashanti</MenuItem>
              <MenuItem value="western">Western</MenuItem>
              <MenuItem value="northern">Northern</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select value={period} onChange={(e) => setPeriod(e.target.value)} label="Period">
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Key Metrics - Clean, icon-free design */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Total Parcels
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {(stats.totalParcels / 1000000).toFixed(2)}M
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" color="success.main">+3.2%</Typography>
                <Typography variant="caption" color="text.secondary">vs last year</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Registered Titles
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {(stats.registeredTitles / 1000).toFixed(0)}K
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" color="success.main">+12.5%</Typography>
                <Typography variant="caption" color="text.secondary">vs last year</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Revenue (YTD)
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                GHS {(stats.totalRevenue / 1000000).toFixed(1)}M
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {((stats.totalRevenue / stats.revenueTarget) * 100).toFixed(0)}% of target
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Active Disputes
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {stats.activeDisputes.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" color="error.main">-8.3%</Typography>
                <Typography variant="caption" color="text.secondary">vs last year</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Secondary Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Registration Coverage
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {stats.registrationCoverage}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats.registrationCoverage}
                sx={{ mt: 1, height: 4, borderRadius: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Avg Processing Time
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {stats.avgProcessingTime} days
              </Typography>
              <Typography variant="caption" color="success.main">
                Target: 10 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Pending Applications
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {stats.pendingApplications.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.monthlyTransactions} processed/month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Satisfaction Rate
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {stats.satisfactionRate}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats.satisfactionRate}
                color="success"
                sx={{ mt: 1, height: 4, borderRadius: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Land Use Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Land Use Distribution</Typography>
            <Divider sx={{ mb: 2 }} />
            {landUseDistribution.map((item) => (
              <Box key={item.type} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{item.type}</Typography>
                  <Typography variant="body2" fontWeight="bold">{item.percentage}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 4 }
                  }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Tiered Registration Breakdown */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Tiered Registration</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Tier 1 (Community)</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {((stats.tier1Registrations / (stats.tier1Registrations + stats.tier2Registrations + stats.tier3Registrations)) * 100).toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(stats.tier1Registrations / (stats.tier1Registrations + stats.tier2Registrations + stats.tier3Registrations)) * 100}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#059669' } }}
              />
              <Typography variant="caption" color="text.secondary">
                {stats.tier1Registrations.toLocaleString()} registrations
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Tier 2 (General)</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {((stats.tier2Registrations / (stats.tier1Registrations + stats.tier2Registrations + stats.tier3Registrations)) * 100).toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(stats.tier2Registrations / (stats.tier1Registrations + stats.tier2Registrations + stats.tier3Registrations)) * 100}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#0284C7' } }}
              />
              <Typography variant="caption" color="text.secondary">
                {stats.tier2Registrations.toLocaleString()} registrations
              </Typography>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Tier 3 (Fixed Survey)</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {((stats.tier3Registrations / (stats.tier1Registrations + stats.tier2Registrations + stats.tier3Registrations)) * 100).toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(stats.tier3Registrations / (stats.tier1Registrations + stats.tier2Registrations + stats.tier3Registrations)) * 100}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#7C3AED' } }}
              />
              <Typography variant="caption" color="text.secondary">
                {stats.tier3Registrations.toLocaleString()} registrations
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Gender Inclusion */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Gender Inclusion</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Women on Titles</Typography>
                <Typography variant="body2" fontWeight="bold">{stats.womenOnTitles}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={stats.womenOnTitles}
                sx={{ height: 8, borderRadius: 4 }}
                color={stats.womenOnTitles >= 45 ? 'success' : stats.womenOnTitles >= 35 ? 'warning' : 'error'}
              />
              <Typography variant="caption" color="text.secondary">
                Target: 50%
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Joint Titles</Typography>
                <Typography variant="body2" fontWeight="bold">{stats.jointTitles}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={stats.jointTitles}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                Married couples with both names
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
              <Typography variant="h5" color="success.dark" fontWeight="bold">
                +15%
              </Typography>
              <Typography variant="caption" color="success.dark">
                Women's registration vs last year
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Regional Statistics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Regional Statistics</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {regionalData.slice(0, 8).map((data) => (
                <Grid item xs={12} sm={6} md={3} key={data.region}>
                  <Card variant="outlined">
                    <CardContent sx={{ py: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {data.region}
                        </Typography>
                        <Chip label={data.revenue} size="small" color="primary" />
                      </Box>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">Parcels</Typography>
                          <Typography variant="body2">{(data.parcels / 1000).toFixed(0)}K</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">Titles</Typography>
                          <Typography variant="body2">{(data.titles / 1000).toFixed(0)}K</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">Disputes</Typography>
                          <Typography variant="body2">{data.disputes}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Registration Trends - Bar Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Registration Trends (2024)</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: '#0D9488' }} />
                  <Typography variant="caption">Registrations</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: '#64748B' }} />
                  <Typography variant="caption">Transfers</Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 200 }}>
              {monthlyTrends.map((data) => {
                const maxValue = 5500;
                const regHeight = (data.registrations / maxValue) * 100;
                const transHeight = (data.transfers / maxValue) * 100;
                return (
                  <Box key={data.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', height: '100%', width: '100%', justifyContent: 'center' }}>
                      <Box
                        sx={{
                          width: '35%',
                          height: `${regHeight}%`,
                          bgcolor: '#0D9488',
                          borderRadius: '4px 4px 0 0',
                          minHeight: 4,
                          transition: 'height 0.3s ease',
                        }}
                      />
                      <Box
                        sx={{
                          width: '35%',
                          height: `${transHeight}%`,
                          bgcolor: '#64748B',
                          borderRadius: '4px 4px 0 0',
                          minHeight: 4,
                          transition: 'height 0.3s ease',
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                      {data.month}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Total: {monthlyTrends.reduce((sum, d) => sum + d.registrations, 0).toLocaleString()} registrations
              </Typography>
              <Typography variant="caption" color="success.main">
                +18% vs 2023
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Revenue Trend - Area Chart Style */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Revenue Trend</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {quarterlyRevenue.map((q) => (
                <Box key={q.quarter}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{q.quarter}</Typography>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight="bold">
                        GHS {q.value}M
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({q.collected}M collected)
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ position: 'relative', height: 8 }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        bgcolor: '#E2E8F0',
                        borderRadius: 4,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        width: `${(q.value / q.target) * 100}%`,
                        height: '100%',
                        bgcolor: q.value >= q.target ? '#059669' : '#0D9488',
                        borderRadius: 4,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 2, textAlign: 'center', p: 1.5, bgcolor: '#F0FDFA', borderRadius: 2 }}>
              <Typography variant="body2" color="primary" fontWeight="bold">
                GHS {yearComparison.revenue.current}M YTD
              </Typography>
              <Typography variant="caption" color="text.secondary">
                +{yearComparison.revenue.change}% vs last year
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Dispute Resolution Timeline */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Dispute Resolution Timeline</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 150 }}>
              {monthlyTrends.map((data) => {
                const maxDisputes = 65;
                const height = (data.disputes / maxDisputes) * 100;
                return (
                  <Box key={data.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: '60%',
                        height: `${height}%`,
                        bgcolor: data.disputes > 50 ? '#DC2626' : data.disputes > 40 ? '#F59E0B' : '#059669',
                        borderRadius: '4px 4px 0 0',
                        minHeight: 4,
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', fontSize: '0.65rem' }}>
                      {data.month}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#059669' }} />
                  <Typography variant="caption">Low</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                  <Typography variant="caption">Medium</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#DC2626' }} />
                  <Typography variant="caption">High</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="success.main">
                Avg: 46/month (-12% YoY)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Processing Time Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Processing Time Trend</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 150 }}>
              {processingTimeData.map((data) => {
                const maxDays = 20;
                const height = (data.days / maxDays) * 100;
                return (
                  <Box key={data.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: '60%',
                        height: `${height}%`,
                        bgcolor: data.days <= 10 ? '#059669' : data.days <= 14 ? '#0D9488' : '#F59E0B',
                        borderRadius: '4px 4px 0 0',
                        minHeight: 4,
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', fontSize: '0.65rem' }}>
                      {data.month}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" fontWeight="bold">{yearComparison.processing.current} days</Typography>
                <Typography variant="caption" color="text.secondary">Current average</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="success.main">Target achieved</Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  {yearComparison.processing.change}% since January
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Performance Indicators */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Performance Indicators</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              {[
                { label: 'Title Registration Rate', value: 68.6, target: 75, unit: '%' },
                { label: 'Dispute Resolution Rate', value: 72, target: 80, unit: '%' },
                { label: 'Application Processing', value: 85, target: 90, unit: '%' },
                { label: 'Digital Adoption', value: 62, target: 70, unit: '%' }
              ].map((indicator) => (
                <Grid item xs={12} sm={6} md={3} key={indicator.label}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{indicator.label}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {indicator.value}{indicator.unit}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={indicator.value}
                      sx={{ height: 10, borderRadius: 5 }}
                      color={indicator.value >= indicator.target ? 'success' : 'warning'}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Target: {indicator.target}{indicator.unit}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
