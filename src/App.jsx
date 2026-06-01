import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Library from "./pages/Library";
import ItemDetail from "./pages/ItemDetail";
import Coworking from "./pages/Coworking";
import SpaceDetail from "./pages/SpaceDetail";
import Cart from "./pages/Cart";
import Historial from "./pages/Historial";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Header />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route path="/library" element={<Library />} />
          <Route path="/library/items/:id" element={<ItemDetail />} />

          <Route path="/cart" element={<Cart />} />

          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <Historial />
              </ProtectedRoute>
            }
          />

          <Route path="/coworking" element={<Coworking />} />
          <Route path="/coworking/spaces/:id" element={<SpaceDetail />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
