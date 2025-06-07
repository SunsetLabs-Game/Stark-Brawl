import { useEffect, useRef, useState } from "react";

interface MapRendererProps {
  src: string;
}

export default function MapRenderer({ src }: MapRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapImage = useRef<HTMLImageElement>(new Image());
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    mapImage.current.src = src;
    mapImage.current.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(mapImage.current, 0, 0, canvas.width, canvas.height);
    };
    mapImage.current.onerror = () => {
      console.error(`Failed to load map image: ${src}`);
    };
  }, [src, dimensions]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute pointer-events-none"
      />
    </>
  );
}
