// lib/features/referral/presentation/referral_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/core/usecases/no_params.dart';
import 'package:customer_mobile/features/referral/domain/usecase/get_referral_code.dart';
import 'package:customer_mobile/features/referral/domain/usecase/get_referral_history.dart';
import 'package:customer_mobile/features/referral/domain/usecase/share_referral_code.dart';
import 'package:customer_mobile/features/referral/domain/entities/referral.dart';
import 'package:customer_mobile/features/referral/provider/provider.dart';
import 'package:customer_mobile/shared/widgets/app_bar.dart';

class ReferralPage extends ConsumerStatefulWidget {
  const ReferralPage({super.key});

  @override
  ConsumerState<ReferralPage> createState() => _ReferralPageState();
}

class _ReferralPageState extends ConsumerState<ReferralPage> {
  bool _isLoading = true;
  String? _errorMessage;
  Referral? _referral;
  List<Referral> _referralHistory = [];

  @override
  void initState() {
    super.initState();
    _loadReferralData();
  }

  Future<void> _loadReferralData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Get referral code
      final referralCode = await ref
          .read(getReferralCodeProvider)
          .call(NoParams());

      // Get referral history
      final referralHistory = await ref
          .read(getReferralHistoryProvider)
          .call(NoParams());

      if (mounted) {
        setState(() {
          _referral = referralCode;
          _referralHistory = referralHistory;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to load referral data: $e';
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _shareReferralCode(String method) async {
    if (_referral == null) return;

    setState(() {
      _isLoading = true;
    });

    try {
      await ref
          .read(shareReferralCodeProvider)
          .call(ShareReferralCodeParams(code: _referral!.code, method: method));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Referral code shared via $method')),
        );

        // Refresh data to update referral count
        _loadReferralData();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to share referral code: $e';
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'Refer & Earn'),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
          ? Center(
              child: Text(
                _errorMessage!,
                style: const TextStyle(color: Colors.red),
              ),
            )
          : _referral == null
          ? const Center(child: Text('No referral data available'))
          : RefreshIndicator(
              onRefresh: _loadReferralData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Referral Info Card
                    Card(
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          children: [
                            const Icon(
                              Icons.card_giftcard,
                              size: 48,
                              color: Colors.green,
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'Your Referral Code',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _referral!.code,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 2,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'Share your code and earn rewards!',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 24),
                            Wrap(
                              spacing: 12,
                              runSpacing: 12,
                              children: [
                                _buildShareButton(
                                  'WhatsApp',
                                  Icons.chat,
                                  Colors.green,
                                ),
                                _buildShareButton(
                                  'Facebook',
                                  Icons.facebook,
                                  Colors.blue,
                                ),
                                _buildShareButton(
                                  'Twitter',
                                  Icons.share,
                                  Colors.lightBlue,
                                ),
                                _buildShareButton(
                                  'Copy Link',
                                  Icons.copy,
                                  Colors.grey,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Stats Section
                    Card(
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Your Earnings',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                _buildStatColumn(
                                  'Referrals',
                                  _referral!.referralCount.toString(),
                                  Icons.people,
                                ),
                                _buildStatColumn(
                                  'Rewards',
                                  '\$${_referral!.rewardsEarned.toStringAsFixed(2)}',
                                  Icons.monetization_on,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Referral History
                    if (_referralHistory.isNotEmpty) ...[
                      const Text(
                        'Referral History',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _referralHistory.length,
                        itemBuilder: (context, index) {
                          final referral = _referralHistory[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 8),
                            elevation: 2,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: ListTile(
                              leading: const Icon(
                                Icons.person_add,
                                color: Colors.green,
                              ),
                              title: Text('Referral #${index + 1}'),
                              subtitle: Text(
                                'Rewards: \$${referral.rewardsEarned.toStringAsFixed(2)}',
                              ),
                              trailing: Text(
                                '${referral.referralCount} friends',
                                style: TextStyle(color: Colors.grey[600]),
                              ),
                            ),
                          );
                        },
                      ),
                    ] else ...[
                      const Text(
                        'No referral history yet',
                        style: TextStyle(color: Colors.grey, fontSize: 16),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                    ],
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildShareButton(String label, IconData icon, Color color) {
    return ElevatedButton.icon(
      onPressed: () => _shareReferralCode(label),
      icon: Icon(icon, color: Colors.white),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        minimumSize: const Size(120, 40),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }

  Widget _buildStatColumn(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 24),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 2),
        Text(label, style: TextStyle(fontSize: 12, color: Colors.grey[600])),
      ],
    );
  }
}

// Providers
final getReferralCodeProvider = Provider<GetReferralCode>(
  (ref) => GetReferralCode(ref.read(referralRepositoryProvider)),
);

final getReferralHistoryProvider = Provider<GetReferralHistory>(
  (ref) => GetReferralHistory(ref.read(referralRepositoryProvider)),
);
