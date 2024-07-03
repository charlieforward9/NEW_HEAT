import React from "react";
import { useNH } from "./state";
import ControlPanel from "./ControlPanel";
import LoadingPanel from "./LoadingPanel";
import TimePanel from "./TimePanel";

const HeaderPanel: React.FC = () => {
  const { loading } = useNH();

  return (
    <div className={`header-panel ${loading ? "centered" : "loaded spaced"}`}>
      <div className="top-bar">
        <div>
          <h1>NEW HEAT</h1>
          <p>Modern Odysseys</p>
        </div>
        {!loading && <ControlPanel />}
      </div>
      <div className="bottom-bar">
        {loading ? <LoadingPanel /> : <TimePanel />}
      </div>
    </div>
  );
};

export default HeaderPanel;
