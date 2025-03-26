import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShopPage from "./pages/shop";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/shop" element={<ShopPage />} />
      </Routes>
    </BrowserRouter>
  );
}
