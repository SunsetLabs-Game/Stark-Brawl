import { useState } from "react";
import ShopTabs from "../components/shop/shop-tabs"; //Importamos ShopTabs

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("featured");

  return (
    <div className="p-6 text-white bg-gradient-to-r from-purple-700 via-purple-500 to-orange-500 min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Shop</h1>
      {/* Pestañas de navegación */}
      <ShopTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}