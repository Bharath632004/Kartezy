import { Box, Typography, Container, TextField, Button, Switch, FormControlLabel, FormGroup } from '@mui/material';
import { useState } from 'react';

const SMSNotificationsPage = () => {
  const [enabled, setEnabled] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [fromNumber, setFromNumber] = useState('');

  const handleSave = () => {
    // TODO: Save to backend
    alert('Settings saved');
  };

  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        SMS Notifications
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3, mt: 2 }}>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
            label="Enable SMS Notifications"
          />
        </FormGroup>
        <TextField
          label="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          margin="normal"
          fullWidth
          disabled={!enabled}
        />
        <TextField
          label="API Secret"
          value={apiSecret}
          onChange={(e) => setApiSecret(e.target.value)}
          margin="normal"
          fullWidth
          type="password"
          disabled={!enabled}
        />
        <TextField
          label="From Number"
          value={fromNumber}
          onChange={(e) => setFromNumber(e.target.value)}
          margin="normal"
          fullWidth
          disabled={!enabled}
        />
        <Button variant="contained" color="primary" onClick={handleSave} disabled={!enabled}>
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default SMSNotificationsPage;