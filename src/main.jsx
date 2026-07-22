import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./index.css";

import { GolfIQProvider } from "./context/GolfIQContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GolfIQProvider>
        <App />
      </GolfIQProvider>
    </BrowserRouter>
  </React.StrictMode>
);