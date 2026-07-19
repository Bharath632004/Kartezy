"use client";

import { Box, Container, Stack, Typography, Card, CardContent, Button, Divider, Chip, Stack as MuiStack, Typography as MuiTypography, LinearProgress, Avatar, Grid } from '@mui/material';
import { Person, LocalMall, Shield, Home, Work, Description, Equalizer, Timeline, TimelineItem, TimelineConnector, ContentPaste, School, Leaderboard, Premium, TrendingUp, LocalFire, AdministratorDashboard, AccountBalanceWallet, AccessTime, Group } from '@mui/icons-material';
import { Link } from 'next/link';

const AboutPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          About Kartify
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Learn about our story, mission, and the team behind India's fastest grocery delivery platform
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LocalMall fontSize={48} color="primary.main" sx={{ mb: 2 }} />
            <Typography variant="h3" fontWeight={600} sx={{ mb: 2 }}>
              Who We Are
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Kartify is India's fastest grocery delivery platform, bringing fresh produce, household essentials, and more to your doorstep in minutes. Founded in 2020, we've grown to serve over 10 cities with a network of 500+ stores and 5000+ delivery partners.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Our Journey
            </Typography>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box sx={{ width: 4, bgColor: 'primary.main' }} />
              <Box sx={{ flexGrow: 1, px: 4 }}>
                <Timeline alignLeft>
                  <TimelineItem>
                    <TimelineConnector />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                        2020
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Founded in Bangalore with a mission to revolutionize grocery delivery
                      </Typography>
                    </Box>
                  </TimelineItem>
                  <TimelineItem>
                    <Connector />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                        2021
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expanded to 5 cities and launched our mobile app
                      </Typography>
                    </Box>
                  </TimelineItem>
                  <TimelineItem>
                    <Connector />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                        2022
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Reached 1 million+ users and introduced Kartify Plus membership
                      </Typography>
                    </Box>
                  </TimelineItem>
                  <TimelineItem>
                    <Connector />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                        2023
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expanded to 10 cities and launched sustainability initiative
                      </Typography>
                    </Box>
                  </TimelineItem>
                </Timeline>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Our Mission & Vision
            </Typography>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 4 }}>
            <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Equality fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Our Mission
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  To make grocery shopping effortless, affordable, and sustainable for every Indian household through lightning-fast delivery and exceptional service.
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <TrendingUp fontSize={32} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Our Vision
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  To be India's most trusted and loved grocery platform, connecting local stores with customers through technology and innovation.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Meet Our Team
            </Typography>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 4 }}>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Avatar sx={{ width: 80, height: 80, bgColor: 'primary.main' }} sx={{ mb: 2 }}>
                  AR
                </Avatar>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Arjun Reddy
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Founder & CEO
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                  <LinkedIn fontSize="small" sx={{ mr: 1 }} />
                  <Twitter fontSize="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Visionary leader with 10+ years in e-commerce and logistics
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Avatar sx={{ width: 80, height: 80, bgColor: 'primary.main' }} sx={{ mb: 2 }}>
                  PS
                </Avatar>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Priya Sharma
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Chief Technology Officer
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                  <LinkedIn fontSize="small" sx={{ mr: 1 }} />
                  <Twitter fontSize="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Tech expert specializing in scalable platforms and AI
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Avatar sx={{ width: 80, height: 80, bgColor: 'primary.main' }} sx={{ mb: 2 }}>
                  VK
                </Avatar>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Vikram Khanna
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Chief Operations Officer
                </Typography>
                <Box sx={{ display: 'flex', justifyOutput: 'center', gap: 2, mb: 3 }}>
                  <LinkedIn fontSize="small" sx={{ mr: 1 }} />
                  <Twitter fontSize="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Operations leader with expertise in supply chain and delivery networks
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Avatar sx={{ width: 80, height: 80, bgColor: 'primary.main' }} sx={{ mb: 2 }}>
                  NG
                </Avatar>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Neha Gupta
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Head of Marketing
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                  <LinkedIn fontSize="small" sx={{ mr: 1 }} />
                  <Twitter fontSize="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Marketing strategist with a passion for brand building and customer engagement
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AboutPage;