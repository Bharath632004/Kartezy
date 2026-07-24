import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Providers for store management state
final storeOperatingStatusProvider =
    StateNotifierProvider<StoreOperatingStatusNotifier, StoreOperatingStatus>((
      ref,
    ) {
      return StoreOperatingStatusNotifier();
    });

class StoreOperatingStatus {
  final bool isOpen;
  final bool isVacationMode;
  final String? vacationEndDate;
  final String? closedMessage;

  const StoreOperatingStatus({
    this.isOpen = true,
    this.isVacationMode = false,
    this.vacationEndDate,
    this.closedMessage,
  });

  StoreOperatingStatus copyWith({
    bool? isOpen,
    bool? isVacationMode,
    String? vacationEndDate,
    String? closedMessage,
  }) {
    return StoreOperatingStatus(
      isOpen: isOpen ?? this.isOpen,
      isVacationMode: isVacationMode ?? this.isVacationMode,
      vacationEndDate: vacationEndDate ?? this.vacationEndDate,
      closedMessage: closedMessage ?? this.closedMessage,
    );
  }
}

class StoreOperatingStatusNotifier extends StateNotifier<StoreOperatingStatus> {
  StoreOperatingStatusNotifier() : super(const StoreOperatingStatus());

  void updateStatus(bool isOpen) {
    state = state.copyWith(isOpen: isOpen);
  }

  void setVacationMode(bool value) {
    state = state.copyWith(isVacationMode: value);
  }

  void setClosedMessage(String message) {
    state = state.copyWith(closedMessage: message);
  }
}

final businessHoursProvider = Provider<List<BusinessHoursDay>>((ref) {
  return BusinessHoursDay.defaultHours();
});

class BusinessHoursDay {
  final String day;
  final bool isOpen;
  final TimeOfDay openTime;
  final TimeOfDay closeTime;

  const BusinessHoursDay({
    required this.day,
    required this.isOpen,
    required this.openTime,
    required this.closeTime,
  });

  static List<BusinessHoursDay> defaultHours() {
    return [
      BusinessHoursDay(
        day: 'Monday',
        isOpen: true,
        openTime: const TimeOfDay(hour: 8, minute: 0),
        closeTime: const TimeOfDay(hour: 22, minute: 0),
      ),
      BusinessHoursDay(
        day: 'Tuesday',
        isOpen: true,
        openTime: const TimeOfDay(hour: 8, minute: 0),
        closeTime: const TimeOfDay(hour: 22, minute: 0),
      ),
      BusinessHoursDay(
        day: 'Wednesday',
        isOpen: true,
        openTime: const TimeOfDay(hour: 8, minute: 0),
        closeTime: const TimeOfDay(hour: 22, minute: 0),
      ),
      BusinessHoursDay(
        day: 'Thursday',
        isOpen: true,
        openTime: const TimeOfDay(hour: 8, minute: 0),
        closeTime: const TimeOfDay(hour: 22, minute: 0),
      ),
      BusinessHoursDay(
        day: 'Friday',
        isOpen: true,
        openTime: const TimeOfDay(hour: 8, minute: 0),
        closeTime: const TimeOfDay(hour: 22, minute: 0),
      ),
      BusinessHoursDay(
        day: 'Saturday',
        isOpen: true,
        openTime: const TimeOfDay(hour: 9, minute: 0),
        closeTime: const TimeOfDay(hour: 22, minute: 0),
      ),
      BusinessHoursDay(
        day: 'Sunday',
        isOpen: false,
        openTime: const TimeOfDay(hour: 9, minute: 0),
        closeTime: const TimeOfDay(hour: 20, minute: 0),
      ),
    ];
  }
}

/// Store Profile Management Page
class StoreProfilePage extends ConsumerStatefulWidget {
  const StoreProfilePage({super.key});

  @override
  ConsumerState<StoreProfilePage> createState() => _StoreProfilePageState();
}

class _StoreProfilePageState extends ConsumerState<StoreProfilePage> {
  int _selectedTab = 0;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final status = ref.watch(storeOperatingStatusProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Store Management'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          // Operating Status Banner
          _buildStatusBanner(theme, status),
          // Tab Bar
          TabBar(
            tabs: const [
              Tab(text: 'Profile'),
              Tab(text: 'Hours'),
              Tab(text: 'Service'),
            ],
            onTap: (index) => setState(() => _selectedTab = index),
            labelColor: theme.colorScheme.primary,
            unselectedLabelColor: Colors.grey,
            indicatorColor: theme.colorScheme.primary,
          ),
          Expanded(
            child: IndexedStack(
              index: _selectedTab,
              children: [
                _buildProfileTab(theme),
                _buildBusinessHoursTab(theme),
                _buildServiceAreaTab(theme),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBanner(ThemeData theme, StoreOperatingStatus status) {
    final isOpen = status.isOpen && !status.isVacationMode;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: BoxDecoration(
        color: isOpen ? Colors.green.shade50 : Colors.orange.shade50,
        border: Border(bottom: BorderSide(color: Colors.grey.shade200)),
      ),
      child: Row(
        children: [
          Container(
            width: 12,
            height: 12,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isOpen ? Colors.green : Colors.orange,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isOpen ? 'Store is Open' : 'Store is Closed',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: isOpen
                        ? Colors.green.shade800
                        : Colors.orange.shade800,
                  ),
                ),
                if (status.isVacationMode)
                  Text(
                    'Vacation mode enabled',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.orange.shade600,
                    ),
                  ),
              ],
            ),
          ),
          Switch(
            value: isOpen,
            onChanged: (value) {
              ref
                  .read(storeOperatingStatusProvider.notifier)
                  .updateStatus(value);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildProfileTab(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionCard(
            theme,
            title: 'Store Information',
            icon: Icons.store,
            children: [
              _buildInfoTile('Store Name', 'My Store'),
              _buildInfoTile('Store Category', 'Grocery'),
              _buildInfoTile('Store ID', 'STR-001'),
              _buildInfoTile('Phone', '+91-9876543210'),
              _buildInfoTile('Address', '123, Main Street, City'),
            ],
          ),
          const SizedBox(height: 16),
          _buildSectionCard(
            theme,
            title: 'Delivery Settings',
            icon: Icons.delivery_dining,
            children: [
              _buildInfoTile('Delivery Radius', '5 km'),
              _buildInfoTile('Minimum Order', '₹ 99'),
              _buildInfoTile('Delivery Fee', '₹ 20'),
              _buildInfoTile('Free Delivery Above', '₹ 500'),
            ],
          ),
          const SizedBox(height: 16),
          _buildSectionCard(
            theme,
            title: 'Operating Settings',
            icon: Icons.settings,
            children: [
              SwitchListTile(
                title: const Text('Vacation Mode'),
                subtitle: const Text('Temporarily close your store'),
                value: false,
                onChanged: (value) {
                  // Toggle vacation mode
                },
              ),
              SwitchListTile(
                title: const Text('Accept New Orders'),
                subtitle: const Text(
                  'Stop taking new orders while keeping store visible',
                ),
                value: true,
                onChanged: (value) {},
              ),
              SwitchListTile(
                title: const Text('Holiday Mode'),
                subtitle: const Text('Close for specific dates'),
                value: false,
                onChanged: (value) {},
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBusinessHoursTab(ThemeData theme) {
    final hours = ref.watch(businessHoursProvider);
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: hours.length + 1,
      separatorBuilder: (_, _) => const Divider(height: 1),
      itemBuilder: (context, index) {
        if (index == 0) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Text(
              'Set your weekly business hours',
              style: TextStyle(color: Colors.grey[600], fontSize: 14),
            ),
          );
        }
        final day = hours[index - 1];
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Row(
            children: [
              SizedBox(
                width: 100,
                child: Text(
                  day.day,
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
              ),
              Switch(value: day.isOpen, onChanged: (value) {}),
              if (day.isOpen) ...[
                const SizedBox(width: 8),
                Expanded(
                  child: InkWell(
                    onTap: () =>
                        _pickTime(context, isOpen: true, dayIndex: index - 1),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey.shade300),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        day.openTime.format(context),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8),
                  child: Text('to'),
                ),
                Expanded(
                  child: InkWell(
                    onTap: () =>
                        _pickTime(context, isOpen: false, dayIndex: index - 1),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey.shade300),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        day.closeTime.format(context),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                ),
              ],
            ],
          ),
        );
      },
    );
  }

  Widget _buildServiceAreaTab(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionCard(
            theme,
            title: 'Serviceable Areas',
            icon: Icons.map,
            children: [
              Chip(
                label: const Text('Downtown'),
                deleteIcon: const Icon(Icons.close, size: 16),
                onDeleted: () {},
              ),
              const SizedBox(height: 8),
              Chip(
                label: const Text('Uptown'),
                deleteIcon: const Icon(Icons.close, size: 16),
                onDeleted: () {},
              ),
              const SizedBox(height: 8),
              Chip(
                label: const Text('Suburbs'),
                deleteIcon: const Icon(Icons.close, size: 16),
                onDeleted: () {},
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.add),
                label: const Text('Add Service Area'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildSectionCard(
            theme,
            title: 'Holiday Calendar',
            icon: Icons.calendar_month,
            children: [
              ListTile(
                title: const Text('No holidays set'),
                subtitle: const Text(
                  'Add dates when your store will be closed',
                ),
                leading: Icon(Icons.info_outline, color: Colors.grey[400]),
              ),
              const SizedBox(height: 8),
              OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.add),
                label: const Text('Add Holiday'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard(
    ThemeData theme, {
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 20, color: theme.colorScheme.primary),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildInfoTile(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.grey[600], fontSize: 14)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Future<void> _pickTime(
    BuildContext context, {
    required bool isOpen,
    required int dayIndex,
  }) async {
    final hours = ref.read(businessHoursProvider);
    final day = hours[dayIndex];
    final initial = isOpen ? day.openTime : day.closeTime;

    final picked = await showTimePicker(context: context, initialTime: initial);
    if (picked != null) {
      // In a real app, update the state here
    }
  }
}
