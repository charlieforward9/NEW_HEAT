import React, { useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNH, useNHDispatch } from "./state";
import "./styles.css";
import AttributionsModal from "./AttributionsModal";

const ControlPanel: React.FC = () => {
  const dispatch = useNHDispatch();
  const { currentTime, endTime, animating, showAttributions } = useNH();

  // const onMapConfigChange = useCallback(
  //   (ev: React.ChangeEvent<HTMLSelectElement>) => {
  //     dispatch({ type: "SET_MAP_CONFIG", value: ev.target.value });
  //   },
  //   []
  // );

  // const onDaysPerTickChange = useCallback(
  //   (ev: React.ChangeEvent<HTMLInputElement>) => {
  //     dispatch({
  //       type: "SET_DAYS_PER_TICK",
  //       daysPerTick: Number(ev.target.value),
  //     });
  //   },
  //   []
  // );

  useEffect(() => {
    if (!animating && Math.abs(currentTime - endTime) < 100) {
      dispatch({ type: "SET_ATTRIBUTIONS", show: true });
    }
  }, [currentTime, animating]);

  return (
    <div className="controls">
      {/* <div>
         <label>Map Style</label>
         <select value={mapConfig.id} onChange={onMapConfigChange}>
           {MAP_CONFIGS.map(({ id, label }) => (
             <option key={id} value={id}>
               {label}
             </option>
           ))}
         </select>
       </div>
       <div>
         <label>Days per Tick:</label>
         <input
           type="number"
           value={daysPerTick}
           onChange={onDaysPerTickChange}
         />
       </div> */}
      <div
        className="control-button"
        onClick={() => {
          dispatch({ type: "SET_ANIMATING", animating: !animating });
        }}
      >
        {animating ? "Rest" : "Run it"}
      </div>
      {/* <div
        className="control-button"
        onClick={() => {
          dispatch({ type: "SET_ATTRIBUTIONS", show: !showAttributions });
        }}
      >
        Creds
      </div> */}
      {showAttributions && <AttributionsModal />}
    </div>
  );
};

export default React.memo(ControlPanel);
