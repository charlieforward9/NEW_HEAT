import {
  Map as ReactGoogleMap,
  MapCameraProps,
} from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useRef, useState } from "react";
import { DeckGlOverlay } from "./deckgl-overlay";
import { Color, TripsLayer } from "deck.gl";
import { MapConfig } from "./app";

type RawData = {
  [key: number]: [number, number, number][]; // key is the timestamp, value is an array of [timestamp, longitude, latitude]
};
type StravaLayer = Map<number, ActivityLayer>;
type ActivityLayer = Point[];
type Point = [number, number, number];
type TripLayer = {
  path: [number, number][];
  timestamps: number[];
};

const animationDuration = 150000;

const cameraStart: MapCameraProps = {
  center: { lat: 29.645834, lng: -82.353026 },
  zoom: 15,
  heading: 331,
  tilt: 67.5,
};

const cameraEnd: MapCameraProps = {
  center: { lat: 29.645834, lng: -82.323026 },
  zoom: 8,
  heading: 360,
  tilt: 67.5,
};

type AnimatedMapProps = {
  mapConfig: MapConfig;
  startTime: number;
  endTime: number;
  daysPerTick: number;
  currentTime: number;
  onSetCurrentTime: (time: number) => void;
};

export const AnimatedMap = ({
  mapConfig,
  startTime,
  endTime,
  daysPerTick,
  currentTime,
  onSetCurrentTime,
}: AnimatedMapProps) => {
  const rawData = useRef<RawData>();
  const [data, setData] = useState<TripLayer[]>();
  const [cameraProps, setCameraProps] = useState<MapCameraProps>(cameraStart);

  const layers = useMemo(
    () => data && getDeckGlLayers(data, currentTime),
    [data, currentTime]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await import("../data/strava_layer.json");
        rawData.current = response.default as unknown as RawData;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const data = parseDataToTripLayer(rawData.current, startTime, endTime);
    setData(data);
  }, [rawData.current, startTime, endTime]);

  useEffect(() => {
    let t0 = performance.now();
    onSetCurrentTime(startTime);
    function loop(t: number) {
      rafId = requestAnimationFrame(loop);

      const elapsedTimeRelative = (t - t0) / animationDuration;
      const progress =
        Math.cos(Math.PI + 2 * Math.PI * elapsedTimeRelative) / 2 + 0.5;

      setCameraProps(interpolateCamera(cameraStart, cameraEnd, progress));
      const elapsedSeconds = Number(
        ((t - t0 / 1000) * (daysPerTick * 86.4)).toFixed(0)
      );

      const newTime = startTime + (elapsedSeconds % (endTime - startTime));

      if (newTime < endTime) {
        onSetCurrentTime(newTime);
      } else {
        //Reset
        t0 = performance.now();
        onSetCurrentTime(startTime);
      }
    }
    let rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [daysPerTick, startTime, endTime]);

  return (
    <ReactGoogleMap
      mapId={mapConfig.mapId || null}
      //mapTypeId={mapConfig.mapTypeId}
      styles={mapConfig.styles}
      defaultCenter={{ lat: 29.645834, lng: -82.323026 }}
      defaultZoom={11}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      reuseMaps={true}
      {...cameraProps}
    >
      {<DeckGlOverlay layers={layers} />}
    </ReactGoogleMap>
  );
};

function getDeckGlLayers(data: TripLayer[] | null, currentTime: number) {
  const ORANGE: Color = [252, 76, 2];

  if (!data) return [];
  return [
    new TripsLayer({
      id: "trips",
      data,
      getPath: (d: TripLayer) => d.path,
      getTimestamps: (d: TripLayer) => d.timestamps,
      getColor: ORANGE,
      opacity: 0.7,
      currentTime,
      trailLength: 600000000,
      widthMinPixels: 4,
      shadowEnabled: false,
      jointRounded: true,
      capRounded: true,
      onError: (error: Error) => {
        console.error("Error rendering trips layer", error);
      },
    }),
  ];

  //   return [
  //     new GeoJsonLayer({
  //       id: "geojson-layer",
  //       data,
  //       stroked: false,
  //       filled: true,
  //       extruded: true,
  //       pointType: "circle",
  //       lineWidthScale: 20,
  //       lineWidthMinPixels: 4,
  //       getFillColor: [160, 160, 180, 200],
  //       getLineColor: (f: Feature) => {
  //         const hex = f?.properties?.color;

  //         if (!hex) return [0, 0, 0];

  //         return hex.match(/[0-9a-f]{2}/g)!.map((x: string) => parseInt(x, 16));
  //       },
  //       getPointRadius: 200,
  //       getLineWidth: 1,
  //       getElevation: 30,
  //     }),
  //   ];
}

function parseDataToTripLayer(
  data: RawData | undefined,
  startTime: number,
  endTime: number
): TripLayer[] {
  const tripLayer: TripLayer[] = [];

  for (const key in data) {
    const trip: TripLayer = {
      path: [],
      timestamps: [],
    };
    if (data.hasOwnProperty(key)) {
      const timestamp = Number(key);
      if (timestamp >= startTime && timestamp <= endTime) {
        const points = data[key];
        points.forEach((point) => {
          trip.path.push([point[1], point[2]]);
          trip.timestamps.push(point[0]);
        });
        tripLayer.push(trip);
      }
    }
  }

  return tripLayer;
}

function lerp(x: number, y: number, t: number): number {
  return (1 - t) * x + t * y;
}

function interpolateCamera(a: MapCameraProps, b: MapCameraProps, t: number) {
  return {
    center: {
      lat: lerp(a.center.lat, b.center.lat, t),
      lng: lerp(a.center.lng, b.center.lng, t),
    },
    zoom: lerp(a.zoom, b.zoom, t),
    heading: lerp(a.heading ?? 0, b.heading ?? 0, t),
    tilt: lerp(a.tilt ?? 0, b.tilt ?? 0, t),
  };
}
