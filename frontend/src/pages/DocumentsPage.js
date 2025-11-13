import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Button, Alert, Box,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, LinearProgress, IconButton
} from '@mui/material';
import { CloudUpload, Description, CheckCircle, Visibility, Download, Delete, VerifiedUser } from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');

  const canManageDocuments = user && (user.role === 'admin' || user.role === 'lands_officer');

  const documentTypes = [
    'TITLE_DEED',
    'SURVEY_PLAN',
    'ID_CARD',
    'PASSPORT',
    'LAND_CERTIFICATE',
    'MORTGAGE_DEED',
    'COURT_ORDER',
    'OTHER'
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setAlert({ type: 'error', message: 'Only PDF, JPG, JPEG, and PNG files are allowed' });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setAlert({ type: 'error', message: 'File size must be less than 10MB' });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      setAlert({ type: 'error', message: 'Please select a file and document type' });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('document_type', documentType);

      await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setAlert({ type: 'success', message: 'Document uploaded successfully' });
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setDocumentType('');
      fetchDocuments();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to upload document' });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (documentId, filename) => {
    try {
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to download document' });
    }
  };

  const handleVerify = async (documentId) => {
    try {
      await api.put(`/documents/${documentId}/verify`);
      setAlert({ type: 'success', message: 'Document verified successfully' });
      fetchDocuments();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to verify document' });
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await api.delete(`/documents/${documentId}`);
      setAlert({ type: 'success', message: 'Document deleted successfully' });
      fetchDocuments();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to delete document' });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
            Document Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload, manage, and verify land-related documents
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => setUploadDialogOpen(true)}
          sx={{ bgcolor: '#006B3F', '&:hover': { bgcolor: '#005030' } }}
        >
          Upload Document
        </Button>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Description sx={{ fontSize: 40, color: '#006B3F', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {documents.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Documents
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle sx={{ fontSize: 40, color: '#4CAF50', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {documents.filter(d => d.verified).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verified
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CloudUpload sx={{ fontSize: 40, color: '#FCD116', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {documents.filter(d => !d.verified).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Verification
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Documents Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Documents</Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document ID</TableCell>
                    <TableCell>Filename</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Uploaded</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No documents uploaded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {doc.document_id}
                          </Typography>
                        </TableCell>
                        <TableCell>{doc.original_filename}</TableCell>
                        <TableCell>{doc.document_type}</TableCell>
                        <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                        <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={doc.verified ? 'Verified' : 'Pending'}
                            size="small"
                            color={doc.verified ? 'success' : 'warning'}
                            icon={doc.verified ? <CheckCircle /> : undefined}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleDownload(doc.id, doc.original_filename)}
                            title="Download"
                          >
                            <Download fontSize="small" />
                          </IconButton>
                          {canManageDocuments && !doc.verified && (
                            <IconButton
                              size="small"
                              onClick={() => handleVerify(doc.id)}
                              title="Verify"
                              color="success"
                            >
                              <VerifiedUser fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(doc.id)}
                            title="Delete"
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => !uploading && setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              select
              fullWidth
              label="Document Type *"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              sx={{ mb: 3 }}
            >
              {documentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </TextField>

            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { borderColor: '#006B3F', bgcolor: '#f5f5f5' }
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                disabled={uploading}
              />
              <CloudUpload sx={{ fontSize: 48, color: '#006B3F', mb: 1 }} />
              <Typography variant="body1">
                {selectedFile ? selectedFile.name : 'Click to select a file'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supported: PDF, JPG, JPEG, PNG (Max 10MB)
              </Typography>
              {selectedFile && (
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={formatFileSize(selectedFile.size)}
                    size="small"
                    color="primary"
                    onDelete={() => setSelectedFile(null)}
                  />
                </Box>
              )}
            </Box>

            {uploading && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress />
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  Uploading document...
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || !documentType || uploading}
            startIcon={<CloudUpload />}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
