import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

void main() => runApp(Strollie());

const bg_color_green = const Color(0xFF1BE07C);

class Strollie extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return MaterialApp(
      home: Main_screen(),
    );
  }
}

class Main_screen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Strolly',
      debugShowCheckedModeBanner: true, // плашка дебага
      theme: ThemeData(
        primaryColor: Colors.transparent,
      ),
      home: MapScreen(),
    );
  }
}

class google_map_page extends StatelessWidget{
  static const _initialCameraPosition = CameraPosition(
    target: LatLng(53.228992, 50.199425),
    zoom: 16,
  );

  @override
  Widget build(BuildContext context){
    return const Scaffold(
      body: GoogleMap(
        myLocationButtonEnabled: false,
        zoomControlsEnabled: false,
        initialCameraPosition: _initialCameraPosition,
      ),
    );
  }
}

class MapScreen extends StatefulWidget {
  const MapScreen({Key? key}) : super(key: key);

  @override
  _MapScreenState createState() => _MapScreenState();
}

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
        maxWidth: 500,
        maxHeight: 90,
      ),
        decoration: const BoxDecoration(
          borderRadius : BorderRadius.all(Radius.circular(40)),
          color : Color.fromRGBO(255, 255, 255, 1),
        )
    );
  }
}

class search_bar extends StatefulWidget{
  const search_bar({Key? key}) : super(key: key);
  @override
  _search_bar_state createState() => _search_bar_state();

}
class _search_bar_state extends State<search_bar>{
  late TextEditingController _textController;
  @override
  void initState() {
    super.initState();
    _textController = TextEditingController(text: 'initial text');
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoSearchTextField(controller: _textController);
  }

}

class profile_img_bar extends StatefulWidget{
  @override
  _profile_img_bar_state createState() => _profile_img_bar_state();
}

class _profile_img_bar_state extends State<profile_img_bar>{
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(0.8),
      child : Row(
        children: <Widget>[
          Padding(
              padding: EdgeInsets.all(0),
            child: ClipRRect(
              borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(30),
                  bottomLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                  bottomRight: Radius.circular(30)),
              child:
              Image.network(
                'https://sun3-9.userapi.com/s/v1/ig2/qFqGcO2xQSreMq9lnFMztp-6Yo79hDHTFIkhkO_FbqEkzagEVdklfjic4IgkBgu3bS-c4EeDz2W2et1Wi4P2YXz-.jpg?size=50x50&quality=95&crop=0,480,1920,1920&ava=1',
                width: 30,
                height: 30,
                scale: 0.1,
              ),
            )
          )
        ],
      )
    );
  }
}

class up_bar_bg extends StatefulWidget{
  @override
  _up_bar_bg_state createState() => _up_bar_bg_state();
}

class _up_bar_bg_state extends State<up_bar_bg>{
  @override
  Widget build(BuildContext context){
    return Container(
      constraints: const BoxConstraints(
        minWidth: 380,
        minHeight: 45,
        maxWidth: 500,
        maxHeight: 45,
      ),
        decoration: const BoxDecoration(
          borderRadius : BorderRadius.only(
            topLeft: Radius.circular(40),
            topRight: Radius.circular(40),
            bottomLeft: Radius.circular(40),
            bottomRight: Radius.circular(40),
          ),
          color: const Color.fromRGBO(255, 255, 255, 1),
        ),
    );
  }
}

class _MapScreenState extends State<MapScreen> with SingleTickerProviderStateMixin {

  @override
  Widget build(BuildContext context){
    return Stack(
      children: <Widget>[
        Container(
          child: google_map_page(),
        ),
        Container(
        alignment: Alignment.topCenter,
        padding: EdgeInsets.only(top:35,left: 20,right:20),
        child: up_bar_bg(),
        ),
        Container(
          alignment: Alignment.bottomCenter,
          padding: EdgeInsets.only(bottom:20,left: 20,right:20),
          child: nav_menu(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: EdgeInsets.only(top:40,left: 60,right:30),
          child: search_bar(),
        ),
        Container(
          alignment: Alignment.topCenter,
          padding: EdgeInsets.only(top:42,left: 25,right:20),
          child: profile_img_bar(),
        ),
      ],
    );
  }


}


