import React from "react";
import { createRoot } from "react-dom/client";
import NHProvider from "./state";
import AnimatedMap from "./AnimatedMap";
import HeaderPanel from "./HeaderPanel";

import "./styles.css";
import LoadingOverlay from "./LoadingOverlay";

const App = () => {
  return (
    <NHProvider>
      <HeaderPanel />
      <LoadingOverlay />
      <AnimatedMap />
    </NHProvider>
  );
};

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(<App />);
}
