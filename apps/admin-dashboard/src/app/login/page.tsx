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
  Tabs,
  Tab,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from '@/hooks/useForm';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, sendOtp, verifyOtp, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0); // 0: password, 1: otp
  const [otpStep, setOtpStep] = useState<number>(0); // 0: enter email, 1: enter otp
  const [otpEmail, setOtpEmail] = useState<string>('');

  const { values: passwordValues, handleChange: handlePasswordChange, handleSubmit: handlePasswordSubmit, reset: resetPasswordForm } = useForm({
    email: '',
    password: '',
  });

  const { values: otpValues, handleChange: handleOtpChange, handleSubmit: handleOtpSubmit, reset: resetOtpForm } = useForm({
    otp: '',
  });

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(passwordValues.email, passwordValues.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await sendOtp(otpEmail);
      setOtpStep(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await verifyOtp(otpEmail, otpValues.otp);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
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
            width: '100%',
            boxShadow: 3,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} textColor="primary">
            <Tab label="Password" />
            <Tab label="OTP" />
          </Tabs>
          <form noValidate sx={{ mt: 1 }}>
            {activeTab === 0 ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={passwordValues.email}
                  onChange={handlePasswordChange}
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
                  value={passwordValues.password}
                  onChange={handlePasswordChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                {error && (
                  <Typography sx={{ color: 'error.main', mb: 2 }}>{error}</Typography>
                )}
                <Grid container justifyContent="flex-end">
                  <Grid>
                    <Link
                      href="/forgot-password"
                      variant="body2"
                      sx={{ color: 'text.primary', cursor: 'pointer' }}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                {otpStep === 0 ? (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="otp-email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      autoFocus
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send OTP'}
                    </Button>
                    {error && (
                      <Typography sx={{ color: 'error.main', mb: 2 }}>{error}</Typography>
                    )}
                  </>
                ) : (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="OTP"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      value={otpValues.otp}
                      onChange={handleOtpChange}
                      autoFocus
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                    {error && (
                      <Typography sx={{ color: 'error.main', mb: 2 }}>{error}</Typography>
                    )}
                    <Button
                      type="button"
                      fullWidth
                      variant="text"
                      sx={{ mt: 2 }}
                      onClick={() => {
                        setOtpStep(0);
                        setError(null);
                        resetOtpForm();
                      }}
                    >
                      Back to email
                    </Button>
                  </>
                )}
              </>
            )}
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
