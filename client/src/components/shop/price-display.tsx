import { Gem, Coins, Ticket, Tag, Wallet } from "lucide-react";

interface PriceDisplayProps {
  price: number;
  priceType: string;
  discount?: number;
}

export function PriceDisplay({
  price,
  priceType,
  discount,
}: PriceDisplayProps) {
  let priceIcon;
  let formattedPrice;

  switch (priceType) {
    case "gems":
      priceIcon = <Gem className="h-4 w-4 text-pink-400" />;
      formattedPrice = price;
      break;
    case "coins":
      priceIcon = <Coins className="h-4 w-4 text-yellow-400" />;
      formattedPrice = price;
      break;
    case "tokens":
      priceIcon = <Ticket className="h-4 w-4 text-green-400" />;
      formattedPrice = price;
      break;
    case "usd":
      priceIcon = <Tag className="h-4 w-4 text-green-400" />;
      formattedPrice = `$${price.toFixed(2)}`;
      break;
    case "eth":
      priceIcon = <Wallet className="h-4 w-4 text-blue-400" />;
      formattedPrice = `${price} ETH`;
      break;
    default:
      priceIcon = <Tag className="h-4 w-4 text-green-400" />;
      formattedPrice = price;
  }

  return (
    <div className="flex items-center">
      {discount ? (
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <span className="text-white/50 line-through text-sm mr-1">
              {typeof formattedPrice === "number"
                ? Math.round(formattedPrice * (1 + discount / 100))
                : formattedPrice}
            </span>
            <div className="flex items-center text-white font-bold">
              {priceIcon}
              <span className="ml-1">{formattedPrice}</span>
            </div>
          </div>
          <span className="text-green-400 text-xs">-{discount}%</span>
        </div>
      ) : (
        <div className="flex items-center text-white font-bold">
          {priceIcon}
          <span className="ml-1">{formattedPrice}</span>
        </div>
      )}
    </div>
  );
}
