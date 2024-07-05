import React, { useCallback, useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { useNH, useNHDispatch } from "./state";
import { ONE_YEAR_IN_MS, Times } from "./constants";

import "react-datepicker/dist/react-datepicker.css";

const formatter = new Intl.DateTimeFormat("default", {
  month: "long",
  year: "numeric",
});

function TimePanel() {
  const { currentTime, startTime, endTime, startDate, endDate, animating } =
    useNH();
  const dispatch = useNHDispatch();

  const [isStartPickerOpen, setStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setEndPickerOpen] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);

  const sliderRef = useRef<HTMLInputElement>(null);

  const handleSliderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      dispatch({
        type: "SET_CURRENT_TIME",
        currentTime: value,
      });

      const range = event.target;
      const newValue =
        ((value - Number(range.min)) /
          (Number(range.max) - Number(range.min))) *
        100;
      setSliderPosition(newValue);
    },
    [dispatch]
  );

  useEffect(() => {
    if (sliderRef.current) {
      const newValue =
        ((currentTime - Number(startTime)) /
          (Number(endTime) - Number(startTime))) *
        100;
      setSliderPosition(newValue);
    }
  }, [currentTime, startTime, endTime]);

  const onStartDateChange = useCallback(
    (date: Date | null) => {
      if (date) {
        dispatch({
          type: "SET_START_DATE",
          startDate: date,
        });
        setStartPickerOpen(false);
      }
    },
    [dispatch]
  );

  const onEndDateChange = useCallback(
    (date: Date | null) => {
      if (date) {
        dispatch({
          type: "SET_END_DATE",
          endDate: date,
        });
        setEndPickerOpen(false);
      }
    },
    [dispatch]
  );

  return (
    <div className="time-panel">
      <div className="slider-container">
        <div
          className="date-container"
          onClick={() => setStartPickerOpen(!isStartPickerOpen)}
        >
          <span className="date-text">
            {formatter.format(startDate).slice(-5)}
          </span>
          <span className="default-text">Start</span>
          {isStartPickerOpen && (
            <div className="datepicker-wrapper">
              <DatePicker
                inline
                selectsStart
                showYearPicker
                selected={startDate}
                startDate={startDate}
                endDate={endDate}
                minDate={new Date(Times.START_2020)}
                maxDate={new Date(endDate.getTime() - ONE_YEAR_IN_MS)}
                onChange={onStartDateChange}
              />
            </div>
          )}
        </div>
        <div className="slider-wrapper">
          <input
            ref={sliderRef}
            type="range"
            min={startTime}
            max={endTime}
            value={currentTime}
            onChange={handleSliderChange}
            className="time-slider"
          />
          {(animating || startTime != currentTime) && (
            <div
              className="slider-value"
              style={{
                left: `calc(${sliderPosition}% )`,
              }}
            >
              {formatter.format(new Date(currentTime * 1000))}
            </div>
          )}
        </div>
        <div
          className="date-container"
          onClick={() => setEndPickerOpen(!isEndPickerOpen)}
        >
          <span className="date-text">
            {formatter.format(endDate).slice(-5)}
          </span>
          <span className="default-text">End</span>
          {isEndPickerOpen && (
            <div className="datepicker-wrapper">
              <DatePicker
                inline
                selectsEnd
                showYearPicker
                selected={endDate}
                startDate={startDate}
                endDate={endDate}
                minDate={new Date(startDate.getTime() + ONE_YEAR_IN_MS)}
                maxDate={new Date(Times.FEB_2024)}
                onChange={onEndDateChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(TimePanel);
