import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  fetchTripLayer,
  interpolateCamera,
  parseDataToTripLayer,
} from "./utils";

import type { NHActions, NHState } from "./types";
import {
  API_KEY,
  cameraEnd,
  cameraStart,
  layerProps,
  MAP_CONFIGS,
  SECOND_IN_DAY_TIMES_TEN,
  Times,
} from "./constants";
import { APIProvider } from "@vis.gl/react-google-maps";

const initialState: NHState = {
  rawData: undefined,
  showMap: false,
  mapConfig: MAP_CONFIGS[0],
  layerProps: layerProps,
  startDate: new Date(Times.START_2020),
  endDate: new Date(Times.FEB_2024),
  startTime: Times.START_2020 / 1000,
  endTime: Times.FEB_2024 / 1000,
  daysPerTick: 15,
  tripLayer: [],
  cameraProps: cameraStart,
  currentTime: 0,
  animating: false,
  loading: true,
  loading_progress: 0,
  showAttributions: false,
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
    case "SET_SHOW_MAP": {
      return {
        ...state,
        showMap: action.show,
      };
    }
    case "SET_START_DATE": {
      return {
        ...state,
        startDate: action.startDate,
        startTime: action.startDate.getTime() / 1000,
        currentTime: action.startDate.getTime() / 1000,
      };
    }
    case "SET_END_DATE":
      return {
        ...state,
        endDate: action.endDate,
        endTime: action.endDate.getTime() / 1000,
        currentTime: state.startDate.getTime() / 1000,
      };
    case "SET_DAYS_PER_TICK":
      return {
        ...state,
      };
    case "SET_TRIP_LAYER":
      return {
        ...state,
        rawData: action.rawData,
        tripLayer: parseDataToTripLayer(
          action.rawData,
          state.startTime,
          state.endTime
        ),
        loading: false,
        cameraProps: cameraStart,
        currentTime: state.startTime,
      };
    case "SET_CAMERA_PROPS":
      return {
        ...state,
        cameraProps: interpolateCamera(cameraStart, cameraEnd, action.progress),
      };
    case "SET_MAP_BREATHING":
      return {
        ...state,
        cameraProps: {
          ...state.cameraProps,
          zoom: state.cameraProps.zoom + action.breath / 20,
          heading: (state.cameraProps.heading ?? 0) - action.breath / 2,
          tilt: (state.cameraProps.tilt ?? 0) + action.breath / 3,
        },
      };
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.currentTime };
    case "SET_ANIMATING":
      console.log(state.endTime, state.currentTime);
      return {
        ...state,
        animating: action.animating,
        currentTime: action.animating
          ? state.startTime
          : //If the next time will exceed the endTime, set the currentTime to the endTime
          state.currentTime +
              (((state.daysPerTick / 60) * SECOND_IN_DAY_TIMES_TEN) %
                (state.endTime - state.startTime)) >
            state.endTime
          ? state.endTime
          : state.currentTime,
      };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_LOADING_PROGRESS":
      return { ...state, loading_progress: action.progress };
    case "SET_ATTRIBUTIONS": {
      return {
        ...state,
        showAttributions: action.show,
      };
    }
    case "SET_ERROR":
      return { ...state, error: action.error };
    default:
      return state;
  }
}

export function NHProvider({ children }) {
  const [context, dispatch] = useReducer(NHReducer, initialState);

  const memoizedDispatch = useMemo(() => dispatch, []);

  useEffect(() => {
    fetchTripLayer((progress) =>
      dispatch({ type: "SET_LOADING_PROGRESS", progress: progress })
    )
      .then((data) => {
        if (data) dispatch({ type: "SET_TRIP_LAYER", rawData: data });
        else throw "No data found.";
      })
      .catch((error) => {
        dispatch({ type: "SET_ERROR", error: `${error}` });
      });
  }, []);

  console.log("API KEY: ", API_KEY);

  return (
    <APIProvider apiKey={API_KEY}>
      <NHContext.Provider value={context}>
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
