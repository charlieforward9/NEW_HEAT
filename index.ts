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
      zoom: 9,
      disableDefaultUI: true,
    } as google.maps.MapOptions
  );
  const view = new deck.MapView({id:"view", x:29.64462421696083, y: -82.33479384825146, width: 300, height: 200});

  let currentTime = -1000000;
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
    window.setInterval(viewportAnimation, 100);
  }
  function viewportAnimation(): void {
    const heading = map.getHeading() || 0;
    const zoom = map.getZoom() || 10;
    console.log(currentTime);

    if (currentTime < 3600000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146})
    } else if (currentTime < 5600000) {
      //Orlando SoFlo
      map.panTo({ lat: 28.6024, lng: -81.2001})
    } else if (currentTime < 6300000) {
    } else if (currentTime < 7600000) {
      //Gainesville 
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146})
    } else if (currentTime < 8000000) {
      //Lake Lanier GA
      map.panTo({ lat: 34.1207, lng: -84.0044})
    } else if (currentTime < 9500000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146})
    } else if (currentTime < 10000000) {
      //FloRida Orlando
      map.panTo({ lat: 28.6024, lng: -81.2001})
    } else if (currentTime < 11000000) {
      //Omaha NE
      map.panTo({ lat: 41.2565, lng: -95.9345})
    } else if (currentTime < 12000000) {
      //Wellington
      map.panTo({ lat: 26.6618, lng: -80.2684})
    } else if (currentTime < 13500000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146})
    } else if (currentTime < 14000000) {
      //Orlando
      map.panTo({ lat: 28.6024, lng: -81.2001})
    } else if (currentTime < 14200000) {
      //Wellington
      map.panTo({ lat: 26.6618, lng: -80.2684})
    } else if (currentTime < 16300000) {
      //Gainesville (St Aug)
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146})
    } else if (currentTime < 16400000) {
      //Clermont
      map.panTo({ lat: 28.6024, lng: -81.2001})
    } else if (currentTime < 19600000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146})
    } else if (currentTime < 20000000) {
      //Talullah Falls
      map.panTo({ lat:34.7367, lng: -83.3927})
    } else if (currentTime < 22200000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146})
    } else if (currentTime < 22600000) {
      //Irving Texas
      map.panTo({ lat:32.8140, lng: -96.9489})
    } else if (currentTime < 23300000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146})
    } else if (currentTime < 24300000) {
      //Wellington
      map.panTo({ lat: 26.6618, lng: -80.2684})
    } else if (currentTime < 26800000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146})
    } else if (currentTime < 28200000) {
      //Spain
      map.panTo({ lat: 42.2406, lng: -8.7207})
    } else if (currentTime < 30000000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146})
    } else if (currentTime < 30600000) {
      //FloRida 2
      map.panTo({ lat: 28.2920, lng: -81.4076})
    } else if (currentTime < 31000000) {
      //North Carolina
      map.panTo({ lat: 36.2168, lng: -81.6746})
    } else {
      //Wellington
      map.panTo({ lat: 26.6618, lng: -80.2684})

    }
  
  }

  const overlay = new GoogleMapsOverlay({});

  const animate = () => {
    currentTime = (currentTime + 30000) % LOOP_LENGTH;

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
