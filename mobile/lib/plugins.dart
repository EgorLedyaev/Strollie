import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'dart:math' as math;

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
          borderRadius : BorderRadius.all(Radius.circular(30)),
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
        Navigator.pushNamedAndRemoveUntil(context, '/stats', (route) => false);
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

class profile_img extends StatefulWidget{
  @override
  _profile_img_state createState() => _profile_img_state();
}

class _profile_img_state extends State<profile_img>{
  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.all(0.8),
        child : Row(
          children: <Widget>[
            Padding(
                padding: const EdgeInsets.all(0),
                child: ClipRRect(
                  borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(90),
                      bottomLeft: Radius.circular(90),
                      topRight: Radius.circular(90),
                      bottomRight: Radius.circular(90)),
                  child:
                  Image.network(
                    'https://sun3-9.userapi.com/s/v1/ig2/qFqGcO2xQSreMq9lnFMztp-6Yo79hDHTFIkhkO_FbqEkzagEVdklfjic4IgkBgu3bS-c4EeDz2W2et1Wi4P2YXz-.jpg?size=50x50&quality=95&crop=0,480,1920,1920&ava=1',
                    width: 80,
                    height: 80,
                    scale: 0.1,
                  ),
                )
            )
          ],
        )
    );
  }

}

class first_bg_box_profile extends StatefulWidget{
  @override
  _first_bg_box_profile_state createState() => _first_bg_box_profile_state();
}

class _first_bg_box_profile_state extends State<first_bg_box_profile>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: double.infinity,
        height: 104,
        decoration: const BoxDecoration(
          borderRadius : BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30),
          ),
          color : Color.fromRGBO(255, 255, 255, 1),
        )
    );
  }
}

class settings_profile_bt extends StatefulWidget{
  @override
  _settings_profile_bt_state createState() => _settings_profile_bt_state();
}

class _settings_profile_bt_state extends State<settings_profile_bt>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          borderRadius : BorderRadius.all(Radius.elliptical(60, 60)),
        )
    );
  }
}

class settngs_profile_bt_icon extends StatefulWidget{
  @override
  _settngs_profile_bt_icon_state createState() => _settngs_profile_bt_icon_state();
}

class _settngs_profile_bt_icon_state extends State<settngs_profile_bt_icon>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
        ),
        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 2,
                  left: 2,
                  child: Container(
                      width: 28,
                      height: 28,
                      child: Stack(
                          children: <Widget>[
                            Positioned(
                                top: 0,
                                left: 0,
                                child: SvgPicture.asset(
                                    'assets/images/settings_1.svg',
                                    semanticsLabel: 'vector',
                                  color: Color(0xFF1BE07C),
                                )
                            ),
                            Positioned(
                                top: 8,
                                left: 7.5,
                                child: SvgPicture.asset(
                                    'assets/images/settings_2.svg',
                                    semanticsLabel: 'vector',
                                  color: Color(0xFF1BE07C),
                                )
                            ),
                          ]
                      )
                  )
              ),
            ]
        )
    );
  }
}

class inf_profile_up_box extends StatefulWidget{
  @override
  _inf_profile_up_box_state createState() => _inf_profile_up_box_state();
}

class _inf_profile_up_box_state extends State<inf_profile_up_box>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 163,
        height: 48,
        child: Stack(
            children: const <Widget>[
              Positioned(
                  top: 27,
                  left: 0,
                  child: Text('Пятница, 24 июня', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 16,
                      letterSpacing: 0 /*percentages not used in flutter. defaulting to zero*/,
                      fontWeight: FontWeight.normal,
                      height: 1
                  ),)
              ),Positioned(
                  top: 0,
                  left: 0,
                  child: Text('Здравствуйте, Егор!', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 0.6000000238418579),
                      fontFamily: 'SF Pro Text',
                      fontSize: 14,
                      letterSpacing: 0 /*percentages not used in flutter. defaulting to zero*/,
                      fontWeight: FontWeight.normal,
                      height: 1
                  ),)
              ),
            ]
        )
    );
  }
}

class full_inf_profile_box extends StatefulWidget{
  @override
  _full_inf_profile_box_state createState() => _full_inf_profile_box_state();
}

class _full_inf_profile_box_state extends State<full_inf_profile_box>{
  @override
  Widget build(BuildContext context) {

    return Container(
        width: 284.0472412109375,
        height: 92,

        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 2,
                  left: 0,
                  child: Container(
                      width: 14.9606294631958,
                      height: 15,
                      decoration: const BoxDecoration(
                        gradient : LinearGradient(
                            begin: Alignment(6.123234262925839e-17,1),
                            end: Alignment(-1,6.123234262925839e-17),
                            colors: [Color.fromRGBO(26, 224, 124, 1),Color.fromRGBO(0, 122, 254, 1)]
                        ),
                        borderRadius : BorderRadius.all(Radius.elliptical(14.9606294631958, 15)),
                      )
                  )
              ),Positioned(
                  top: 38,
                  left: 0,
                  child: Container(
                      width: 14.9606294631958,
                      height: 15,
                      decoration: const BoxDecoration(
                        gradient : LinearGradient(
                            begin: Alignment(6.123234262925839e-17,1),
                            end: Alignment(-1,6.123234262925839e-17),
                            colors: [Color.fromRGBO(26, 224, 124, 1),Color.fromRGBO(0, 122, 254, 1)]
                        ),
                        borderRadius : BorderRadius.all(Radius.elliptical(14.9606294631958, 15)),
                      )
                  )
              ),Positioned(
                  top: 74,
                  left: 0,
                  child: Container(
                      width: 14.9606294631958,
                      height: 15,
                      decoration: const BoxDecoration(
                        gradient : LinearGradient(
                            begin: Alignment(6.123234262925839e-17,1),
                            end: Alignment(-1,6.123234262925839e-17),
                            colors: [Color.fromRGBO(26, 224, 124, 1),Color.fromRGBO(0, 122, 254, 1)]
                        ),
                        borderRadius : BorderRadius.all(Radius.elliptical(14.9606294631958, 15)),
                      )
                  )
              ),const Positioned(
                  top: 36,
                  left: 23.0472412109375,
                  child: Text('День рождения : 24.06.2004', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 18,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),const Positioned(
                  top: 0,
                  left: 23.0472412109375,
                  child: Text('Имя : Егор Ледяев', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 18,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),const Positioned(
                  top: 72,
                  left: 23.047245025634766,
                  child: Text('Родной город : Самара', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 18,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),
            ]
        )
    );
  }
}

class second_bg_box_profile extends StatefulWidget{
  @override
  _second_bg_box_profile_state createState() => _second_bg_box_profile_state();
}

class _second_bg_box_profile_state extends State<second_bg_box_profile>{
  @override
  Widget build(BuildContext context) {
    // Figma Flutter Generator BaseWidget - RECTANGLE

    return Container(
        width: double.infinity,
        height: 120,
        decoration: const BoxDecoration(
          borderRadius : BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30),
          ),
          color : Color.fromRGBO(255, 255, 255, 1),
        )
    );
  }
}

class first_inf_route_box extends StatefulWidget{
  @override
  _first_inf_route_box_state createState() => _first_inf_route_box_state();
}

class _first_inf_route_box_state extends State<first_inf_route_box>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: double.infinity,
        height: 180,
        decoration: const BoxDecoration(
          borderRadius : BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30),
          ),
          color : Color.fromRGBO(255, 255, 255, 1),
        )
    );
  }
}

class first_inf_route_pic extends StatefulWidget{
  @override
  _first_ing_route_pic_state createState() => _first_ing_route_pic_state();
}

class _first_ing_route_pic_state extends State<first_inf_route_pic>{
  @override
  Widget build(BuildContext context) {
    // Figma Flutter Generator Img_20210704_2103431Widget - RECTANGLE

    return Container(
        width: double.infinity,
        height: 120,
        decoration: const BoxDecoration(
          borderRadius : BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
            bottomLeft: Radius.circular(0),
            bottomRight: Radius.circular(0),
          ),
          image : DecorationImage(
              image: AssetImage('assets/images/Img_20210704_2103431.png'),
              fit: BoxFit.fitWidth
          ),
        )
    );
  }
}

class first_info_route extends StatefulWidget{
  @override
  _first_info_route_state createState() => _first_info_route_state();
}

class _first_info_route_state extends State<first_info_route>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 300,
        height: 37,
        child: Stack(
            children: const <Widget>[
              Positioned(
                  child: Text('просп. Карла Маркса - ул. Ветвистая  ', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 14,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.4285714285714286
                  ),)
              ),Positioned(
                  top: 20,
                  left: 0,
                  child: Text('25.07.2021   21 км   2 ч 38 мин', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 0.699999988079071),
                      fontFamily: 'SF Pro Text',
                      fontSize: 13,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.5384615384615385
                  ),)
              ),
            ]
        )
    );
  }
}

class view_first_info_route extends StatefulWidget{
  @override
  _view_first_info_route_state createState() => _view_first_info_route_state();
}

class _view_first_info_route_state extends State<view_first_info_route>{
  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
        'assets/images/view_info_route.svg',
        semanticsLabel: 'vector'
    );;
  }
}

class second_inf_route_box extends StatefulWidget{
  @override
  _second_inf_route_box_state createState() => _second_inf_route_box_state();
}

class _second_inf_route_box_state extends State<second_inf_route_box>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: double.infinity,
        height: 180,
        decoration: const BoxDecoration(
          borderRadius : BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30),
          ),
          color : Color.fromRGBO(255, 255, 255, 1),
        )
    );
  }
}

class second_inf_route_pic extends StatefulWidget{
  @override
  _second_ing_route_pic_state createState() => _second_ing_route_pic_state();
}

class _second_ing_route_pic_state extends State<second_inf_route_pic>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: double.infinity,
        height: 120,
        decoration: const BoxDecoration(
          borderRadius : BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
            bottomLeft: Radius.circular(0),
            bottomRight: Radius.circular(0),
          ),
          image : DecorationImage(
              image: AssetImage('assets/images/Dsc_00111.png'),
              fit: BoxFit.fitWidth
          ),
        )
    );
  }
}

class second_info_route extends StatefulWidget{
  @override
  _second_info_route_state createState() => _second_info_route_state();
}

class _second_info_route_state extends State<second_info_route>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 300,
        height: 37,
        child: Stack(
            children: const <Widget>[
              Positioned(
                  top: 20,
                  left: 0,
                  child: Text('12.09.2021   11 км   1 ч 14 мин', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 0.699999988079071),
                      fontFamily: 'SF Pro Text',
                      fontSize: 13,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.5384615384615385
                  ),)
              ),Positioned(
                  top: 0,
                  left: 0,
                  child: Text('Московское ш. - ул. Лесная ', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 14,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.4285714285714286
                  ),)
              ),
            ]
        )
    );
  }
}

class view_second_info_route extends StatefulWidget{
  @override
  _view_second_info_route_state createState() => _view_second_info_route_state();
}

class _view_second_info_route_state extends State<view_second_info_route>{
  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
        'assets/images/view_info_route.svg',
        semanticsLabel: 'vector'
    );;
  }
}

class bg extends StatefulWidget{
  @override
  _bg_state createState() => _bg_state();
}

class _bg_state extends State<bg>{
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ClipPath(
          child: Container(
            width: double.infinity,
            height: double.infinity,
            color: Color(0xF0FFFFFF),
          ),
        ),
      ),
    );
  }
}

class profile_menu_icon extends StatefulWidget{
  @override
  _profile_menu_icon_state createState() => _profile_menu_icon_state();
}

class _profile_menu_icon_state extends State<profile_menu_icon>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 90,
        height: 37,
        child: Stack(
            children: <Widget>[
              const Positioned(
                  top: 0,
                  left:-20,
                  right: 0,
                  child: Text('Профиль', textAlign: TextAlign.center, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 17,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),Positioned(
                  top: 22,
                  left: 28,
                  child: Container(
                      width: 15,
                      height: 15,
                      decoration: const BoxDecoration(
                        gradient : LinearGradient(
                            begin: Alignment(6.123234262925839e-17,1),
                            end: Alignment(-1,6.123234262925839e-17),
                            colors: [Color.fromRGBO(0, 122, 254, 1),Color.fromRGBO(26, 224, 124, 1)]
                        ),
                        borderRadius : BorderRadius.all(Radius.elliptical(15, 15)),
                      )
                  )
              ),
            ]
        )
    );
  }
}

class view_all_routes extends StatefulWidget{
  @override
  _view_all_routes_state createState() => _view_all_routes_state();
}

class _view_all_routes_state extends State<view_all_routes>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 380,
        height: 66,
        child: Stack(
            children: <Widget>[
              Positioned(
                  child: Container(
                      width: 380,
                      height: 66,
                      decoration: BoxDecoration(
                        borderRadius : BorderRadius.only(
                          topLeft: Radius.circular(15),
                          topRight: Radius.circular(15),
                          bottomLeft: Radius.circular(15),
                          bottomRight: Radius.circular(15),
                        ),
                        color : Color.fromRGBO(26, 224, 124, 0.8500000238418579),
                      )
                  )
              ),Positioned(
                  top: 20,
                  left: 80,
                  child: Text('Все прогулки', textAlign: TextAlign.left, style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'SF Pro Text',
                      fontSize: 26,
                      letterSpacing: 0 /*percentages not used in flutter. defaulting to zero*/,
                      fontWeight: FontWeight.normal,
                      height: 1
                  ),)
              ),
            ]
        )
    );
  }
}

class empty_chto_to extends StatefulWidget{
  @override
  _empty_chto_to_state createState() => _empty_chto_to_state();
}

class _empty_chto_to_state extends State<empty_chto_to>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 380,
        height: 66,
        child: Stack(
            children: const <Widget>[
              Positioned(
                  top: 17,
                  left: 97,
                  child: Text('', textAlign: TextAlign.left, style: TextStyle(
                      color: Color(0xE0FFFFFF),
                      fontFamily: 'SF Pro Text',
                      fontSize: 26,
                      letterSpacing: 0 /*percentages not used in flutter. defaulting to zero*/,
                      fontWeight: FontWeight.normal,
                      height: 1
                  ),)
              ),
            ]
        )
    );
  }
}


class default_base_stats extends StatefulWidget{
  @override
  _default_base_stats_state createState() => _default_base_stats_state();
}

class _default_base_stats_state extends State<default_base_stats>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 155,
        height: 141,
        decoration: const BoxDecoration(
          borderRadius : BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30),
          ),
          color : Color.fromRGBO(255, 255, 255, 1),
        )
    );
  }
}


class StepsWidget extends StatefulWidget {
  @override
  _StepsWidgetState createState() => _StepsWidgetState();
}

class _StepsWidgetState extends State<StepsWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 130,
        height: 102.7627182006836,

        child: Stack(
            children: <Widget>[
              const Positioned(
                  top: 83.64407348632812,
                  left: 0,
                  child: Text('Шагов', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(4, 4, 21, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 14,
                      letterSpacing: 0,
                      fontWeight: FontWeight.normal,
                      height: 1.1428571428571428
                  ),)
              ),
              const Positioned(
                  top: 47.796600341796875,
                  left: 0,
                  child: Text('7 229', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(4, 4, 21, 1),
                      fontFamily: 'SF Pro Display',
                      fontSize: 18,
                      letterSpacing: 0,
                      fontWeight: FontWeight.normal,
                      height: 1.5555555555555556
                  ),)
              ),
              Positioned(
                  top: 0,
                  left: 0,
                  child: Container(
                      width: 148.025634765625,
                      height: 48.296630859375,

                      child: Stack(
                          children: <Widget>[
                            Positioned(
                                top: 0.296630859375,
                                left: 100.025634765625,
                                child: Container(
                                    width: 48,
                                    height: 48,
                                    decoration: BoxDecoration(

                                    ),
                                )
                            ),
                            const Positioned(
                                top: 0,
                                left: 0,
                                child: Text('Сделано', textAlign: TextAlign.left, style: TextStyle(
                                    color: Color.fromRGBO(4, 4, 21, 1),
                                    fontFamily: 'SF Pro Text',
                                    fontSize: 18,
                                    letterSpacing: 0,
                                    fontWeight: FontWeight.normal,
                                    height: 1.3333333333333333
                                ),)
                            ),
                          ]
                      )
                  )
              ),
            ]
        )
    );
  }
}

class steps_logo extends StatefulWidget{
  @override
  _steps_logo_state createState() => _steps_logo_state();
}

class _steps_logo_state extends State<steps_logo>{
  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
        'assets/images/steps_logo.svg',
        semanticsLabel: 'steps_logo'
    );;
  }
}

class steps_info extends StatefulWidget{
  @override
  _steps_info_class createState() => _steps_info_class();
}

class _steps_info_class extends State<steps_info>{
  @override
  Widget build(BuildContext context) {
    return Stack(
        children: <Widget>[
          Container(
            alignment: Alignment.topLeft,
            child:default_base_stats(),
          ),
          Container(
            alignment: Alignment.topLeft,
            padding: const EdgeInsets.only(top:20,left:20),
            child:StepsWidget(),
          ),
          Container(
            alignment: Alignment.topLeft,
            padding: const EdgeInsets.only(top:75,left:90),
            child:steps_logo(),
          ),
        ]
    );
  }
}


class DistanceWidget extends StatefulWidget {
  @override
  _DistanceWidgetState createState() => _DistanceWidgetState();
}

class _DistanceWidgetState extends State<DistanceWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 130,
        height: 102.7627182006836,

        child: Stack(
            children: <Widget>[
              const Positioned(
                  top: 83.64407348632812,
                  left: 0,
                  child: Text('Метров', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(4, 4, 21, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 14,
                      letterSpacing: 0,
                      fontWeight: FontWeight.normal,
                      height: 1.1428571428571428
                  ),)
              ),
              const Positioned(
                  top: 47.796600341796875,
                  left: 0,
                  child: Text('13 549', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(4, 4, 21, 1),
                      fontFamily: 'SF Pro Display',
                      fontSize: 18,
                      letterSpacing: 0,
                      fontWeight: FontWeight.normal,
                      height: 1.5555555555555556
                  ),)
              ),
              Positioned(
                  top: 0,
                  left: 0,
                  child: Container(
                      width: 148.025634765625,
                      height: 48.296630859375,

                      child: Stack(
                          children: <Widget>[
                            Positioned(
                                top: 0.296630859375,
                                left: 100.025634765625,
                                child: Container(
                                  width: 48,
                                  height: 48,
                                  decoration: BoxDecoration(

                                  ),
                                )
                            ),
                            const Positioned(
                                top: 0,
                                left: 0,
                                child: Text('Пройдено', textAlign: TextAlign.left, style: TextStyle(
                                    color: Color.fromRGBO(4, 4, 21, 1),
                                    fontFamily: 'SF Pro Text',
                                    fontSize: 18,
                                    letterSpacing: 0,
                                    fontWeight: FontWeight.normal,
                                    height: 1.3333333333333333
                                ),)
                            ),
                          ]
                      )
                  )
              ),
            ]
        )
    );
  }
}

class distance_logo extends StatefulWidget{
  @override
  _distance_logo_state createState() => _distance_logo_state();
}

class _distance_logo_state extends State<distance_logo>{
  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
        'assets/images/distance_logo.svg',
        semanticsLabel: 'distance_logo'
    );;
  }
}

class distance_info extends StatefulWidget{
  @override
  _distance_info_class createState() => _distance_info_class();
}

class _distance_info_class extends State<distance_info>{
  @override
  Widget build(BuildContext context) {
    return Stack(
        children: <Widget>[
          Container(
            alignment: Alignment.topLeft,
            child:default_base_stats(),
          ),
          Container(
            alignment: Alignment.topLeft,
            padding: const EdgeInsets.only(top:20,left:20),
            child:DistanceWidget(),
          ),
          Container(
            alignment: Alignment.topLeft,
            padding: const EdgeInsets.only(top:75,left:90),
            child:distance_logo(),
          ),
        ]
    );
  }
}

class ScorepointsWidget extends StatefulWidget {
  @override
  _ScorepointsWidgetState createState() => _ScorepointsWidgetState();
}

class _ScorepointsWidgetState extends State<ScorepointsWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 381,
        height: 180,

        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 0,
                  left: 0,
                  child: Container(
                      width: 320,
                      height: 180,
                      decoration: const BoxDecoration(
                        borderRadius : BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30),
                          bottomLeft: Radius.circular(30),
                          bottomRight: Radius.circular(30),
                        ),
                        color : Color.fromRGBO(255, 255, 255, 1),
                      )
                  )
              ),Positioned(
                  top: 50,
                  left: 0,
                  child: SvgPicture.asset(
                      'assets/images/score.svg',
                      semanticsLabel: 'score',
                    color: Color(0xFF1BE07C),
                  )
              ),const Positioned(
                  top: 149,
                  left: 139,
                  child: Text('Очков', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 14,
                      letterSpacing: 0,
                      fontWeight: FontWeight.normal,
                      height: 1.7142857142857142
                  ),)
              ),const Positioned(
                  top: 125,
                  left: 145,
                  child: Text('298', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 18,
                      letterSpacing: 0,
                      fontWeight: FontWeight.normal,
                      height: 1.3333333333333333
                  ),)
              ),const Positioned(
                  top: 22,
                  left: 19,
                  child: Text('Результат', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 18,
                      letterSpacing: 0,
                      fontWeight: FontWeight.normal,
                      height: 1.3333333333333333
                  ),)
              ),
            ]
        )
    );
  }
}

class stats_menu_icon extends StatefulWidget{
  const stats_menu_icon({Key? key}) : super(key: key);

  @override
  _stats_menu_icon_state createState() => _stats_menu_icon_state();
}

class _stats_menu_icon_state extends State<stats_menu_icon>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 90,
        height: 37,
        child: Stack(
            children: <Widget>[
              const Positioned(
                  top: 0,
                  left:-20,
                  right: 0,
                  child: Text('Таланты', textAlign: TextAlign.center, style: TextStyle(
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 17,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),Positioned(
                  top: 22,
                  left: 28,
                  child: Container(
                      width: 15,
                      height: 15,
                      decoration: const BoxDecoration(
                        gradient : LinearGradient(
                            begin: Alignment(6.123234262925839e-17,1),
                            end: Alignment(-1,6.123234262925839e-17),
                            colors: [Color.fromRGBO(0, 122, 254, 1),Color.fromRGBO(26, 224, 124, 1)]
                        ),
                        borderRadius : BorderRadius.all(Radius.elliptical(15, 15)),
                      )
                  )
              ),
            ]
        )
    );
  }
}

class VisitedWidget extends StatefulWidget {
  const VisitedWidget({Key? key}) : super(key: key);

  @override
  _VisitedWidgetState createState() => _VisitedWidgetState();
}

class _VisitedWidgetState extends State<VisitedWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 155,
        height: 141,

        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 0,
                  left: 0,
                  child: Container(
                      width: 155,
                      height: 141,
                      decoration: const BoxDecoration(
                        borderRadius : BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30),
                          bottomLeft: Radius.circular(30),
                          bottomRight: Radius.circular(30),
                        ),
                        color : Color.fromRGBO(255, 255, 255, 1),
                      )
                  )
              ),
              const Positioned(
                  top: 106.347412109375,
                  left: 18.974365234375,
                  child: Text('Мест', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(4, 4, 21, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 14,
                      letterSpacing: 0,
                      fontWeight: FontWeight.normal,
                      height: 1.1428571428571428
                  ),)
              ),
              const Positioned(
                  top: 70.5,
                  left: 18.974365234375,
                  child: Text('12', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(4, 4, 21, 1),
                      fontFamily: 'SF Pro Display',
                      fontSize: 18,
                      letterSpacing: 0,
                      fontWeight: FontWeight.normal,
                      height: 1.5555555555555556
                  ),)
              ),
              const Positioned(
                  top: 22.703369140625,
                  left: 18.974365234375,
                  child: Text('Посещено', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(4, 4, 21, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 18,
                      letterSpacing: 0,
                      fontWeight: FontWeight.normal,
                      height: 1.3333333333333333
                  ),)
              ),
              Positioned(
                  top: 70,
                  left: 90,
                  child: Container(
                      width: 48,
                      height: 60,
                      decoration: BoxDecoration(),
                      child: Stack(
                          children: <Widget>[
                            Positioned(
                                top: 0,
                                left: 0,
                                child: Container(
                                    width: 48,
                                    height: 60,
                                    child: Stack(
                                        children: <Widget>[
                                          Positioned(
                                              top: 0,
                                              left: 0,
                                              child: SvgPicture.asset(
                                                  'assets/images/visited_places.svg',
                                                  semanticsLabel: 'visited_places'
                                              )
                                          )
                                        ]
                                    )
                                )
                            ),
                          ]
                      )
                  )
              ),
            ]
        )
    );
  }
}

class WalksWidget extends StatefulWidget {
  @override
  _WalksWidgetState createState() => _WalksWidgetState();
}

class _WalksWidgetState extends State<WalksWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 155,
        height: 141,

        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 0,
                  left: 0,
                  child: Container(
                      width: 155,
                      height: 141,
                      decoration: const BoxDecoration(
                        borderRadius : BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30),
                          bottomLeft: Radius.circular(30),
                          bottomRight: Radius.circular(30),
                        ),
                        color : Color.fromRGBO(255, 255, 255, 1),
                      )
                  )
              ),const Positioned(
                  top: 22.703369140625,
                  left: 18.974365234375,
                  child: Text('Совершено', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(4, 4, 21, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 18,
                      letterSpacing: 0,
                      fontWeight: FontWeight.normal,
                      height: 1.3333333333333333
                  ),)
              ),Positioned(
                  top: 70,
                  left: 70,
                  child: Container(
                      width: 60,
                      height: 60,
                      decoration: const BoxDecoration(
                        color : Color.fromRGBO(255, 255, 255, 1),
                      ),
                      child: Stack(
                          children: <Widget>[
                            Positioned(
                                top: 4,
                                left: 22,
                                child: SvgPicture.asset(
                                    'assets/images/walks.svg',
                                    semanticsLabel: 'walks'
                                )
                            ),
                          ]
                      )
                  )
              ),const Positioned(
                  top: 70.5,
                  left: 19,
                  child: Text('8', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(4, 4, 21, 1),
                      fontFamily: 'SF Pro Display',
                      fontSize: 18,
                      letterSpacing: 0,
                      fontWeight: FontWeight.normal,
                      height: 1.5555555555555556
                  ),)
              ),const Positioned(
                  top: 106,
                  left: 19,
                  child: Text('Прогулок', textAlign: TextAlign.left, style: TextStyle(
                      color: Color.fromRGBO(4, 4, 21, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 14,
                      letterSpacing: 0,
                      fontWeight: FontWeight.normal,
                      height: 1.1428571428571428
                  ),)
              ),
            ]
        )
    );
  }
}

class make_route_view_bg extends StatefulWidget{
  @override
  _make_route_view_bg createState() => _make_route_view_bg();
}

class _make_route_view_bg extends State<make_route_view_bg>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          borderRadius : const BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30),
          ),
          color : Color.fromRGBO(255, 255, 255, 1),
          border : Border.all(
            color: Color.fromRGBO(214, 214, 214, 1),
            width: 1,
          ),
        )
    );
  }
}

class main_start_button_2 extends StatefulWidget{
  @override
  _main_start_button_2_state createState() => _main_start_button_2_state();
}

class _main_start_button_2_state extends State<main_start_button_2>{
  @override
  Widget build(BuildContext context){
    return GestureDetector(
        onTap: () {
          Navigator.pop(context);
          Navigator.pushNamedAndRemoveUntil(context, '/makeroute', (route) => false);
          setState(() {
            _isElevated = !_isElevated;
          });
          print("DEBUG : onTap makeroute called.");
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

class main_start_button_icon_2 extends StatefulWidget{
  @override
  _main_start_button_icon_2_state createState() => _main_start_button_icon_2_state();
}

class _main_start_button_icon_2_state extends State<main_start_button_icon_2>{
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.pop(context);
        Navigator.pushNamedAndRemoveUntil(context, '/makeroute', (route) => false);
        setState(() {
          _isElevated = !_isElevated;
        });
        print("DEBUG : onTap makeroute called.");
      },
      child: SvgPicture.asset(
        'assets/images/start_icon.svg',
      ),
    );
  }
}

class from_route extends StatefulWidget{
  @override
  _from_route_state createState() => _from_route_state();
}

class _from_route_state extends State<from_route>{
  @override
  Widget build(BuildContext context) {

    return Container(
        width: 303,
        height: 57,

        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 10,
                  left: 22,
                  child: Text('Политехнический Университет', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(60, 60, 67, 0.6000000238418579),
                      fontFamily: 'SF Pro Text',
                      fontSize: 16,
                      letterSpacing: -0.40799999237060547,
                      fontWeight: FontWeight.normal,
                      height: 1.2941176470588236
                  ),
                  )
              ),Positioned(
                  top: 10,
                  left: 0,
                  child: SvgPicture.asset(
                      'assets/images/arrow.svg',
                      semanticsLabel: 'arrow',
                    color: Colors.green
                  )
              ),
            ]
        )
    );
  }
}

class to_route extends StatefulWidget{
  @override
  _to_route_state createState() => _to_route_state();
}

class _to_route_state extends State<to_route>{
  @override
  Widget build(BuildContext context) {

    return Container(
        width: 303,
        height: 57,

        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 35,
                  left: 22,
                  child: Text('Отель "Москва"', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(60, 60, 67, 0.6000000238418579),
                      fontFamily: 'SF Pro Text',
                      fontSize: 17,
                      letterSpacing: -0.40799999237060547,
                      fontWeight: FontWeight.normal,
                      height: 1.2941176470588236
                  ),
                  )
              ),Positioned(
                  top: 42,
                  left: 2,
                  child: SvgPicture.asset(
                    'assets/images/ellipse.svg',
                    semanticsLabel: 'ellipse',
                  )
              ),
            ]
        )
    );
  }
}

class additional_route extends StatefulWidget{
  @override
  _additional_route_state createState() => _additional_route_state();
}

class _additional_route_state extends State<additional_route>{
  @override
  Widget build(BuildContext context) {

    return Container(
        width: 303,
        height: 100,

        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 50,
                  left: 22,
                  child: Text('Зингер', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(60, 60, 67, 0.6000000238418579),
                      fontFamily: 'SF Pro Text',
                      fontSize: 17,
                      letterSpacing: -0.40799999237060547,
                      fontWeight: FontWeight.normal,
                      height: 1.2941176470588236
                  ),
                  )
              ),Positioned(
                  top: 55,
                  left: 2,
                  child: SvgPicture.asset(
                    'assets/images/ellipse_2.svg',
                    semanticsLabel: 'ellipse_2',
                    color: Colors.black,
                  )
              ),
            ]
        )
    );
  }
}

class separator extends StatefulWidget{
  @override
  _separator_state createState() => _separator_state();
}

class _separator_state extends State<separator>{
  @override
  Widget build(BuildContext context) {
    return Transform.rotate(
      angle: 1.4033419209422001e-14 * (math.pi / 180),
      child: const Divider(
          color: Color.fromRGBO(198, 198, 200, 1),
          thickness: 0.5
      )
      ,
    );
  }
}

class crossicon extends StatefulWidget{
  @override
  _crossicon_state createState() => _crossicon_state();
}

class _crossicon_state extends State<crossicon>{
  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
        'assets/images/crossicon.svg',
        semanticsLabel: 'crossicon'
    );
  }
}

class From_to_settings extends StatefulWidget {
  @override
  _From_to_settings_State createState() => _From_to_settings_State();
}

class _From_to_settings_State extends State<From_to_settings> {
  @override
  Widget build(BuildContext context) {
    return Container(
        width: double.infinity,
        height: double.infinity,
        child: Stack(
            children: [
              Container(
                alignment: Alignment.topCenter,
                child:from_route(),
              ),
              Container(
                alignment: Alignment.topCenter,
                padding: const EdgeInsets.only(top:30,right:20,left:20),
                child:separator(),
              ),
              Container(
                alignment: Alignment.topRight,
                padding: const EdgeInsets.only(top:10,right:25),
                child:crossicon(),
              ),
              Container(
                alignment: Alignment.topCenter,
                child:additional_route(),
              ),
              Container(
                alignment: Alignment.topCenter,
                padding: const EdgeInsets.only(top:70,right:20,left:20),
                child:separator(),
              ),
              Container(
                alignment: Alignment.topRight,
                padding: const EdgeInsets.only(top:50,right:25),
                child:crossicon(),
              ),
              Container(
                alignment: Alignment.topCenter,
                padding: const EdgeInsets.only(top:50),
                child:to_route(),
              ),
              Container(
                alignment: Alignment.topCenter,
                padding: const EdgeInsets.only(top:110,right:20,left:20),
                child:separator(),
              ),
              Container(
                alignment: Alignment.topRight,
                padding: const EdgeInsets.only(top:90,right:25),
                child:crossicon(),
              ),
        ]
    )
    );
  }
}

class change_time_or_km extends StatefulWidget{
  @override
  _change_time_or_km createState() => _change_time_or_km();
}

class _change_time_or_km extends State<change_time_or_km>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 352,
        height: 32,

        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 0,
                  left: 0,
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius : BorderRadius.only(
                        topLeft: Radius.circular(30),
                        topRight: Radius.circular(30),
                        bottomLeft: Radius.circular(30),
                        bottomRight: Radius.circular(30),
                      ),
                      color : Color.fromRGBO(242, 242, 242, 1),
                    ),
                    padding: EdgeInsets.symmetric(horizontal: 2, vertical: 2),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,

                      children: <Widget>[
                        Container(
                            width: 140,
                            height: 28,
                            decoration: BoxDecoration(
                              borderRadius : BorderRadius.only(
                                topLeft: Radius.circular(30),
                                topRight: Radius.circular(30),
                                bottomLeft: Radius.circular(30),
                                bottomRight: Radius.circular(30),
                              ),
                              boxShadow : [BoxShadow(
                                  color: Color.fromRGBO(0, 0, 0, 0.11999999731779099),
                                  offset: Offset(0,3),
                                  blurRadius: 8
                              )],
                              color : Color.fromRGBO(255, 255, 255, 1),
                              border : Border.all(
                                color: Color.fromRGBO(0, 0, 0, 1),
                                width: 0.5,
                              ),
                            ),
                            child: Stack(
                                children: <Widget>[
                                  Positioned(
                                      top: 5.999495506286621,
                                      left: 171,
                                      child: Container(
                                          width: 1,
                                          height: 15.99865436553955,
                                          decoration: BoxDecoration(
                                            borderRadius : BorderRadius.only(
                                              topLeft: Radius.circular(0.5),
                                              topRight: Radius.circular(0.5),
                                              bottomLeft: Radius.circular(0.5),
                                              bottomRight: Radius.circular(0.5),
                                            ),
                                            color : Color.fromRGBO(60, 60, 67, 0.36000001430511475),
                                          )
                                      )
                                  ),Positioned(
                                      top: 2,
                                      left: 25,
                                      child: Text('По времени', textAlign: TextAlign.center, style: TextStyle(
                                          decoration: TextDecoration.none,
                                          color: Color.fromRGBO(0, 0, 0, 1),
                                          fontFamily: 'SF Pro Text',
                                          fontSize: 15,
                                          letterSpacing: -0.5,
                                          fontWeight: FontWeight.normal,
                                          height: 1.3333333333333333
                                      ),)
                                  ),
                                ]
                            )
                        ), SizedBox(width : 0),
                        Container(
                            width: 135,
                            height: 28,
                            decoration: const BoxDecoration(
                              borderRadius : BorderRadius.only(
                                topLeft: Radius.circular(6.929999828338623),
                                topRight: Radius.circular(6.929999828338623),
                                bottomLeft: Radius.circular(6.929999828338623),
                                bottomRight: Radius.circular(6.929999828338623),
                              ),
                            ),
                            child: Stack(
                                children: <Widget>[
                                  Positioned(
                                      top: 5.999495506286621,
                                      left: 171,
                                      child: Container(
                                          width: 1,
                                          height: 15.99865436553955,
                                          decoration: const BoxDecoration(
                                            borderRadius : BorderRadius.only(
                                              topLeft: Radius.circular(0.5),
                                              topRight: Radius.circular(0.5),
                                              bottomLeft: Radius.circular(0.5),
                                              bottomRight: Radius.circular(0.5),
                                            ),
                                            color : Color.fromRGBO(60, 60, 67, 0.36000001430511475),
                                          )
                                      )
                                  ),const Positioned(
                                      top: 3,
                                      left: 15,
                                      child: Text('По расстоянию', textAlign: TextAlign.center, style: TextStyle(
                                          decoration: TextDecoration.none,
                                          color: Color.fromRGBO(0, 0, 0, 1),
                                          fontFamily: 'SF Pro Text',
                                          fontSize: 15,
                                          letterSpacing: -0.5,
                                          fontWeight: FontWeight.normal,
                                          height: 1.3333333333333333
                                      ),)
                                  ),
                                ]
                            )
                        ),

                      ],
                    ),
                  )
              ),
            ]
        )
    );
  }
}

class costyl_bg extends StatefulWidget{
  @override
  _costyl_bg_state createState() => _costyl_bg_state();
}

class _costyl_bg_state extends State<costyl_bg>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 89,
        height: 229,
        decoration: const BoxDecoration(
          borderRadius : BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30),
          ),
          color : Color.fromRGBO(242, 242, 242, 1),
        )
    );
  }
}

class buttons_reset_plus extends StatefulWidget {
  @override
  _buttons_reset_plus_State createState() => _buttons_reset_plus_State();
}

class _buttons_reset_plus_State extends State<buttons_reset_plus> {
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 330,
        height: 20,
        child: Stack(
            children: const <Widget>[
              Positioned(
                  top: 0,
                  left: 208,
                  child: Text('Сбросить', textAlign: TextAlign.center, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(142, 142, 147, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 15,
                      letterSpacing: -0.5,
                      fontWeight: FontWeight.normal,
                      height: 1.3333333333333333
                  ),)
              ),Positioned(
                  top: 0,
                  left: 0,
                  child: Text('Добавить', textAlign: TextAlign.center, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(142, 142, 147, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 15,
                      letterSpacing: -0.5,
                      fontWeight: FontWeight.normal,
                      height: 1.3333333333333333
                  ),)
              ),
            ]
        )
    );
  }
}

class time_change extends StatefulWidget {
  @override
  _time_change_State createState() => _time_change_State();
}

class _time_change_State extends State<time_change> {
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 352,
        height: 60,

        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 0,
                  left: 0,
                  child: Container(
                      width: 280,
                      height: 60,
                      decoration: BoxDecoration(
                        borderRadius : BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30),
                          bottomLeft: Radius.circular(30),
                          bottomRight: Radius.circular(30),
                        ),
                        color : Color.fromRGBO(242, 242, 242, 1),
                      )
                  )
              ),Positioned(
                  top: 20,
                  left: 40,
                  child: Text('02 ', textAlign: TextAlign.center, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(0, 0, 0, 0.4000000059604645),
                      fontFamily: 'SF Pro Text',
                      fontSize: 25,
                      letterSpacing: -0.5,
                      fontWeight: FontWeight.normal,
                      height: 0.8
                  ),)
              ),Positioned(
                  top: 20,
                  left: 90,
                  child: Text('ч.', textAlign: TextAlign.center, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(0, 0, 0, 0.4000000059604645),
                      fontFamily: 'SF Pro Text',
                      fontSize: 25,
                      letterSpacing: -0.5,
                      fontWeight: FontWeight.normal,
                      height: 0.8
                  ),)
              ),Positioned(
                  top: 20,
                  left: 160,
                  child: Text('15', textAlign: TextAlign.center, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(0, 0, 0, 0.4000000059604645),
                      fontFamily: 'SF Pro Text',
                      fontSize: 25,
                      letterSpacing: -0.5,
                      fontWeight: FontWeight.normal,
                      height: 0.8
                  ),)
              ),Positioned(
                  top: 20,
                  left: 200,
                  child: Text('мин.', textAlign: TextAlign.center, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(0, 0, 0, 0.4000000059604645),
                      fontFamily: 'SF Pro Text',
                      fontSize: 25,
                      letterSpacing: -0.5,
                      fontWeight: FontWeight.normal,
                      height: 0.8
                  ),)
              ),
            ]
        )
    );
  }
}

class check_mark_cafe extends StatefulWidget {
  @override
  _check_mark_cafe_state createState() => _check_mark_cafe_state();
}

class _check_mark_cafe_state extends State<check_mark_cafe> {
  Color _containerColor = Color(0xFF1BE07C);
  Border _containerBorder = Border.all(color: Colors.white, width: 0);
  static const mark = 1;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
          width: 20,
          height: 20,

          child: Stack(
              children: <Widget>[
                Positioned(
                    top: 0,
                    left: 0,
                    child: Ink(
                        child: InkWell(
                          child: Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                color : _containerColor,
                                border : _containerBorder,
                                borderRadius : BorderRadius.all(Radius.elliptical(20, 20)),
                              )
                          ),
                          onTap: () {
                            setState(() {
                              _containerColor = _containerColor == Colors.white ?
                              Color(0xFF1BE07C) :
                              Colors.white;
                              _containerBorder = _containerBorder == Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1) ?
                              Border.all(color: Colors.white, width: 0) :
                              Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1);
                            });
                          },
                        )
                    )

                ),Positioned(
                    top: 6,
                    left: 4,
                    child: SvgPicture.asset(
                        'assets/images/check_mark.svg',
                        semanticsLabel: 'check_mark'
                    )
                ),
              ]
          )
      ),
    );
  }
}

class check_mark_history extends StatefulWidget {
  @override
  _check_mark_history_state createState() => _check_mark_history_state();
}

class _check_mark_history_state extends State<check_mark_history> {
  Color _containerColor = Color(0xFF1BE07C);
  Border _containerBorder = Border.all(color: Colors.white, width: 0);
  static const mark = 1;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
          width: 20,
          height: 20,

          child: Stack(
              children: <Widget>[
                Positioned(
                    top: 0,
                    left: 0,
                    child: Ink(
                        child: InkWell(
                          child: Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                color : _containerColor,
                                border : _containerBorder,
                                borderRadius : BorderRadius.all(Radius.elliptical(20, 20)),
                              )
                          ),
                          onTap: () {
                            setState(() {
                              _containerColor = _containerColor == Colors.white ?
                              Color(0xFF1BE07C) :
                              Colors.white;
                              _containerBorder = _containerBorder == Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1) ?
                              Border.all(color: Colors.white, width: 0) :
                              Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1);
                            });
                          },
                        )
                    )

                ),Positioned(
                    top: 6,
                    left: 4,
                    child: SvgPicture.asset(
                        'assets/images/check_mark.svg',
                        semanticsLabel: 'check_mark'
                    )
                ),
              ]
          )
      ),
    );
  }
}

class check_mark_mall extends StatefulWidget {
  @override
  _check_mark_mall_state createState() => _check_mark_mall_state();
}

class _check_mark_mall_state extends State<check_mark_mall> {
  Color _containerColor = Color(0xFF1BE07C);
  Border _containerBorder = Border.all(color: Colors.white, width: 0);
  static const mark = 1;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
          width: 20,
          height: 20,

          child: Stack(
              children: <Widget>[
                Positioned(
                    top: 0,
                    left: 0,
                    child: Ink(
                        child: InkWell(
                          child: Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                color : _containerColor,
                                border : _containerBorder,
                                borderRadius : BorderRadius.all(Radius.elliptical(20, 20)),
                              )
                          ),
                          onTap: () {
                            setState(() {
                              _containerColor = _containerColor == Colors.white ?
                              Color(0xFF1BE07C) :
                              Colors.white;
                              _containerBorder = _containerBorder == Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1) ?
                              Border.all(color: Colors.white, width: 0) :
                              Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1);
                            });
                          },
                        )
                    )

                ),Positioned(
                    top: 6,
                    left: 4,
                    child: SvgPicture.asset(
                        'assets/images/check_mark.svg',
                        semanticsLabel: 'check_mark'
                    )
                ),
              ]
          )
      ),
    );
  }
}

class check_mark_parks extends StatefulWidget {
  @override
  _check_mark_parks_state createState() => _check_mark_parks_state();
}

class _check_mark_parks_state extends State<check_mark_parks> {
  Color _containerColor = Color(0xFF1BE07C);
  Border _containerBorder = Border.all(color: Colors.white, width: 0);
  static const mark = 1;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
          width: 20,
          height: 20,

          child: Stack(
              children: <Widget>[
                Positioned(
                    top: 0,
                    left: 0,
                    child: Ink(
                        child: InkWell(
                          child: Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                color : _containerColor,
                                border : _containerBorder,
                                borderRadius : BorderRadius.all(Radius.elliptical(20, 20)),
                              )
                          ),
                          onTap: () {
                            setState(() {
                              _containerColor = _containerColor == Colors.white ?
                              Color(0xFF1BE07C) :
                              Colors.white;
                              _containerBorder = _containerBorder == Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1) ?
                              Border.all(color: Colors.white, width: 0) :
                              Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1);
                            });
                          },
                        )
                    )

                ),Positioned(
                    top: 6,
                    left: 4,
                    child: SvgPicture.asset(
                        'assets/images/check_mark.svg',
                        semanticsLabel: 'check_mark'
                    )
                ),
              ]
          )
      ),
    );
  }
}

class check_mark_monuments extends StatefulWidget {
  @override
  _check_mark_monuments_state createState() => _check_mark_monuments_state();
}

class _check_mark_monuments_state extends State<check_mark_monuments> {
  Color _containerColor = Color(0xFF1BE07C);
  Border _containerBorder = Border.all(color: Colors.white, width: 0);
  static const mark = 1;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
          width: 20,
          height: 20,

          child: Stack(
              children: <Widget>[
                Positioned(
                    top: 0,
                    left: 0,
                    child: Ink(
                        child: InkWell(
                          child: Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                color : _containerColor,
                                border : _containerBorder,
                                borderRadius : BorderRadius.all(Radius.elliptical(20, 20)),
                              )
                          ),
                          onTap: () {
                            setState(() {
                              _containerColor = _containerColor == Colors.white ?
                              Color(0xFF1BE07C) :
                              Colors.white;
                              _containerBorder = _containerBorder == Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1) ?
                              Border.all(color: Colors.white, width: 0) :
                              Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1);
                            });
                          },
                        )
                    )

                ),Positioned(
                    top: 6,
                    left: 4,
                    child: SvgPicture.asset(
                        'assets/images/check_mark.svg',
                        semanticsLabel: 'check_mark'
                    )
                ),
              ]
          )
      ),
    );
  }
}

class check_mark_art extends StatefulWidget {
  @override
  _check_mark_art_state createState() => _check_mark_art_state();
}

class _check_mark_art_state extends State<check_mark_art> {
  Color _containerColor = Color(0xFF1BE07C);
  Border _containerBorder = Border.all(color: Colors.white, width: 0);
  static const mark = 1;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
          width: 20,
          height: 20,

          child: Stack(
              children: <Widget>[
                Positioned(
                    top: 0,
                    left: 0,
                    child: Ink(
                        child: InkWell(
                          child: Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                color : _containerColor,
                                border : _containerBorder,
                                borderRadius : BorderRadius.all(Radius.elliptical(20, 20)),
                              )
                          ),
                          onTap: () {
                            setState(() {
                              _containerColor = _containerColor == Colors.white ?
                              Color(0xFF1BE07C) :
                              Colors.white;
                              _containerBorder = _containerBorder == Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1) ?
                              Border.all(color: Colors.white, width: 0) :
                              Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1);
                            });
                          },
                        )
                    )

                ),Positioned(
                    top: 6,
                    left: 4,
                    child: SvgPicture.asset(
                        'assets/images/check_mark.svg',
                        semanticsLabel: 'check_mark'
                    )
                ),
              ]
          )
      ),
    );
  }
}

class check_mark_popular extends StatefulWidget {
  @override
  _check_mark_popular_state createState() => _check_mark_popular_state();
}

class _check_mark_popular_state extends State<check_mark_popular> {
  Color _containerColor = Color(0xFF1BE07C);
  Border _containerBorder = Border.all(color: Colors.white, width: 0);
  static const mark = 1;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Container(
          child: Stack(
              children: <Widget>[
                Positioned(
                    top: 0,
                    left: 0,
                    child: Ink(
                      color:Colors.transparent,
                        child: InkWell(
                          child: Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                color : _containerColor,
                                border : _containerBorder,
                                borderRadius : BorderRadius.all(Radius.elliptical(20, 20)),
                              )
                          ),
                          onTap: () {
                            setState(() {
                              _containerColor = _containerColor == Colors.white ?
                              Color(0xFF1BE07C) :
                              Colors.white;
                              _containerBorder = _containerBorder == Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1) ?
                              Border.all(color: Colors.white, width: 0) :
                              Border.all(color: Color.fromRGBO(214, 214, 214, 1), width: 1);
                            });
                          },
                        )
                    )

                ),Positioned(
                    top: 6,
                    left: 4,
                    child: SvgPicture.asset(
                        'assets/images/check_mark.svg',
                        semanticsLabel: 'check_mark'
                    )
                ),
              ]
          )
      ),
    );
  }
}

class choice_places_bg extends StatefulWidget{
  @override
  _choice_places_bg_state createState() => _choice_places_bg_state();
}

class _choice_places_bg_state extends State<choice_places_bg>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 353,
        height: 229,
        decoration: BoxDecoration(
          borderRadius : BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30),
          ),
          color : Color.fromRGBO(242, 242, 242, 1),
        )
    );
  }
}

class types_object extends StatefulWidget {
  @override
  _types_object_state createState() => _types_object_state();
}

class _types_object_state extends State<types_object> {
  @override
  Widget build(BuildContext context) {

    return Container(
        width: 286,
        height: 200,

        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 180,
                  left: 0,
                  child: Text('Популярные места', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(52, 52, 52, 1),
                      fontFamily: 'Outfit',
                      fontSize: 16,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),Positioned(
                  top: 60,
                  left: 0,
                  child: Text('Торговые центры', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(52, 52, 52, 1),
                      fontFamily: 'Outfit',
                      fontSize: 16,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),Positioned(
                  top: 30,
                  left: 0,
                  child: Text('Исторические здания', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(52, 52, 52, 1),
                      fontFamily: 'Outfit',
                      fontSize: 16,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),Positioned(
                  top: 0,
                  left: 0,
                  child: Text('Кафе и рестораны', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(52, 52, 52, 1),
                      fontFamily: 'Outfit',
                      fontSize: 16,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),Positioned(
                  top: 90,
                  left: 0,
                  child: Text('Парки и скверы', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(52, 52, 52, 1),
                      fontFamily: 'Outfit',
                      fontSize: 16,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),Positioned(
                  top: 120,
                  left: 0,
                  child: Text('Памятники культуры', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(52, 52, 52, 1),
                      fontFamily: 'Outfit',
                      fontSize: 16,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),Positioned(
                  top: 150,
                  left: 0,
                  child: Text('Современные арт-объекты', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(52, 52, 52, 1),
                      fontFamily: 'Outfit',
                      fontSize: 16,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112,
                  ),)
              ),
            ]
        )
    );
  }
}

class choice_places extends StatefulWidget{
  @override
  _choice_places_state createState() => _choice_places_state();
}

class _choice_places_state extends State<choice_places>{
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          alignment: Alignment.topCenter,
          child:choice_places_bg(),
        ),
        Container(
          alignment: Alignment.topLeft,
          padding: const EdgeInsets.only(top:15,left: 20),
          child:types_object(),
        ),
        Container(
          alignment: Alignment.topLeft,
          padding: const EdgeInsets.only(top:15,left: 240),
          child:check_mark_cafe(),
        ),
        Container(
          alignment: Alignment.topLeft,
          padding: const EdgeInsets.only(top:45,left: 240),
          child:check_mark_history(),
        ),
        Container(
          alignment: Alignment.topLeft,
          padding: const EdgeInsets.only(top:75,left: 240),
          child:check_mark_mall(),
        ),
        Container(
          alignment: Alignment.topLeft,
          padding: const EdgeInsets.only(top:105,left: 240),
          child:check_mark_parks(),
        ),
        Container(
          alignment: Alignment.topLeft,
          padding: const EdgeInsets.only(top:135,left: 240),
          child:check_mark_monuments(),
        ),
        Container(
          alignment: Alignment.topLeft,
          padding: const EdgeInsets.only(top:165,left: 240),
          child:check_mark_art(),
        ),
        Container(
          alignment: Alignment.topLeft,
          padding: const EdgeInsets.only(top:195,left: 240),
          child:check_mark_popular(),
        ),
      ],
    );
  }

}

class make_route_button extends StatefulWidget{
  @override
  _make_route_button_state createState() => _make_route_button_state();
}

class _make_route_button_state extends State<make_route_button>{
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: () {
          Navigator.pop(context);
          Navigator.pushNamedAndRemoveUntil(context, '/choose_route', (route) => false);
        },
        child: Container(
            width: 285,
            height: 50,

            child: Stack(
                children: <Widget>[
                  Positioned(
                      top: 0,
                      left: 0,
                      child: Container(
                          width: 225,
                          height: 50,
                          decoration: const BoxDecoration(
                            borderRadius : BorderRadius.only(
                              topLeft: Radius.circular(30),
                              topRight: Radius.circular(30),
                              bottomLeft: Radius.circular(30),
                              bottomRight: Radius.circular(30),
                            ),
                            color : Color.fromRGBO(27, 224, 124, 1),
                          )
                      )
                  ),const Positioned(
                      top: 17,
                      left: 8,
                      child: Text('Построить маршрут', textAlign: TextAlign.center, style: TextStyle(
                          decoration: TextDecoration.none,
                          color: Color.fromRGBO(255, 255, 255, 1),
                          fontFamily: 'Outfit',
                          fontSize: 22,
                          letterSpacing: 0,
                          fontWeight: FontWeight.normal,
                          height: 0.8
                      ),)
                  ),
                ]
            )
        )
    );
  }
}

class return_button extends StatefulWidget{
  @override
  _return_button_state createState() => _return_button_state();
}

class _return_button_state extends State<return_button>{
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.pop(context);
        Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
      },
      child: SvgPicture.asset(
        'assets/images/return.svg',
      ),
    );
  }
}

class settings_route extends StatefulWidget{
  @override
  _settings_route_state createState() => _settings_route_state();
}

class _settings_route_state extends State<settings_route>{
  @override
  Widget build(BuildContext context){
    return Stack(
      children: [
        Container(
          alignment: Alignment.topCenter,
          child:make_route_view_bg(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(top:20,left: 20),
          child:From_to_settings(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(top:150,left: 20,right:20),
          child:buttons_reset_plus(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(top:180,left: 20,right:20),
          child:change_time_or_km(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(top:220,left: 20,right:20),
          child:time_change(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(top:290,left: 20,right:20),
          child:choice_places(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(top:525,left: 75,right:20),
          child:make_route_button(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(top:540,left: 20,right:260),
          child:return_button(),
        ),
      ],
    );
  }
}

class first_route extends StatefulWidget{
  @override
  _first_route_state createState() => _first_route_state();
}

class _first_route_state extends State<first_route>{
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: () {

          Navigator.pop(context);
          Navigator.pushNamedAndRemoveUntil(context, '/stats', (route) => false);

        },
        child: Container(
            width: 380,
            height: 217,
            child: Stack(
                children: <Widget>[
                  Positioned(
                      top: 14,
                      left: 8,
                      child: Container(
                          width: 150,
                          height: 58,
                          decoration: BoxDecoration(
                            borderRadius : BorderRadius.only(
                              topLeft: Radius.circular(30),
                              topRight: Radius.circular(30),
                              bottomLeft: Radius.circular(30),
                              bottomRight: Radius.circular(30),
                            ),
                            color : Color.fromRGBO(255, 255, 255, 1),
                            border : Border.all(
                              color: Color.fromRGBO(27, 224, 124, 1),
                              width: 3,
                            ),
                          )
                      )
                  ),Positioned(
                      top: 29,
                      left: 22,
                      child: Container(
                          width: 10,
                          height: 28,
                          decoration: BoxDecoration(
                            borderRadius : BorderRadius.only(
                              topLeft: Radius.circular(20),
                              topRight: Radius.circular(20),
                              bottomLeft: Radius.circular(20),
                              bottomRight: Radius.circular(20),
                            ),
                            color : Color.fromRGBO(24, 174, 182, 1),
                          )
                      )
                  ),Positioned(
                      top: 33,
                      left: 35,
                      child: Text('14,9 км', textAlign: TextAlign.left, style: TextStyle(
                          decoration: TextDecoration.none,
                          color: Color.fromRGBO(0, 0, 0, 1),
                          fontFamily: 'SF Pro Text',
                          fontSize: 18,
                          letterSpacing: -0.23999999463558197,
                          fontWeight: FontWeight.normal,
                          height: 1.1111111111111112
                      ),)
                  ),Positioned(
                      top: 35,
                      left: 100,
                      child: Text('(2ч 40 мин)', textAlign: TextAlign.left, style: TextStyle(
                          decoration: TextDecoration.none,
                          color: Color.fromRGBO(0, 0, 0, 0.550000011920929),
                          fontFamily: 'SF Pro Text',
                          fontSize: 10,
                          letterSpacing: -0.23999999463558197,
                          fontWeight: FontWeight.normal,
                          height: 1.6666666666666667
                      ),)
                  ),
                ]
            )
        )
    );
  }
}

class second_route extends StatefulWidget{
  @override
  _second_route_state createState() => _second_route_state();
}

class _second_route_state extends State<second_route>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 178,
        height: 120,

        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 14,
                  left: 8,
                  child: Container(
                      width: 150,
                      height: 58,
                      decoration: BoxDecoration(
                        borderRadius : BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30),
                          bottomLeft: Radius.circular(30),
                          bottomRight: Radius.circular(30),
                        ),
                        color : Color.fromRGBO(242, 242, 242, 1),
                      )
                  )
              ),Positioned(
                  top: 29,
                  left: 22,
                  child: Container(
                      width: 10,
                      height: 28,
                      decoration: BoxDecoration(
                        borderRadius : BorderRadius.only(
                          topLeft: Radius.circular(20),
                          topRight: Radius.circular(20),
                          bottomLeft: Radius.circular(20),
                          bottomRight: Radius.circular(20),
                        ),
                        color : Color.fromRGBO(250, 61, 61, 0.6899999976158142),
                      )
                  )
              ),Positioned(
                  top: 33,
                  left: 35,
                  child: Text('17,7 км', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 18,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),Positioned(
                  top: 35,
                  left: 100,
                  child: Text('(3ч 18 мин)', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(0, 0, 0, 0.550000011920929),
                      fontFamily: 'SF Pro Text',
                      fontSize: 10,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.6666666666666667
                  ),)
              ),
            ]
        )
    );
  }
}

class third_route extends StatefulWidget{
  @override
  _third_route_state createState() => _third_route_state();
}

class _third_route_state extends State<third_route>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 178,
        height: 120,

        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 14,
                  left: 8,
                  child: Container(
                      width: 150,
                      height: 58,
                      decoration: BoxDecoration(
                        borderRadius : BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30),
                          bottomLeft: Radius.circular(30),
                          bottomRight: Radius.circular(30),
                        ),
                        color : Color.fromRGBO(242, 242, 242, 1),
                      )
                  )
              ),Positioned(
                  top: 29,
                  left: 22,
                  child: Container(
                      width: 10,
                      height: 28,
                      decoration: BoxDecoration(
                        borderRadius : BorderRadius.only(
                          topLeft: Radius.circular(20),
                          topRight: Radius.circular(20),
                          bottomLeft: Radius.circular(20),
                          bottomRight: Radius.circular(20),
                        ),
                        color : Color.fromRGBO(251, 143, 29, 1),
                      )
                  )
              ),Positioned(
                  top: 33,
                  left: 40,
                  child: Text('7,1 км', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 18,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),Positioned(
                  top: 35,
                  left: 95,
                  child: Text('(1 ч 15 мин)', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(0, 0, 0, 0.550000011920929),
                      fontFamily: 'SF Pro Text',
                      fontSize: 10,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.6666666666666667
                  ),)
              ),
            ]
        )
    );
  }
}

class fourth_route extends StatefulWidget{
  @override
  _fourth_route_state createState() => _fourth_route_state();
}

class _fourth_route_state extends State<fourth_route>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 178,
        height: 120,

        child: Stack(
            children: <Widget>[
              Positioned(
                  top: 14,
                  left: 8,
                  child: Container(
                      width: 150,
                      height: 58,
                      decoration: BoxDecoration(
                        borderRadius : BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30),
                          bottomLeft: Radius.circular(30),
                          bottomRight: Radius.circular(30),
                        ),
                        color : Color.fromRGBO(242, 242, 242, 1),
                      )
                  )
              ),Positioned(
                  top: 29,
                  left: 22,
                  child: Container(
                      width: 10,
                      height: 28,
                      decoration: BoxDecoration(
                        borderRadius : BorderRadius.only(
                          topLeft: Radius.circular(20),
                          topRight: Radius.circular(20),
                          bottomLeft: Radius.circular(20),
                          bottomRight: Radius.circular(20),
                        ),
                        color : Color.fromRGBO(0, 122, 254, 1),
                      )
                  )
              ),Positioned(
                  top: 33,
                  left: 35,
                  child: Text('12,3 км', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(0, 0, 0, 1),
                      fontFamily: 'SF Pro Text',
                      fontSize: 18,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.1111111111111112
                  ),)
              ),Positioned(
                  top: 35,
                  left: 98,
                  child: Text('(1 ч 42 мин)', textAlign: TextAlign.left, style: TextStyle(
                      decoration: TextDecoration.none,
                      color: Color.fromRGBO(0, 0, 0, 0.550000011920929),
                      fontFamily: 'SF Pro Text',
                      fontSize: 10,
                      letterSpacing: -0.23999999463558197,
                      fontWeight: FontWeight.normal,
                      height: 1.6666666666666667
                  ),)
              ),
            ]
        )
    );
  }
}

class choose_route_menu_bg extends StatefulWidget{
  @override
  _choose_route_menu_bg_state createState() => _choose_route_menu_bg_state();
}

class _choose_route_menu_bg_state extends State<choose_route_menu_bg>{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 380,
        height: 160,
        decoration: BoxDecoration(
          borderRadius : BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30),
          ),
          color : Color.fromRGBO(255, 255, 255, 1),
        )
    );
  }
}

class choose_route_menu extends StatefulWidget{
  @override
  _choose_route_menu_state createState() => _choose_route_menu_state();
}

class _choose_route_menu_state extends State<choose_route_menu>{
  @override
  Widget build(BuildContext context){
    return Stack(
      children: [
        Container(
          alignment: Alignment.topCenter,
          child:choose_route_menu_bg(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(),
          child:first_route(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(left: 152, right:0),
          child:second_route(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(top:70,right:150),
          child:third_route(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(left: 152, top:70),
          child:fourth_route(),
        )
      ],
    );
  }
}