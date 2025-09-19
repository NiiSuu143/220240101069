import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import ShortenerPage from "./pages/ShortenerPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<ShortenerPage />} />
        <Route path="stats" element={<StatsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
