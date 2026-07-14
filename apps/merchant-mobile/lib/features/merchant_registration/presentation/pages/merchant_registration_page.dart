import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/core/services/merchant_service.dart';
import 'package:merchant_mobile/features/merchant_registration/provider.dart';

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
  final TextEditingController _gstController = TextEditingController();
  final TextEditingController _panController = TextEditingController();
  final TextEditingController _aadhaarController = TextEditingController();
  final TextEditingController _bankNameController = TextEditingController();
  final TextEditingController _accountNumberController =
      TextEditingController();
  final TextEditingController _ifscController = TextEditingController();
  final TextEditingController _upiIdController = TextEditingController();

  // Controllers for step 2: Store Details
  final TextEditingController _storeNameController = TextEditingController();
  final TextEditingController _storeAddressController = TextEditingController();
  final TextEditingController _latitudeController = TextEditingController();
  final TextEditingController _longitudeController = TextEditingController();
  final TextEditingController _businessHoursController =
      TextEditingController();
  final TextEditingController _deliveryRadiusController =
      TextEditingController();
  final TextEditingController _minimumOrderController = TextEditingController();

  // Controllers for step 3: Documents & KYC
  // We'll handle file pickers later

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
    _upiIdController.dispose();
    _storeNameController.dispose();
    _storeAddressController.dispose();
    _latitudeController.dispose();
    _longitudeController.dispose();
    _businessHoursController.dispose();
    _deliveryRadiusController.dispose();
    _minimumOrderController.dispose();
    super.dispose();
  }

  List<Step> getSteps() => [
    Step(
      title: const Text('Business Details'),
      content: Form(
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
            ),
            TextFormField(
              controller: _gstController,
              decoration: const InputDecoration(labelText: 'GST Number'),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter GST number';
                }
                // Add GST validation if needed
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
                // Add PAN validation if needed
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
                // Add Aadhaar validation if needed
                return null;
              },
            ),
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
                return null;
              },
            ),
            TextFormField(
              controller: _upiIdController,
              decoration: const InputDecoration(labelText: 'UPI ID'),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter UPI ID';
                }
                return null;
              },
            ),
          ],
        ),
      ),
    ),
    Step(
      title: const Text('Store Details'),
      content: Form(
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
            ),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _latitudeController,
                    decoration: const InputDecoration(labelText: 'Latitude'),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter latitude';
                      }
                      return null;
                    },
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextFormField(
                    controller: _longitudeController,
                    decoration: const InputDecoration(labelText: 'Longitude'),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter longitude';
                      }
                      return null;
                    },
                  ),
                ),
              ],
            ),
            TextFormField(
              controller: _businessHoursController,
              decoration: const InputDecoration(labelText: 'Business Hours'),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter business hours';
                }
                return null;
              },
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
                final double? valueAsDouble = double.tryParse(value);
                if (valueAsDouble == null || valueAsDouble <= 0) {
                  return 'Please enter a valid positive number';
                }
                return null;
              },
            ),
            TextFormField(
              controller: _minimumOrderController,
              decoration: const InputDecoration(labelText: 'Minimum Order'),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter minimum order';
                }
                final double? valueAsDouble = double.tryParse(value);
                if (valueAsDouble == null || valueAsDouble <= 0) {
                  return 'Please enter a valid positive number';
                }
                return null;
              },
            ),
          ],
        ),
      ),
    ),
    Step(
      title: const Text('Documents & KYC'),
      content: const Column(
        children: [
          // Placeholder for document upload UI
          Text('Document upload functionality will be implemented here.'),
          SizedBox(height: 16),
          Text('KYC status will be updated after verification.'),
        ],
      ),
    ),
  ];

  Future<void> _submitRegistration() async {
    if (!_formKey.currentState!.validate()) {
      // If the form is invalid, show an error message and don't proceed.
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please fix the errors in the form.')),
        );
      }
      return;
    }

    final merchantRegistrationNotifier = ref.read(
      merchantRegistrationProvider.notifier,
    );

    // Prepare the data to send to the backend
    final merchantData = {
      'store_name': _storeNameController.text,
      'owner_name': '', //  Get from auth user profile
      'mobile': '', //  Get from auth user profile
      'email': '', //  Get from auth user profile
      'gst_number': _gstController.text,
      'pan_number': _panController.text,
      'aadhaar_number': _aadhaarController.text,
      'bank_name': _bankNameController.text,
      'account_number': _accountNumberController.text,
      'ifsc_code': _ifscController.text,
      'upi_id': _upiIdController.text,
      'business_category': '', //  Add dropdown
      'business_type': _businessTypeController.text,
      'store_address': _storeAddressController.text,
      'latitude': double.tryParse(_latitudeController.text),
      'longitude': double.tryParse(_longitudeController.text),
      'business_hours': _businessHoursController.text,
      'delivery_radius': double.tryParse(_deliveryRadiusController.text),
      'minimum_order': double.tryParse(_minimumOrderController.text),
      'store_images': [], //  Implement image upload
      'store_logo': '', //  Implement logo upload
      'documents': [], //  Implement document upload
      'kyc_status': 'pending',
    };

    try {
      await merchantRegistrationNotifier.registerMerchant(merchantData);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registration submitted successfully')),
        );
        // Navigate to login or dashboard after successful registration
        // For now, we'll just pop to the previous screen
        if (context.mounted) {
          Navigator.of(context).pop();
        }
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
    final merchantRegistrationState = ref.watch(merchantRegistrationProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Merchant Registration')),
      body: merchantRegistrationState.isLoading
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
