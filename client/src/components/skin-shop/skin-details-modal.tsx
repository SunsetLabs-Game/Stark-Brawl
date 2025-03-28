import React from "react";

interface Skin {
  name: string;
  description: string;
  price: number;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  image: string;
  discountedPrice?: number;
}

interface SkinModalProps {
  skin: Skin | null;
  onClose: () => void;
}

const SkinModal: React.FC<SkinModalProps> = ({ skin, onClose }) => {
  if (!skin) return null;

  const rarityColors: Record<Skin["rarity"], string> = {
    COMMON: "bg-gray-400",
    RARE: "bg-blue-500",
    EPIC: "bg-pink-600",
    LEGENDARY: "bg-yellow-400 text-black",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
<div className="relative w-[90%] max-w-[580px] h-[420px] bg-purple-800/60 border border-pink-400 p-5 text-white shadow-lg flex gap-5">




        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-white text-2xl font-bold"
        >
          &times;
        </button>
<div className="w-1/3 flex flex-col items-center justify-start">
  <div className="flex gap-2 mb-4 self-start">
    <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full uppercase">NFT</span>
    <span className={`${rarityColors[skin.rarity]} text-xs font-semibold px-2 py-1 rounded-full uppercase`}>
      {skin.rarity}
    </span>
  </div>

  <img src={skin.image} alt={skin.name} className="h-40 object-contain mb-3" />

  <div className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
    <span>📄</span>
    <span>#3210</span>
  </div>
</div>

        <div className="w-2/3 flex flex-col justify-between h-full">
          <h2 className="text-2xl font-bold mb-2">{skin.name}</h2>
          <p className="text-sm opacity-90 mb-4">{skin.description}</p>

          <div className="bg-indigo-900/90 p-4 rounded-xl mb-5 text-sm">
            <p className="font-semibold mb-1">ℹ️ NFT Information</p>
            <p className="opacity-80">
              This item is a unique NFT on the Starknet blockchain. Once purchased,
              it will be transferred to your wallet and can be traded on supported marketplaces.
            </p>
          </div>

          <div className="flex justify-between items-center font-bold mb-6 text-base">
  <span>Price:</span>
  <span className="text-pink-300 text-xl flex items-center gap-1">
    💎 {skin.discountedPrice ?? skin.price}
  </span>
</div>


<div className="flex gap-5 mt-1">
  <button className="bg-pink-500 hover:bg-pink-600 px-6 py-2  font-bold text-white text-lg shadow">
    Buy Now
  </button>
  <button className="bg-white text-black hover:bg-gray-100 px-6 py-3 font-bold border border-black text-lg shadow">
    Add to Cart
  </button>
</div>

        </div>

      </div>
    </div>
  );
};

export default SkinModal;
