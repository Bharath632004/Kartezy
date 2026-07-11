'use client';

import { Box, Typography, Container, Button, Stack, Alert, TextField } from '@mui/material';
import { Qrcode, CheckCircle, ErrorOutline } from '@mui/icons-material';
import { useState } from 'react';

const MfaPage = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const generateSecret = () => {
    // In a real app, you would generate a secret on the backend
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let text = '';
    for (let i = 0; i < 16; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const generateQrCodeUrl = (secret) => {
    // In a real app, you would use a proper QR code generator
    // This is a placeholder URL
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/Account:user@example.com?secret=${secret}&issuer=AppName`;
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      let code = '';
      for (let j = 0; j < 8; j++) {
        code += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 36));
        if ((j + 1) % 4 === 0 && j < 7) code += '-';
      }
      codes.push(code);
    }
    return codes;
  };

  const handleEnable = () => {
    setIsSettingUp(true);
    const secret = generateSecret();
    setSecret(secret);
    setQrCodeUrl(generateQrCodeUrl(secret));
  };

  const handleVerify = () => {
    // In a real app, you would send the code to the backend for verification
    // For now, we'll just simulate success if the code is not empty
    if (verificationCode.length === 6) {
      setIsVerifying(false);
      setIsEnabled(true);
      setBackupCodes(generateBackupCodes());
    } else {
      alert('Invalid code');
    }
  };

  const handleDisable = () => {
    if (window.confirm('Are you sure you want to disable MFA? This will make your account less secure.')) {
      setIsEnabled(false);
      setSecret('');
      setQrCodeUrl('');
      setBackupCodes([]);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Copied to clipboard');
  };

  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        Multi-Factor Authentication (MFA)
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
        {!isEnabled && !isSettingUp ? (
          <>
            <Typography variant="h5" gutterBottom>
              MFA is currently disabled
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography color="text.secondary">
                Enable multi-factor authentication to add an extra layer of security to your account.
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEnable}
                disabled={isSettingUp || isVerifying}
              >
                {isSettingUp ? 'Setting up...' : 'Set up MFA'}
              </Button>
            </Stack>
          </>
        ) : isSettingUp && !isVerifying ? (
          <>
            <Typography variant="h5" gutterBottom>
              Set up MFA
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <img src={qrCodeUrl} alt="QR Code" width="150" height="150" />
            </Box>
            <Typography>
              Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.) and enter the 6-digit code below.
            </Typography>
            <TextField
              label="Verification Code"
              type="number"
              inputMode="numeric"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              margin="normal"
              fullWidth
              autoFocus
            />
            <Stack direction="row" spacing={2} mt={2}>
              <Button
                variant="outlined"
                onClick={() => setVerificationCode('')}
                disabled={!verificationCode}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleVerify}
                disabled={!verificationCode || verificationCode.length !== 6}
                startIcon={<CheckCircle fontSize="small" />}
              >
                Verify
              </Button>
            </Stack>
          </>
        ) : isEnabled && !isSettingUp ? (
          <>
            <Alert severity="success">
              MFA is enabled for your account.
            </Alert>
            <Box sx={{ my: 2 }}>
              <Typography variant="h5" gutterBottom>
                Backup Codes
              </Typography>
              <Typography color="text.secondary">
                Save these codes in a safe place. Each code can be used once to sign in if you lose access to your authenticator app.
              </Typography>
              {showBackupCodes ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    {backupCodes.map((code, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" fontFamily="monospace" sx={{ flex: 1 }}>
                          {code}
                        </Typography>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleCopyCode(code)}
                        >
                          Copy
                        </Button>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setShowBackupCodes(false)}
                  >
                    Hide Codes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowBackupCodes(true)}
                  >
                    Show Backup Codes
                  </Button>
                </>
              )}
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={handleDisable}
                color="error"
              >
                Disable MFA
              </Button>
            </Stack>
          </>
        ) : null}
      </Box>
    </Container>
  );
};

export default MfaPage;