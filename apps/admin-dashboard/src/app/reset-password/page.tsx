import { useState } from 'react';
import {
  Box,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Stack,
  Container,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed');
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
          <form onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {token ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="New Password"
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
                {error && (
                  <Typography sx={{ color: 'error.main', mb: 2 }}>{error}</Typography>
                )}
              </>
            ) : (
              <Typography sx={{ color: 'text.secondary' }}>
                Invalid or expired token. Please request a new password reset.
              </Typography>
            )}
          </form>
        </Box>
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          {success ? (
            <>
              <Typography variant="h5" component="div">
                Password reset successfully
              </Typography>
              <Button
                variant="text"
                onClick={() => router.push('/login')}
                sx={{ mt: 2 }}
              >
                Sign in
              </Button>
            </>
          ) : (
            <Typography sx={{ fontSize: '0.875rem' }}>
              Remember your password? <Link
                href="/login"
                component="a"
                sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign in
              </Link>
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}
