import React, { useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNH, useNHDispatch } from "./state";
import { MAP_CONFIGS } from "./constants";
import "./styles.css";

const ControlPanel: React.FC = () => {
  const dispatch = useNHDispatch();
  const {
    mapConfig,
    startDate: globalStartDate,
    endDate: globalEndDate,
    daysPerTick: globalDaysPerTick,
  } = useNH();

  const [localMapConfig, setLocalMapConfig] = useState(mapConfig.id);
  const [localStartDate, setLocalStartDate] = useState(globalStartDate);
  const [localEndDate, setLocalEndDate] = useState(globalEndDate);
  const [localDaysPerTick, setLocalDaysPerTick] = useState(globalDaysPerTick);

  const onMapConfigChange = useCallback(
    (ev: React.ChangeEvent<HTMLSelectElement>) => {
      setLocalMapConfig(ev.target.value);
    },
    []
  );

  const onStartDateChange = useCallback((date: Date | null) => {
    if (date) setLocalStartDate(date);
  }, []);

  const onEndDateChange = useCallback((date: Date | null) => {
    if (date) setLocalEndDate(date);
  }, []);

  const onDaysPerTickChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setLocalDaysPerTick(Number(ev.target.value));
    },
    []
  );

  const applyChanges = useCallback(() => {
    dispatch({ type: "SET_MAP_CONFIG", value: localMapConfig });
    dispatch({ type: "SET_START_DATE", startDate: localStartDate });
    dispatch({ type: "SET_END_DATE", endDate: localEndDate });
    dispatch({ type: "SET_DAYS_PER_TICK", daysPerTick: localDaysPerTick });
  }, [
    localMapConfig,
    localStartDate,
    localEndDate,
    localDaysPerTick,
    dispatch,
  ]);

  return (
    <div className="control-panel">
      <div className="controls">
        <div>
          <label>Map Style</label>
          <select value={localMapConfig} onChange={onMapConfigChange}>
            {MAP_CONFIGS.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Start:</label>
          <DatePicker
            selected={localStartDate}
            onChange={onStartDateChange}
            selectsStart
            startDate={localStartDate}
            endDate={localEndDate}
            dateFormat="yyyy/MM/dd"
          />
        </div>
        <div>
          <label>End:</label>
          <DatePicker
            selected={localEndDate}
            onChange={onEndDateChange}
            selectsEnd
            startDate={localStartDate}
            endDate={localEndDate}
            minDate={localStartDate}
            dateFormat="yyyy/MM/dd"
          />
        </div>
        <div>
          <label>Days per Tick:</label>
          <input
            type="number"
            value={localDaysPerTick}
            onChange={onDaysPerTickChange}
          />
        </div>
        <button onClick={applyChanges}>Apply Changes</button>
      </div>
    </div>
  );
};

export default React.memo(ControlPanel);
