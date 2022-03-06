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
        primaryColor: Colors.white,
      ),
      home: MapScreen(),
    );
  }
}

class MapScreen extends StatefulWidget {
  const MapScreen({Key? key}) : super(key: key);

  @override
  _MapScreenState createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> with SingleTickerProviderStateMixin {
  static const _initialCameraPosition = CameraPosition(
      target: LatLng(53.228992, 50.199425),
      zoom: 16,
  );

  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2,vsync: this);
  }

  @override
  void dispose(){
    //_googleMapController.dispose();
    super.dispose();
    _tabController.dispose();
  }

  @override
  Widget build(BuildContext context){
    return Scaffold(
      body: const GoogleMap(
        myLocationButtonEnabled: false,
        zoomControlsEnabled: false,
        initialCameraPosition: _initialCameraPosition,
      ),
      bottomNavigationBar: Container(
        padding: EdgeInsets.all(16.0),
        child: ClipRRect(
          borderRadius: const BorderRadius.all(
            Radius.circular(50.0)
          ),
          child: Container(
            color: Colors.green,
              child: TabBar(
                labelColor: Color(0xFFC41A3B),
                unselectedLabelColor: Colors.white,
                labelStyle: TextStyle(fontSize: 10.0),
                indicator: const UnderlineTabIndicator(
                  borderSide: BorderSide(color: Colors.black54, width: 0.0),
                  insets: EdgeInsets.fromLTRB(50.0, 0.0, 50.0, 40.0),
                ),
                indicatorColor: Colors.black54,
                tabs: const <Widget>[
              Tab(
              icon: Icon(
                Icons.home,
                size: 24.0,
              ),
            text: 'Home',
          ),
          Tab(
            icon: Icon(
              Icons.category,
              size: 24.0,
            ),
            text: 'Department',
          ),
          ],
                controller: _tabController,
            )
          )
        )
      ),
    );
  }


}
