"use client";

import { useState } from 'react';
import {
  Box,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          mt: 8,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography component="h1" variant="h4">
            Admin Dashboard
          </Typography>
          <Typography component="h6" variant="h6" color="text.secondary" paragraph>
            Reset your password
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            boxShadow: 3,
            borderRadius: 2,
            p: 4,
          }}
        >
          {!success ? (
            <form onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              {error && (
                <Typography sx={{ color: 'error.main', mb: 2 }}>{error}</Typography>
              )}
            </form>
          ) : (
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Typography variant="h5" component="div">
                Reset link sent
              </Typography>
              <Typography>
                We've sent a password reset link to your email. Please check your inbox.
              </Typography>
              <Button
                variant="text"
                onClick={() => router.push('/login')}
                sx={{ mt: 2 }}
              >
                Back to sign in
              </Button>
            </Stack>
          )}
        </Box>
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.875rem' }}>
            Remember your password? <Link
              href="/login"
              component="a"
              sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Container>
    </>
  );
}
