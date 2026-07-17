import { Box, Container, Stack, Typography, Divider, Button } from '@mui/material';
import { 
  Email, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram 
} from '@mui/icons-material';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
          {/* About */}
          <Box sx={{ textAlign: 'center', minWidth: 200 }}>
            <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
              About Kartezy
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Kartezy is India's fastest grocery delivery platform.
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Email fontSize="inherit" sx={{ mr: 1 }} />
                support@kartezy.com
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone fontSize="inherit" sx={{ mr: 1 }} />
                +91-1800-123-4567
              </Typography>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box sx={{ textAlign: 'center', minWidth: 200 }}>
            <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <Stack spacing={2} sx={{ alignItems: 'center' }}>
              <Link href="/" passHref>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { textDecoration: 'underline' }, cursor: 'pointer' }}>
                  Home
                </Typography>
              </Link>

              <Link href="/categories" passHref>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { textDecoration: 'underline' }, cursor: 'pointer' }}>
                  Categories
                </Typography>
              </Link>

              <Link href="/offers" passHref>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { textDecoration: 'underline' }, cursor: 'pointer' }}>
                  Offers
                </Typography>
              </Link>

              <Link href="/blog" passHref>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { textDecoration: 'underline' }, cursor: 'pointer' }}>
                  Blog
                </Typography>
              </Link>
            </Stack>
          </Box>

          {/* Download App */}
          <Box sx={{ textAlign: 'center', minWidth: 200 }}>
            <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
              Download Our App
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Shop anytime, anywhere
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  border: '2px solid #1976d2',
                  color: '#1976d2',
                  height: 40,
                  borderRadius: 10,
                  px: 2,
                  fontWeight: 600,
                  minWidth: 48,
                  '&:hover': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                  }
                }}
              >
                <Facebook fontSize="medium" />
              </Button>

              <Button
                variant="outlined"
                sx={{
                  border: '2px solid #1976d2',
                  color: '#1976d2',
                  height: 40,
                  borderRadius: 10,
                  px: 2,
                  fontWeight: 600,
                  minWidth: 48,
                  '&:hover': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                  }
                }}
              >
                <Twitter fontSize="medium" />
              </Button>

              <Button
                variant="outlined"
                sx={{
                  border: '2px solid #1976d2',
                  color: '#1976d2',
                  height: 40,
                  borderRadius: 10,
                  px: 2,
                  fontWeight: 600,
                  minWidth: 48,
                  '&:hover': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                  }
                }}
              >
                <Instagram fontSize="medium" />
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Kartezy. All rights reserved.
          </Typography>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Link href="/terms" passHref>
              <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { textDecoration: 'underline' }, cursor: 'pointer' }}>
                Terms of Service
              </Typography>
            </Link>

            <Link href="/privacy" passHref>
              <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { textDecoration: 'underline' }, cursor: 'pointer' }}>
                Privacy Policy
              </Typography>
            </Link>

            <Link href="/refund" passHref>
              <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { textDecoration: 'underline' }, cursor: 'pointer' }}>
                Refund Policy
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </footer>
  );
};
