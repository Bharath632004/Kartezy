import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    // Use environment variables; ensure .env file has FIREBASE_API_KEY, etc.
    const String apiKey = String.fromEnvironment('FIREBASE_API_KEY');
    const String appId = String.fromEnvironment('FIREBASE_APP_ID');
    const String messagingSenderId = String.fromEnvironment('FIREBASE_SENDER_ID');
    const String projectId = String.fromEnvironment('FIREBASE_PROJECT_ID');
    const String authDomain = String.fromEnvironment('FIREBASE_AUTH_DOMAIN');
    const String storageBucket = String.fromEnvironment('FIREBASE_STORAGE_BUCKET');
    const String iosBundleId = String.fromEnvironment('FIREBASE_IOS_BUNDLE_ID');

    if (kIsWeb) {
      return FirebaseOptions(
        apiKey: apiKey,
        appId: appId,
        messagingSenderId: messagingSenderId,
        projectId: projectId,
        authDomain: authDomain,
        storageBucket: storageBucket,
      );
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return FirebaseOptions(
          apiKey: apiKey,
          appId: appId,
          messagingSenderId: messagingSenderId,
          projectId: projectId,
          storageBucket: storageBucket,
        );
      case TargetPlatform.iOS:
        return FirebaseOptions(
          apiKey: apiKey,
          appId: appId,
          messagingSenderId: messagingSenderId,
          projectId: projectId,
          storageBucket: storageBucket,
          iosBundleId: iosBundleId,
        );
      case TargetPlatform.macOS:
        return FirebaseOptions(
          apiKey: apiKey,
          appId: appId,
          messagingSenderId: messagingSenderId,
          projectId: projectId,
          storageBucket: storageBucket,
          iosBundleId: iosBundleId,
        );
      case TargetPlatform.windows:
        return FirebaseOptions(
          apiKey: apiKey,
          appId: appId,
          messagingSenderId: messagingSenderId,
          projectId: projectId,
          storageBucket: storageBucket,
        );
      case TargetPlatform.linux:
        return FirebaseOptions(
          apiKey: apiKey,
          appId: appId,
          messagingSenderId: messagingSenderId,
          projectId: projectId,
          storageBucket: storageBucket,
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }
}
