import { Box, Container, Stack, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

export const FAQSection = () => {
  const faqs = [
    {
      question: "How fast is the delivery?",
      answer: "We offer lightning-fast delivery in as little as 15-30 minutes depending on your location and order size. Our advanced logistics network ensures your groceries arrive fresh and on time."
    },
    {
      question: "Is there a minimum order value?",
      answer: "No, there's no minimum order value! You can order just what you need, whether it's a single item or a full grocery haul. We believe in convenience without constraints."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and popular digital wallets like Paytm, PhonePe, and Google Pay. All transactions are secure and encrypted."
    },
    {
      question: "How do you ensure product quality?",
      answer: "We partner directly with trusted suppliers and brands. Our quality control team inspects all perishables before they leave our fulfillment centers, and we maintain strict temperature control for fresh and frozen items throughout the delivery process."
    },
    {
      question: "Can I schedule a delivery for later?",
      answer: "Absolutely! You can schedule your delivery for any convenient time slot within our service hours. Simply select your preferred date and time during checkout."
    },
    {
      question: "What if I'm not satisfied with my order?",
      answer: "Your satisfaction is our guarantee. If you're not completely satisfied with any item in your order, we'll either replace it or provide a full refund - no questions asked. Simply contact our support team within 24 hours of delivery."
    }
  ];

  return (
    <section sx={{ padding: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" fontWeight={600} textAlign="center" sx={{ mb: 4 }}>
            Frequently Asked Questions
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            textAlign="center" 
            sx={{ mb: 6, maxWidth: 600 }}
          >
            Have questions about our service? We've got answers.
          </Typography>
          
          <Box sx={{ maxWidth: 800, marginX: 'auto' }}>
            {faqs.map((faq, index) => (
              <Accordion 
                key={index} 
                sx={{
                  borderRadius: 12,
                  }
                }}
                disableGutters
              >
                <AccordionSummary
                  expandIcon={<ExpandMore fontSize="inherit" />}
                  aria-controls={`panel${index}a-content`}
                  id={`panel${index}a-header`}
                  sx={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: 12,
                    marginBottom: 1
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  typography="body2"
                  sx={{
                    pt: 2
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Stack>
      </Container>
    </section>
  );
};
