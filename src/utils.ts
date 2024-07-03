import type { MapCameraProps } from "@vis.gl/react-google-maps";
import type { RawData, TripLayer } from "./types";

export async function fetchTripLayer(onProgress?: (progress: number) => void) {
  try {
    const response = await fetchWithProgress(
      "https://corsproxy.io/?https://github.com/charlieforward9/NEW_HEAT/raw/master/data/strava_layer.json",
      onProgress
    );
    // Snippet for local fetching when internet speeds are not ideal (will not show progress)
    // const response = (await import("../data/strava_layer.json")).default;
    return response as unknown as RawData;
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

async function fetchWithProgress(
  url: string,
  onProgress?: (progress: number) => void
) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const contentLength = response.headers.get("Content-Length");
  if (!contentLength) {
    throw new Error("Content-Length response header is missing");
  }

  const total = parseInt(contentLength, 10);
  let loaded = 0;

  if (!response.body) {
    throw new Error("There is no body in this request");
  }

  const reader = response.body.getReader();
  const stream = new ReadableStream({
    start(controller) {
      function push() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }

            loaded += value.byteLength;
            onProgress && onProgress((loaded / total) * 100);

            controller.enqueue(value);
            push();
          })
          .catch((error) => {
            console.error("Stream reading error:", error);
            controller.error(error);
          });
      }

      push();
    },
  });

  const newResponse = new Response(stream);
  const data = await newResponse.json(); // Convert the response to JSON
  return data;
}
