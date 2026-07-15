import { Typography, Container, Card, CardContent, CardHeader, Button } from '@mui/material';
import {
  Settings,
  AttachMoney,
  Shield,
  Palette,
  Language,
  FeaturedPlayList,
} from '@mui/icons-material';

const SettingsPage = () => {
  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      {/* In a real app, you would use a proper stack or grid layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        <Card>
          <CardHeader title="Platform Settings" />
          <CardContent>
            <Button
              variant="outlined"
              startIcon={<Settings />}
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
              startIcon={<AttachMoney />}
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
              startIcon={<Shield />}
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
              startIcon={<Palette />}
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
              startIcon={<Language />}
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
              startIcon={<FeaturedPlayList />}
              href="/settings/feature-flags"
              size="large"
              fullWidth
            >
              Feature Flags
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default SettingsPage;