import { useRef, useEffect, useState } from "react";
import { Enemy } from "@/logic/class/Enemy";
import { EnemyController } from "@/logic/controllers/EnemyController"
import { enemySprites } from "@/data/enemySprites";

interface EnemyRenderProps {
  enemyId: number
  initialX: number;
  initialY: number;
}

export default function EnemyRenderer({
  enemyId,
  initialX,
  initialY,
}: EnemyRenderProps) {
  const enemyRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const currentFrame = useRef(0);
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const enemy = new Enemy({ x: initialX, y: initialY });
  const controller = new EnemyController(enemy, 5);
  const enemyData = enemySprites.find((sprite) => sprite.id === enemyId);
  const currentAnimation = enemyData?.animations.idle;

  useEffect(() => {
    if(!currentAnimation) return;
    const loadImage: HTMLImageElement[] = [];
    let loadCount = 0;

    for (let i = 0; i < currentAnimation.frameCount; i++) {
      const numberImage = String(i).padStart(3, "0");
      const image = new Image();
      image.src = `${currentAnimation.src}_${numberImage}.png`;

      image.onload = () => {
        loadCount++;
        if (loadCount === currentAnimation.frameCount) {
          setFrames(loadImage);
        }
      };
      image.onerror = () => {
        console.error(`Failed to load image: ${image.src}`);
      };
      loadImage.push(image);
    }
  }, [currentAnimation]);

  useEffect(() => {
    if (frames.length === 0 || !currentAnimation) return;

    const canvas = enemyRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let animationId: number;
    let lastTime = 0;

    const render = (time: number) => {
      if (time - lastTime > 1000 / currentAnimation.fps) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(frames[currentFrame.current], position.x, position.y, currentAnimation.width, currentAnimation.height);
        currentFrame.current = (currentFrame.current + 1) % frames.length;
        lastTime = time;
      }
      animationId = requestAnimationFrame(render);
    };
    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [frames, position, currentAnimation]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          controller.move({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          controller.move({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          controller.move({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          controller.move({ x: 1, y: 0 });
          break;
        case 'a':
          controller.attack();
          break;
        case 'd':
          controller.die();
          break;
        case 'h':
          controller.hurt();
          break;
        case 'i':
          controller.idle();
          break;
        case 'j':
          controller.jump();
          break;
        case 'r':
          controller.run();
          break;
        default:
          break;
      }
      setPosition(controller.getPosition());
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  });

  return (
    <canvas
      ref={enemyRef}
      width={window.innerWidth}
      height={window.innerHeight}
      className="absolute pointer-events-none"
      style={{
        top: initialY * 64,
        left: initialX * 64,
        imageRendering: "pixelated",
      }}
    />
  );
}
