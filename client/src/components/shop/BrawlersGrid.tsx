import BrawlerCard from "./brawler-card";
import { ShopItem } from "./@types/shop-types";  

interface BrawlersGridProps {
  brawlers: ShopItem[];
  onSelectBrawler: (brawler: ShopItem) => void;
}

const BrawlersGrid = ({ brawlers, onSelectBrawler }: BrawlersGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {brawlers.map((brawler) => (
        <BrawlerCard key={brawler.id} brawler={brawler} onClick={() => onSelectBrawler(brawler)} />
      ))}
    </div>
  );
};

export default BrawlersGrid;