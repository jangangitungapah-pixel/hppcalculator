import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastProvider } from "./components/ui/ToastProvider.jsx";
import { AppDataProvider } from "./contexts/AppDataContext.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <AppDataProvider>
        <App />
      </AppDataProvider>
    </ToastProvider>
  </React.StrictMode>
);
