import 'dart:io';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:gpx/gpx.dart';
import 'package:xml/xml.dart';

import 'page.dart';

class PlacePolylinePage extends GoogleMapExampleAppPage {
  const PlacePolylinePage({Key? key})
      : super(const Icon(Icons.linear_scale), 'Place polyline', key: key);

  @override
  Widget build(BuildContext context) {
    return const PlacePolylineBody();
  }
}

class PlacePolylineBody extends StatefulWidget {
  const PlacePolylineBody({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => PlacePolylineBodyState();
}

class PlacePolylineBodyState extends State<PlacePolylineBody> {
  PlacePolylineBodyState();

  GoogleMapController? controller;
  Map<PolylineId, Polyline> polylines = <PolylineId, Polyline>{};
  int _polylineIdCounter = 0;

  // ignore: use_setters_to_change_properties
  void _onMapCreated(GoogleMapController controller) {
    this.controller = controller;
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    print(polylines.values);
    return Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Center(
            child: SizedBox(
              width: 350.0,
              height: 300.0,
              child: GoogleMap(
                initialCameraPosition: const CameraPosition(
                  target: LatLng(26.541805739700794, -80.09499596580863),
                  zoom: 13.0,
                ),
                polylines: Set<Polyline>.of(polylines.values),
                onMapCreated: _onMapCreated,
              ),
            ),
          ),
          Expanded(
            child: TextButton(
              onPressed: _createPoints,
              child: const Text('add'),
            ),
          )
        ]);
  }

  List<LatLng> _createPoints() {
    List<LatLng> points = [];
    final file = XmlDocument.parse(File(
                "/Users/crich/Documents/Github/animated_heatmap/lib/data/2022/8283184493.gpx")
            .readAsStringSync())
        .toXmlString();
    final gpx = GpxReader().fromString(file);
    for (var trk in gpx.trks) {
      for (var seg in trk.trksegs) {
        for (var pt in seg.trkpts) {
          if (pt.lat != null && pt.lon != null) {
            final PolylineId polylineId =
                PolylineId('polyline_id_${_polylineIdCounter++}');
            print(polylineId);

            final Polyline polyline = Polyline(
              polylineId: polylineId,
              consumeTapEvents: true,
              color: Colors.purple,
              width: 8,
              points: [LatLng(pt.lat!, pt.lon!)],
            );
            if (_polylineIdCounter % 67 == 0) {
              setState(() {
                polylines[polylineId] = polyline;
              });
            } else {
              polylines[polylineId] = polyline;
            }
          }
        }
      }
    }
    return points;
  }
}
