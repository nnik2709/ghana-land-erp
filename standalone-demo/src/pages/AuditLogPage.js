import React, { useState } from 'react';
import {
  Container, Typography, Card, CardContent, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, TextField, MenuItem,
  Button, Grid, IconButton, Tooltip
} from '@mui/material';
import { History, FilterList, Download, Visibility, Security } from '@mui/icons-material';

const mockAuditLogs = [
  { id: 1, timestamp: '2025-11-13 14:23:15', user: 'Abena Osei (Officer)', action: 'APPROVE_APPLICATION', resource: 'Application APP-2025-005', ipAddress: '192.168.1.45', status: 'success' },
  { id: 2, timestamp: '2025-11-13 14:18:42', user: 'Kofi Mensah (Citizen)', action: 'UPLOAD_DOCUMENT', resource: 'Document DOC-2025-012', ipAddress: '41.189.45.123', status: 'success' },
  { id: 3, timestamp: '2025-11-13 14:15:33', user: 'Ama Adjei (Surveyor)', action: 'SUBMIT_SURVEY', resource: 'Survey SUR-2025-018', ipAddress: '102.176.23.89', status: 'success' },
  { id: 4, timestamp: '2025-11-13 14:10:21', user: 'Kwame Nkrumah (Admin)', action: 'CREATE_USER', resource: 'User USR-2025-034', ipAddress: '192.168.1.10', status: 'success' },
  { id: 5, timestamp: '2025-11-13 14:05:18', user: 'Abena Osei (Officer)', action: 'REGISTER_MORTGAGE', resource: 'Mortgage MTG-2025-003', ipAddress: '192.168.1.45', status: 'success' },
  { id: 6, timestamp: '2025-11-13 13:58:45', user: 'Unknown User', action: 'LOGIN_FAILED', resource: 'Login Attempt', ipAddress: '185.220.101.42', status: 'failed' },
  { id: 7, timestamp: '2025-11-13 13:55:12', user: 'Kofi Mensah (Citizen)', action: 'VIEW_TITLE', resource: 'Title TIT-GH-2025-00001', ipAddress: '41.189.45.123', status: 'success' },
  { id: 8, timestamp: '2025-11-13 13:50:03', user: 'Abena Osei (Officer)', action: 'VERIFY_DOCUMENT', resource: 'Document DOC-2025-011', ipAddress: '192.168.1.45', status: 'success' },
  { id: 9, timestamp: '2025-11-13 13:45:29', user: 'Ama Adjei (Surveyor)', action: 'UPDATE_SURVEY', resource: 'Survey SUR-2025-017', ipAddress: '102.176.23.89', status: 'success' },
  { id: 10, timestamp: '2025-11-13 13:40:56', user: 'Kofi Mensah (Citizen)', action: 'MAKE_PAYMENT', resource: 'Payment TXN-2025-089', ipAddress: '41.189.45.123', status: 'success' },
  { id: 11, timestamp: '2025-11-13 13:35:44', user: 'Kwame Nkrumah (Admin)', action: 'UPDATE_SETTINGS', resource: 'System Settings', ipAddress: '192.168.1.10', status: 'success' },
  { id: 12, timestamp: '2025-11-13 13:30:17', user: 'Unknown User', action: 'LOGIN_FAILED', resource: 'Login Attempt', ipAddress: '185.220.101.42', status: 'failed' },
  { id: 13, timestamp: '2025-11-13 13:25:08', user: 'Abena Osei (Officer)', action: 'ISSUE_TITLE', resource: 'Title TIT-GH-2025-00015', ipAddress: '192.168.1.45', status: 'success' },
  { id: 14, timestamp: '2025-11-13 13:20:35', user: 'Kofi Mensah (Citizen)', action: 'SUBMIT_APPLICATION', resource: 'Application APP-2025-006', ipAddress: '41.189.45.123', status: 'success' },
  { id: 15, timestamp: '2025-11-13 13:15:22', user: 'Ama Adjei (Surveyor)', action: 'LOGIN', resource: 'User Session', ipAddress: '102.176.23.89', status: 'success' }
];

export default function AuditLogPage() {
  const [filterAction, setFilterAction] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const actions = ['all', 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'UPLOAD', 'DOWNLOAD'];

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesAction = filterAction === 'all' || log.action.includes(filterAction);
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    return status === 'success' ? 'success' : 'error';
  };

  const getActionColor = (action) => {
    if (action.includes('LOGIN')) return '#1976D2';
    if (action.includes('CREATE') || action.includes('REGISTER')) return '#2E7D32';
    if (action.includes('UPDATE') || action.includes('APPROVE')) return '#ED6C02';
    if (action.includes('DELETE')) return '#D32F2F';
    if (action.includes('VIEW')) return '#0288D1';
    if (action.includes('UPLOAD')) return '#7B1FA2';
    if (action.includes('DOWNLOAD')) return '#1565C0';
    return '#616161';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            <History sx={{ mr: 1, verticalAlign: 'middle' }} />
            Audit Log
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor all system activities and user actions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={() => alert('Export audit logs to CSV. In production, this would generate a downloadable CSV file.')}
        >
          Export Logs
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary" sx={{ mb: 1 }}>{mockAuditLogs.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total Actions Today</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main" sx={{ mb: 1 }}>
                {mockAuditLogs.filter(l => l.status === 'success').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Successful</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="error.main" sx={{ mb: 1 }}>
                {mockAuditLogs.filter(l => l.status === 'failed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Failed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main" sx={{ mb: 1 }}>
                {new Set(mockAuditLogs.map(l => l.ipAddress)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">Unique IPs</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Action Type"
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
              >
                {actions.map(action => (
                  <MenuItem key={action} value={action}>{action.toUpperCase()}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">ALL</MenuItem>
                <MenuItem value="success">SUCCESS</MenuItem>
                <MenuItem value="failed">FAILED</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setFilterAction('all');
                  setFilterStatus('all');
                  setSearchQuery('');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Resource</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No audit logs match your filters</TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {log.timestamp}
                      </TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: getActionColor(log.action),
                              flexShrink: 0
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {log.action.replace(/_/g, ' ')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{log.resource}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {log.ipAddress}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          size="small"
                          color={getStatusColor(log.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => alert(`Audit Log Details:\n\nID: ${log.id}\nTimestamp: ${log.timestamp}\nUser: ${log.user}\nAction: ${log.action}\nResource: ${log.resource}\nIP: ${log.ipAddress}\nStatus: ${log.status}\n\nIn production, this would show full request/response payload and user agent.`)}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Security Alert */}
      <Card sx={{ mt: 3, bgcolor: '#FFF3E0' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Security color="warning" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6" gutterBottom>Security Notice</Typography>
              <Typography variant="body2">
                2 failed login attempts detected from IP 185.220.101.42 in the last hour.
                This IP has been flagged for monitoring. Automatic blocking will occur after 5 failed attempts.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
