import { Box, Container, Stack, Typography, TextField, Button } from '@mui/material';
import { Mail, Phone, LocationOn } from '@mui/icons-material';

export const NewsletterSection = () => {
  const [email, setEmail] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // In a real app, this would send to a newsletter API
      alert(`Thanks for subscribing! We'll send updates to ${email}`);
      setEmail('');
    }
  };

  return (
    <section 
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        padding: { xs: 4, md: 8 }
      }}
    >
      {/* Decorative elements */}
      <div 
        sx={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '200px',
          height: '200px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <div 
        sx={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '150px',
          height: '150px',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '2s'
        }}
      />
      
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography 
            variant="h2" 
            fontWeight={600}
            sx={{ mb: 2 }}
          >
            Stay Updated with Karthezy
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ mb: 4, maxWidth: 500 }}
          >
            Get exclusive offers, new product alerts, and delivery updates straight to your inbox.
          </Typography>
          
          <form 
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
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
              sx={{
                flexGrow: 1,
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 24,
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                }
              }}
              InputLabelProps={{
                shrink: true,
                style: { color: 'white' }
              }}
              InputProps={{
                style: { color: 'white' }
              }}
            />
            <Button 
              variant="contained"
              sx={{
                px: { xs: 16, md: 24 },
                py: { xs: 2, md: 3 },
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 24,
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
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  );
};
