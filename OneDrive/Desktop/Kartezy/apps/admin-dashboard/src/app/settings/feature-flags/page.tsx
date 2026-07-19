"use client";

import { Box, Typography, Container, Button, Switch, FormControlLabel, FormGroup, FormLabel, TextField, Stack, Divider } from '@mui/material';
import { useState } from 'react';

const FeatureFlagsPage = () => {
  const [flags, setFlags] = useState([
    { key: 'new_ui', name: 'New UI', description: 'Enable the new user interface', enabled: false },
    { key: 'advanced_analytics', name: 'Advanced Analytics', description: 'Enable advanced analytics features', enabled: true },
    { key: 'ai_recommendations', name: 'AI Recommendations', description: 'Enable AI-powered product recommendations', enabled: false },
    { key: 'dark_mode', name: 'Dark Mode', description: 'Enable dark mode for users', enabled: true },
    { key: 'social_login', name: 'Social Login', description: 'Enable login with social media', enabled: false },
    { key: 'multi_currency', name: 'Multi-Currency', description: 'Enable multiple currencies', enabled: true },
    { key: 'tax_inclusive', name: 'Tax Inclusive Pricing', description: 'Show prices inclusive of tax', enabled: false },
    { key: 'guest_checkout', name: 'Guest Checkout', description: 'Allow checkout without account', enabled: true },
  ]);

  const [newFlagKey, setNewFlagKey] = useState('');
  const [newFlagName, setNewFlagName] = useState('');
  const [newFlagDescription, setNewFlagDescription] = useState('');

  const handleToggle = (key) => {
    setFlags(
      flags.map((flag) =>
        flag.key === key ? { ...flag, enabled: !flag.enabled } : flag
      )
    );
  };

  const handleAddFlag = () => {
    if (newFlagKey && newFlagName) {
      setFlags([
        ...flags,
        {
          key: newFlagKey,
          name: newFlagName,
          description: newFlagDescription,
          enabled: false,
        },
      ]);
      setNewFlagKey('');
      setNewFlagName('');
      setNewFlagDescription('');
    }
  };

  const handleSave = () => {
    // Save to backend (to be implemented)
    alert('Feature flags saved');
  };

  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        Feature Flags
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
        <Stack spacing={2} mt={2}>
          <TextField
            label="Flag Key"
            value={newFlagKey}
            onChange={(e) => setNewFlagKey(e.target.value)}
            placeholder="e.g., new_feature"
            margin="normal"
            fullWidth
          />
          <TextField
            label="Flag Name"
            value={newFlagName}
            onChange={(e) => setNewFlagName(e.target.value)}
            placeholder="e.g., New Feature"
            margin="normal"
            fullWidth
          />
          <TextField
            label="Description"
            value={newFlagDescription}
            onChange={(e) => setNewFlagDescription(e.target.value)}
            placeholder="e.g., Description of the feature"
            margin="normal"
            fullWidth
          />
        </Stack>
        <Button variant="outlined" color="primary" onClick={handleAddFlag} sx={{ mt: 2 }}>
          Add Flag
        </Button>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h5" gutterBottom>
          Active Flags
        </Typography>
        {flags.map((flag) => (
          <Box key={flag.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>{flag.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {flag.description}
              </Typography>
            </Box>
            <FormControlLabel
              control={<Switch checked={flag.enabled} onChange={() => handleToggle(flag.key)} />}
              label=""
            />
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 4 }}>
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default FeatureFlagsPage;