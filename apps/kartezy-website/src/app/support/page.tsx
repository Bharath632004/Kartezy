"use client";

import { Box, Container, Stack, Typography, Card, CardContent, Button, Divider, Chip, TextField, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Person, Phone, Email, LocationOn, Chat, Headset, HelpOutline, Description, Category, Mail, Link, Web } from '@mui/icons/material';
import { useState } from 'react';

const SupportPage = () => {
  const [contactMethod, setContactMethod] = useState('chat'); // chat, email, phone
  const [query, setQuery] = useState('');

  const faqs = [
    {
      question: 'How do I place an order on Kartzy?',
      answer: 'To place an order, simply browse our products, add items to your cart, and proceed to checkout. You can choose from various payment methods including cash on delivery, credit/debit card, or wallet.',
    },
    {
      question: 'What is the delivery time for orders?',
      answer: 'Delivery times vary based on your location and product availability. Most orders are delivered within 30-45 minutes. You can see the estimated delivery time before placing your order.',
    },
    {
      question: 'How can I track my order?',
      answer: 'You can track your order in real-time from the Orders section in your account. We provide live updates on your order status from preparation to delivery.',
    },
    {
      question: 'What is your return and refund policy?',
      answer: 'We offer a 7-day return policy for most products. If you are not satisfied with your purchase, we will replace the item or provide a refund. Refunds are processed within 5-7 business days.',
    },
    {
      question: 'How do I add money to my wallet?',
      answer: 'You can add money to your wallet from the Wallet section in your account. We support various payment methods including credit/debit cards, net banking, and UPI.',
    },
    {
      question: 'Is there a minimum order value?',
      answer: 'No, there is no minimum order value on Kartzy. You can order any amount, whether it\'s a single item or a full grocery haul.',
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach our customer support team through live chat, email, or phone. We are available 24/7 to assist you with any queries or concerns.',
    },
    {
      question: 'What safety measures do you follow for deliveries?',
      answer: 'We follow strict hygiene protocols including contactless delivery, regular sanitization of delivery bags, and temperature checks for all delivery personnel.',
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }}>
          Help & Support
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We're here to help you with any questions or concerns
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 6, mb: 4 }}>
        <CardContent>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose how you'd like to get in touch with our support team
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                sx={{ px: 4, py: 2 }}
                selected={contactMethod === 'chat'}
                onClick={() => setContactMethod('chat')}
              >
                <Chat fontSize="medium" sx={{ mr: 2 }} />
                Live Chat
              </Button>

              <Button
                variant="outlined"
                color="primary"
                size="medium"
                sx={{ px: 4, py: 2 }}
                selected={contactMethod === 'email'}
                onClick={() => setContactMethod('email')}
              >
                <Email fontSize="medium" sx={{ mr: 2 }} />
                Email Support
              </Button>

              <Button
                variant="outlined"
                color="primary"
                size="medium"
                sx={{ px: 4, py: 2 }}
                selected={contactMethod === 'phone'}
                onClick={() => setContactMethod('phone')}
              >
                <Phone fontSize="medium" sx={{ mr: 2 }} />
                Call Support
              </Button>
            </Box>
          </Box>

          {contactMethod === 'chat' && (
            <Box sx={{ mb: 4 }}>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Live Chat
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Chat with our support team in real-time for quick assistance
              </Typography>
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, height: 200, mb: 3, p: 3, display: 'flex', flexDirection: 'column-reverse', overflowY: 'auto' }}>
                {/* Chat messages would go here */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    K
                  </Avatar>
                  <Box sx={{ ml: 2, maxWidth: '70%' }}>
                    <Typography variant="body2" backgroundColor="#e3f2fd" px={2} py={1} borderRadius={4} maxWidth="max-content">
                      Hi! How can I help you today?
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#f0f0f0' }}>
                      U
                    </Avatar>
                    <Box sx={{ ml: 2, maxWidth: '70%', alignSelf: 'flex-end' }}>
                      <Typography variant="body2" backgroundColor="#f5f5f5" px={2} py={1} borderRadius={4} maxWidth="max-content">
                        Hello, I have a question about my recent order.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Type a message..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{ px: 4, py: 2 }}
                  disabled={!query.trim()}
                >
                  Send
                </Button>
              </Box>
            </Box>
          )}

          {contactMethod === 'email' && (
            <Box sx={{ mb: 4 }}>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Email Support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Send us an email and we'll get back to you within 24 hours.
              </Typography>
              <TextField label="Your Name" sx={{ mb: 2 }} required />
              <TextField label="Your Email" type="email" sx={{ mb: 2 }} required />
              <TextField label="Subject" sx={{ mb: 2 }} required />
              <TextField label="Message" multiline rows={4} sx={{ mb: 3 }} required />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{ px: 4, py: 2 }}
                >
                  Send Email
                </Button>
              </Box>
            </Box>
          )}

          {contactMethod === 'phone' && (
            <Box sx={{ mb: 4 }}>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Phone Support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Call us for immediate assistance
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Telegram fontSize={48} color="primary.main" sx={{ mb: 2 }} />
                <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
                  1800-123-4567
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available 24/7
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Frequently Asked Questions
        </Typography>
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
          {faqs.map((faq, index) => (
            <Accordion key={index} disableGutters square>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Quick Links
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 3 }}>
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Link fontSize={32} color="primary.main" sx={{ mb: 2 }} />
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Track Order
            </Typography>
          </Card>
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Receipt fontSize={32} color="primary.main" sx={{ mb: 2 }} />
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Order History
            </Typography>
          </Card>
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Wallet fontSize={32} color="primary.main" sx={{ mb: 2 }} />
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Wallet
            </Typography>
          </Card>
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <LocalMall fontSize={32} color="primary.main" sx={{ mb: 2 }} />
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Shop Now
            </Typography>
          </Card>
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Person fontSize={32} color="primary.main" sx={{ mb: 2 }} />
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              My Account
            </Typography>
          </Card>
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <HelpOutline fontSize={32} color="primary.main" sx={{ mb: 2 }} />
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Help Center
            </Typography>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default SupportPage;