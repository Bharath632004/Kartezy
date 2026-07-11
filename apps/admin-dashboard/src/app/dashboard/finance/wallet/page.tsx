import { Box, Container, Typography } from '@mui/material';

export default function WalletPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Wallet
        </Typography>
        <Typography variant="body1">
          Wallet management and balance.
        </Typography>
      </Container>
    </Box>
  );
}