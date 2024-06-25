import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { APIProvider } from "@vis.gl/react-google-maps";

import brightColorsStyles from "./map-styles/bright-colors";
import vitaminCStyles from "./map-styles/vitamin-c";

import ControlPanel from "./control-panel";
import { AnimatedMap } from "./animated_map";

const mapTypes = {
  "white with buildings": "5e13191437f4efb4",
  "black without buildings": "4f6dde3310be51d7",
};

const MapTypeId = {
  HYBRID: "hybrid",
  ROADMAP: "roadmap",
  SATELLITE: "satellite",
  TERRAIN: "terrain",
};
export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
  styles?: google.maps.MapTypeStyle[];
};

const MAP_CONFIGS: MapConfig[] = [
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
    id: "satellite",
    label: "Satellite (no mapId)",
    mapTypeId: MapTypeId.SATELLITE,
  },
  {
    id: "hybrid",
    label: "Hybrid (no mapId)",
    mapTypeId: MapTypeId.HYBRID,
  },
  {
    id: "terrain",
    label: "Terrain (no mapId)",
    mapTypeId: MapTypeId.TERRAIN,
  },
  {
    id: "styled1",
    label: 'Raster / "Bright Colors" (no mapId)',
    mapTypeId: MapTypeId.ROADMAP,
    styles: brightColorsStyles,
  },
  {
    id: "styled2",
    label: 'Raster / "Vitamin C" (no mapId)',
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
];

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => {
  const [mapConfig, setMapConfig] = useState<MapConfig>(MAP_CONFIGS[0]);

  return (
    <APIProvider apiKey={API_KEY}>
      <AnimatedMap mapConfig={mapConfig} />
      <ControlPanel
        mapConfigs={MAP_CONFIGS}
        mapConfigId={mapConfig.id}
        onMapConfigIdChange={(id) =>
          setMapConfig(MAP_CONFIGS.find((s) => s.id === id)!)
        }
      />
    </APIProvider>
  );
};

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
