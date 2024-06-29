import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { APIProvider } from "@vis.gl/react-google-maps";

import brightColorsStyles from "./map-styles/bright-colors";
import vitaminCStyles from "./map-styles/vitamin-c";

import ControlPanel from "./control-panel";
import { AnimatedMap } from "./animated_map";

const Times = {
  START_2020: 1577836800000,
  START_2023: 1672593838000,
  END_2023: 1694139838000,
  END_2024: 1704139838000,
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

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => {
  const [mapConfig, setMapConfig] = useState<MapConfig>(MAP_CONFIGS[0]);
  const [startDate, setStartDate] = useState<Date>(new Date(Times.START_2020));
  const [endDate, setEndDate] = useState<Date>(new Date(Times.END_2024));
  const [daysPerTick, setDaysPerTick] = useState<number>(33);
  const [currentTime, setCurrentTime] = useState(startDate.getTime() / 1000);

  return (
    <APIProvider apiKey={API_KEY}>
      <AnimatedMap
        mapConfig={mapConfig}
        startTime={startDate?.getTime() / 1000}
        endTime={endDate?.getTime() / 1000}
        daysPerTick={daysPerTick}
        currentTime={currentTime}
        onSetCurrentTime={(t) => setCurrentTime(t)}
      />
      <ControlPanel
        mapConfigs={MAP_CONFIGS}
        mapConfigId={mapConfig.id}
        onMapConfigIdChange={(id) =>
          setMapConfig(MAP_CONFIGS.find((s) => s.id === id)!)
        }
        startDate={startDate}
        endDate={endDate}
        onSetStartDate={(d) => setStartDate(d)}
        onSetEndDate={(d) => setEndDate(d)}
        daysPerTick={daysPerTick}
        onSetDaysPerTick={(d) => setDaysPerTick(d)}
        currentTime={currentTime}
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
