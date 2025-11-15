import React, { useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Box, TextField,
  Accordion, AccordionSummary, AccordionDetails, Chip, Button, Tab, Tabs
} from '@mui/material';
import { ExpandMore, Search, School, VideoLibrary, Description, HelpOutline } from '@mui/icons-material';

const faqData = [
  {
    category: 'Land Registration',
    items: [
      { q: 'How do I register my land?', a: 'To register your land, you need to: 1) Submit an application through the portal, 2) Provide valid identification documents, 3) Submit a current survey plan, 4) Pay the registration fees, 5) Wait for verification by our lands officers.' },
      { q: 'What documents do I need?', a: 'You will need: Ghana Card or Passport, Site plan or Survey Report, Previous title deed (if any), Proof of payment for land purchase, Letter of allocation (for government land).' },
      { q: 'How long does registration take?', a: 'Standard registration takes 30-45 days from submission of complete documents. Express service (72 hours) is available for an additional fee.' },
      { q: 'What are the registration fees?', a: 'Fees vary by land type and size: Residential (0-1 acre): GHS 500, Residential (1-5 acres): GHS 1,500, Commercial: GHS 2,500, Agricultural: GHS 1,000 per 10 acres.' }
    ]
  },
  {
    category: 'Payments',
    items: [
      { q: 'What payment methods are accepted?', a: 'We accept: Mobile Money (MTN, Vodafone, AirtelTigo), Bank Transfer (all major banks), Debit/Credit Cards (Visa, Mastercard), Cash payment at our offices.' },
      { q: 'Is payment secure?', a: 'Yes, all online payments are encrypted and recorded on the blockchain for transparency and security.' },
      { q: 'Can I get a receipt?', a: 'Yes, receipts are automatically generated and sent via email and SMS. You can also download them from your dashboard.' }
    ]
  },
  {
    category: 'Surveys',
    items: [
      { q: 'Do I need a licensed surveyor?', a: 'Yes, all surveys must be conducted by a Ghana-licensed surveyor registered with the Survey & Mapping Division.' },
      { q: 'How accurate should my survey be?', a: 'Surveys must have an accuracy score of at least 85%. We recommend using Total Station or GPS RTK equipment for best results.' },
      { q: 'What if my survey overlaps with another parcel?', a: 'Our system automatically detects overlaps. The case will be flagged for review and resolution by our lands officers.' }
    ]
  },
  {
    category: 'Titles',
    items: [
      { q: 'What types of land titles exist?', a: 'Ghana recognizes: Freehold (full ownership), Leasehold (time-limited), Customary (traditional land tenure).' },
      { q: 'Can I transfer my title?', a: 'Yes, titles can be transferred through our portal. Both parties must verify the transfer, and transfer fees apply.' },
      { q: 'How do I verify a title is genuine?', a: 'All titles are recorded on blockchain. Scan the QR code on the certificate or enter the title number on our verification page.' }
    ]
  }
];

const tutorials = [
  { title: 'How to Register Land in Ghana', duration: '8:24', views: '15K', thumbnail: '🎥' },
  { title: 'Understanding Land Types', duration: '5:12', views: '8K', thumbnail: '🎥' },
  { title: 'Mobile Money Payment Guide', duration: '3:45', views: '12K', thumbnail: '🎥' },
  { title: 'Survey Process Explained', duration: '10:30', views: '6K', thumbnail: '🎥' },
  { title: 'Blockchain Verification', duration: '4:18', views: '9K', thumbnail: '🎥' },
  { title: 'Mortgage Registration Guide', duration: '7:05', views: '5K', thumbnail: '🎥' }
];

const guides = [
  { title: 'Complete Land Registration Guide', pages: 24, downloads: '3.2K' },
  { title: 'Survey Requirements Checklist', pages: 8, downloads: '2.8K' },
  { title: 'Payment Methods Guide', pages: 6, downloads: '4.1K' },
  { title: 'Title Transfer Process', pages: 12, downloads: '1.9K' },
  { title: 'Dispute Resolution Guidelines', pages: 18, downloads: '1.5K' }
];

export default function EducationalPortalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#006B3F' }}>
          Educational Portal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Learn about land registration, watch tutorials, and find answers to common questions
        </Typography>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab icon={<HelpOutline />} label="FAQ" />
          <Tab icon={<VideoLibrary />} label="Video Tutorials" />
          <Tab icon={<Description />} label="Downloadable Guides" />
        </Tabs>
      </Box>

      {/* FAQ Tab */}
      {tabValue === 0 && (
        <Box>
          {filteredFAQ.length === 0 ? (
            <Card>
              <CardContent>
                <Typography align="center" color="text.secondary">
                  No results found for "{searchQuery}"
                </Typography>
              </CardContent>
            </Card>
          ) : (
            filteredFAQ.map((category, idx) => (
              <Box key={idx} mb={3}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School color="primary" />
                  {category.category}
                </Typography>
                {category.items.map((item, itemIdx) => (
                  <Accordion
                    key={itemIdx}
                    expanded={expanded === `${idx}-${itemIdx}`}
                    onChange={handleAccordionChange(`${idx}-${itemIdx}`)}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography sx={{ fontWeight: 500 }}>{item.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary">{item.a}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ))
          )}
        </Box>
      )}

      {/* Video Tutorials Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {tutorials.map((video, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
                <Box
                  sx={{
                    height: 180,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f5f5f5',
                    fontSize: 64
                  }}
                >
                  {video.thumbnail}
                </Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: 14, fontWeight: 600 }}>
                    {video.title}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip label={video.duration} size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {video.views} views
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => alert('Video player would open here. In production, embed YouTube/Vimeo player.')}
                  >
                    Watch Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Downloadable Guides Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          {guides.map((guide, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Description sx={{ fontSize: 48, color: '#CE1126' }} />
                    <Box flex={1}>
                      <Typography variant="h6" gutterBottom>
                        {guide.title}
                      </Typography>
                      <Box display="flex" gap={2} mb={2}>
                        <Chip label={`${guide.pages} pages`} size="small" />
                        <Chip label={`${guide.downloads} downloads`} size="small" variant="outlined" />
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => alert('PDF download would start here. File would be generated from templates.')}
                      >
                        Download PDF
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Contact Support */}
      <Card sx={{ mt: 4, bgcolor: '#006B3F', color: 'white' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Need More Help?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Can't find what you're looking for? Our support team is here to help.
          </Typography>
          <Button variant="contained" sx={{ bgcolor: 'white', color: '#006B3F' }}>
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
