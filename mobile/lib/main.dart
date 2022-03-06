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
      padding: EdgeInsets.only(bottom:50,left: 20,right:20),
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

class search_profile_bar extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    throw UnimplementedError();
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
          alignment: Alignment.bottomCenter,
          child: nav_menu(),
        ),
      ],
    );
  }


}


