import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  fetchTripLayer,
  interpolateCamera,
  parseDataToTripLayer,
} from "./utils";

import type { NHActions, NHState, RawData } from "./types";
import {
  API_KEY,
  cameraEnd,
  cameraStart,
  layerProps,
  MAP_CONFIGS,
  Times,
} from "./constants";
import { APIProvider } from "@vis.gl/react-google-maps";

const initialState: NHState = {
  rawData: undefined,
  mapConfig: MAP_CONFIGS[0],
  animationDuration: 90000,
  layerProps: layerProps,
  startDate: new Date(Times.START_2020),
  endDate: new Date(2024, 0, 1),
  startTime: Times.START_2020 / 1000,
  endTime: Times.END_2024 / 1000,
  daysPerTick: 33,
  tripLayer: [],
  cameraProps: cameraStart,
  t0: 0,
  currentTime: 0,
  loading: true,
};

export const NHContext = createContext<NHState>(initialState);
export const NHDispatchContext = createContext<React.Dispatch<NHActions>>(
  () => {}
);

export function NHReducer(state: NHState, action: NHActions): NHState {
  switch (action.type) {
    case "SET_MAP_CONFIG":
      return {
        ...state,
        mapConfig:
          MAP_CONFIGS.find((config) => config.id === action.value) ??
          MAP_CONFIGS[0],
      };
    case "SET_START_DATE": {
      return {
        ...state,
        startDate: action.startDate,
        startTime: action.startDate.getTime() / 1000,
        currentTime: action.startDate.getTime(),
      };
    }
    case "SET_END_DATE":
      return {
        ...state,
        endDate: action.endDate,
        endTime: action.endDate.getTime() / 1000,
        currentTime: state.startDate.getTime(),
      };
    case "SET_DAYS_PER_TICK":
      return {
        ...state,
      };
    case "SET_TRIP_LAYER":
      return {
        ...state,
        tripLayer: parseDataToTripLayer(
          action.rawData,
          state.startTime,
          state.endTime
        ),
        cameraProps: cameraStart,
        t0: performance.now(),
        currentTime: state.startTime,
      };
    case "SET_T0":
      return {
        ...state,
        t0: action.t0,
      };
    case "SET_CAMERA_PROPS":
      return {
        ...state,
        cameraProps: interpolateCamera(cameraStart, cameraEnd, action.progress),
      };
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.currentTime };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

export function NHProvider({ children }) {
  const [context, dispatch] = useReducer(NHReducer, initialState);
  const [rawData, setRawData] = useState<RawData | undefined>(undefined);

  const memoizedDispatch = useMemo(() => dispatch, []);

  useEffect(() => {
    fetchTripLayer().then((data) => {
      setRawData(data);
    });
  }, []);

  return (
    <APIProvider apiKey={API_KEY}>
      <NHContext.Provider value={{ ...context, rawData: rawData }}>
        <NHDispatchContext.Provider value={memoizedDispatch}>
          {children}
        </NHDispatchContext.Provider>
      </NHContext.Provider>
    </APIProvider>
  );
}

export default memo(NHProvider);

export function useNH() {
  return useContext(NHContext);
}

export function useNHDispatch() {
  return useContext(NHDispatchContext);
}
