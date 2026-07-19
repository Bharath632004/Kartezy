"use client";

import { Box, Typography, Container, TextField, Button, Switch, FormControlLabel, FormGroup, FormLabel, Select, MenuItem, Slider, Divider, Stack } from '@mui/material';
import { useState } from 'react';

const SecuritySettingsPage = () => {
  const [minPasswordLength, setMinPasswordLength] = useState(8);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [passwordHistorySize, setPasswordHistorySize] = useState(5);
  const [sessionTimeout, setSessionTimeout] = useState(30); // minutes
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [lockoutDuration, setLockoutDuration] = useState(30); // minutes
  const [requireMfaForAdmins, setRequireMfaForAdmins] = useState(false);
  const [requireMfaForAll, setRequireMfaForAll] = useState(false);

  const handleSave = () => {
    // Save to backend (to be implemented)
    alert('Security settings saved');
  };

  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        Security Settings
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Password Policy
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Minimum Password Length"
            type="number"
            value={minPasswordLength}
            onChange={(e) => setMinPasswordLength(parseInt(e.target.value) || 8)}
            margin="normal"
          />
          <Slider
            valueLabelDisplay="auto"
            min={4}
            max={20}
            step={1}
            value={minPasswordLength}
            onChange={(e, value) => setMinPasswordLength(value)}
          />
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={requireUppercase} onChange={(e) => setRequireUppercase(e.target.checked)} />}
              label="Require Uppercase Letters"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={requireLowercase} onChange={(e) => setRequireLowercase(e.target.checked)} />}
              label="Require Lowercase Letters"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={requireNumbers} onChange={(e) => setRequireNumbers(e.target.checked)} />}
              label="Require Numbers"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={requireSpecialChars} onChange={(e) => setRequireSpecialChars(e.target.checked)} />}
              label="Require Special Characters"
            />
          </FormGroup>
          <Stack spacing={2} mt={2}>
            <TextField
              label="Password History Size"
              type="number"
              value={passwordHistorySize}
              onChange={(e) => setPasswordHistorySize(parseInt(e.target.value) || 5)}
              margin="normal"
            />
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={1}
              value={passwordHistorySize}
              onChange={(e, value) => setPasswordHistorySize(value)}
            />
          </Stack>
        </Stack>
        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" gutterBottom>
          Session Settings
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Session Timeout (minutes)"
            type="number"
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(parseInt(e.target.value) || 30)}
            margin="normal"
          />
          <Slider
            valueLabelDisplay="auto"
            min={5}
            max={120}
            step={5}
            value={sessionTimeout}
            onChange={(e, value) => setSessionTimeout(value)}
          />
          <TextField
            label="Max Login Attempts"
            type="number"
            value={maxLoginAttempts}
            onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value) || 5)}
            margin="normal"
          />
          <Slider
            valueLabelDisplay="auto"
            min={1}
            max={10}
            step={1}
            value={maxLoginAttempts}
            onChange={(e, value) => setMaxLoginAttempts(value)}
          />
          <TextField
            label="Lockout Duration (minutes)"
            type="number"
            value={lockoutDuration}
            onChange={(e) => setLockoutDuration(parseInt(e.target.value) || 30)}
            margin="normal"
          />
          <Slider
            valueLabelDisplay="auto"
            min={5}
            max={60}
            step={5}
            value={lockoutDuration}
            onChange={(e, value) => setLockoutDuration(value)}
          />
        </Stack>
        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" gutterBottom>
          Multi-Factor Authentication (MFA)
        </Typography>
        <Stack spacing={2}>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={requireMfaForAdmins} onChange={(e) => setRequireMfaForAdmins(e.target.checked)} />}
              label="Require MFA for Administrators"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={requireMfaForAll} onChange={(e) => setRequireMfaForAll(e.target.checked)} />}
              label="Require MFA for All Users"
            />
          </FormGroup>
        </Stack>
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 4 }}>
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default SecuritySettingsPage;