import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

// ✅ Initialize theme BEFORE React renders
const initTheme = () => {
  const saved = localStorage.getItem("theme-preference");
  let theme = "dark";
  
  if (saved) {
    try {
      theme = JSON.parse(saved).state.theme;
    } catch (e) {
      console.error("Failed to parse theme preference", e);
    }
  }
  
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
};

initTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" theme="dark" richColors />
  </React.StrictMode>
);
