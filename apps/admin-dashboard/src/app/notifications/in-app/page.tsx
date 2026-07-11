import { Box, Typography, Container, TextField, Button, Switch, FormControlLabel, FormGroup, Slider, FormLabel, Select, MenuItem } from '@mui/material';
import { useState } from 'react';

const InAppNotificationsPage = () => {
  const [enabled, setEnabled] = useState(true);
  const [duration, setDuration] = useState(5); // seconds
  const [position, setPosition] = useState('top-right');
  const [maxVisible, setMaxVisible] = useState(5);

  const handleSave = () => {
    // TODO: Save to backend
    alert('Settings saved');
  };

  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        In-App Notifications
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3, mt: 2 }}>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
            label="Enable In-App Notifications"
          />
        </FormGroup>
        <FormLabel sx={{ mt: 2 }}>Duration (seconds)</FormLabel>
        <Slider
          value={duration}
          onChange={(e, value) => setDuration(value)}
          min={1}
          max={30}
          step={1}
          disableSwap
          disabled={!enabled}
        />
        <Typography sx={{ mt: 2 }}>{duration}s</Typography>

        <FormLabel sx={{ mt: 2 }}>Position</FormLabel>
        <Select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          disabled={!enabled}
          sx={{ width: '100%', mt: 1 }}
        >
          <MenuItem value="top-right">Top Right</MenuItem>
          <MenuItem value="top-left">Top Left</MenuItem>
          <MenuItem value="bottom-right">Bottom Right</MenuItem>
          <MenuItem value="bottom-left">Bottom Left</MenuItem>
          <MenuItem value="top-center">Top Center</MenuItem>
          <MenuItem value="bottom-center">Bottom Center</MenuItem>
        </Select>

        <FormLabel sx={{ mt: 2 }}>Max Visible</FormLabel>
        <Slider
          value={maxVisible}
          onChange={(e, value) => setMaxVisible(value)}
          min={1}
          max={10}
          step={1}
          disableSwap
          disabled={!enabled}
        />
        <Typography sx={{ mt: 2 }}>{maxVisible}</Typography>

        <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 4 }} disabled={!enabled}>
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default InAppNotificationsPage;