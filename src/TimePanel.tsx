import React, { useMemo } from "react";
import { useNH } from "./state";
import "./styles.css";

function TimePanel() {
  const { loading, currentTime } = useNH();
  const formatter = useMemo(() => {
    return new Intl.DateTimeFormat("default", {
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <div className="time-panel">
      <div style={{ fontSize: "36px" }}>
        Current:{" "}
        <strong>{formatter.format(new Date(currentTime * 1000))}</strong>
      </div>
    </div>
  );
}

export default React.memo(TimePanel);
