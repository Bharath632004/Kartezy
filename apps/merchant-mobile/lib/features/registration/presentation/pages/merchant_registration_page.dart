import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/core/services/merchant_service.dart';

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

  // Controllers for step 1: Business Details
  final TextEditingController _businessNameController = TextEditingController();
  final TextEditingController _businessTypeController = TextEditingController();
  final TextEditingController _businessAddressController =
      TextEditingController();

  // Controllers for step 2: GST & PAN
  final TextEditingController _gstController = TextEditingController();
  final TextEditingController _panController = TextEditingController();
  final TextEditingController _aadhaarController = TextEditingController();

  // Controllers for step 3: Bank Account
  final TextEditingController _bankNameController = TextEditingController();
  final TextEditingController _accountNumberController =
      TextEditingController();
  final TextEditingController _ifscController = TextEditingController();

  // Controllers for step 4: Store Details
  final TextEditingController _storeNameController = TextEditingController();
  final TextEditingController _storeAddressController = TextEditingController();
  final TextEditingController _deliveryRadiusController =
      TextEditingController();

  @override
  void dispose() {
    _businessNameController.dispose();
    _businessTypeController.dispose();
    _businessAddressController.dispose();
    _gstController.dispose();
    _panController.dispose();
    _aadhaarController.dispose();
    _bankNameController.dispose();
    _accountNumberController.dispose();
    _ifscController.dispose();
    _storeNameController.dispose();
    _storeAddressController.dispose();
    _deliveryRadiusController.dispose();
    super.dispose();
  }

  List<Step> getSteps() => [
    Step(
      title: const Text('Business Details'),
      content: _buildBusinessDetailsForm(),
      isActive: _currentStep >= 0,
      state: _currentStep >= 1 ? StepState.complete : StepState.indexed,
    ),
    Step(
      title: const Text('GST & PAN'),
      content: _buildTaxAndIdentityForm(),
      isActive: _currentStep >= 1,
      state: _currentStep >= 2 ? StepState.complete : StepState.indexed,
    ),
    Step(
      title: const Text('Bank Account'),
      content: _buildBankAccountForm(),
      isActive: _currentStep >= 2,
      state: _currentStep >= 3 ? StepState.complete : StepState.indexed,
    ),
    Step(
      title: const Text('Store Details'),
      content: _buildStoreDetailsForm(),
      isActive: _currentStep >= 3,
      state: _currentStep >= 4 ? StepState.complete : StepState.indexed,
    ),
  ];

  Widget _buildBusinessDetailsForm() {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            controller: _businessNameController,
            decoration: const InputDecoration(labelText: 'Business Name'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter business name';
              }
              return null;
            },
          ),
          TextFormField(
            controller: _businessTypeController,
            decoration: const InputDecoration(labelText: 'Business Type'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter business type';
              }
              return null;
            },
          ),
          TextFormField(
            controller: _businessAddressController,
            decoration: const InputDecoration(labelText: 'Business Address'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter business address';
              }
              return null;
            },
            maxLines: 3,
          ),
        ],
      ),
    );
  }

  Widget _buildTaxAndIdentityForm() {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            controller: _gstController,
            decoration: const InputDecoration(labelText: 'GST Number'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter GST number';
              }
              // Optional: Add GST validation regex
              return null;
            },
          ),
          TextFormField(
            controller: _panController,
            decoration: const InputDecoration(labelText: 'PAN Number'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter PAN number';
              }
              // Optional: Add PAN validation regex
              return null;
            },
          ),
          TextFormField(
            controller: _aadhaarController,
            decoration: const InputDecoration(labelText: 'Aadhaar Number'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter Aadhaar number';
              }
              // Optional: Add Aadhaar validation (12 digits)
              return null;
            },
          ),
        ],
      ),
    );
  }

  Widget _buildBankAccountForm() {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            controller: _bankNameController,
            decoration: const InputDecoration(labelText: 'Bank Name'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter bank name';
              }
              return null;
            },
          ),
          TextFormField(
            controller: _accountNumberController,
            decoration: const InputDecoration(labelText: 'Account Number'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter account number';
              }
              // Optional: Add account number validation
              return null;
            },
          ),
          TextFormField(
            controller: _ifscController,
            decoration: const InputDecoration(labelText: 'IFSC Code'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter IFSC code';
              }
              // Optional: Add IFSC validation regex
              return null;
            },
          ),
        ],
      ),
    );
  }

  Widget _buildStoreDetailsForm() {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            controller: _storeNameController,
            decoration: const InputDecoration(labelText: 'Store Name'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter store name';
              }
              return null;
            },
          ),
          TextFormField(
            controller: _storeAddressController,
            decoration: const InputDecoration(labelText: 'Store Address'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter store address';
              }
              return null;
            },
            maxLines: 3,
          ),
          TextFormField(
            controller: _deliveryRadiusController,
            decoration: const InputDecoration(
              labelText: 'Delivery Radius (km)',
            ),
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter delivery radius';
              }
              // Optional: Check if it's a positive number
              if (double.tryParse(value) == null || double.parse(value) <= 0) {
                return 'Please enter a valid positive number';
              }
              return null;
            },
          ),
        ],
      ),
    );
  }

  Future<void> _submitRegistration() async {
    if (!_formKey.currentState!.validate()) {
      // If the form is invalid, show an error message and don't proceed.
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fix the errors in the form.')),
      );
      return;
    }

    final merchantStateNotifier = ref.read(merchantStateProvider.notifier);

    // Prepare the data to send to the backend
    final merchantData = {
      'business_name': _businessNameController.text,
      'business_type': _businessTypeController.text,
      'business_address': _businessAddressController.text,
      'gst_number': _gstController.text,
      'pan_number': _panController.text,
      'aadhaar_number': _aadhaarController.text,
      'bank_name': _bankNameController.text,
      'account_number': _accountNumberController.text,
      'ifsc_code': _ifscController.text,
      'store_name': _storeNameController.text,
      'store_address': _storeAddressController.text,
      'delivery_radius': double.parse(_deliveryRadiusController.text),
    };

    try {
      await merchantStateNotifier.registerMerchant(merchantData);
      // If successful, show a success message and navigate to login or dashboard
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registration submitted successfully')),
        );
        // Navigate to login page after successful registration
        Navigator.of(
          context,
        ).pushNamedAndRemoveUntil('/login', (route) => false);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Registration failed: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final merchantState = ref.watch(merchantStateProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Merchant Registration')),
      body: merchantState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : Stepper(
              currentStep: _currentStep,
              onStepContinue: () {
                if (_currentStep < getSteps().length - 1) {
                  // Validate the current step before moving to the next
                  if (_formKey.currentState?.validate() ?? false) {
                    setState(() {
                      _currentStep += 1;
                    });
                  } else {
                    // If validation fails, show an error (the form will show it)
                  }
                } else {
                  // Final step: submit the registration
                  _submitRegistration();
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
