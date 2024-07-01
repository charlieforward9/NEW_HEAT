import React, { useState } from "react";
import "./styles.css";
import ControlPanel from "./ControlPanel";

const HeaderPanel: React.FC = () => {
  const [isControlPanelVisible, setControlPanelVisible] = useState(false);

  const toggleControlPanel = () => {
    setControlPanelVisible(!isControlPanelVisible);
  };

  return (
    <div className="header-panel">
      <h1>NEW HEAT</h1>
      <div>
        <div className="control-icon" onClick={toggleControlPanel}>
          <div>Controls</div>
        </div>
        {isControlPanelVisible && <ControlPanel />}
      </div>
    </div>
  );
};

export default HeaderPanel;
