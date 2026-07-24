# @kartezy/maps

Shared maps and location library for Kartezy applications.

## Purpose

Provides location services, mapping, geocoding, and navigation functionality shared across customer, merchant, and delivery applications.

## Features

- Map widget integration (Google Maps / Mapbox)
- Geocoding (address ↔ coordinates)
- Reverse geocoding
- Distance calculation
- Location tracking
- Map marker clustering
- Route drawing

## Usage

```dart
// Flutter
import 'package:kartezy_maps/kartezy_maps.dart';

final location = await LocationService.getCurrentLocation();
final distance = LocationUtils.calculateDistance(
  lat1, lng1, lat2, lng2
);
```

```typescript
// Node.js / Next.js
import { LocationService } from '@kartezy/maps';

const distance = LocationUtils.calculateDistance(
  lat1, lng1, lat2, lng2
);
```

## Dependencies

- Google Maps SDK / Mapbox SDK
- Geolocation plugins
