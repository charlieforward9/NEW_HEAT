import React from "react";
import { useNH } from "./state";

function LoadingPanel() {
  const { loading_progress } = useNH();

  return (
    <div
      className="loading-bar"
      // @ts-ignore --loading-progress is a CSS variable
      style={{ "--loading-progress": `${loading_progress.toFixed(1)}%` }}
    >
      <span className="loading-text">{`Heatin' up.. ${loading_progress.toFixed(
        2
      )}%`}</span>
    </div>
  );
}

export default React.memo(LoadingPanel);
