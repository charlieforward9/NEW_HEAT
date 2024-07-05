import type { MapCameraProps } from "@vis.gl/react-google-maps";
import { Color, AccessorFunction } from "deck.gl";
import type { TripsLayerProps } from "@deck.gl/geo-layers";
import type { MapConfig, TripLayer } from "./types";

export const API_KEY =
  import.meta.env.VITE_MAP_KEY ??
  globalThis.VITE_MAP_KEY ??
  (process.env.VITE_MAP_KEY as string);

export const Times = {
  START_2020: 1578000000000,
  START_2021: 1609459200000,
  START_2023: 1672593838000,
  END_2023: 1694139838000,
  START_2024: 1704114000000,
  FEB_2024: 1711972800000,
  MAY_2024: 1714535810000,
  END_2024: 1725685838000,
};

//This just works for my use case, you may need to adjust this value for the most accurate results (linked to ticksPerDay, which is also not accurate)
export const SECOND_IN_DAY_TIMES_TEN = 864000;
export const ONE_YEAR_IN_MS = 31557600000;

export const MapTypeId = {
  HYBRID: "hybrid",
  ROADMAP: "roadmap",
  SATELLITE: "satellite",
  TERRAIN: "terrain",
};

export const MAP_CONFIGS: MapConfig[] = [
  {
    id: "ogblack",
    label: "Black",
    mapId: "1ae1962daafbdd69",
    mapTypeId: MapTypeId.ROADMAP,
  },
  {
    id: "light",
    label: "Light",
    mapId: "49ae42fed52588c3",
    mapTypeId: MapTypeId.ROADMAP,
  },
  {
    id: "dark",
    label: "Dark",
    mapId: "739af084373f96fe",
    mapTypeId: MapTypeId.ROADMAP,
  },
  // {
  //   id: "styled1",
  //   label: "Bright Colors",
  //   mapTypeId: MapTypeId.ROADMAP,
  //   styles: brightColorsStyles,
  // },
  // {
  //   id: "styled2",
  //   label: "Vitamin C",
  //   mapTypeId: MapTypeId.ROADMAP,
  //   styles: vitaminCStyles,
  // },
  {
    id: "satellite2",
    label: 'Satellite ("light" mapId)',
    mapId: "49ae42fed52588c3",
    mapTypeId: MapTypeId.SATELLITE,
  },
  {
    id: "hybrid2",
    label: 'Hybrid ("light" mapId)',
    mapId: "49ae42fed52588c3",
    mapTypeId: MapTypeId.HYBRID,
  },
  {
    id: "terrain2",
    label: 'Terrain ("light" mapId)',
    mapId: "49ae42fed52588c3",
    mapTypeId: MapTypeId.TERRAIN,
  },
  {
    id: "ogwhite",
    label: "White",
    mapId: "5e13191437f4efb4",
    mapTypeId: MapTypeId.ROADMAP,
  },
];

export const cameraStart: MapCameraProps = {
  center: { lat: 29.645834, lng: -82.353026 },
  zoom: 16,
  heading: 331,
  tilt: 57.5,
};

export const cameraEnd: MapCameraProps = {
  center: { lat: 29.645834, lng: -82.323026 },
  zoom: 6.5,
  heading: 360,
  tilt: 67.5,
};

export const ORANGE: Color = [252, 76, 2];

export const getPath: AccessorFunction<TripLayer, [number, number][]> = (d) =>
  d.path;
export const getTimestamps: AccessorFunction<TripLayer, number[]> = (d) =>
  d.timestamps;

export const layerProps: TripsLayerProps<TripLayer> = {
  id: "trips",
  data: [],
  getPath,
  getTimestamps,
  getColor: ORANGE,
  opacity: 0.7,
  currentTime: 0,
  trailLength: 400000000,
  widthMinPixels: 2,
  jointRounded: true,
  capRounded: true,
  onError: (error: Error) => {
    console.error("Error rendering trips layer", error);
  },
};
