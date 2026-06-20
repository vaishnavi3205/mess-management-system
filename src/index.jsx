import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { MessProvider } from "./context/MessContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <MessProvider>
        <AppRoutes />
      </MessProvider>
    </AuthProvider>
  </React.StrictMode>
);