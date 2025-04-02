"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import GameModeCard from "@/components/game-modes/game-mode-card"
import { gameModes } from "@/lib/game-data"

export default function GameModesLayout() {

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tabs defaultValue="game-modes" className="w-full">

        <TabsContent value="characters" className="mt-0">
          <div className="text-white text-center p-8">Characters content will go here</div>
        </TabsContent>

        <TabsContent value="game-modes" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gameModes.map((mode) => (
              <GameModeCard key={mode.id} gameMode={mode} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-0">
          <div className="text-white text-center p-8">Leaderboard content will go here</div>
        </TabsContent>

        <TabsContent value="events" className="mt-0">
          <div className="text-white text-center p-8">Events content will go here</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

