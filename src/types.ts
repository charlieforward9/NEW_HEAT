import type { MapCameraProps } from "@vis.gl/react-google-maps";
import type { TripsLayerProps } from "@deck.gl/geo-layers";

export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
  styles?: google.maps.MapTypeStyle[];
};

// key is the timestamp, value is an array of [timestamp, longitude, latitude]
export type RawData = {
  [key: number]: [number, number, number][];
};

export type TripLayer = {
  path: [number, number][];
  timestamps: number[];
};

export type NHActions =
  | { type: "SET_MAP_CONFIG"; value: String }
  | { type: "SET_START_DATE"; startDate: Date }
  | { type: "SET_END_DATE"; endDate: Date }
  | { type: "SET_TRIP_LAYER"; rawData: RawData }
  | { type: "SET_DAYS_PER_TICK"; daysPerTick: number }
  | { type: "SET_CAMERA_PROPS"; progress: number }
  | { type: "SET_T0"; t0: number }
  | { type: "SET_CURRENT_TIME"; currentTime: number }
  | { type: "SET_LOADING"; loading: boolean };

export type NHState = {
  rawData: RawData | undefined;
  mapConfig: MapConfig;
  animationDuration: number;
  layerProps: TripsLayerProps<TripLayer>;
  startDate: Date;
  endDate: Date;
  startTime: number;
  endTime: number;
  daysPerTick: number;
  tripLayer: TripLayer[];
  cameraProps: MapCameraProps;
  t0: number;
  currentTime: number;
  loading: boolean;
};
