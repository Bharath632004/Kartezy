"use client";

import { Box, Typography, Container, Button, Select, MenuItem, Switch, FormControlLabel, FormGroup, FormLabel, Stack, Slider, TextField } from '@mui/material';
import { useState } from 'react';

const ThemeSettingsPage = () => {
  const [mode, setMode] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#1976d2');
  const [secondaryColor, setSecondaryColor] = useState('#dc004e');
  const [borderRadius, setBorderRadius] = useState(4);
  const [typographyFont, setTypographyFont] = useState('Roboto');
  const [enableDarkMode, setEnableDarkMode] = useState(true);
  const [systemTheme, setSystemTheme] = useState(false);

  const handleSave = () => {
    // Save to backend (to be implemented)
    alert('Theme settings saved');
  };

  const fonts = ['Roboto', 'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana'];

  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        Theme Settings
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={enableDarkMode} onChange={(e) => setEnableDarkMode(e.target.checked)} />}
            label="Enable Dark Mode"
          />
        </FormGroup>
        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch checked={systemTheme} onChange={(e) => setSystemTheme(e.target.checked)} />}
            label="Follow System Theme"
          />
        </FormGroup>
        <FormGroup sx={{ mt: 2 }}>
          <FormLabel htmlFor="theme-mode-select">Default Mode</FormLabel>
          <Select
            labelId="theme-mode-label"
            id="theme-mode-select"
            value={mode}
            label="Mode"
            onChange={(e) => setMode(e.target.value)}
            disabled={systemTheme}
            fullWidth
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </FormGroup>
        <Stack sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Primary Color
          </Typography>
          <TextField
            label="Primary Color"
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            margin="normal"
          />
          <Typography variant="h5" gutterBottom mt={2}>
            Secondary Color
          </Typography>
          <TextField
            label="Secondary Color"
            type="color"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            margin="normal"
          />
        </Stack>
        <Stack sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Border Radius
          </Typography>
          <Slider
            valueLabelDisplay="auto"
            min={0}
            max={24}
            step={1}
            value={borderRadius}
            onChange={(e, value) => setBorderRadius(value)}
          />
          <Typography sx={{ mt: 1 }}>{borderRadius}px</Typography>
        </Stack>
        <Stack sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Body Font
          </Typography>
          <Select
            labelId="font-label"
            id="font-select"
            value={typographyFont}
            label="Font"
            onChange={(e) => setTypographyFont(e.target.value)}
            fullWidth
          >
            {fonts.map((font) => (
              <MenuItem key={font} value={font}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 4 }}>
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default ThemeSettingsPage;