/**
 * @license
 * Copyright 2021 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */
// TODO Use imports when Deck.gl works in more bundlers
// https://github.com/visgl/deck.gl/issues/6351#issuecomment-1079424167

// import { GoogleMapsOverlay } from "@deck.gl/google-maps";
// import { TripsLayer } from "deck.gl";

const GoogleMapsOverlay = deck.GoogleMapsOverlay;
const TripsLayer = deck.TripsLayer;

interface Data {
  path: [number, number][];
  timestamps: number[];
}

const DATA_URL =
  "https://raw.githubusercontent.com/charlieforward9/animated_heatmap/master/data/2022.json";

const LOOP_LENGTH = 31557600;
const VENDOR_COLORS = [
  [255, 0, 0], // vendor #0
  [0, 0, 255], // vendor #1
];

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 29.64462421696083, lng: -82.33479384825146},
      mapId: '1ae1962daafbdd69',
      tilt: 45,
      zoom: 18,
      disableDefaultUI: true,
    } as google.maps.MapOptions
  );
  const view = new deck.MapView({id:"view", x:29.64462421696083, y: -82.33479384825146, width: 300, height: 200});

  let currentTime = 428000;
  let playSpeed = 1;
  const props = {
    id: "trips",
    data: DATA_URL,
    getPath: (d: Data) =>d.path,
    getTimestamps: (d: Data) => d.timestamps,
    getColor: [255, 87, 51],
    opacity: 1,
    widthMinPixels: 4,
    trailLength: 31557600,
    currentTime,
    shadowEnabled: false,
    jointRounded: true,
    capRounded: true
  };

  function autoAnimate(): void {
    window.setInterval(viewportAnimation, 80);
  }
  function viewportAnimation(): void {
    let heading = map.getHeading() || 0;
    let zoom = map.getZoom() || 10;
    let tilt = map.getTilt() || 45;

    if (currentTime < 3500000) {
      if(playSpeed<270000) playSpeed *= 1.05;
      //Gainesville
      map.setHeading(heading - 0.1);
      map.setZoom(zoom - 0.01);

    } else if (currentTime < 4000000) {
      if (currentTime < 3700000) {
        map.setCenter({ lat: 28.6024, lng: -81.2001});
        playSpeed = 3000;
      };
      playSpeed = playSpeed * 1.4;
      //Orlando SoFlo
      map.setHeading(0);
      map.setZoom(zoom - 0.1);
      map.setTilt(tilt - 0.1);
      map.panBy(0,2);
      

    } else if (currentTime < 7700000) {
      //Gainesville 
      playSpeed = 30000;
      map.setHeading(heading + 0.1);
      if(zoom>11)map.setZoom(zoom - 0.01);
      map.setCenter({ lat: 29.64462421696083, lng: -82.33479384825146});
      
    } else if (currentTime < 7900000) {
      //Lake Lanier GA
      if (currentTime < 7760000){
        playSpeed = 1000;
        map.setCenter({ lat: 34.1607, lng: -84.0044});
      } 
      playSpeed = playSpeed + 40;
      map.setHeading(0);
      map.setZoom(zoom + 0.005);
      map.panBy(-0.2,0.2);
      

    } else if (currentTime < 9200000) {
      playSpeed = 20000;
      //Gainesville
      map.setZoom(zoom - 0.03);
      map.setTilt(tilt - 0.1);
      map.setCenter({ lat: 29.54462421696083, lng: -82.33479384825146});

    } else if (currentTime < 10300000) {
      //FLORIDA and Orlando
      map.setZoom(zoom - 0.01);
      map.panBy(5, 15);

    } else if (currentTime < 10500000) {
      //Omaha NE
      playSpeed = 2000;
      map.setCenter({ lat: 41.2565, lng: -95.9345});
      playSpeed = playSpeed * 1.05;
      map.setZoom(zoom + 0.04);
      map.setTilt(tilt+0.3);

    } else if (currentTime < 10800000) {
      //Orlando, St Aug
      playSpeed *= 1.1
      map.panTo({ lat: 28.8024, lng: -81.2001});
      map.setZoom(zoom - 0.05);
      map.setTilt(45)
    } else if (currentTime < 19500000) {
      if (currentTime < 13000000) map.panBy(-3, -6);
      if (zoom > 9) map.setZoom(zoom -0.04);
      map.setHeading(heading + 0.3);
    } else if (currentTime < 20000000) {
      playSpeed = 30000;
      //Talullah Falls
      map.panTo({ lat:34.7367, lng: -83.3927});
      map.setZoom(zoom + 0.05);

    } else if (currentTime < 22200000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146});

    } else if (currentTime < 22600000) {
      //Irving Texas
      map.panTo({ lat:32.8140, lng: -96.9489});
      map.setZoom(zoom + 0.5)

    } else if (currentTime < 23300000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146});

    } else if (currentTime < 24300000) {
      //Wellington
      map.panTo({ lat: 26.6618, lng: -80.2684});

    } else if (currentTime < 26800000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146});

    } else if (currentTime < 28200000) {
      //Spain
      map.panTo({ lat: 42.2406, lng: -8.7207});

    } else if (currentTime < 30000000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146});

    } else if (currentTime < 30600000) {
      //FloRida 2
      map.panTo({ lat: 28.2920, lng: -81.4076});

    } else if (currentTime < 31000000) {
      //North Carolina
      map.panTo({ lat: 36.2168, lng: -81.6746});;

    } else {
      //Wellington
      map.panTo({ lat: 26.6618, lng: -80.2684});


    }
  
  }

  const overlay = new GoogleMapsOverlay({});

  const animate = () => {
    currentTime = (currentTime + playSpeed) % LOOP_LENGTH;

    const tripsLayer = new TripsLayer({
      ...props,
      currentTime,
    });

    overlay.setProps({
      layers: [tripsLayer],
    });

    window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(animate);
  autoAnimate()

  overlay.setMap(map);
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
