import React from "react";
import { createRoot } from "react-dom/client";
import NHProvider from "./state";
import AnimatedMap from "./AnimatedMap";
import FooterPanel from "./FooterPanel";
import HeaderPanel from "./HeaderPanel";

import "./styles.css";

const App = () => {
  return (
    <NHProvider>
      <HeaderPanel />
      <AnimatedMap />
      <FooterPanel />
    </NHProvider>
  );
};

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(<App />);
}
