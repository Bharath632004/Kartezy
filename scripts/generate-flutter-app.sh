#!/bin/bash

# Script to generate a basic Flutter app

APP_NAME=$1
APP_PATH="apps/$APP_NAME"

if [ -z "$APP_NAME" ]; then
    echo "Usage: $0 <app-name>"
    exit 1
fi

# Create directory structure
mkdir -p "$APP_PATH/lib"

# Create pubspec.yaml
cat > "$APP_PATH/pubspec.yaml" <<EOF
name: $APP_NAME
description: A new Flutter project.
publish_to: 'none' # Remove this line if you wish to publish to pub.dev

version: 1.0.0+1

environment:
  sdk: ">=2.19.0 <3.0.0"

dependencies:
  flutter:
    sdk: flutter

  # The following adds the Cupertino icons font for iOS icons.
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter

  # The "flutter_lints" package helps your code follow the official Flutter style guide.
  flutter_lints: ^2.0.0

flutter:

  # The following line ensures that the Material Icons font is
  # included with your application, so that you can use the icons in
  # the material Icons class.
  uses-material-design: true

  # To add assets to your application, add an assets section, like this:
  # assets:
  #   - images/a_dot_burr.jpeg
  #   - images/a_dot_gray.jpeg

  # An image asset can refer to one or more resolution-specific "variants", see
  # https://flutter.dev/assets-and-images/#resolution-aware.
  # For details regarding adding assets from package files, see
  # https://flutter.dev/assets-and-images/#from-packages
  # To add custom fonts to your application, add a font section here,
  # in this "flutter" section. Each entry in this list should have a
  # family name with the font files, and a weight.
  # There are no specific font requirements for Flutter.
  # For example:
  #   fonts:
  #     - family: Schyler
  #       fonts:
  #         - asset: fonts/Schyler-Regular.ttf
  #         - asset: fonts/Schyler-Bold.ttf
  #           weight: 700
  #     - family: Theo Gray
  #       fonts:
  #         - asset: fonts/TheoGray.ttf
  #           weight: 400
  #         - asset: fonts/TheoGray-Bold.ttf
  #           weight: 700
  #       -
EOF

# Create lib/main.dart
cat > "$APP_PATH/lib/main.dart" <<EOF
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '$APP_NAME',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "flutter hot reload" to see the application change.
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: '$APP_NAME Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      // This call to setState tells the Flutter framework that something has
      // changed in this State, which causes it to rerun the build method below
      // so that the display can reflect the updated values. If we changed
      // _counter without calling setState(), then the build method would not be
      // called again, and so we would miss the chance to update the visual.
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance when
    // the _incrementButton is pressed.
    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the myHomePage object that was created by the
        // // The AppBar.
        title: Text(widget.title),
      ),
      body: Center(
        // Center is a layout widget. It takes a single child and positions it
        // in the middle of the parent.
        child: Column(
          // Column is also a layout widget. It takes a list of children and
          // arranges them vertically. By default, the first element in the
          // // array is at the top of the column.
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
EOF

echo "Generated Flutter app: $APP_NAME"