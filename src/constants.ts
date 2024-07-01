import brightColorsStyles from "./map-styles/bright-colors";
import vitaminCStyles from "./map-styles/vitamin-c";

import type { MapCameraProps } from "@vis.gl/react-google-maps";
import { Color, AccessorFunction } from "deck.gl";
import type { TripsLayerProps } from "@deck.gl/geo-layers";
import type { MapConfig, TripLayer } from "./types";

export const API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ??
  globalThis.GOOGLE_MAPS_API_KEY ??
  (process.env.GOOGLE_MAPS_API_KEY as string);
export const Times = {
  START_2020: 1577836800000,
  START_2023: 1672593838000,
  END_2023: 1694139838000,
  END_2024: 1704139838000,
};

export const defaultCenter = { lat: 29.645834, lng: -82.323026 };

export const MapTypeId = {
  HYBRID: "hybrid",
  ROADMAP: "roadmap",
  SATELLITE: "satellite",
  TERRAIN: "terrain",
};

export const MAP_CONFIGS: MapConfig[] = [
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
  {
    id: "styled1",
    label: "Bright Colors",
    mapTypeId: MapTypeId.ROADMAP,
    styles: brightColorsStyles,
  },
  {
    id: "styled2",
    label: "Vitamin C",
    mapTypeId: MapTypeId.ROADMAP,
    styles: vitaminCStyles,
  },
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
    label: "white with buildings",
    mapId: "5e13191437f4efb4",
    mapTypeId: MapTypeId.ROADMAP,
  },
  {
    id: "ogblack",
    label: "black without buildings",
    mapId: "4f6dde3310be51d7",
    mapTypeId: MapTypeId.ROADMAP,
  },
];

export const cameraStart: MapCameraProps = {
  center: { lat: 29.645834, lng: -82.353026 },
  zoom: 15,
  heading: 331,
  tilt: 67.5,
};

export const cameraEnd: MapCameraProps = {
  center: { lat: 29.645834, lng: -82.323026 },
  zoom: 7,
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
