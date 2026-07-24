import 'package:flutter/material.dart';

/// A prominent card showing the delivery partner's online status
/// with controls for going online/offline, starting shifts, and break mode.
class OnlineStatusCard extends StatelessWidget {
  final bool isOnline;
  final bool isOnBreak;
  final Duration? shiftDuration;
  final int ordersInShift;
  final VoidCallback onToggleOnline;
  final VoidCallback onToggleBreak;
  final VoidCallback onStartShift;
  final VoidCallback onEndShift;

  const OnlineStatusCard({
    super.key,
    required this.isOnline,
    this.isOnBreak = false,
    this.shiftDuration,
    this.ordersInShift = 0,
    required this.onToggleOnline,
    required this.onToggleBreak,
    required this.onStartShift,
    required this.onEndShift,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isOnline
              ? [const Color(0xFF00C853), const Color(0xFF00E676)]
              : [Colors.grey.shade400, Colors.grey.shade500],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: (isOnline ? Colors.green : Colors.grey).withValues(
              alpha: 0.3,
            ),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          color: isOnline ? Colors.white : Colors.white54,
                          shape: BoxShape.circle,
                          boxShadow: isOnline
                              ? [
                                  BoxShadow(
                                    color: Colors.white.withValues(alpha: 0.6),
                                    blurRadius: 8,
                                    spreadRadius: 2,
                                  ),
                                ]
                              : null,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        isOnline ? 'You\'re Online' : 'You\'re Offline',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  if (isOnline && shiftDuration != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      'Shift: ${_formatDuration(shiftDuration!)} • $ordersInShift orders',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 13,
                      ),
                    ),
                  ],
                  if (isOnBreak) ...[
                    const SizedBox(height: 4),
                    const Text(
                      '☕ On Break',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ],
              ),
              Switch(
                value: isOnline,
                onChanged: (_) => onToggleOnline(),
                activeColor: Colors.white,
                activeTrackColor: Colors.white38,
                inactiveThumbColor: Colors.white70,
                inactiveTrackColor: Colors.white24,
              ),
            ],
          ),
          if (isOnline) ...[
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _ActionButton(
                    label: isOnBreak ? 'Resume' : 'Break',
                    icon: isOnBreak
                        ? Icons.play_arrow_rounded
                        : Icons.coffee_rounded,
                    onTap: onToggleBreak,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _ActionButton(
                    label: 'End Shift',
                    icon: Icons.stop_rounded,
                    onTap: onEndShift,
                  ),
                ),
              ],
            ),
          ] else ...[
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: onStartShift,
                icon: const Icon(Icons.play_arrow_rounded),
                label: const Text('Start Shift & Go Online'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFF00C853),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  textStyle: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _formatDuration(Duration d) {
    final h = d.inHours;
    final m = d.inMinutes % 60;
    if (h > 0) return '${h}h ${m}m';
    return '${m}m';
  }
}

class _ActionButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  const _ActionButton({
    required this.label,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: onTap,
      icon: Icon(icon, size: 18),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.white.withValues(alpha: 0.25),
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }
}
