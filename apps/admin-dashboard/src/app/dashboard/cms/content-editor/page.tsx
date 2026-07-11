import { Box, Container, Typography } from '@mui/material';

export default function ContentEditorPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Content Editor
        </Typography>
        <Typography variant="body1">
          Rich text editor for managing website content.
        </Typography>
      </Container>
    </Box>
  );
}