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

const SEQUENTIAL_DATA_URL = "https://raw.githubusercontent.com/charlieforward9/animated_heatmap/master/data/2022.json";
const BULK_DATA_URL = "https://raw.githubusercontent.com/charlieforward9/animated_heatmap/master/data/2022bulk.json";
const RANDOM_DATA_URL = "https://raw.githubusercontent.com/charlieforward9/animated_heatmap/master/data/2022randombulk.json";
const SEQUENTIAL_LOOP_LENGTH = 31557600;
const BULK_LOOP_LENGTH = 29667;
// const WORLDVIEW_LENGTH = 1557600;
const DATAS = [SEQUENTIAL_DATA_URL,BULK_DATA_URL,RANDOM_DATA_URL]
const LENGTHS = [SEQUENTIAL_LOOP_LENGTH,BULK_LOOP_LENGTH, BULK_LOOP_LENGTH]

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://maps.googleapis.com/maps/api/js?v=weekly&key=AIzaSyDoVOLk0SYBOGRcupNpEhVLeGUqjkBtJ_A&callback=initMap"
    document.body.appendChild(script);
    jQuery('#welcome')!.modal('show');
}

document.getElementById("reset")!.addEventListener("click", (e:Event) => reset());


const delay = ms => new Promise(res => setTimeout(res, ms));

function initMap(): void {
  //document.getElementById("preloadData")!.addEventListener("click", (e:Event) => preloadData());
  document.getElementById("sequenceAnimate")!.addEventListener("click", (e:Event) => viewportAnimate(0));
  document.getElementById("bulkAnimate")!.addEventListener("click", (e:Event) => viewportAnimate(1));
  document.getElementById("randAnimate")!.addEventListener("click", (e:Event) => viewportAnimate(2));
  // document.getElementById("sequenceWorld")!.addEventListener("click", (e:Event) => viewportAnimate(3));

  let currentTime = 428000;
  let playSpeed = 1;
  const overlay = new GoogleMapsOverlay({});
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 29.64462421696083, lng: -82.33479384825146},
      mapId: '1ae1962daafbdd69',
      tilt: 45,
      zoom: 17,
      disableDefaultUI: true,
    } as google.maps.MapOptions
  );

  async function viewportAnimate(index:number): Promise<void> {
    window.scrollTo({top: 70,behavior:'smooth'});
    currentTime = index == 0 ? 42800: 0;
    map.setCenter({lat: 29.64462421696083, lng: -82.33479384825146});
    index == 3? map.setZoom(3) : map.setZoom(18);
    map.setTilt(45);
    
    const props = {
      id: "trips",
      data: DATAS[index%3],
      getPath: (d: Data) =>d.path,
      getTimestamps: (d: Data) => d.timestamps,
      getColor: [255, 87, 51],
      opacity: 1,
      widthMinPixels: 4,
      trailLength: LENGTHS[index],
      currentTime,
      shadowEnabled: false,
      jointRounded: true,
      capRounded: true
    };
    const animate =async() => {
      currentTime = (currentTime + playSpeed) % LENGTHS[index];

      const tripsLayer = new TripsLayer({
        ...props,
        currentTime,
      });

      overlay.setProps({
        layers: [tripsLayer],
      });
      if(playSpeed == 1) await delay(1000); //If the animation just started, give it a second to load the overlay

      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
    overlay.setMap(map);

    if(index == 0) {
      window.setInterval(_sequentialAnimation, 80);
    } else if (index == 1 || index || 2) {
      window.setInterval(_bulkAnimation, 1000);
    } else if (index == 3) {
      playSpeed = 10000000;
    }

  }
  function _sequentialAnimation(): void {
    let heading = map.getHeading() || 0;
    let zoom = map.getZoom() || 10;
    let tilt = map.getTilt() || 45;

    if (currentTime < 3500000) {
      if(playSpeed<265000) playSpeed *= 1.05;
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
      

    } else if (currentTime < 7750000) {
      //Gainesville 
      playSpeed = 30000;
      map.setHeading(heading + 0.07);
      if(zoom>11)map.setZoom(zoom - 0.01);
      map.setCenter({lat: 29.64462421696083, lng: -82.33479384825146});
      
    } else if (currentTime < 8000000) {
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
      playSpeed = 9000 * 1.01;
      //Talullah Falls
      map.panTo({ lat:34.7367, lng: -83.3927});
      map.setZoom(zoom + 0.05);

    } else if (currentTime < 22200000) {
      //Gainesville
      map.setHeading(0);
      map.setZoom(zoom + 0.01);
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146});

    } else if (currentTime < 22600000) {
      //Irving Texas
      map.panTo({ lat:32.9140, lng: -96.9489});
      map.setZoom(zoom + 0.01)

    } else if (currentTime < 23300000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146});
      map.setZoom(zoom+ 0.01);

    } else if (currentTime < 24300000) {
      //Wellington
      map.panTo({ lat: 26.6618, lng: -80.2684});
      map.setZoom(zoom + 0.01);

    } else if (currentTime < 26800000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146});
      map.setZoom(zoom - 0.01);

    } else if (currentTime < 28200000) {
      //Spain
      map.panTo({ lat: 42.2406, lng: -8.7207});
      map.setHeading(heading + 0.1);

    } else if (currentTime < 30000000) {
      //Gainesville
      map.panTo({ lat: 29.64462421696083, lng: -82.33479384825146});
      map.setHeading(0);
      map.setZoom(zoom - 0.05);

    } else if (currentTime < 30600000) {
      //FloRida 2
      map.panTo({ lat: 28.2920, lng: -81.4076});
      map.setZoom(zoom - 0.05);

    } else if (currentTime < 32000000) {
      //North Carolina
      map.panTo({ lat: 36.2168, lng: -81.6746});;
      map.setZoom(3); 
    }
  
  }
  function _bulkAnimation(): void {
    let zoom = map.getZoom() || 10;

    if(zoom > 17) playSpeed = 0.1; else playSpeed *= 1.2;
    
    if(zoom > 3) map.setZoom(zoom - 0.2);
  }
}

function reset():void {
  window.location.reload();
  window.initMap = initMap;
}

declare global {
  interface Window {
    initMap: () => void;
  }
}

window.onload = loadScript;
window.initMap = initMap;
export {};
