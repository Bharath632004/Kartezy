import { Box, Typography, Container, TextField, Button, Switch, FormControlLabel, FormGroup } from '@mui/material';
import { useState } from 'react';

const PushNotificationsPage = () => {
  const [enabled, setEnabled] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [senderId, setSenderId] = useState('');

  const handleSave = () => {
    // TODO: Save to backend
    alert('Settings saved');
  };

  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        Push Notifications
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3, mt: 2 }}>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
            label="Enable Push Notifications"
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
          label="Sender ID"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
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

export default PushNotificationsPage;