import { Typography, Container, Card, CardContent, CardHeader, Button, Stack } from '@mui/material';
import { NotificationsOutlined, EmailOutlined, SmsOutlined, ChatBubbleOutlineOutlined, WarningAmberOutlined } from '@mui/icons-material';
import Link from 'next/link';

const NotificationsPage = () => {
  return (
    <Container maxWidth="lg" py={4}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <Stack spacing={3} mt={2}>
        <Card>
          <CardHeader title="Push Notifications" icon={<NotificationsOutlined />} />
          <CardContent>
            <Button
              variant="outlined"
              startIcon={<NotificationsOutlined />}
              href="/notifications/push"
              size="large"
              fullWidth
            >
              Configure
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Email Notifications" icon={<EmailOutlined />} />
          <CardContent>
            <Button
              variant="outlined"
              startIcon={<EmailOutlined />}
              href="/notifications/email"
              size="large"
              fullWidth
            >
              Configure
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="SMS Notifications" icon={<SmsOutlined />} />
          <CardContent>
            <Button
              variant="outlined"
              startIcon={<SmsOutlined />}
              href="/notifications/sms"
              size="large"
              fullWidth
            >
              Configure
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="In-App Notifications" icon={<ChatBubbleOutlineOutlined />} />
          <CardContent>
            <Button
              variant="outlined"
              startIcon={<ChatBubbleOutlineOutlined />}
              href="/notifications/in-app"
              size="large"
              fullWidth
            >
              Configure
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="System Alerts" icon={<WarningAmberOutlined />} />
          <CardContent>
            <Button
              variant="outlined"
              startIcon={<WarningAmberOutlined />}
              href="/notifications/system-alerts"
              size="large"
              fullWidth
            >
              Configure
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default NotificationsPage;