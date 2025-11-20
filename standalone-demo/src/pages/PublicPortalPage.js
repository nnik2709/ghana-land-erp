import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent, Button, TextField,
  Tabs, Tab, Divider, Alert, List, ListItem, ListItemText, ListItemIcon, Chip
} from '@mui/material';
import {
  Public, Search, Map, Gavel, Description, CheckCircle, Warning, Info,
  LocationOn, Person, CalendarMonth
} from '@mui/icons-material';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function PublicPortalPage() {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Mock public search results
  const mockResults = {
    'ACC/2024/001': {
      parcelId: 'ACC/2024/001',
      location: 'East Legon, Greater Accra',
      district: 'Accra Metropolitan',
      area: 850,
      landUse: 'Residential',
      titleStatus: 'Registered',
      encumbrances: 'None',
      lastTransaction: '2024-06-15',
      coordinates: '5.6037° N, 0.1870° W'
    },
    'ASH/2024/003': {
      parcelId: 'ASH/2024/003',
      location: 'Ahodwo, Kumasi',
      district: 'Kumasi Metropolitan',
      area: 5000,
      landUse: 'Mixed Use',
      titleStatus: 'Registered',
      encumbrances: 'Mortgage (Standard Chartered Bank)',
      lastTransaction: '2023-11-10',
      coordinates: '6.6885° N, 1.6244° W'
    },
    'WES/2024/004': {
      parcelId: 'WES/2024/004',
      location: 'Beach Road, Takoradi',
      district: 'Sekondi-Takoradi Metropolitan',
      area: 3000,
      landUse: 'Commercial',
      titleStatus: 'Under Review',
      encumbrances: 'Court Order (Case #TC/2024/089)',
      lastTransaction: '2024-01-25',
      coordinates: '4.8845° N, 1.7554° W'
    }
  };

  const handleSearch = () => {
    setSearchPerformed(true);
    const result = mockResults[searchQuery.toUpperCase()];
    setSearchResult(result || null);
  };

  const announcements = [
    {
      title: 'Online Title Application Now Available',
      date: '2024-11-15',
      type: 'info',
      content: 'Citizens can now submit land title applications online through the citizen portal.'
    },
    {
      title: 'Scheduled System Maintenance',
      date: '2024-11-20',
      type: 'warning',
      content: 'The system will be unavailable on November 20, 2024 from 10 PM to 2 AM for maintenance.'
    },
    {
      title: 'New Fee Structure Effective January 2025',
      date: '2024-11-10',
      type: 'info',
      content: 'Updated processing fees will take effect from January 1, 2025. View the fee schedule for details.'
    }
  ];

  const feeSchedule = [
    { service: 'Land Title Registration', fee: 'GHS 2,500 - 5,000', timeline: '30-60 days' },
    { service: 'Title Search', fee: 'GHS 150', timeline: '1-3 days' },
    { service: 'Encumbrance Certificate', fee: 'GHS 200', timeline: '3-5 days' },
    { service: 'Survey Plan', fee: 'GHS 1,500 - 3,000', timeline: '14-21 days' },
    { service: 'Subdivision Approval', fee: 'GHS 2,000 - 5,000', timeline: '30-45 days' },
    { service: 'Land Use Change', fee: 'GHS 3,000 - 8,000', timeline: '45-60 days' },
    { service: 'Lease Registration', fee: 'GHS 1,000 - 3,000', timeline: '21-30 days' },
    { service: 'Transfer of Title', fee: 'GHS 2,000 + 0.5% Stamp Duty', timeline: '14-21 days' }
  ];

  const offices = [
    { region: 'Greater Accra', address: 'Cantonments, Accra', phone: '+233 302 123 456', email: 'accra@lands.gov.gh' },
    { region: 'Ashanti', address: 'Adum, Kumasi', phone: '+233 322 123 456', email: 'kumasi@lands.gov.gh' },
    { region: 'Western', address: 'Beach Road, Takoradi', phone: '+233 312 123 456', email: 'takoradi@lands.gov.gh' },
    { region: 'Northern', address: 'Central, Tamale', phone: '+233 372 123 456', email: 'tamale@lands.gov.gh' },
    { region: 'Eastern', address: 'Koforidua Central', phone: '+233 342 123 456', email: 'koforidua@lands.gov.gh' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 4, bgcolor: '#006B3F', color: 'white', textAlign: 'center' }}>
        <Public sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Ghana Land Administration Portal
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
          Public access to land information and services
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Ministry of Lands and Natural Resources
        </Typography>
      </Paper>

      {/* Search Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          <Search sx={{ mr: 1, verticalAlign: 'middle' }} />
          Parcel Search
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Search for land parcel information using the Parcel ID
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Enter Parcel ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., ACC/2024/001"
              helperText="Try: ACC/2024/001, ASH/2024/003, or WES/2024/004"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Search />}
              onClick={handleSearch}
              sx={{ bgcolor: '#006B3F', height: 56 }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {searchPerformed && (
          <Box sx={{ mt: 3 }}>
            {searchResult ? (
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      <Map sx={{ mr: 1, verticalAlign: 'middle', color: '#006B3F' }} />
                      {searchResult.parcelId}
                    </Typography>
                    <Chip
                      label={searchResult.titleStatus}
                      color={searchResult.titleStatus === 'Registered' ? 'success' : 'warning'}
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Location</Typography>
                      <Typography variant="body1">{searchResult.location}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">District</Typography>
                      <Typography variant="body1">{searchResult.district}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">Area</Typography>
                      <Typography variant="body1">{searchResult.area} m²</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">Land Use</Typography>
                      <Typography variant="body1">{searchResult.landUse}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Coordinates</Typography>
                      <Typography variant="body1">{searchResult.coordinates}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Last Transaction</Typography>
                      <Typography variant="body1">
                        {new Date(searchResult.lastTransaction).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Encumbrances</Typography>
                      <Typography variant="body1">
                        {searchResult.encumbrances === 'None' ? (
                          <Chip label="None" size="small" color="success" icon={<CheckCircle />} />
                        ) : (
                          <Chip label={searchResult.encumbrances} size="small" color="warning" icon={<Warning />} />
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" color="text.secondary">
                    Note: For detailed ownership information and official documents, please visit a Lands Commission office with valid identification.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Alert severity="warning">
                No parcel found with ID "{searchQuery}". Please check the Parcel ID and try again.
              </Alert>
            )}
          </Box>
        )}
      </Paper>

      {/* Tabs for additional info */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Announcements" />
          <Tab label="Fee Schedule" />
          <Tab label="Office Locations" />
        </Tabs>

        {/* Announcements Tab */}
        <TabPanel value={tabValue} index={0}>
          <List>
            {announcements.map((announcement, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  {announcement.type === 'warning' ? (
                    <Warning color="warning" />
                  ) : (
                    <Info color="info" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{announcement.title}</Typography>
                      <Chip label={announcement.date} size="small" variant="outlined" />
                    </Box>
                  }
                  secondary={announcement.content}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        {/* Fee Schedule Tab */}
        <TabPanel value={tabValue} index={1}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Fees may vary based on property value and location. Contact your regional office for exact quotes.
          </Alert>
          <Grid container spacing={2}>
            {feeSchedule.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.service}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="primary">
                        {item.fee}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.timeline}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Office Locations Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={2}>
            {offices.map((office, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#006B3F' }}>
                      <LocationOn sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: 18 }} />
                      {office.region} Region
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {office.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tel: {office.phone}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {office.email}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Quick Links */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Description sx={{ fontSize: 40, color: '#006B3F', mb: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Download Forms
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Application forms and guidelines
            </Typography>
            <Button size="small" sx={{ mt: 1 }}>View Forms</Button>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Gavel sx={{ fontSize: 40, color: '#FCD116', mb: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Laws & Regulations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Land administration legislation
            </Typography>
            <Button size="small" sx={{ mt: 1 }}>View Laws</Button>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Person sx={{ fontSize: 40, color: '#CE1126', mb: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Citizen Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access your applications
            </Typography>
            <Button size="small" sx={{ mt: 1 }} href="/login">Login</Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
