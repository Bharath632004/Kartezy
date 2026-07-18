import { Box, Container, Stack, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

export default function FAQSection({ data } = {}) {
  // Default data if none provided
  const defaultData = [
    {
      question: "How fast is the delivery?",
      answer: "We offer lightning-fast delivery in as little as 15-30 minutes depending on your location and order size."
    },
    {
      question: "Is there a minimum order value?",
      answer: "No, there's no minimum order value! You can order just what you need, whether it's a single item or a full grocery haul."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and popular digital wallets. All transactions are secure."
    },
    {
      question: "How do you ensure product quality?",
      answer: "We partner directly with trusted suppliers and brands. Every item is inspected for quality before delivery."
    },
    {
      question: "Can I schedule a delivery for later?",
      answer: "Yes, you can schedule your delivery for any convenient time slot within our service hours."
    },
    {
      question: "What if I'm not satisfied with my order?",
      answer: "Your satisfaction is our guarantee. If you're not satisfied, we'll replace the item or provide a refund."
    }
  ];

  const faqs = data || defaultData;

  return (
    <Box sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" fontWeight={600} textAlign="center" sx={{ mb: 4 }}>
            Frequently Asked Questions
          </Typography>

          <Box sx={{ maxWidth: 800, marginX: 'auto', width: '100%' }}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{ backgroundColor: '#fff', borderRadius: 2 }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: '#fff', pb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}