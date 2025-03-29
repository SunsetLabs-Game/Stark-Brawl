const events = [
  {
    title: "CRYPTO TOURNAMENT",
    description: "Win exclusive NFTs",
    startTime: new Date(Date.now() + 3600000),
    rewards: "Legendary NFT + 5000 BRAWL",
  },
  {
    title: "DOUBLE XP WEEKEND",
    description: "Earn 2x XP in all modes",
    startTime: new Date(Date.now() + 86400000),
    rewards: "2x XP + Special Skin",
  },
];

const calculateTimeLeft = (startTime: Date) => {
  const difference = +new Date(startTime) - +new Date();
  let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export { calculateTimeLeft, events };
