import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastProvider } from "./components/ui/ToastProvider.jsx";
import { AppDataProvider } from "./contexts/AppDataContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AuthStorageBridge } from "./components/system/AuthStorageBridge.jsx";
import { SyncProvider } from "./contexts/SyncContext.jsx";
import { PwaProvider } from "./contexts/PwaContext.jsx";
import { PwaUpdatePrompt } from "./components/pwa/PwaUpdatePrompt.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <AppDataProvider>
        <AuthProvider>
          <AuthStorageBridge />
          <SyncProvider>
            <PwaProvider>
              <App />
              <PwaUpdatePrompt />
            </PwaProvider>
          </SyncProvider>
        </AuthProvider>
      </AppDataProvider>
    </ToastProvider>
  </React.StrictMode>
);
