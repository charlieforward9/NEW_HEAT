import React from "react";
import { useNH } from "./state";

const LoadingOverlay: React.FC = () => {
  const { showMap } = useNH();
  return (
    <div className={`loading-overlay ${!showMap ? "visible" : "hidden"}`}>
      Dreamt It
    </div>
  );
};

export default LoadingOverlay;
