import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'dart:math' as math;import 'dart:math' as math;

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
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
            bottomLeft: Radius.circular(24),
            bottomRight: Radius.circular(24),
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
          border : Border.all(
            color: Color(0x40040415),
            width: 1.5,
          ),
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
    // Figma Flutter Generator Group20Widget - GROUP

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
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
            bottomLeft: Radius.circular(24),
            bottomRight: Radius.circular(24),
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
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
            bottomLeft: Radius.circular(24),
            bottomRight: Radius.circular(24),
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
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
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
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
            bottomLeft: Radius.circular(24),
            bottomRight: Radius.circular(24),
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
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
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
                      color: Color.fromRGBO(0, 0, 0, 1),
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
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
            bottomLeft: Radius.circular(24),
            bottomRight: Radius.circular(24),
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
                          topLeft: Radius.circular(24),
                          topRight: Radius.circular(24),
                          bottomLeft: Radius.circular(24),
                          bottomRight: Radius.circular(24),
                        ),
                        color : Color.fromRGBO(255, 255, 255, 1),
                      )
                  )
              ),Positioned(
                  top: 0,
                  left: 0,
                  child: SvgPicture.asset(
                      'assets/images/score.svg',
                      semanticsLabel: 'score',
                    color: Colors.green,
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
                          topLeft: Radius.circular(24),
                          topRight: Radius.circular(24),
                          bottomLeft: Radius.circular(24),
                          bottomRight: Radius.circular(24),
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
                      decoration: BoxDecoration(
                        borderRadius : BorderRadius.only(
                          topLeft: Radius.circular(24),
                          topRight: Radius.circular(24),
                          bottomLeft: Radius.circular(24),
                          bottomRight: Radius.circular(24),
                        ),
                        color : Color.fromRGBO(255, 255, 255, 1),
                      )
                  )
              ),Positioned(
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
                      decoration: BoxDecoration(
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
              ),Positioned(
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