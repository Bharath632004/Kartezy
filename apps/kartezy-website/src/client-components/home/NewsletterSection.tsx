'use client';
import { Box, Container, Stack, Typography, TextField, Button } from '@mui/material';
import { useState } from 'react';

export default function NewsletterSection({ data } = {}) {
  // Default data if none provided
  const defaultData = {
    title: 'Stay Updated with Kartezy',
    description: 'Get exclusive offers, new product alerts, and delivery updates straight to your inbox.',
    placeholder: 'Your Email Address',
    buttonText: 'Subscribe Now',
    privacyText: 'We respect your privacy. Unsubscribe at any time.',
  };

  const dataToUse = data || defaultData;
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitting(true);
      try {
        // In a real app, we would call an API to subscribe
        // For now, we'll simulate
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessage(`Thanks for subscribing! We'll send updates to ${email}`);
        setEmail('');
        setSubmitting(false);
      } catch (error) {
        setMessage('Failed to subscribe. Please try again.');
        setSubmitting(false);
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        padding: { xs: 4, md: 8 }
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography
            variant="h2"
            fontWeight={600}
            sx={{ mb: 2 }}
          >
            {dataToUse.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, maxWidth: 500 }}
          >
            {dataToUse.description}
          </Typography>

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              justifyContent: 'center',
              maxWidth: 500,
              width: '100%'
            }}
          >
            <TextField
              label={dataToUse.placeholder}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{
                flexGrow: 1,
                minWidth: 200,
                backgroundColor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              sx={{
                px: 4,
                py: 2,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                opacity: submitting ? 0.7 : 1,
              }}
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Subscribing...' : dataToUse.buttonText}
            </Button>
          </form>

          {message && (
            <Typography variant="body2" color="white" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}

          <Typography
            variant="body2"
            color="white"
            sx={{ mt: 4, opacity: 0.8 }}
          >
            {dataToUse.privacyText}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}