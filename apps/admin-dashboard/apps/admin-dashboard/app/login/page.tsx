import { useState } from 'react';
import { 
  Box, 
  Container, 
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { Link as RouterLink, useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/src/lib/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const { accessToken, refreshToken } = response.data;
      
      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Redirect to dashboard
      router.push('/(protected)/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      // Handle error (show toast, etc.)
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      component="main"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ width: 400, boxShadow: 4 }}>
        <CardHeader
          title="Sign in to Kartezy Admin"
          subheader="Manage your enterprise platform"
          sx={{ pb: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate sx={{ minWidth: 300 }}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 1 }}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ mb: 2 }}
                fullWidth
                autoComplete="current-password"
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isSubmitting || loading}
                sx={{ mt: 2 }}
                fullWidth
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Stack>
          </form>
          
          <Stack direction="row" justifyContent="center" mt={3}>
            <Link href="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Stack>
          
          <Stack direction="row" justifyContent="center" mt={2}>
            <Typography variant="body2">
              Don't have an account?{' '}
            </Typography>
            <Link href="/register" variant="body2" color="primary">
              Sign up
            </Link>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
