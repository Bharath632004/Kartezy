import { Box, Container, Typography } from '@mui/material';

export default function TransactionsPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Transactions
        </Typography>
        <Typography variant="body1">
          View and manage all financial transactions.
        </Typography>
      </Container>
    </Box>
  );
}