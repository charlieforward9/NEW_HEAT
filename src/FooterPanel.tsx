import React from "react";
import TimePanel from "./TimePanel";
import { useNH } from "./state";
import LoadingPanel from "./LoadingPanel";

const FooterPanel: React.FC = () => {
  const { loading } = useNH();
  return (
    <div className="footer-panel">
      {loading ? <LoadingPanel /> : <TimePanel />}
    </div>
  );
};

export default FooterPanel;
