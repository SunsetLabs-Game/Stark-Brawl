import { useState } from "react";
import { ShopTabs } from "@/components/shop/shop-tabs";

export default function SkinShopPage() {
  const [activeTab, setActiveTab] = useState("skins");

  return (
    <div className="p-6 text-blue-900">
      <ShopTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
