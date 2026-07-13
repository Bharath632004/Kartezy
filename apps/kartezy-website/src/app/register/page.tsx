"use client";

import { Box, Container, Stack, Typography, Card, CardContent, TextField, Button, FormControlLabel, Checkbox, RadioGroup, Radio } from '@mui/material';
import { Person, Lock, CheckCircle, Link } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { register } from '@/lib/services';

const RegisterPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const { mutate: registerMutation, isLoading: isMutating } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // Store token in localStorage (already handled by api interceptor)
      localStorage.setItem('token', data.token);
      // Redirect to home or profile setup
      router.push('/');
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Registration failed');
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms and Conditions');
      setLoading(false);
      return;
    }

    // Prepare data for API
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    registerMutation(userData);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ width: '100%', maxWidth: 450, borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', p: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Person fontSize={48} color="primary.main" sx={{ mb: 2 }} />
          <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Join Kartenzy to enjoy faster grocery delivery
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            sx={{ mb: 2 }}
            autoComplete="given-name"
          />
          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            sx={{ mb: 2 }}
            autoComplete="family-name"
          />
          <TextField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            sx={{ mb: 2 }}
            autoComplete="email"
          />
          <TextField
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            sx={{ mb: 2 }}
            autoComplete="tel"
          />
          <TextField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            sx={{ mb: 2 }}
            autoComplete="new-password"
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            sx={{ mb: 2 }}
            autoComplete="new-password"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                color="primary"
              />
            }
            label={
              <>
                I agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </>
            }
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <a href="/login" sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'none' }}>
              Sign In
            </a>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default RegisterPage;