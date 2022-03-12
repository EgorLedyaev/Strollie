import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'home.dart';
import 'profile.dart';
import 'plugins.dart';

void main() => runApp(Strollie());

const bg_color_green = const Color(0xFF1BE07C);

bool _isElevated = true;

class Strollie extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Strollie',
      debugShowCheckedModeBanner: true, // плашка дебага
      theme: ThemeData(
        primaryColor: Colors.transparent,
      ),
      initialRoute: '/home',
      routes: {
        '/home': (context) => const MapScreen(),
        '/profile': (context) => ProfileScreen(),
      },
    );
  }
}




