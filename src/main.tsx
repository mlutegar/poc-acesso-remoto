import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider } from "./auth/AuthProvider";
import "./index.css";
import { OperationsProvider } from "./operations/Store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <OperationsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </OperationsProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
