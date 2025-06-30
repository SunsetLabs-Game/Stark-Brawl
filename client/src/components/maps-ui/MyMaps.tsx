import { motion } from "framer-motion";
import { MyMap } from "@/data/maps-data";
import {
  ThumbsUp,
  ThumbsDown,
  Users,
  Clock,
  SquarePen,
  Eye,
  Trash,
  Copy,
} from "lucide-react";
import { useState } from "react";
import SnowyHighlandsMap from "@/components/maps/snowy-highlands-map/SnowyHighlandsMap";
import ToxicSwampMap from "@/components/maps/toxic-swamp-map/ToxicSwampMap";

interface MyMapsProps {
  maps: MyMap[];
}

const MyMaps: React.FC<MyMapsProps> = ({ maps }) => {
  const [editingMap, setEditingMap] = useState<MyMap | null>(null);
  const [towers, setTowers] = useState<any[]>([]);

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  const handleEditMap = (map: MyMap) => {
    setEditingMap(map);
  };

  const handleCloseEdit = () => {
    setEditingMap(null);
  };

  const handleTowerPlace = (tower: any) => {
    console.log("Tower placed:", tower);
    setTowers((prev) => [...prev, tower]);
  };

  // If editing Snowy Highlands map, show the interactive component
  if (editingMap?.name === "Snowy Highlands") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Editing: Snowy Highlands</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCloseEdit}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium"
          >
            Close Editor
          </motion.button>
        </div>
        <SnowyHighlandsMap 
          onTowerPlace={handleTowerPlace}
          className="bg-blue-600/20 p-4 rounded-lg"
        />
      </div>
    );
  }

  // If editing Toxic Swamp map, show the editor
  if (editingMap?.type === "ToxicSwamp") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Editing: {editingMap.name}
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCloseEdit}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium"
          >
            Close Editor
          </motion.button>
        </div>
        <ToxicSwampMap
          onTowerPlaced={handleTowerPlace}
          className="bg-blue-600/20 p-4 rounded-lg"
        />
      </div>
    );
  }

  return (
    <>
      {maps.map((map, index) => (
        <motion.div
          key={map.name}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col md:flex-row bg-blue-600/20 p-4 rounded-lg"
        >
          <div className="w-full h-[200px] md:w-[250px] md:h-[260px] flex-shrink-0 rounded-lg mb-4 md:mb-0 md:mr-4">
            {map.type === "ToxicSwamp" ? (
              <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden">
                <ToxicSwampMap
                  disabled={true}
                  className="w-full h-full pointer-events-none"
                />
              </div>
            ) : (
              <img
                src={map?.image}
                alt=""
                className="object-cover w-full h-[200px] md:h-[260px] rounded-lg"
              />
            )}
          </div>
          <div className="flex flex-col justify-between w-full">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg text-white font-semibold">{map.name}</h3>
                <div>
                  <p className="text-blue-300/90 font-semibold text-sm">
                    {map.name}
                  </p>
                  <div className="flex items-center gap-[6px] mt-2">
                    <Clock width={15} height={15} className="" />
                    <p className={`text-[13px] font-medium text-blue-300/90`}>
                      Last Edited {map.lastEdited}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  {map.likes !== null && (
                    <div className="flex items-center gap-1">
                      <ThumbsUp
                        width={18}
                        height={18}
                        className="text-green-500"
                      />
                      <p className="font-medium">
                        {map.likes.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {map.dislikes !== null && (
                    <div className="flex items-center gap-1">
                      <ThumbsDown
                        width={18}
                        height={18}
                        className="text-red-400"
                      />
                      <p className="font-medium">
                        {map.dislikes.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {map.dislikes !== null && (
                    <div className="flex items-center gap-1">
                      <Users width={18} height={18} className="text-blue-300" />
                      <p className="font-medium">
                        {map.dislikes.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {map.type && (
                <button
                  className={`${
                    map.type === "Published" ? "bg-green-500" : "bg-yellow-500"
                  } text-white py-1 px-2 rounded-full capitalize text-xs font-bold flex-shrink-0`}
                >
                  {map.type}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 justify-end sm:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEditMap(map)}
                className="px-3 py-1 flex items-center gap-1 bg-blue-600 rounded-lg text-sm font-bold"
              >
                <SquarePen width={12} height={12} />
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 flex items-center gap-1 bg-purple-600 rounded-lg text-sm font-bold"
              >
                <Eye width={12} height={12} />
                Test
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 flex items-center gap-1 bg-yellow-600 rounded-lg text-sm font-bold"
              >
                <Copy width={12} height={12} />
                Duplicate
              </motion.button>
              {map.type !== "Published" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 flex items-center gap-1 bg-green-600 rounded-lg text-sm font-bold"
                >
                  <ThumbsUp width={12} height={12} />
                  Publish
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 flex items-center gap-1 bg-red-600 rounded-lg text-sm font-bold"
              >
                <Trash width={12} height={12} />
                Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default MyMaps;
