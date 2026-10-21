import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import App from "./App.jsx";
import SwordCursor from "./components/SwordCursor.jsx";
import { AuthProvider } from "./lib/auth-context.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MotionConfig reducedMotion="user">
          <App />
          <SwordCursor />
        </MotionConfig>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
