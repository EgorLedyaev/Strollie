import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

void main() => runApp(StrollieApp());

const bg_color_green = const Color(0xFF1BE07C);
bool showlogo = false;

class StrollieApp extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(
        backgroundColor: bg_color_green,
        body: Center(
          child: Image(
            image: AssetImage('assets/images/Strollie_logo.png'),
            height: 550
          ),
        )
      )
    );
  }

}