import * as React from "react";
import type { MapConfig } from "./app";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type ControlPanelProps = {
  mapConfigs: MapConfig[];
  mapConfigId: string;
  onMapConfigIdChange: (id: string) => void;
  startDate: Date;
  endDate: Date;
  onSetStartDate: (date: Date) => void;
  onSetEndDate: (date: Date) => void;
  daysPerTick: number;
  onSetDaysPerTick: (days: number) => void;
};

function ControlPanel({
  mapConfigs,
  mapConfigId,
  onMapConfigIdChange,
  startDate,
  endDate,
  onSetStartDate,
  onSetEndDate,
  daysPerTick,
  onSetDaysPerTick,
}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <h3>Change Map Styles</h3>
      <div>
        <select
          value={mapConfigId}
          onChange={(ev) => onMapConfigIdChange(ev.target.value)}
        >
          {mapConfigs.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <h3>Map Layer Control</h3>

      <div>
        <div>
          <div>
            <label>Start Date: </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => date && onSetStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy/MM/dd"
            />
          </div>
          <div>
            <label>End Date: </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => date && onSetEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy/MM/dd"
            />
          </div>
          <div>
            <label>Days per Tick: </label>
            <input
              type="number"
              value={daysPerTick}
              onChange={(ev) => onSetDaysPerTick(Number(ev.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
