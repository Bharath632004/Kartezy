import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        children: [
          const ListTile(
            leading: Icon(Icons.person),
            title: Text('Merchant Profile'),
          ),
          const ListTile(
            leading: Icon(Icons.business),
            title: Text('Business Settings'),
          ),
          const ListTile(
            leading: Icon(Icons.notifications),
            title: Text('Notification Settings'),
          ),
          const ListTile(
            leading: Icon(Icons.security),
            title: Text('Security Settings'),
          ),
          const ListTile(leading: Icon(Icons.logout), title: Text('Logout')),
        ],
      ),
    );
  }
}
