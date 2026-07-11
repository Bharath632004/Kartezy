import { Box, Typography, Container, TextField, Button, Switch, FormControlLabel, FormGroup, TextareaAutosize, Select, MenuItem } from '@mui/material';
import { useState } from 'react';

const SystemAlertsPage = () => {
  const [enabled, setEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [inAppEnabled, setInAppEnabled] = useState(true);
  const [recipients, setRecipients] = useState(''); // comma-separated emails
  const [phoneNumbers, setPhoneNumbers] = useState(''); // comma-separated phone numbers
  const [template, setTemplate] = useState('');

  const handleSave = () => {
    // TODO: Save to backend
    alert('Settings saved');
  };

  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        System Alerts
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3, mt: 2 }}>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
            label="Enable System Alerts"
          />
        </FormGroup>
        {/* Only show sub-options if system alerts are enabled */}
        {enabled && (
          <>
            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel
                control={<Switch checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} />}
                label="Send via Email"
              />
            </FormGroup>
            {emailEnabled && (
              <>
                <TextField
                  label="Recipient Emails (comma-separated)"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  margin="normal"
                  fullWidth
                />
                <TextareaAutosize
                  label="Email Template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  rows={4}
                  margin="normal"
                  fullWidth
                />
              </>
            )}
            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel
                control={<Switch checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} />}
                label="Send via SMS"
              />
            </FormGroup>
            {smsEnabled && (
              <TextField
                label="Phone Numbers (comma-separated)"
                value={phoneNumbers}
                onChange={(e) => setPhoneNumbers(e.target.value)}
                margin="normal"
                fullWidth
              />
            )}

            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel
                control={<Switch checked={inAppEnabled} onChange={(e) => setInAppEnabled(e.target.checked)} />}
                label="Show In-App Notification"
              />
            </FormGroup>

            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 4 } disabled={!enabled}}>
              Save Settings
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default SystemAlertsPage;