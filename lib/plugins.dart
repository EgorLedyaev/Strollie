import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

bool _isElevated = true;

class nav_menu extends StatefulWidget{
  @override
  _nav_menu_state createState() => _nav_menu_state();
}

class _nav_menu_state extends State<nav_menu>{
  @override
  Widget build(BuildContext context){
    return Container(
        constraints: const BoxConstraints(
          minWidth: 380,
          minHeight: 80,
          maxWidth: 380,
          maxHeight: 80,
        ),
        decoration: const BoxDecoration(
          borderRadius : BorderRadius.all(Radius.circular(40)),
          color : Color.fromRGBO(255, 255, 255, 1),
        )
    );
  }
}

class main_start_button extends StatefulWidget{
  @override
  _main_start_button_state createState() => _main_start_button_state();
}

class _main_start_button_state extends State<main_start_button>{
  @override
  Widget build(BuildContext context){
    return GestureDetector(
        onTap: () {
          Navigator.pop(context);
          Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
          setState(() {
            _isElevated = !_isElevated;
          });
          print("DEBUG : onTap main called.");
        },
        child: AnimatedContainer(
          duration: Duration(milliseconds: 200),
          height: 65,
          width: 65,
          decoration: BoxDecoration(
            gradient : const LinearGradient(
                begin : Alignment.topLeft,
                end: Alignment(0.2, 0.0),
                colors: [Color.fromRGBO(0, 122, 254, 1),Color.fromRGBO(27, 224, 124, 1)]
            ),
            borderRadius: BorderRadius.circular(40),
            boxShadow: _isElevated
                ? [
              BoxShadow(
                color: Colors.green[300]!,
                offset: const Offset(2,2),
                blurRadius: 15,
                spreadRadius: 1,
              ),
              const BoxShadow(
                color: Colors.white,
                offset: Offset(-2,-2),
                blurRadius: 15,
                spreadRadius: 1,
              )
            ]
                : null,
          ),
        )
    );
  }
}

class main_start_button_icon extends StatefulWidget{
  @override
  _main_start_button_icon_state createState() => _main_start_button_icon_state();
}

class _main_start_button_icon_state extends State<main_start_button_icon>{
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.pop(context);
        Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
        setState(() {
          _isElevated = !_isElevated;
        });
        print("DEBUG : onTap main called.");
      },
      child: SvgPicture.asset(
        'assets/images/start_icon.svg',
      ),
    );
  }
}

class profile_button_icon extends StatefulWidget{
  @override
  _profile_button_icon_state createState() => _profile_button_icon_state();
}

class _profile_button_icon_state extends State<profile_button_icon>{
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.pop(context);
        Navigator.pushNamedAndRemoveUntil(context, '/profile', (route) => false);
        setState(() {
          _isElevated = !_isElevated;
        });
        print("DEBUG : onTap profile called.");
      },
      child: SvgPicture.asset(
        'assets/images/profile_icon.svg',
      ),
    );
  }
}

class stats_button_icon extends StatefulWidget{
  @override
  _stats_button_icon_state createState() => _stats_button_icon_state();
}

class _stats_button_icon_state extends State<stats_button_icon>{
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.pop(context);
        Navigator.pushNamedAndRemoveUntil(context, '/profile', (route) => false);
        setState(() {
          _isElevated = !_isElevated;
        });
        print("DEBUG : onTap stats called.");
      },
      child: SvgPicture.asset(
        'assets/images/stats_icon.svg',
      ),
    );
  }
}