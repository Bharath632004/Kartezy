"use client";

import { useState } from 'react';
import {
  Box, Container, Typography, Paper, Tabs, Tab, TextField, Button,
  Switch, FormControlLabel, Divider, Grid, Card, CardContent,
  Stack, Alert, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import {
  Security, Notifications, Palette, Language, Payment,
  Storage, Api, Save, Settings as SettingsIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return value === index ? <Box sx={{ py: 3 }}>{children}</Box> : null;
}

export default function SettingsPage() {
  const [tab, setTab] = useState(0);
  const [saved, setSaved] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { label: 'General', icon: <SettingsIcon /> },
    { label: 'Security', icon: <Security /> },
    { label: 'Notifications', icon: <Notifications /> },
    { label: 'Appearance', icon: <Palette /> },
    { label: 'Localization', icon: <Language /> },
    { label: 'Payments', icon: <Payment /> },
    { label: 'Storage', icon: <Storage /> },
    { label: 'API', icon: <Api /> },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Settings</Typography>

      {saved && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSaved(false)}>Settings saved successfully!</Alert>}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ position: 'sticky', top: 16 }}>
            <Tabs
              orientation="vertical"
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{ '& .MuiTab-root': { alignItems: 'flex-start', minHeight: 48, px: 3 } }}
            >
              {tabs.map((t) => (
                <Tab key={t.label} icon={t.icon} iconPosition="start" label={t.label} />
              ))}
            </Tabs>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          {/* General */}
          <TabPanel value={tab} index={0}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>General Settings</Typography>
                <Stack spacing={3}>
                  <TextField label="Platform Name" defaultValue="Kartezy" fullWidth />
                  <TextField label="Support Email" defaultValue="support@kartezy.com" fullWidth />
                  <TextField label="Support Phone" defaultValue="+91-1800-123-4567" fullWidth />
                  <TextField label="Address" defaultValue="Bangalore, Karnataka, India" fullWidth multiline rows={2} />
                  <FormControlLabel control={<Switch defaultChecked />} label="Maintenance Mode" />
                  <FormControlLabel control={<Switch />} label="Enable Registration" />
                  <Box sx={{ pt: 2 }}><Button variant="contained" startIcon={<Save />} onClick={showSaved}>Save Changes</Button></Box>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Security */}
          <TabPanel value={tab} index={1}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Security Settings</Typography>
                <Stack spacing={3}>
                  <FormControlLabel control={<Switch defaultChecked />} label="Two-Factor Authentication (2FA)" />
                  <FormControlLabel control={<Switch defaultChecked />} label="MFA Enforcement for Admins" />
                  <FormControlLabel control={<Switch />} label="IP Whitelist Enforcement" />
                  <FormControlLabel control={<Switch defaultChecked />} label="Session Timeout (30 min)" />
                  <TextField label="Max Login Attempts" type="number" defaultValue={5} fullWidth />
                  <TextField label="Password Min Length" type="number" defaultValue={8} fullWidth />
                  <FormControl fullWidth>
                    <InputLabel>Password Policy</InputLabel>
                    <Select label="Password Policy" defaultValue="strong">
                      <MenuItem value="basic">Basic</MenuItem>
                      <MenuItem value="strong">Strong</MenuItem>
                      <MenuItem value="enterprise">Enterprise</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ pt: 2 }}><Button variant="contained" startIcon={<Save />} onClick={showSaved}>Save Changes</Button></Box>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Notifications */}
          <TabPanel value={tab} index={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Notification Preferences</Typography>
                <Stack spacing={2}>
                  <FormControlLabel control={<Switch defaultChecked />} label="Email Notifications" />
                  <FormControlLabel control={<Switch defaultChecked />} label="Push Notifications" />
                  <FormControlLabel control={<Switch defaultChecked />} label="SMS Notifications" />
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2">Notification Types</Typography>
                  <FormControlLabel control={<Switch defaultChecked />} label="Order Updates" />
                  <FormControlLabel control={<Switch defaultChecked />} label="Payment Alerts" />
                  <FormControlLabel control={<Switch defaultChecked />} label="System Alerts" />
                  <FormControlLabel control={<Switch />} label="Marketing & Promotions" />
                  <Divider sx={{ my: 1 }} />
                  <TextField label="Quiet Hours Start" type="time" defaultValue="22:00" fullWidth />
                  <TextField label="Quiet Hours End" type="time" defaultValue="08:00" fullWidth />
                  <Box sx={{ pt: 2 }}><Button variant="contained" startIcon={<Save />} onClick={showSaved}>Save Changes</Button></Box>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Appearance */}
          <TabPanel value={tab} index={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Appearance</Typography>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Theme Mode</InputLabel>
                    <Select label="Theme Mode" defaultValue="light">
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="system">System Default</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField label="Primary Color" defaultValue="#1976d2" fullWidth />
                  <TextField label="Logo URL" placeholder="https://..." fullWidth />
                  <TextField label="Favicon URL" placeholder="https://..." fullWidth />
                  <Box sx={{ pt: 2 }}><Button variant="contained" startIcon={<Save />} onClick={showSaved}>Save Changes</Button></Box>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Localization */}
          <TabPanel value={tab} index={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Localization</Typography>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Default Language</InputLabel>
                    <Select label="Default Language" defaultValue="en">
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="hi">Hindi</MenuItem>
                      <MenuItem value="kn">Kannada</MenuItem>
                      <MenuItem value="ta">Tamil</MenuItem>
                      <MenuItem value="te">Telugu</MenuItem>
                      <MenuItem value="ml">Malayalam</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select label="Currency" defaultValue="INR">
                      <MenuItem value="INR">INR (₹)</MenuItem>
                      <MenuItem value="USD">USD ($)</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select label="Timezone" defaultValue="Asia/Kolkata">
                      <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                      <MenuItem value="UTC">UTC</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Date Format</InputLabel>
                    <Select label="Date Format" defaultValue="DD/MM/YYYY">
                      <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                      <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                      <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ pt: 2 }}><Button variant="contained" startIcon={<Save />} onClick={showSaved}>Save Changes</Button></Box>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Payments */}
          <TabPanel value={tab} index={5}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Payment Settings</Typography>
                <Stack spacing={3}>
                  <FormControlLabel control={<Switch defaultChecked />} label="Cash on Delivery (COD)" />
                  <FormControlLabel control={<Switch defaultChecked />} label="Razorpay" />
                  <TextField label="Razorpay Key ID" type="password" fullWidth />
                  <TextField label="Razorpay Key Secret" type="password" fullWidth />
                  <TextField label="Razorpay Webhook Secret" type="password" fullWidth />
                  <FormControlLabel control={<Switch />} label="UPI Payments" />
                  <FormControlLabel control={<Switch />} label="Wallet Payments" />
                  <TextField label="Platform Fee (%)" type="number" defaultValue={5} fullWidth />
                  <TextField label="Minimum COD Amount" type="number" defaultValue={500} fullWidth />
                  <Box sx={{ pt: 2 }}><Button variant="contained" startIcon={<Save />} onClick={showSaved}>Save Changes</Button></Box>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Storage */}
          <TabPanel value={tab} index={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Storage & Uploads</Typography>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Storage Provider</InputLabel>
                    <Select label="Storage Provider" defaultValue="local">
                      <MenuItem value="local">Local</MenuItem>
                      <MenuItem value="s3">Amazon S3</MenuItem>
                      <MenuItem value="gcs">Google Cloud Storage</MenuItem>
                      <MenuItem value="azure">Azure Blob</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField label="Max Upload Size (MB)" type="number" defaultValue={10} fullWidth />
                  <TextField label="Allowed File Types" defaultValue="jpg,png,pdf,doc" fullWidth />
                  <FormControlLabel control={<Switch defaultChecked />} label="Image Optimization" />
                  <Box sx={{ pt: 2 }}><Button variant="contained" startIcon={<Save />} onClick={showSaved}>Save Changes</Button></Box>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>

          {/* API */}
          <TabPanel value={tab} index={7}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>API Settings</Typography>
                <Stack spacing={3}>
                  <TextField label="API Base URL" defaultValue="https://api.kartezy.com" fullWidth />
                  <FormControlLabel control={<Switch defaultChecked />} label="Rate Limiting" />
                  <TextField label="Rate Limit (requests/min)" type="number" defaultValue={100} fullWidth />
                  <FormControlLabel control={<Switch defaultChecked />} label="API Logging" />
                  <FormControlLabel control={<Switch />} label="CORS Enabled" />
                  <FormControlLabel control={<Switch />} label="GraphQL Playground" />
                  <TextField label="Allowed Origins" defaultValue="https://admin.kartezy.com" fullWidth multiline rows={2} />
                  <Box sx={{ pt: 2 }}><Button variant="contained" startIcon={<Save />} onClick={showSaved}>Save Changes</Button></Box>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
}
