import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNH, useNHDispatch } from "./state";
import "./styles.css";

const ControlPanel: React.FC = () => {
  const dispatch = useNHDispatch();
  const { loading, animating } = useNH();

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
        className="animate-button"
        onClick={() => {
          dispatch({ type: "SET_ANIMATING", animating: !animating });
        }}
      >
        {animating ? "Play" : "Pause"}
      </div>
    </div>
  );
};

export default React.memo(ControlPanel);
