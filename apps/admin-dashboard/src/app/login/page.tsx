"use client";

import { useState } from 'react';
import {
  Box,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Link,
  Stack,
  Container,
  Grid,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from '@/hooks/useForm';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { values, handleChange, handleSubmit, reset } = useForm({
    email: '',
    password: '',
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', values);
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
            Sign in to your account
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%', // Fix IE 11 issue.
            boxShadow: 3,
            borderRadius: 2,
            p: 4,
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            {error && (
              <Typography sx={{ color: 'error.main', mb: 2 }}>{error}</Typography>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href="/forgot-password"
                  variant="body2"
                  sx={{ color: 'text.primary', cursor: 'pointer' }}
                >
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.875rem' }}>
            Don't have an account? <Link
              href="/register"
              component={Link}
              sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Container>
    </>
  );
}
