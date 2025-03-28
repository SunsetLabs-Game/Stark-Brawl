import { ShopItem } from "./@types/shop-types";  
import { Clock, Wallet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "./price-display";
//import { ItemImage } from "./item-image";
import { BrawlerImage } from "./brawler-image";
import { getRarityBgColor, getRarityBorderColor } from "./utils/shop-utils";
import { CountdownTimer } from "@/components/shop/CountdownTimer";

interface BrawlerCardProps {
  brawler: ShopItem;
  onClick: () => void;
}

const BrawlerCard = ({ brawler, onClick }: BrawlerCardProps) => {
  return (
        <div
      className={`bg-gradient-to-br ${getRarityBgColor(brawler.rarity)} rounded-xl overflow-hidden border-2 ${getRarityBorderColor(brawler.rarity)} hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            {brawler.isNew && (
              <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full mr-2">
                NEW
              </div>
            )}
            {brawler.isNFT && (
              <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full mr-2 flex items-center">
                <Wallet className="h-3 w-3 mr-1" />
                NFT
              </div>
            )}
            {brawler.isLimited && (
              <div className="bg-red-500/80 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <CountdownTimer 
                  timeRemaining={brawler.timeRemaining  ?? "Expired"} 
                  onExpire={() => console.log("⏱️ Expired:", brawler.name)} 
                />
              </div>
            )}
          </div>
          {brawler.rarity && (
            <div
              className={`text-xs px-2 py-0.5 rounded-full ${
                brawler.rarity === "legendary"
                  ? "bg-yellow-500/80 text-yellow-900"
                  : brawler.rarity === "epic"
                  ? "bg-pink-500/80 text-white"
                  : "bg-blue-500/80 text-white"
              }`}
            >
              {brawler.rarity.toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex justify-center mb-3">
            <BrawlerImage brawler={brawler} size="md" />
        </div>

        <h3 className="text-white font-bold text-lg mb-1">{brawler.name}</h3>
        <p className="text-white/70 text-sm mb-3 line-clamp-2 h-10">
          {brawler.description}
        </p>

        <div className="flex justify-between items-center">
          <PriceDisplay
            price={brawler.price}
            priceType={brawler.priceType}
            discount={brawler.discount}
          />
          <Button
            size="sm"
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white border-none"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrawlerCard;