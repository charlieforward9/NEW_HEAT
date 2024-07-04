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
  | { type: "SET_SHOW_MAP"; show: boolean }
  | { type: "SET_START_DATE"; startDate: Date }
  | { type: "SET_END_DATE"; endDate: Date }
  | { type: "SET_TRIP_LAYER"; rawData: RawData }
  | { type: "SET_DAYS_PER_TICK"; daysPerTick: number }
  | { type: "SET_CAMERA_PROPS"; progress: number }
  | { type: "SET_CURRENT_TIME"; currentTime: number }
  | { type: "SET_MAP_BREATHING"; breath: number }
  | { type: "SET_ANIMATING"; animating: boolean }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_LOADING_PROGRESS"; progress: number }
  | { type: "SET_CREDITS"; show: boolean }
  | { type: "SET_ERROR"; error: string };

export type NHState = {
  rawData: RawData | undefined;
  showMap: boolean;
  mapConfig: MapConfig;
  layerProps: TripsLayerProps<TripLayer>;
  startDate: Date;
  endDate: Date;
  startTime: number;
  endTime: number;
  daysPerTick: number;
  tripLayer: TripLayer[];
  cameraProps: MapCameraProps;
  currentTime: number;
  animating: boolean;
  loading: boolean;
  loading_progress: number;
  showCredits: boolean;
  error?: string;
};
