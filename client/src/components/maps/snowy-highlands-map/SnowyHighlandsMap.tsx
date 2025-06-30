import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Tower {
  id: string;
  x: number;
  y: number;
  type: 'archer' | 'stone' | 'magic';
}

interface SnowyHighlandsMapProps {
  onTowerPlace?: (tower: Tower) => void;
  className?: string;
}

const SnowyHighlandsMap: React.FC<SnowyHighlandsMapProps> = ({ 
  onTowerPlace, 
  className = "" 
}) => {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [selectedTowerType, setSelectedTowerType] = useState<'archer' | 'stone' | 'magic'>('archer');
  const [isPlacing, setIsPlacing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Grid configuration
  const GRID_SIZE = 64;
  const MAP_WIDTH = 800;
  const MAP_HEIGHT = 600;
  const GRID_COLS = Math.floor(MAP_WIDTH / GRID_SIZE);
  const GRID_ROWS = Math.floor(MAP_HEIGHT / GRID_SIZE);

  // Define placement zones (snow patches where towers can be placed)
  const placementZones = [
    { x: 2, y: 2, width: 3, height: 2 },
    { x: 6, y: 3, width: 2, height: 2 },
    { x: 10, y: 2, width: 2, height: 3 },
    { x: 3, y: 6, width: 2, height: 2 },
    { x: 7, y: 7, width: 3, height: 2 },
    { x: 11, y: 6, width: 2, height: 2 },
  ];

  // Check if a position is valid for tower placement
  const isValidPlacement = (gridX: number, gridY: number): boolean => {
    // Check if position is within placement zones
    const inZone = placementZones.some(zone => 
      gridX >= zone.x && gridX < zone.x + zone.width &&
      gridY >= zone.y && gridY < zone.y + zone.height
    );

    // Check if position is not already occupied
    const occupied = towers.some(tower => 
      Math.floor(tower.x / GRID_SIZE) === gridX && 
      Math.floor(tower.y / GRID_SIZE) === gridY
    );

    return inZone && !occupied;
  };

  // Handle mouse click for tower placement
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlacing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const gridX = Math.floor(x / GRID_SIZE);
    const gridY = Math.floor(y / GRID_SIZE);

    if (isValidPlacement(gridX, gridY)) {
      const newTower: Tower = {
        id: `tower-${Date.now()}`,
        x: gridX * GRID_SIZE + GRID_SIZE / 2,
        y: gridY * GRID_SIZE + GRID_SIZE / 2,
        type: selectedTowerType
      };

      setTowers(prev => [...prev, newTower]);
      onTowerPlace?.(newTower);
      setIsPlacing(false);
    }
  };

  // Handle mouse move for placement preview
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });
  };

  // Draw the map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Draw background (snowy highlands)
    const gradient = ctx.createLinearGradient(0, 0, 0, MAP_HEIGHT);
    gradient.addColorStop(0, '#E8F4FD'); // Light blue sky
    gradient.addColorStop(0.3, '#F0F8FF'); // Snowy sky
    gradient.addColorStop(0.7, '#FFFFFF'); // Snow
    gradient.addColorStop(1, '#F5F5F5'); // Light gray ground

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Draw path (icy road)
    ctx.fillStyle = '#B8D4E3';
    ctx.fillRect(GRID_SIZE * 4, 0, GRID_SIZE * 2, MAP_HEIGHT);

    // Draw snow patches (placement zones)
    placementZones.forEach(zone => {
      ctx.fillStyle = '#F8FBFF';
      ctx.fillRect(
        zone.x * GRID_SIZE, 
        zone.y * GRID_SIZE, 
        zone.width * GRID_SIZE, 
        zone.height * GRID_SIZE
      );
      
      // Add snow texture
      ctx.strokeStyle = '#E6F3FF';
      ctx.lineWidth = 1;
      for (let i = 0; i < zone.width * zone.height; i++) {
        const x = (zone.x + (i % zone.width)) * GRID_SIZE + Math.random() * GRID_SIZE;
        const y = (zone.y + Math.floor(i / zone.width)) * GRID_SIZE + Math.random() * GRID_SIZE;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw grid (subtle)
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= MAP_WIDTH; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, MAP_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= MAP_HEIGHT; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(MAP_WIDTH, y);
      ctx.stroke();
    }

    // Draw existing towers
    towers.forEach(tower => {
      drawTower(ctx, tower);
    });

    // Draw placement preview
    if (isPlacing) {
      const gridX = Math.floor(mousePos.x / GRID_SIZE);
      const gridY = Math.floor(mousePos.y / GRID_SIZE);
      
      if (isValidPlacement(gridX, gridY)) {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.fillRect(
          gridX * GRID_SIZE, 
          gridY * GRID_SIZE, 
          GRID_SIZE, 
          GRID_SIZE
        );
      } else {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(
          gridX * GRID_SIZE, 
          gridY * GRID_SIZE, 
          GRID_SIZE, 
          GRID_SIZE
        );
      }
    }
  }, [towers, isPlacing, mousePos]);

  // Draw tower function
  const drawTower = (ctx: CanvasRenderingContext2D, tower: Tower) => {
    const colors = {
      archer: '#8B4513',
      stone: '#696969',
      magic: '#9370DB'
    };

    ctx.fillStyle = colors[tower.type];
    ctx.fillRect(tower.x - 20, tower.y - 20, 40, 40);
    
    // Tower details
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(tower.x - 15, tower.y - 15, 30, 30);
    
    ctx.fillStyle = colors[tower.type];
    ctx.fillRect(tower.x - 10, tower.y - 10, 20, 20);
  };

  return (
    <div className={`snowy-highlands-map ${className}`}>
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => {
            setSelectedTowerType('archer');
            setIsPlacing(true);
          }}
          className={`px-3 py-2 rounded ${
            selectedTowerType === 'archer' && isPlacing 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-600 text-white'
          }`}
        >
          Place Archer Tower
        </button>
        <button
          onClick={() => {
            setSelectedTowerType('stone');
            setIsPlacing(true);
          }}
          className={`px-3 py-2 rounded ${
            selectedTowerType === 'stone' && isPlacing 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-600 text-white'
          }`}
        >
          Place Stone Tower
        </button>
        <button
          onClick={() => {
            setSelectedTowerType('magic');
            setIsPlacing(true);
          }}
          className={`px-3 py-2 rounded ${
            selectedTowerType === 'magic' && isPlacing 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-600 text-white'
          }`}
        >
          Place Magic Tower
        </button>
        {isPlacing && (
          <button
            onClick={() => setIsPlacing(false)}
            className="px-3 py-2 rounded bg-red-600 text-white"
          >
            Cancel
          </button>
        )}
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          className="border border-gray-300 rounded cursor-crosshair"
        />
        
        {isPlacing && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
            Click on snow patches to place {selectedTowerType} tower
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>• Green areas: Valid tower placement zones (snow patches)</p>
        <p>• Blue path: Enemy path (cannot place towers here)</p>
        <p>• Red areas: Invalid placement zones</p>
      </div>
    </div>
  );
};

export default SnowyHighlandsMap; 