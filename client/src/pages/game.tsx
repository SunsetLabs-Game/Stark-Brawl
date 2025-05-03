import GameCanvas from "@/components/GameCanvas";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="mb-4 text-2xl font-bold text-white">2D Adventure Game</h1>
      <div className="rounded-lg border-2 border-gray-700 overflow-hidden shadow-lg">
        <GameCanvas />
      </div>
      <div className="mt-4 text-gray-300 text-sm">
        <p>Controls: WASD to move, Click to attack</p>
      </div>
    </main>
  )
}
