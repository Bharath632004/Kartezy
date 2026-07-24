import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:delivery_mobile/core/services/location_service.dart';

/// Navigation page with Google Maps integration for delivery routes.
class NavigationPage extends ConsumerStatefulWidget {
  final String? destinationName;
  final double? destinationLatitude;
  final double? destinationLongitude;
  final String? orderId;

  const NavigationPage({
    super.key,
    this.destinationName,
    this.destinationLatitude,
    this.destinationLongitude,
    this.orderId,
  });

  @override
  ConsumerState<NavigationPage> createState() => _NavigationPageState();
}

class _NavigationPageState extends ConsumerState<NavigationPage> {
  final Completer<GoogleMapController> _mapController = Completer();
  GoogleMapController? _mapControllerInstance;
  Set<Marker> _markers = {};
  Set<Polyline> _polylines = {};
  LatLng? _currentPosition;
  bool _isLoading = true;
  String _estimatedTime = '15 min';
  String _distance = '2.3 km';

  @override
  void initState() {
    super.initState();
    _initLocation();
  }

  Future<void> _initLocation() async {
    final locationService = ref.read(locationServiceProvider);
    final location = await locationService.getCurrentLocation();

    if (location != null) {
      setState(() {
        _currentPosition = LatLng(location.latitude, location.longitude);
        _isLoading = false;
      });
      _updateMap();
    } else {
      setState(() {
        _currentPosition = const LatLng(12.9716, 77.5946);
        _isLoading = false;
      });
    }
  }

  void _updateMap() {
    if (_currentPosition == null) return;

    final markers = <Marker>{
      Marker(
        markerId: const MarkerId('current'),
        position: _currentPosition!,
        infoWindow: const InfoWindow(title: 'Your Location'),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueBlue),
      ),
    };

    if (widget.destinationLatitude != null &&
        widget.destinationLongitude != null) {
      markers.add(
        Marker(
          markerId: const MarkerId('destination'),
          position: LatLng(
            widget.destinationLatitude!,
            widget.destinationLongitude!,
          ),
          infoWindow: InfoWindow(
            title: widget.destinationName ?? 'Destination',
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
        ),
      );
    }

    setState(() => _markers = markers);

    // Fit map to show both markers
    if (widget.destinationLatitude != null && _mapControllerInstance != null) {
      final bounds = LatLngBounds(
        southwest: LatLng(
          _currentPosition!.latitude < widget.destinationLatitude!
              ? _currentPosition!.latitude
              : widget.destinationLatitude!,
          _currentPosition!.longitude < widget.destinationLongitude!
              ? _currentPosition!.longitude
              : widget.destinationLongitude!,
        ),
        northeast: LatLng(
          _currentPosition!.latitude > widget.destinationLatitude!
              ? _currentPosition!.latitude
              : widget.destinationLatitude!,
          _currentPosition!.longitude > widget.destinationLongitude!
              ? _currentPosition!.longitude
              : widget.destinationLongitude!,
        ),
      );
      _mapControllerInstance!.animateCamera(
        CameraUpdate.newLatLngBounds(bounds, 80),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.destinationName ?? 'Navigation'),
        actions: [
          IconButton(
            icon: const Icon(Icons.layers),
            onPressed: () {},
            tooltip: 'Map Type',
          ),
          IconButton(
            icon: const Icon(Icons.volume_up),
            onPressed: () {},
            tooltip: 'Voice Navigation',
          ),
        ],
      ),
      body: Stack(
        children: [
          // Map
          if (_isLoading)
            const Center(child: CircularProgressIndicator())
          else
            GoogleMap(
              initialCameraPosition: CameraPosition(
                target: _currentPosition ?? const LatLng(12.9716, 77.5946),
                zoom: 14,
              ),
              onMapCreated: (controller) {
                _mapController.complete(controller);
                _mapControllerInstance = controller;
                _updateMap();
              },
              markers: _markers,
              polylines: _polylines,
              myLocationEnabled: true,
              myLocationButtonEnabled: false,
              zoomControlsEnabled: false,
              compassEnabled: true,
              mapToolbarEnabled: false,
            ),

          // Current location button
          Positioned(
            right: 16,
            bottom: 280,
            child: FloatingActionButton.small(
              heroTag: 'myLocation',
              onPressed: _initLocation,
              child: const Icon(Icons.my_location),
            ),
          ),

          // Bottom info panel
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: _buildBottomPanel(theme),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomPanel(ThemeData theme) {
    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle bar
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 16),
              // ETA and distance
              Row(
                children: [
                  _InfoChip(
                    icon: Icons.schedule,
                    label: _estimatedTime,
                    color: Colors.green,
                  ),
                  const SizedBox(width: 12),
                  _InfoChip(
                    icon: Icons.straighten,
                    label: _distance,
                    color: Colors.blue,
                  ),
                  const SizedBox(width: 12),
                  _InfoChip(
                    icon: Icons.traffic,
                    label: 'Light',
                    color: Colors.orange,
                  ),
                ],
              ),
              const SizedBox(height: 16),
              // Destination info
              Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: Colors.red.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.location_on,
                      color: Colors.red,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.destinationName ?? 'Destination',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const Text(
                          'Delivery Address',
                          style: TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              // Action buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _openInGoogleMaps,
                      icon: const Icon(Icons.navigation, size: 18),
                      label: const Text('Open in Maps'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      icon: const Icon(Icons.check, size: 18),
                      label: const Text('I\'ve Arrived'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _openInGoogleMaps() async {
    if (widget.destinationLatitude == null ||
        widget.destinationLongitude == null)
      return;

    final url = Uri.parse(
      'https://www.google.com/maps/dir/?api=1&destination=${widget.destinationLatitude},${widget.destinationLongitude}',
    );

    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _InfoChip({
    required this.icon,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: color,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}
