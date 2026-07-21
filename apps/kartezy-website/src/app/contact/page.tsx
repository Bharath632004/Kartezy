"use client";

import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { Phone, Email } from '@mui/icons-material';
import { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const officeLocations = [
    { id: 1, city: 'Bangalore', address: '123, Innovative Tech Park, Whitefield, Bangalore - 560066', phone: '+91-80-1234-5678', email: 'bangalore@kartezy.com', timings: 'Mon-Sat: 8:00 AM - 8:00 PM' },
    { id: 2, city: 'Mumbai', address: '456, Business Bandra Kurla Complex, Mumbai - 400051', phone: '+91-22-2345-6789', email: 'mumbai@kartezy.com', timings: 'Mon-Sat: 8:00 AM - 8:00 PM' },
    { id: 3, city: 'Delhi', address: '789, Corporate Hub Connaught Place, New Delhi - 110001', phone: '+91-11-3456-7890', email: 'delhi@kartezy.com', timings: 'Mon-Sat: 8:00 AM - 8:00 PM' }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ fontWeight: 600, mb: 2 }}>Contact Us</Typography>
        <Typography variant="body1" color="text.secondary">Get in touch with our team for any questions or support.</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required fullWidth sx={{ mb: 2 }} />
            <TextField label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required fullWidth sx={{ mb: 2 }} />
            <TextField label="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required fullWidth sx={{ mb: 2 }} />
            <TextField label="Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required fullWidth multiline rows={4} sx={{ mb: 2 }} />
            <Button type="submit" variant="contained" color="primary" sx={{ px: 4, py: 2 }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </Box>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          {success && <Typography color="success.main" sx={{ mt: 2 }}>Message sent successfully!</Typography>}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Our Offices</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {officeLocations.map((office) => (
              <Box key={office.id} sx={{ flex: '1 1 200px', border: '1px solid #e0e0e0', borderRadius: 4, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{office.city}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{office.address}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2">{office.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2">{office.email}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">{office.timings}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ContactPage;
