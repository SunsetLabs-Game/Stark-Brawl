import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SkinModal from "./skin-details-modal";

interface Skin {
  name: string;
  description: string;
  price: number;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  image: string;
  discountedPrice?: number;
}

const getRarityBgColor = (rarity: Skin["rarity"]) => {
  switch (rarity) {
    case "LEGENDARY":
      return "from-yellow-200 to-yellow-400";
    case "EPIC":
      return "from-pink-300 to-pink-500";
    case "RARE":
      return "from-blue-300 to-blue-500";
    default:
      return "from-gray-300 to-gray-400";
  }
};

const getRarityBorderColor = (rarity: Skin["rarity"]) => {
  switch (rarity) {
    case "LEGENDARY":
      return "from-yellow-200/50 to-yellow-400/50";
    case "EPIC":
      return "from-pink-300/50 to-pink-500/50";
    case "RARE":
      return "from-blue-300/50 to-blue-500/50";
    default:
      return "from-gray-300/50 to-gray-400/50";
  }
};

const skins: Skin[] = [
  {
    name: "Cyber Samurai",
    description: "Futuristic samurai skin with neon effects and unique animations.",
    price: 149,
    rarity: "EPIC",
    image: "/nft1.png",
  },
  {
    name: "Desert Warrior",
    description: "Sand-themed warrior with unique desert storm abilities.",
    price: 100,
    discountedPrice: 80,
    rarity: "RARE",
    image: "/nft2.png",
  },
  {
    name: "Golden Gladiator",
    description: "Exclusive golden skin with special effects and animations.",
    price: 299,
    rarity: "LEGENDARY",
    image: "/nft3.png",
  },
  {
    name: "Shadow Ninja",
    description: "Stealthy ninja with smoke dash and shadow blend.",
    price: 129,
    rarity: "RARE",
    image: "/nft4.png",
  },
  {
    name: "Frost Mage",
    description: "Mage with freezing aura and snowy animations.",
    price: 159,
    rarity: "EPIC",
    image: "/nft5.png",
  },
  {
    name: "Jungle Beast",
    description: "Savage beast with wild roar and jungle camo effects.",
    price: 199,
    rarity: "LEGENDARY",
    image: "/nft6.png",
  },
];

const SkinCard = () => {
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {skins.map((skin, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${getRarityBgColor(
              skin.rarity
            )} rounded-xl overflow-hidden border-2 ${getRarityBorderColor(
              skin.rarity
            )} hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300`}
            onClick={() => setSelectedSkin(skin)}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                </div>
                <div
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    skin.rarity === "LEGENDARY"
                      ? "bg-yellow-500/80 text-yellow-900"
                      : skin.rarity === "EPIC"
                      ? "bg-pink-500/80 text-white"
                      : "bg-blue-500/80 text-white"
                  }`}
                >
                  {skin.rarity}
                </div>
              </div>

              <div className="flex justify-center mb-3">
                <img
                  src={skin.image}
                  alt={skin.name}
                  className="h-20 object-contain"
                />
              </div>

              <h3 className="text-white font-bold text-lg mb-1">{skin.name}</h3>
              <p className="text-white/70 text-sm mb-3 line-clamp-2 h-10">
                {skin.description}
              </p>

              <div className="flex justify-between items-center">
                <div>
                  {skin.discountedPrice ? (
                    <>
                      <p className="line-through text-sm text-white/50">
                        💎 {skin.price}
                      </p>
                      <p className="text-green-300 font-bold text-sm">
                        💎 {skin.discountedPrice} (
                        -{100 - Math.round((skin.discountedPrice / skin.price) * 100)}%)
                      </p>
                    </>
                  ) : (
                    <p className="text-white font-bold text-sm">
                      💎 {skin.price}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white border-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSkin(skin);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SkinModal skin={selectedSkin} onClose={() => setSelectedSkin(null)} />
    </>
  );
};

export default SkinCard;
