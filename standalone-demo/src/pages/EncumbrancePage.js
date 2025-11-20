import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert, Divider, List, ListItem,
  ListItemText, ListItemIcon, CircularProgress
} from '@mui/material';
import {
  Search, Description, CheckCircle, Warning, Cancel, Download, QrCode,
  AccountBalance, Gavel, AttachMoney, Lock, LockOpen, Verified, Print
} from '@mui/icons-material';

export default function EncumbrancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [alert, setAlert] = useState(null);

  // Mock encumbrance data
  const mockEncumbranceData = {
    'GH-ACC-12345': {
      parcel_id: 'GH-ACC-12345',
      title_number: 'GA/2024/001/TL',
      location: 'East Legon, Accra',
      owner: 'Kofi Mensah',
      area: '0.5 hectares',
      land_use: 'Residential',
      status: 'Encumbered',
      search_date: new Date().toISOString(),
      encumbrances: [
        {
          type: 'Mortgage',
          id: 'MTG-2024-001',
          holder: 'Ghana Home Loans Ltd',
          amount: 'GHS 450,000',
          date_registered: '2024-01-20',
          status: 'Active',
          maturity_date: '2044-01-20'
        }
      ],
      court_orders: [],
      caveats: [],
      restrictions: [],
      clean: false
    },
    'GH-ASH-45678': {
      parcel_id: 'GH-ASH-45678',
      title_number: 'AS/2023/045/TL',
      location: 'Adum, Kumasi',
      owner: 'Yaw Boateng',
      area: '1.2 hectares',
      land_use: 'Commercial',
      status: 'Encumbered',
      search_date: new Date().toISOString(),
      encumbrances: [
        {
          type: 'Mortgage',
          id: 'MTG-2023-045',
          holder: 'Stanbic Bank Ghana',
          amount: 'GHS 1,200,000',
          date_registered: '2023-06-15',
          status: 'Active',
          maturity_date: '2033-06-15'
        }
      ],
      court_orders: [
        {
          type: 'Injunction',
          case_number: 'SUIT/2024/HC/0456',
          court: 'High Court, Kumasi',
          date_issued: '2024-09-20',
          description: 'Restraint on transfer pending litigation',
          status: 'Active'
        }
      ],
      caveats: [],
      restrictions: [],
      clean: false
    },
    'GH-WR-78910': {
      parcel_id: 'GH-WR-78910',
      title_number: 'WR/2024/078/TL',
      location: 'Takoradi',
      owner: 'Akua Serwaa',
      area: '2.0 hectares',
      land_use: 'Industrial',
      status: 'Clean',
      search_date: new Date().toISOString(),
      encumbrances: [],
      court_orders: [],
      caveats: [],
      restrictions: [],
      clean: true
    },
    'GH-NR-11213': {
      parcel_id: 'GH-NR-11213',
      title_number: null,
      location: 'Tamale',
      owner: 'Ibrahim Musa',
      area: '3.5 hectares',
      land_use: 'Agricultural',
      status: 'Encumbered',
      search_date: new Date().toISOString(),
      encumbrances: [],
      court_orders: [],
      caveats: [
        {
          type: 'Caveat',
          id: 'CAV-2024-023',
          lodged_by: 'Fatima Ibrahim',
          reason: 'Claiming beneficial interest in land',
          date_lodged: '2024-08-10',
          status: 'Active',
          expiry_date: '2025-02-10'
        }
      ],
      restrictions: [
        {
          type: 'Government Acquisition Notice',
          authority: 'Lands Commission',
          date: '2024-07-01',
          description: 'Part of land earmarked for road expansion project'
        }
      ],
      clean: false
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setAlert({ type: 'error', message: 'Please enter a Parcel ID or Title Number' });
      return;
    }

    setLoading(true);
    setAlert(null);

    // Simulate API call
    setTimeout(() => {
      const result = mockEncumbranceData[searchQuery.toUpperCase()];
      if (result) {
        setSearchResult(result);
        setAlert({
          type: result.clean ? 'success' : 'warning',
          message: result.clean
            ? 'Title is CLEAN - No encumbrances found'
            : 'ENCUMBRANCES FOUND - Review details below'
        });
      } else {
        setSearchResult(null);
        setAlert({ type: 'error', message: 'No records found for this Parcel ID / Title Number' });
      }
      setLoading(false);
    }, 1500);
  };

  const handleDownloadCertificate = () => {
    setAlert({ type: 'success', message: 'Encumbrance Certificate downloaded successfully' });
    setCertificateDialogOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
          <Search sx={{ mr: 1, verticalAlign: 'middle' }} />
          Encumbrance Search & Certificate
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search for encumbrances, liens, mortgages, and court orders on land parcels
        </Typography>
      </Box>

      {/* Search Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Search Land Records</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Enter Parcel ID or Title Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., GH-ACC-12345 or GA/2024/001/TL"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              sx={{ height: 56 }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Demo IDs: GH-ACC-12345, GH-ASH-45678, GH-WR-78910, GH-NR-11213
        </Typography>
      </Paper>

      {alert && (
        <Alert
          severity={alert.type}
          sx={{ mb: 3 }}
          onClose={() => setAlert(null)}
          icon={alert.type === 'success' ? <LockOpen /> : alert.type === 'warning' ? <Lock /> : undefined}
        >
          {alert.message}
        </Alert>
      )}

      {/* Search Results */}
      {searchResult && (
        <Grid container spacing={3}>
          {/* Property Details */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>Property Details</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Parcel ID</Typography>
                    <Typography variant="body2" fontWeight="bold">{searchResult.parcel_id}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Title Number</Typography>
                    <Typography variant="body2">{searchResult.title_number || 'Not Titled'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Location</Typography>
                    <Typography variant="body2">{searchResult.location}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Registered Owner</Typography>
                    <Typography variant="body2">{searchResult.owner}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Area</Typography>
                    <Typography variant="body2">{searchResult.area}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Land Use</Typography>
                    <Typography variant="body2">{searchResult.land_use}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        icon={searchResult.clean ? <CheckCircle /> : <Warning />}
                        label={searchResult.clean ? 'CLEAN' : 'ENCUMBERED'}
                        color={searchResult.clean ? 'success' : 'error'}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  startIcon={<Description />}
                  onClick={() => setCertificateDialogOpen(true)}
                >
                  Generate Certificate
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Encumbrances */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>Encumbrance Details</Typography>
                <Divider sx={{ mb: 2 }} />

                {searchResult.clean ? (
                  <Alert severity="success" icon={<Verified />}>
                    <Typography variant="subtitle2">No Encumbrances Found</Typography>
                    <Typography variant="body2">
                      This property is free from mortgages, liens, court orders, caveats, and other restrictions.
                    </Typography>
                  </Alert>
                ) : (
                  <Box>
                    {/* Mortgages */}
                    {searchResult.encumbrances.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccountBalance sx={{ mr: 1, fontSize: 18 }} />
                          Mortgages / Charges ({searchResult.encumbrances.length})
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Holder</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Registered</TableCell>
                                <TableCell>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {searchResult.encumbrances.map((enc) => (
                                <TableRow key={enc.id}>
                                  <TableCell>{enc.id}</TableCell>
                                  <TableCell>{enc.holder}</TableCell>
                                  <TableCell>{enc.amount}</TableCell>
                                  <TableCell>{enc.date_registered}</TableCell>
                                  <TableCell>
                                    <Chip label={enc.status} size="small" color="warning" />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}

                    {/* Court Orders */}
                    {searchResult.court_orders.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Gavel sx={{ mr: 1, fontSize: 18, color: 'error.main' }} />
                          Court Orders ({searchResult.court_orders.length})
                        </Typography>
                        {searchResult.court_orders.map((order, i) => (
                          <Alert severity="error" key={i} sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">{order.type}</Typography>
                            <Typography variant="body2">Case: {order.case_number}</Typography>
                            <Typography variant="body2">Court: {order.court}</Typography>
                            <Typography variant="body2">{order.description}</Typography>
                            <Typography variant="caption">Issued: {order.date_issued}</Typography>
                          </Alert>
                        ))}
                      </Box>
                    )}

                    {/* Caveats */}
                    {searchResult.caveats.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Warning sx={{ mr: 1, fontSize: 18, color: 'warning.main' }} />
                          Caveats ({searchResult.caveats.length})
                        </Typography>
                        {searchResult.caveats.map((caveat, i) => (
                          <Alert severity="warning" key={i} sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">{caveat.id}</Typography>
                            <Typography variant="body2">Lodged by: {caveat.lodged_by}</Typography>
                            <Typography variant="body2">Reason: {caveat.reason}</Typography>
                            <Typography variant="caption">Expires: {caveat.expiry_date}</Typography>
                          </Alert>
                        ))}
                      </Box>
                    )}

                    {/* Restrictions */}
                    {searchResult.restrictions.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Cancel sx={{ mr: 1, fontSize: 18, color: 'error.main' }} />
                          Restrictions ({searchResult.restrictions.length})
                        </Typography>
                        {searchResult.restrictions.map((rest, i) => (
                          <Alert severity="error" key={i} sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">{rest.type}</Typography>
                            <Typography variant="body2">Authority: {rest.authority}</Typography>
                            <Typography variant="body2">{rest.description}</Typography>
                            <Typography variant="caption">Date: {rest.date}</Typography>
                          </Alert>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Certificate Dialog */}
      <Dialog open={certificateDialogOpen} onClose={() => setCertificateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
          Encumbrance Certificate
        </DialogTitle>
        <DialogContent>
          {searchResult && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                This certificate confirms the encumbrance status as of {new Date().toLocaleDateString()}
              </Alert>

              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h6">REPUBLIC OF GHANA</Typography>
                  <Typography variant="subtitle2">LANDS COMMISSION</Typography>
                  <Typography variant="body2" color="text.secondary">ENCUMBRANCE CERTIFICATE</Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption">Certificate No:</Typography>
                    <Typography variant="body2">EC-{Date.now()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">Date Issued:</Typography>
                    <Typography variant="body2">{new Date().toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption">Parcel ID:</Typography>
                    <Typography variant="body2">{searchResult.parcel_id}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption">Status:</Typography>
                    <Typography variant="body2" fontWeight="bold" color={searchResult.clean ? 'success.main' : 'error.main'}>
                      {searchResult.clean ? 'FREE FROM ENCUMBRANCES' : 'ENCUMBRANCES EXIST'}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <QrCode sx={{ fontSize: 60, color: 'text.secondary' }} />
                  <Typography variant="caption" display="block">Scan to verify</Typography>
                </Box>
              </Card>

              <Typography variant="caption" color="text.secondary">
                Fee: GHS 50.00 | Valid for 30 days from issue date
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCertificateDialogOpen(false)}>Cancel</Button>
          <Button variant="outlined" startIcon={<Print />}>
            Print
          </Button>
          <Button variant="contained" startIcon={<Download />} onClick={handleDownloadCertificate}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
