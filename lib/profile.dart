import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'plugins.dart';



class first_up_box_inf extends StatefulWidget{
  @override
  _first_up_box_inf createState() => _first_up_box_inf();
}

class _first_up_box_inf extends State<first_up_box_inf> with SingleTickerProviderStateMixin{
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        Container(
          alignment: Alignment.topCenter,
          child:first_bg_box_profile(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(top:10,left: 10),
          child:profile_img(),
        ),
        Container(
          alignment: Alignment.topRight,
          padding: const EdgeInsets.only(top:20,right: 10),
          child:settings_profile_bt(),
        ),
        Container(
          alignment: Alignment.topRight,
          padding: const EdgeInsets.only(top:33,right: 24),
          child:settngs_profile_bt_icon(),
        ),
        Container(
          alignment: Alignment.topLeft,
          padding: const EdgeInsets.only(top:33,left: 100),
          child:inf_profile_up_box(),
        ),

    ]
    );
  }
}

class second_up_box_inf extends StatefulWidget{
  @override
  _second_up_box_inf createState() => _second_up_box_inf();
}

class _second_up_box_inf extends State<second_up_box_inf> with SingleTickerProviderStateMixin{
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        Container(
          alignment: Alignment.topCenter,
          child:second_bg_box_profile(),
        ),
        Container(
          alignment: Alignment.topLeft,
          padding: const EdgeInsets.only(top:15,left: 15),
          child:full_inf_profile_box(),
        ),
    ]
    );
  }
}

class first_route_inf extends StatefulWidget{
  @override
  _first_route_inf createState() => _first_route_inf();
}

class _first_route_inf extends State<first_route_inf> with SingleTickerProviderStateMixin{
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 380,
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

class second_route_inf extends StatefulWidget{
  @override
  _second_route_inf createState() => _second_route_inf();
}

class _second_route_inf extends State<second_up_box_inf> with SingleTickerProviderStateMixin{
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    throw UnimplementedError();
  }
}


class ProfileScreen extends StatefulWidget{
  const ProfileScreen({Key? key}) : super(key: key);
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with SingleTickerProviderStateMixin{
  @override
  Widget build(BuildContext context){
    return Stack(
      children: <Widget>[
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(top:35,left: 20,right:20),
          child:first_up_box_inf(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(top:150,left: 20,right:20),
          child:second_up_box_inf(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(top:282,left: 20,right:20),
          child:first_route_inf(),
        ),
        Container(
          alignment: Alignment.bottomCenter,
          padding: const EdgeInsets.only(bottom:25,left: 20,right:20),
          child: nav_menu(),
        ),
        Container(
          alignment: Alignment.bottomCenter,
          padding: const EdgeInsets.only(bottom:32,left: 20,right:20),
          child: main_start_button(),
        ),
        Container(
          alignment: Alignment.bottomCenter,
          padding: const EdgeInsets.only(bottom:56,left: 20,right:20),
          child: main_start_button_icon(),
        ),
        Container(
          alignment: Alignment.bottomCenter,
          padding: const EdgeInsets.only(bottom:50,right: 200),
          child: profile_button_icon(),
        ),
        Container(
          alignment: Alignment.bottomCenter,
          padding: const EdgeInsets.only(bottom:48,left:200),
          child: stats_button_icon(),
        ),
        /// сюда нужно будет добавить контейнер с нижним меню, а также с кнопкой посмотреть остальные маршруты
      ],
    );
  }
  
}