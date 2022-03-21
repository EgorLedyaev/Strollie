import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'home.dart';
import 'profile.dart';
import 'plugins.dart';
import 'stats.dart';
import 'make_route_view.dart';

void main() => runApp(Strollie());

const bg_color_green = const Color(0xFF1BE07C);
const bg_color = const Color(0xFFFFFFFF);

bool _isElevated = true;

class Strollie extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Strollie',
      debugShowCheckedModeBanner: true, // плашка дебага
      theme: new ThemeData(scaffoldBackgroundColor: const Color(0x40FFFFFF)),
      initialRoute: '/home',
      routes: {
        '/home': (context) => const MapScreen(),
        '/profile': (context) => ProfileScreen(),
        '/stats': (context) => StatsScreen(),
        '/makeroute': (context) => MakeRouteScreen(),
      },
    );
  }
}




