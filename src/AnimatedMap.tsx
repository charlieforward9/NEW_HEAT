import { Map as ReactGoogleMap } from "@vis.gl/react-google-maps";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DeckGlOverlay } from "./DeckGLOverlay";
import { TripsLayer } from "deck.gl";

import { useNH, useNHDispatch } from "./state";
import { defaultCenter } from "./constants";

export default function AnimatedMap() {
  const dispatch = useNHDispatch();
  const {
    rawData,
    mapConfig,
    layerProps,
    animationDuration,
    startTime,
    endTime,
    daysPerTick,
    tripLayer,
    cameraProps,
    t0,
    currentTime,
    loading,
  } = useNH();

  const rafId = useRef<number>();

  const getDeckGlLayers = useCallback(
    (t: number) => {
      if (!tripLayer) return [];
      return [
        new TripsLayer({
          ...layerProps,
          data: tripLayer,
          currentTime: t,
        }),
      ];
    },
    [tripLayer]
  );

  const layers = useMemo(() => getDeckGlLayers(currentTime), [currentTime]);

  const loop = useCallback((t: number) => {
    if (t0 === 0) {
      dispatch({ type: "SET_T0", t0: t });
    }
    rafId.current = requestAnimationFrame(loop);

    const elapsedTimeRelative = (t - t0) / animationDuration;
    dispatch({
      type: "SET_CAMERA_PROPS",
      progress: Math.cos(Math.PI + 2 * Math.PI * elapsedTimeRelative) / 2 + 0.5,
    });

    const elapsedSeconds = Number(
      ((t - t0 / 1000) * (daysPerTick * 86.4)).toFixed(0)
    );

    const newTime = startTime + (elapsedSeconds % (endTime - startTime));

    if (newTime < endTime) {
      dispatch({ type: "SET_CURRENT_TIME", currentTime: newTime });
    } else {
      //Reset
      dispatch({ type: "SET_T0", t0: performance.now() });
      dispatch({ type: "SET_CURRENT_TIME", currentTime: startTime });
    }
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_T0", t0: performance.now() });
    dispatch({ type: "SET_CURRENT_TIME", currentTime: startTime });
    dispatch({ type: "SET_TRIP_LAYER", rawData: rawData ?? {} });
  }, [rawData, startTime, endTime, daysPerTick]);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "SET_LOADING", loading: false });
    }, 2000);
  }, [tripLayer]);

  useEffect(() => {
    dispatch({ type: "SET_CURRENT_TIME", currentTime: startTime });
    if (loading) return;
    let rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [daysPerTick, startTime, endTime, loading]);

  return (
    <ReactGoogleMap
      mapId={mapConfig.mapId || null}
      mapTypeId={mapConfig.mapTypeId}
      styles={mapConfig.styles}
      defaultCenter={defaultCenter}
      defaultZoom={11}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      reuseMaps={true}
      {...cameraProps}
    >
      <DeckGlOverlay layers={layers} />
    </ReactGoogleMap>
  );
}
