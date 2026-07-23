import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./index.css";

import { GolfIQProvider } from "./context/GolfIQContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GolfIQProvider>
      <App />
    </GolfIQProvider>
  </BrowserRouter>
);