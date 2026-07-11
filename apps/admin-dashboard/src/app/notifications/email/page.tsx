import { Box, Typography, Container, TextField, Button, Switch, FormControlLabel, FormGroup } from '@mui/material';
import { useState } from 'react';

const EmailNotificationsPage = () => {
  const [enabled, setEnabled] = useState(true);
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [fromEmail, setFromEmail] = useState('');

  const handleSave = () => {
    // TODO: Save to backend
    alert('Settings saved');
  };

  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        Email Notifications
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3, mt: 2 }}>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
            label="Enable Email Notifications"
          />
        </FormGroup>
        <TextField
          label="SMTP Host"
          value={smtpHost}
          onChange={(e) => setSmtpHost(e.target.value)}
          margin="normal"
          fullWidth
          disabled={!enabled}
        />
        <TextField
          label="SMTP Port"
          value={smtpPort}
          onChange={(e) => setSmtpPort(e.target.value)}
          margin="normal"
          fullWidth
          type="number"
          disabled={!enabled}
        />
        <TextField
          label="SMTP User"
          value={smtpUser}
          onChange={(e) => setSmtpUser(e.target.value)}
          margin="normal"
          fullWidth
          disabled={!enabled}
        />
        <TextField
          label="SMTP Password"
          value={smtpPass}
          onChange={(e) => setSmtpPass(e.target.value)}
          margin="normal"
          fullWidth
          type="password"
          disabled={!enabled}
        />
        <TextField
          label="From Email"
          value={fromEmail}
          onChange={(e) => setFromEmail(e.target.value)}
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

export default EmailNotificationsPage;