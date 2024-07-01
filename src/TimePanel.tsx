import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNH, useNHDispatch } from "./state";
import "./styles.css";

function TimePanel() {
  const { loading, currentTime, startTime, endTime } = useNH();
  const dispatch = useNHDispatch();
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("default", {
        month: "long",
        year: "numeric",
      }),
    []
  );

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
          {formatter.format(new Date(startTime * 1000))}
          {isStartPickerOpen && (
            <div className="datepicker-wrapper">
              <DatePicker
                selected={new Date(startTime * 1000)}
                onChange={onStartDateChange}
                selectsStart
                startDate={new Date(startTime * 1000)}
                endDate={new Date(endTime * 1000)}
                dateFormat="yyyy/MM/dd"
                showMonthYearPicker
                inline
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
          <div
            className="slider-value"
            style={{
              left: `calc(${sliderPosition}% )`,
            }}
          >
            {formatter.format(new Date(currentTime * 1000))}
          </div>
        </div>
        <div
          className="date-container"
          onClick={() => setEndPickerOpen(!isEndPickerOpen)}
        >
          {formatter.format(new Date(endTime * 1000))}
          {isEndPickerOpen && (
            <div className="datepicker-wrapper">
              <DatePicker
                selected={new Date(endTime * 1000)}
                onChange={onEndDateChange}
                selectsEnd
                startDate={new Date(startTime * 1000)}
                endDate={new Date(endTime * 1000)}
                minDate={new Date(startTime * 1000)}
                dateFormat="yyyy/MM/dd"
                showMonthYearPicker
                inline
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(TimePanel);
