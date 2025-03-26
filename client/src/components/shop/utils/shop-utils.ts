export const getRarityBgColor = (rarity?: string) => {
  switch (rarity) {
    case "legendary":
      return "from-yellow-500/20 to-amber-700/20";
    case "epic":
      return "from-pink-500/20 to-purple-700/20";
    case "rare":
      return "from-blue-500/20 to-indigo-700/20";
    case "common":
      return "from-green-500/20 to-emerald-700/20";
    default:
      return "from-purple-900/50 to-fuchsia-900/50";
  }
};

export const getRarityBorderColor = (rarity?: string) => {
  switch (rarity) {
    case "legendary":
      return "border-yellow-500/50";
    case "epic":
      return "border-pink-500/50";
    case "rare":
      return "border-blue-500/50";
    case "common":
      return "border-green-500/50";
    default:
      return "border-purple-500/30";
  }
};
