"use client";

import { Box, Typography, Container, TextField, Button, Switch, FormControlLabel, FormGroup, FormLabel, Select, MenuItem, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';

const PaymentSettingsPage = () => {
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; severity: 'success' | 'error'; message: string }>({ open: false, severity: 'success', message: '' });
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [stripePublishableKey, setStripePublishableKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [paypalClientId, setPaypalClientId] = useState('');
  const [paypalSecret, setPaypalSecret] = useState('');
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('');

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'];
  const [defaultCurrency, setDefaultCurrency] = useState('USD');

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        stripe: { enabled: stripeEnabled, publishableKey: stripePublishableKey, secretKey: stripeSecretKey },
        paypal: { enabled: paypalEnabled, clientId: paypalClientId, secret: paypalSecret },
        razorpay: { enabled: razorpayEnabled, keyId: razorpayKeyId, keySecret: razorpayKeySecret },
        defaultCurrency,
      };
      await axios.put('/settings/payment', payload);
      setSnackbar({ open: true, severity: 'success', message: 'Payment settings saved successfully' });
    } catch (error) {
      setSnackbar({ open: true, severity: 'error', message: error instanceof Error ? error.message : 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        Payment Settings
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={stripeEnabled} onChange={(e) => setStripeEnabled(e.target.checked)} />}
            label="Enable Stripe"
          />
        </FormGroup>
        {stripeEnabled && (
          <>
            <TextField
              label="Publishable Key"
              value={stripePublishableKey}
              onChange={(e) => setStripePublishableKey(e.target.value)}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Secret Key"
              type="password"
              value={stripeSecretKey}
              onChange={(e) => setStripeSecretKey(e.target.value)}
              margin="normal"
              fullWidth
            />
          </>
        )}
        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch checked={paypalEnabled} onChange={(e) => setPaypalEnabled(e.target.checked)} />}
            label="Enable PayPal"
          />
        </FormGroup>
        {paypalEnabled && (
          <>
            <TextField
              label="Client ID"
              value={paypalClientId}
              onChange={(e) => setPaypalClientId(e.target.value)}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Secret"
              type="password"
              value={paypalSecret}
              onChange={(e) => setPaypalSecret(e.target.value)}
              margin="normal"
              fullWidth
            />
          </>
        )}
        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch checked={razorpayEnabled} onChange={(e) => setRazorpayEnabled(e.target.checked)} />}
            label="Enable Razorpay"
          />
        </FormGroup>
        {razorpayEnabled && (
          <>
            <TextField
              label="Key ID"
              value={razorpayKeyId}
              onChange={(e) => setRazorpayKeyId(e.target.value)}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Key Secret"
              type="password"
              value={razorpayKeySecret}
              onChange={(e) => setRazorpayKeySecret(e.target.value)}
              margin="normal"
              fullWidth
            />
          </>
        )}
        <FormGroup sx={{ mt: 2 }}>
          <FormLabel htmlFor="currency-select">Default Currency</FormLabel>
          <Select
            labelId="currency-label"
            id="currency-select"
            value={defaultCurrency}
            label="Currency"
            onChange={(e) => setDefaultCurrency(e.target.value)}
            fullWidth
          >
            {currencies.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormGroup>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={saving} sx={{ mt: 4 }}>
          {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Settings'}
        </Button>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PaymentSettingsPage;