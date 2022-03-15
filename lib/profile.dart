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
    return Stack(
        children: <Widget>[
          Container(
            alignment: Alignment.topCenter,
            child:first_inf_route_box(),
          ),
          Container(
            alignment: Alignment.topLeft,
            child:first_inf_route_pic(),
          ),

        ]
    );
  }
}

class second_route_inf extends StatefulWidget{
  @override
  _second_route_inf_state createState() => _second_route_inf_state();
}

class _second_route_inf_state extends State<second_route_inf> with SingleTickerProviderStateMixin{
  @override
  Widget build(BuildContext context) {
    return Stack(
        children: <Widget>[
          Container(
            alignment: Alignment.topCenter,
            child:second_inf_route_box(),
          ),
          Container(
            alignment: Alignment.topLeft,
            child:second_inf_route_pic(),
          ),
        ]
    );
  }
}


class ProfileScreen extends StatefulWidget{
  const ProfileScreen({Key? key}) : super(key: key);
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with SingleTickerProviderStateMixin{
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: null,
      body: Container(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        color: Color(0xF0FFFFFF),
        child: Stack(
          alignment: Alignment.center,
          children: [
            Positioned(
              top: 0,
              left: 20,
              right:20,
              child: Container(
                width: MediaQuery.of(context).size.width,
                height:  MediaQuery.of(context).size.height,
                child: Padding(
                  padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
                  child: SingleChildScrollView(
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          alignment: Alignment.topCenter,
                          padding: const EdgeInsets.only(top:35),
                          child:first_up_box_inf(),
                        ),
                        Container(
                          alignment: Alignment.topCenter,
                          padding: const EdgeInsets.only(top:10),
                          child:second_up_box_inf(),
                        ),
                        Container(
                          alignment: Alignment.topCenter,
                          padding: const EdgeInsets.only(top:10),
                          child:first_route_inf(),
                        ),
                        Container(
                          alignment: Alignment.topCenter,
                          padding: const EdgeInsets.only(top:10),
                          child:second_route_inf(),
                        ),
                        Container(
                          alignment: Alignment.topCenter,
                          padding: const EdgeInsets.only(top:10),
                          child:first_route_inf(),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            Positioned(
              bottom: 25.0,
              left: 20.0,
              right: 20.0,
              child: Container(
                alignment: Alignment.bottomCenter,
                child: nav_menu(),
              ),
            ),
            Positioned(
              bottom: 32.0,
              left: 20.0,
              right: 20.0,
              child: Container(
                alignment: Alignment.bottomCenter,
                child: main_start_button(),
              ),
            ),
            Positioned(
              bottom: 56.0,
              left: 20.0,
              right: 20.0,
              child: Container(
                alignment: Alignment.bottomCenter,
                child: main_start_button_icon(),
              ),
            ),
            Positioned(
              bottom: 50.0,
              left: 50.0,
              child: Container(
                alignment: Alignment.bottomCenter,
                child: profile_menu_icon(),
              ),
            ),
            Positioned(
              bottom: 50.0,
              right: 66.0,
              child: Container(
                alignment: Alignment.bottomCenter,
                child: stats_button_icon(),
              ),
            ),

          ],
        ),
      ),
    );
  }

}