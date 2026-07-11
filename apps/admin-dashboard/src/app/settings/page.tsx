import { Box, Typography, Container, Card, CardContent, CardHeader, Button, Stack } from '@mui/material';
import Link from 'next/link';

const SettingsPage = () => {
  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Stack spacing={3} mt={2}>
        <Card>
          <CardHeader title="Platform Settings" />
          <CardContent>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              href="/settings/platform"
              size="large"
              fullWidth
            >
              Platform
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Payment Settings" />
          <CardContent>
            <Button
              variant="outlined"
              startIcon={<AttachMoneyIcon />}
              href="/settings/payment"
              size="large"
              fullWidth
            >
              Payment
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Security Settings" />
          <CardContent>
            <Button
              variant="outlined"
              startIcon={<ShieldIcon />}
              href="/settings/security"
              size="large"
              fullWidth
            >
              Security
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Theme & Appearance" />
          <CardContent>
            <Button
              variant="outlined"
              startIcon={<PaletteIcon />}
              href="/settings/theme"
              size="large"
              fullWidth
            >
              Theme
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Language & Regional" />
          <CardContent>
            <Button
              variant="outlined"
              startIcon={<LanguageIcon />}
              href="/settings/language"
              size="large"
              fullWidth
            >
              Language
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Feature Flags" />
          <CardContent>
            <Button
              variant="outlined"
              startIcon={<FeaturedPlayListIcon />}
              href="/settings/feature-flags"
              size="large"
              fullWidth
            >
              Feature Flags
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default SettingsPage;