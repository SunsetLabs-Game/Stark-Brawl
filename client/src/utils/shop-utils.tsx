// Función para renderizar el precio según el tipo
export const renderPrice = (price: number, priceType: string, discount?: number) => {
    const discountedPrice = discount ? price - (price * discount) / 100 : price
  
    return (
      <div className="flex flex-col">
        {discount && (
          <div className="flex items-center">
            <span className="text-white/50 text-xs line-through mr-1">{price}</span>
            <span className="bg-green-500 text-white text-xs px-1 rounded">-{discount}%</span>
          </div>
        )}
        <div className="flex items-center">
          {priceType === "gems" && (
            <>
              <div className="w-4 h-4 bg-pink-500 rounded-full mr-1"></div>
              <span className="text-white font-bold">{discountedPrice}</span>
            </>
          )}
          {priceType === "coins" && (
            <>
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-1"></div>
              <span className="text-white font-bold">{discountedPrice}</span>
            </>
          )}
          {priceType === "tokens" && (
            <>
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-1"></div>
              <span className="text-white font-bold">{discountedPrice}</span>
            </>
          )}
          {priceType === "usd" && <span className="text-white font-bold">${discountedPrice.toFixed(2)}</span>}
          {priceType === "eth" && (
            <span className="text-white font-bold flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97"></path>
              </svg>
              {discountedPrice.toFixed(3)}
            </span>
          )}
        </div>
      </div>
    )
  }
  
  // Función para obtener el color de fondo según la rareza
  export const getRarityBgColor = (rarity?: string) => {
    switch (rarity) {
      case "legendary":
        return "from-yellow-700/80 to-amber-900/80"
      case "epic":
        return "from-pink-700/80 to-purple-900/80"
      case "rare":
        return "from-blue-700/80 to-indigo-900/80"
      case "common":
        return "from-gray-700/80 to-slate-900/80"
      default:
        return "from-violet-700/80 to-purple-900/80"
    }
  }
  
  // Función para obtener el color del borde según la rareza
  export const getRarityBorderColor = (rarity?: string) => {
    switch (rarity) {
      case "legendary":
        return "border-yellow-500"
      case "epic":
        return "border-pink-500"
      case "rare":
        return "border-blue-500"
      case "common":
        return "border-gray-500"
      default:
        return "border-violet-500"
    }
  }
  
  