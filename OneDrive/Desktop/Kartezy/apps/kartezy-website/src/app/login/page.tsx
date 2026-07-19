"use client";

import { Box, Container, Stack, Typography, Card, TextField, Button, Link as MuiLink, Checkbox, FormControlLabel, Divider } from '@mui/material';
import { Person, Lock, CheckCircle, Link } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/lib/services';

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const { mutate: loginMutation, isLoading: isMutating } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Store token in localStorage (already handled by api interceptor)
      localStorage.setItem('token', data.token);
      // Redirect to home or previous page
      router.push('/');
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Login failed');
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    loginMutation(formData);
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth2/authorization/google?redirect_uri=${encodeURIComponent(window.location.origin)}`;
  };

  const handleFacebookSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth2/authorization/facebook?redirect_uri=${encodeURIComponent(window.location.origin)}`;
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ width: '100%', maxWidth: 400, borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', p: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Person fontSize={48} color="primary.main" sx={{ mb: 2 }} />
          <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to your account to continue
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            sx={{ mb: 3 }}
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            sx={{ mb: 3 }}
            autoComplete="current-password"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                color="primary"
              />
            }
            label="Remember me"
            labelPlacement="start"
            sx={{ mb: 3 }}
          />
          {error && (
            <Box sx={{ mb: 3, color: 'error.main' }}>
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ width: '100%', py: 2, fontWeight: 600 }}
            disabled={loading || isMutating}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <MuiLink
              href="/register"
              color="primary.main"
              sx={{ fontWeight: 600, textDecoration: 'none' }}
            >
              Sign Up
            </MuiLink>
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Or continue with
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Button
            variant="outlined"
            sx={{ width: 48, height: 48, borderRadius: '50%' }}
            startIcon={<Person fontSize="medium" />}
            onClick={handleGoogleSignIn}
          />
          <Button
            variant="outlined"
            sx={{ width: 48, height: 48, borderRadius: '50%' }}
            startIcon={<Link fontSize="medium" />}
            onClick={handleFacebookSignIn}
          />
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Forgot your password?
          </Typography>
          <MuiLink
            href="/forgot-password"
            color="primary.main"
            sx={{ fontWeight: 600, textDecoration: 'none' }}
          >
            Reset Password
          </MuiLink>
        </Box>
      </Card>
    </Container>
  );
};

export default LoginPage;