import React from "react";
import { useNH } from "./state";
import ControlPanel from "./ControlPanel";

const HeaderPanel: React.FC = () => {
  const { loading } = useNH();

  return (
    <div className="header-panel">
      <h1>NEW HEAT</h1>
      {!loading && <ControlPanel />}
    </div>
  );
};

export default HeaderPanel;
