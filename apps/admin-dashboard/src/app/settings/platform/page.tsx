"use client";

import { Box, Typography, Container, TextField, Button, Switch, FormControlLabel, FormGroup, Slider, TextareaAutosize, Select, MenuItem, Stack, FormLabel } from '@mui/material';
import { useState } from 'react';

const PlatformSettingsPage = () => {
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxUploadSize, setMaxUploadSize] = useState(10); // in MB
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [allowGuestCheckout, setAllowGuestCheckout] = useState(true);

  const timezones = ['UTC', 'GMT', 'EST', 'PST', 'CET', 'IST', 'JST'];
  const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];

  const handleSave = () => {
    // Save to backend (to be implemented)
    alert('Platform settings saved');
  };

  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        Platform Settings
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
        <TextField
          label="Site Name"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Site URL"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Contact Email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          margin="normal"
          fullWidth
        />
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} />}
            label="Maintenance Mode"
          />
        </FormGroup>
        {maintenanceMode && (
          <TextareaAutosize
            label="Maintenance Message"
            placeholder="Enter message to display during maintenance"
            rows={4}
            margin="normal"
            fullWidth
          />
        )}
        <Stack spacing={2} mt={2}>
          <TextField
            label="Maximum Upload Size (MB)"
            type="number"
            value={maxUploadSize}
            onChange={(e) => setMaxUploadSize(parseInt(e.target.value) || 10)}
            margin="normal"
          />
          <Slider
            valueLabelDisplay="auto"
            min={1}
            max={100}
            step={1}
            value={maxUploadSize}
            onChange={(e, value) => setMaxUploadSize(value)}
          />
        </Stack>
        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch checked={allowRegistration} onChange={(e) => setAllowRegistration(e.target.checked)} />}
            label="Allow User Registration"
          />
        </FormGroup>
        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch checked={allowGuestCheckout} onChange={(e) => setAllowGuestCheckout(e.target.checked)} />}
            label="Allow Guest Checkout"
          />
        </FormGroup>
        <FormGroup sx={{ mt: 2 }}>
          <FormLabel htmlFor="timezone-select">Timezone</FormLabel>
          <Select
            labelId="timezone-label"
            id="timezone-select"
            value={timezone}
            label="Timezone"
            onChange={(e) => setTimezone(e.target.value)}
            fullWidth
          >
            {timezones.map((tz) => (
              <MenuItem key={tz} value={tz}>
                {tz}
              </MenuItem>
            ))}
          </Select>
        </FormGroup>
        <FormGroup sx={{ mt: 2 }}>
          <FormLabel htmlFor="dateformat-select">Date Format</FormLabel>
          <Select
            labelId="dateformat-label"
            id="dateformat-select"
            value={dateFormat}
            label="Date Format"
            onChange={(e) => setDateFormat(e.target.value)}
            fullWidth
          >
            {dateFormats.map((fmt) => (
              <MenuItem key={fmt} value={fmt}>
                {fmt}
              </MenuItem>
            ))}
          </Select>
        </FormGroup>
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 4 }}>
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default PlatformSettingsPage;