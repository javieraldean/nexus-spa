import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import App from "./App";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/buttons.css";
import "./styles/components/book-card.css";
import "./styles/components/sidebar.css";
import "./styles/components/table.css";
import "./styles/components/cart.css";
import "./styles/pages/coworking.css";
import "./styles/pages/library.css";
import "./styles/spa.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
