'use client';
import { Box, Container, Stack, Typography, TextField, Button } from '@mui/material';
import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Thanks for subscribing! We'll send updates to ${email}`);
      setEmail('');
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
            Stay Updated with Kartezy
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, maxWidth: 500 }}
          >
            Get exclusive offers, new product alerts, and delivery updates straight to your inbox.
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
              label="Your Email Address"
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
                textTransform: 'none'
              }}
              type="submit"
            >
              Subscribe Now
            </Button>
          </form>

          <Typography
            variant="body2"
            color="white"
            sx={{ mt: 4, opacity: 0.8 }}
          >
            We respect your privacy. Unsubscribe at any time.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};
