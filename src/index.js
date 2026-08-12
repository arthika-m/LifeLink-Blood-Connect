import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
import { AuthProvider } from "./AuthContext";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>

    <AuthProvider>

      <Auth0Provider
        domain="dev-wesy33w1g8gd7cy6.us.auth0.com"
        clientId="l1PMr0YjuXUcskEr16APUw6tN804wYId"
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >

        <App />

      </Auth0Provider>

    </AuthProvider>

  </React.StrictMode>
);