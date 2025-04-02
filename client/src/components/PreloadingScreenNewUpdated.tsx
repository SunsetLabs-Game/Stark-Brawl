import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  loadingText: string;
  onLoaded: () => void;
}

export default function LoadingScreen({ loadingText, onLoaded }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          onLoaded(); // Call onLoaded when loading is complete
          return 100;
        }
        return oldProgress + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-blue-700 text-white">
      <img
        src="/brawlstars-logo.png"
        alt="Brawl Stars Logo"
        className="mb-4 w-20 h-20"
      />
      <motion.div
        className="w-40 h-2 bg-yellow-400 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
      <p className="mt-2 text-lg font-semibold">{loadingText}</p>
    </div>
  );
}
