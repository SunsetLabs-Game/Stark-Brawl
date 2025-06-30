    import { useEffect, useRef, useState } from "react";
    import Desert from "@/assets/maps/desert-bonefiel-map.png";
    import Tower from "@/assets/tower-defense-monster-2d-sprites/PNG/1/1_enemies_1_ATTACK_000.png";

    interface Coordinates {
    position_x: number;
    position_y: number;
    }

    export default function DesertBonefieldMap() {
    const mapRef = useRef<HTMLCanvasElement>(null);
    const [placedTowers, setPlacedTowers] = useState<Coordinates[]>([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const towerSpots: Coordinates[] = [
        { position_x: 90, position_y: 110 },
        { position_x: 500, position_y: 150 },
        { position_x: 770, position_y: 135 },
        { position_x: 1005, position_y: 150 },
        { position_x: 975, position_y: 340 },
        { position_x: 205, position_y: 400 },
        { position_x: 840, position_y: 525 },
        { position_x: 445, position_y: 570 },
    ];

    useEffect(() => {
        const canvas = mapRef.current;
        const context = canvas?.getContext("2d");
        if (!context || !canvas) return;

        const image = new Image();
        image.src = Desert;
        image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        towerSpots.forEach((spot) => {
            context.fillStyle = "rgba(0, 0, 0, 0.1)";
            context.fillRect(spot.position_x, spot.position_y, 40, 40);
        });

        const towerImg = new Image();
        towerImg.src = Tower;
        towerImg.onload = () => {
            placedTowers.forEach((tower) => {
            context.drawImage(towerImg, tower.position_x - 20, tower.position_y - 60, 100, 100);
            });
        };
        };
    }, [placedTowers, towerSpots]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = mapRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const clickedSpot = towerSpots.find(
        (spot) =>
            mouseX >= spot.position_x &&
            mouseX <= spot.position_x + 40 &&
            mouseY >= spot.position_y &&
            mouseY <= spot.position_y + 40
        );

        if (clickedSpot) {
        const alreadyPlaced = placedTowers.some(
            (tower) =>
            tower.position_x === clickedSpot.position_x &&
            tower.position_y === clickedSpot.position_y
        );
        if (!alreadyPlaced) {
            setPlacedTowers((prev) => [...prev, clickedSpot]);
        }
        }
    };

    return (
        <canvas
        ref={mapRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleCanvasClick}
        className="absolute top-0 left-0 z-0"
        />
    );
    }
