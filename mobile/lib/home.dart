import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget{
  const HomeScreen({ Key? key}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();

  }

class _HomeScreenState extends State<HomeScreen>{
  int _selectedIndex = 0;
  PageController pageController = PageController();

  void onTapped(int index){
    setState(() {
      _selectedIndex = index;
    });
    pageController.jumpToPage(index);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: BoxDecoration(
          borderRadius : BorderRadius.only(
            topLeft: Radius.circular(40),
            topRight: Radius.circular(40),
            bottomLeft: Radius.circular(40),
            bottomRight: Radius.circular(40),
          ),
          color : Color.fromRGBO(255, 255, 255, 1),
        )
    );
  }
}

