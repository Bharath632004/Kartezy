import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class MerchantRegistrationPage extends ConsumerStatefulWidget {
  const MerchantRegistrationPage({super.key});

  @override
  ConsumerState<MerchantRegistrationPage> createState() =>
      _MerchantRegistrationPageState();
}

class _MerchantRegistrationPageState
    extends ConsumerState<MerchantRegistrationPage> {
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();

  List<Step> getSteps() => [
        const Step(
          title: Text('Business Details'),
          content: Text('Business Details Form'),
          isActive: true,
        ),
        const Step(
          title: Text('GST & PAN'),
          content: Text('GST and PAN Details'),
          isActive: true,
        ),
        const Step(
          title: Text('Bank Account'),
          content: Text('Bank Account Details'),
          isActive: true,
        ),
        const Step(
          title: Text('Store Details'),
          content: Text('Store Details Form'),
          isActive: true,
        ),
      ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Merchant Registration'),
      ),
      body: Stepper(
        currentStep: _currentStep,
        onStepContinue: () {
          if (_currentStep < getSteps().length - 1) {
            setState(() {
              _currentStep += 1;
            });
          } else {
            // Submit the form
            if (_formKey.currentState?.validate() ?? false) {
              // TODO: Submit the registration data
              // For now, just show a snackbar
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Registration submitted')),
              );
              // Navigate to login
              Navigator.of(context).pushNamedAndRemoveUntil(
                  '/', (route) => false);
            }
          }
        },
        onStepCancel: () {
          if (_currentStep > 0) {
            setState(() {
              _currentStep -= 1;
            });
          } else {
            // Go back to login
            Navigator.of(context).maybePop();
          }
        },
        steps: getSteps(),
      ),
    );
  }
}