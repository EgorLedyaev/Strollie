import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'plugins.dart';

class up_box_info extends StatefulWidget{
  @override
  _up_box_info_state createState() => _up_box_info_state();
}

class _up_box_info_state extends State<up_box_info>{
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

class first_box_stats_info extends StatefulWidget{
  @override
  _first_box_stats_info createState() => _first_box_stats_info();
}

class _first_box_stats_info extends State<first_box_stats_info>{
  @override
  Widget build(BuildContext context) {
    return Stack(
        children: <Widget>[
          Container(
            alignment: Alignment.topLeft,
            child:steps_info(),
          ),
          Container(
            alignment: Alignment.topRight,
            padding: const EdgeInsets.only(top:0,left: 165),
            child:distance_info(),
          ),
        ]
    );
  }
}


class second_box_stats_info extends StatefulWidget{
  @override
  _second_box_stats_info createState() => _second_box_stats_info();
}

class _second_box_stats_info extends State<second_box_stats_info>{
  @override
  Widget build(BuildContext context) {
    return Stack(
        children: <Widget>[
          Container(
            alignment: Alignment.topLeft,
            child:VisitedWidget(),
          ),
          Container(
            alignment: Alignment.topRight,
            padding: const EdgeInsets.only(top:0,left: 165),
            child:WalksWidget(),
          ),
        ]
    );
  }
}


class StatsScreen extends StatefulWidget{
  const StatsScreen({Key? key}) : super(key: key);
  @override
  _StatsScreenState createState() => _StatsScreenState();
}

class _StatsScreenState extends State<StatsScreen> with SingleTickerProviderStateMixin{
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: null,
      body: Container(
        height: (MediaQuery.of(context).size.height),
        width: MediaQuery.of(context).size.width,
        color: Color(0xE0FFFFFF),
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
                          child:up_box_info(),
                        ),
                        Container(
                          alignment: Alignment.topCenter,
                          padding: const EdgeInsets.only(top:8),
                          child:first_box_stats_info(),
                        ),
                        Container(
                          alignment: Alignment.topCenter,
                          padding: const EdgeInsets.only(top:8),
                          child:ScorepointsWidget(),
                        ),
                        Container(
                          alignment: Alignment.topCenter,
                          padding: const EdgeInsets.only(top:8),
                          child:second_box_stats_info(),
                        )
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
              left: 70.0,
              child: Container(
                alignment: Alignment.bottomCenter,
                child: profile_button_icon(),
              ),
            ),
            Positioned(
              bottom: 50.0,
              right: 40.0,
              child: Container(
                alignment: Alignment.bottomCenter,
                child: stats_menu_icon(),
              ),
            ),

          ],
        ),
      ),
    );
  }

}