import { Box, Typography, Container, Button, Switch, FormControlLabel, FormGroup, FormLabel, Select, MenuItem, TextField, Stack } from '@mui/material';
import { useState } from 'react';

const LanguageSettingsPage = () => {
  const [language, setLanguage] = useState('en');
  const [timeFormat, setTimeFormat] = useState('12');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0); // 0 = Sunday, 1 = Monday
  const [numberFormat, setNumberFormat] = useState('1,234.56');
  const [currencyFormat, setCurrencyFormat] = useState('$1,234.56');
  const [rtlEnabled, setRtlEnabled] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
  ];

  const timeFormats = ['12', '24'];
  const dateFormatsArr = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
  const firstDayOptions = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
  ];
  const numberFormats = ['1,234.56', '1.234,56', '1 234,56', '1,234.56'];
  const currencyFormats = ['$1,234.56', '€1.234,56', '£1,234.56', '₹1,234.56'];

  const handleSave = () => {
    // Save to backend (to be implemented)
    alert('Language settings saved');
  };

  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        Language Settings
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
        <FormGroup>
          <FormLabel htmlFor="language-select">Language</FormLabel>
          <Select
            labelId="language-label"
            id="language-select"
            value={language}
            label="Language"
            onChange={(e) => setLanguage(e.target.value)}
            fullWidth
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormGroup>
        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch checked={rtlEnabled} onChange={(e) => setRtlEnabled(e.target.checked)} />}
            label="Enable Right-to-Left (RTL)"
          />
        </FormGroup>
        <Stack sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Time Format
          </Typography>
          <Select
            labelId="timeformat-label"
            id="timeformat-select"
            value={timeFormat}
            label="Format"
            onChange={(e) => setTimeFormat(e.target.value)}
            fullWidth
          >
            {timeFormats.map((fmt) => (
              <MenuItem key={fmt} value={fmt}>
                {fmt} hour
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Date Format
          </Typography>
          <Select
            labelId="dateformat-label"
            id="dateformat-select"
            value={dateFormat}
            label="Format"
            onChange={(e) => setDateFormat(e.target.value)}
            fullWidth
          >
            {dateFormatsArr.map((fmt) => (
              <MenuItem key={fmt} value={fmt}>
                {fmt}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            First Day of Week
          </Typography>
          <Select
            labelId="firstday-label"
            id="firstday-select"
            value={firstDayOfWeek}
            label="First Day"
            onChange={(e) => setFirstDayOfWeek(parseInt(e.target.value))}
            fullWidth
          >
            {firstDayOptions.map((day) => (
              <MenuItem key={day.value} value={day.value}>
                {day.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Number Format
          </Typography>
          <Select
            labelId="numberformat-label"
            id="numberformat-select"
            value={numberFormat}
            label="Format"
            onChange={(e) => setNumberFormat(e.target.value)}
            fullWidth
          >
            {numberFormats.map((fmt) => (
              <MenuItem key={fmt} value={fmt}>
                {fmt}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Currency Format
          </Typography>
          <Select
            labelId="currencyformat-label"
            id="currencyformat-select"
            value={currencyFormat}
            label="Format"
            onChange={(e) => setCurrencyFormat(e.target.value)}
            fullWidth
          >
            {currencyFormats.map((fmt) => (
              <MenuItem key={fmt} value={fmt}>
                {fmt}
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

export default LanguageSettingsPage;