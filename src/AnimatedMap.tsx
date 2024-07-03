import { Map as ReactGoogleMap } from "@vis.gl/react-google-maps";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { TripsLayer } from "deck.gl";
import { DeckGlOverlay } from "./DeckGLOverlay";
import { useNH, useNHDispatch } from "./state";

export default function AnimatedMap() {
  const dispatch = useNHDispatch();
  const {
    rawData,
    mapConfig,
    layerProps,
    startTime,
    endTime,
    daysPerTick,
    tripLayer,
    cameraProps,
    currentTime,
    animating,
    loading,
  } = useNH();

  const rafIdRef = useRef<number>();
  const currentTimeRef = useRef(currentTime);

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

  const layers = useMemo(
    () => getDeckGlLayers(currentTime),
    [tripLayer, currentTime]
  );

  const deferredLayers = useDeferredValue(layers);

  const loop = (t: number) => {
    if (!animating) return;
    rafIdRef.current = requestAnimationFrame(loop);

    const elapsedTimeRelative =
      (currentTimeRef.current - startTime) / (endTime - startTime);

    dispatch({
      type: "SET_CAMERA_PROPS",
      progress: elapsedTimeRelative,
    });

    const newTime =
      currentTimeRef.current +
      (((daysPerTick / 60) * 864000) % (endTime - startTime));

    if (newTime < endTime) {
      dispatch({ type: "SET_CURRENT_TIME", currentTime: newTime });
    } else {
      dispatch({ type: "SET_ANIMATING", animating: false });
    }
  };

  useEffect(() => {
    currentTimeRef.current = currentTime; // Keep the ref updated
  }, [currentTime]);

  useEffect(() => {
    dispatch({ type: "SET_CURRENT_TIME", currentTime: startTime });
    rawData && dispatch({ type: "SET_TRIP_LAYER", rawData: rawData });
  }, [rawData, startTime, endTime, daysPerTick]);

  useEffect(() => {
    if (loading || !animating) cancelAnimationFrame(rafIdRef.current ?? 0);
    rafIdRef.current = requestAnimationFrame((t) => loop(currentTime));
    return () => {
      cancelAnimationFrame(rafIdRef.current ?? 0);
    };
  }, [animating, daysPerTick, startTime, endTime, loading]);

  useEffect(() => {
    if (loading && !animating) {
      const zoomInterval = setInterval(() => {
        dispatch({
          type: "SET_MAP_BREATHING",
          breath: Math.sin(Date.now() / 1000),
        });
      }, 100); // Change zoom level every millisecond

      return () => clearInterval(zoomInterval); // Clear interval on component unmount
    }
  }, [animating]);

  return (
    <ReactGoogleMap
      mapId={mapConfig.mapId || null}
      mapTypeId={mapConfig.mapTypeId}
      styles={mapConfig.styles}
      defaultCenter={cameraProps.center}
      defaultZoom={cameraProps.zoom}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      reuseMaps={true}
      keyboardShortcuts={false}
      {...((animating || loading) && cameraProps)}
      onTilesLoaded={() => dispatch({ type: "SET_SHOW_MAP", show: true })}
    >
      <DeckGlOverlay layers={deferredLayers} />
    </ReactGoogleMap>
  );
}
