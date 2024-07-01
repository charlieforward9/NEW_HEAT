import type { MapCameraProps } from "@vis.gl/react-google-maps";
import type { RawData, TripLayer } from "./types";

export async function fetchTripLayer() {
  try {
    const response = await fetch(
      "https://corsproxy.io/?https://github.com/charlieforward9/NEW_HEAT/raw/feat_update/data/strava_layer.json"
    );
    const rawData = await response.json();
    return rawData as unknown as RawData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export function parseDataToTripLayer(
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
        points.forEach((point: [number, number, number]) => {
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

export function interpolateCamera(
  a: MapCameraProps,
  b: MapCameraProps,
  t: number
) {
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
