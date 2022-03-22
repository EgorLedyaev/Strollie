import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'plugins.dart';
import 'package:location/location.dart';

const bg_color_green = const Color(0xFF1BE07C);

bool _isElevated = true;


class google_map_page extends StatefulWidget {
  @override
  _google_map_page_state createState() => _google_map_page_state();
}

class _google_map_page_state extends State<google_map_page> {

  final LatLng _initialcameraposition = LatLng(53.228992, 50.199425);
  late GoogleMapController _controller;
  Location _location = Location();

  void _onMapCreated(GoogleMapController _cntlr) {
    _controller = _cntlr;
    _location.onLocationChanged.listen((l) {
      _controller.animateCamera(
        CameraUpdate.newCameraPosition(
          CameraPosition(target: LatLng(l.latitude!, l.longitude!), zoom: 15),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        child: Stack(
          children: [
            GoogleMap(
              initialCameraPosition: CameraPosition(target: _initialcameraposition),
              mapType: MapType.normal,
              onMapCreated: _onMapCreated,
              myLocationEnabled: true,
              myLocationButtonEnabled: false,
              zoomControlsEnabled: false,
            ),
          ],
        ),
      ),
    );
  }
}




class ChooseRouteScreen extends StatefulWidget {
  const ChooseRouteScreen({Key? key}) : super(key: key);

  @override
  _ChooseRouteScreenState createState() => _ChooseRouteScreenState();
}




class _ChooseRouteScreenState extends State<ChooseRouteScreen> with SingleTickerProviderStateMixin {

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        Container(
          child: google_map_page(),
        ),
        Container(
          alignment: Alignment.bottomCenter,
          padding: const EdgeInsets.only(
              left: 20, right: 20, top: 460),
          child: choose_route_menu(),
        ),
        Container(
          alignment: Alignment.bottomCenter,
          padding: const EdgeInsets.only(bottom: 25, left: 20, right: 20),
          child: nav_menu(),
        ),
        Container(
          alignment: Alignment.bottomCenter,
          padding: const EdgeInsets.only(bottom: 32, left: 20, right: 20),
          child: main_start_button(),
        ),
        Container(
          alignment: Alignment.bottomCenter,
          padding: const EdgeInsets.only(bottom: 56, left: 20, right: 20),
          child: main_start_button_icon(),
        ),
        Container(
          alignment: Alignment.bottomCenter,
          padding: const EdgeInsets.only(bottom: 50, right: 200),
          child: profile_button_icon(),
        ),
        Container(
          alignment: Alignment.bottomCenter,
          padding: const EdgeInsets.only(bottom: 48, left: 200),
          child: stats_button_icon(),
        ),
      ],
    );
  }
}