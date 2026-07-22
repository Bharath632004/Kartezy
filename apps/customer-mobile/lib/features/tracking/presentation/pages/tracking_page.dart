// lib/features/tracking/presentation/pages/tracking_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:customer_mobile/features/tracking/provider/tracking_provider.dart';
import 'package:customer_mobile/features/tracking/domain/models/tracking_info.dart';

class TrackingPage extends ConsumerWidget {
  final String orderId;

  const TrackingPage({super.key, required this.orderId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Start tracking via the provider; the notifier deduplicates calls by orderId
    ref.read(trackingProvider.notifier).startTracking(orderId);

    final trackingState = ref.watch(trackingProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Order Tracking'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.read(trackingProvider.notifier).startTracking(orderId);
            },
          ),
        ],
      ),
      body: trackingState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : trackingState.hasError
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('Error: ${trackingState.error}'),
                  ElevatedButton(
                    onPressed: () {
                      ref
                          .read(trackingProvider.notifier)
                          .startTracking(orderId);
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            )
          : trackingState.value == null
          ? const Center(child: Text('No tracking data available'))
          : _buildTrackingView(context, trackingState.value!),
    );
  }

  Widget _buildTrackingView(BuildContext context, TrackingInfo tracking) {
    return Column(
      children: [
        // Map view
        Expanded(
          flex: 3,
          child: Stack(
            children: [
              GoogleMap(
                initialCameraPosition: CameraPosition(
                  target: tracking.currentLocation,
                  zoom: 15,
                ),
                markers: _getMarkers(tracking),
                polylines: _getPolylines(context, tracking),
                myLocationEnabled: true,
                myLocationButtonEnabled: true,
                zoomControlsEnabled: true,
              ),
              // ETA and status overlay
              Positioned(
                top: 16,
                left: 16,
                right: 16,
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Status: ${_formatStatus(tracking.currentStatus)}',
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'ETA: ${_formatETA(tracking.eta)}',
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                          ],
                        ),
                        Icon(
                          _getStatusIcon(tracking.currentStatus),
                          color: _getStatusColor(tracking.currentStatus),
                          size: 30,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        // Driver info card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            border: Border(top: BorderSide(color: Colors.grey.shade300)),
          ),
          child: Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundImage: NetworkImage(tracking.driver.photoUrl ?? ''),
                backgroundColor: Colors.grey.shade300,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      tracking.driver.name,
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${_formatRating(tracking.driver.rating)} ★',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
              // Action buttons: Call and Chat
              Column(
                children: [
                  IconButton(
                    icon: const Icon(Icons.phone),
                    onPressed: () {
                      // Call functionality - will use url_launcher when integrated
                    },
                    tooltip: 'Call Driver',
                  ),
                  IconButton(
                    icon: const Icon(Icons.chat_bubble),
                    onPressed: () {
                      // Chat functionality to be implemented
                    },
                    tooltip: 'Chat with Driver',
                  ),
                ],
              ),
            ],
          ),
        ),
        // Bottom actions
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    // Share live location to be implemented
                  },
                  icon: const Icon(Icons.share),
                  label: const Text('Share Live Location'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    // Contact support to be implemented
                  },
                  icon: const Icon(Icons.headset),
                  label: const Text('Contact Support'),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Set<Marker> _getMarkers(TrackingInfo tracking) {
    return {
      Marker(
        markerId: const MarkerId('driver'),
        position: tracking.currentLocation,
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueAzure),
        infoWindow: InfoWindow(
          title: 'Driver: ${tracking.driver.name}',
          snippet: 'Vehicle: ${tracking.driver.vehicleNumber}',
        ),
      ),
      Marker(
        markerId: const MarkerId('destination'),
        position: tracking.route.endPoint,
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
      ),
    };
  }

  Set<Polyline> _getPolylines(BuildContext context, TrackingInfo tracking) {
    return {
      Polyline(
        polylineId: const PolylineId('route'),
        points: tracking.route.polylineCoordinates,
        color: Theme.of(context).primaryColor,
        width: 5,
      ),
    };
  }

  String _formatStatus(String status) {
    switch (status) {
      case 'order_placed':
        return 'Order Placed';
      case 'order_confirmed':
        return 'Order Confirmed';
      case 'packing':
        return 'Packing Order';
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'delivered':
        return Icons.check_circle;
      case 'out_for_delivery':
        return Icons.local_shipping;
      case 'packing':
        return Icons.inventory_2;
      default:
        return Icons.access_time;
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'delivered':
        return Colors.green;
      case 'out_for_delivery':
        return Colors.orange;
      case 'packing':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  String _formatETA(Duration eta) {
    if (eta.inMinutes < 60) {
      return '${eta.inMinutes} min';
    } else {
      final hours = eta.inHours;
      final minutes = eta.inMinutes % 60;
      return '${hours}h ${minutes}m';
    }
  }

  String _formatRating(double rating) {
    return rating.toStringAsFixed(1);
  }
}
