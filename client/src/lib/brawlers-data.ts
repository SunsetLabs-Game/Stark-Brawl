import type { Brawler } from "@/types/brawler-types"

// This would typically fetch from an API, but for now we'll use mock data
export async function getBrawlersData(): Promise<Brawler[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        // LEGENDARY BRAWLERS (UNLOCKED)
        {
          id: 1,
          name: "Cyber Warrior",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg%20%283%29-QGCcias2jfmXbISldcsGrNqMuDO5c1.png",
          unlocked: true,
          rarity: "legendary",
          power: 10,
          rank: 20,
          trophies: 530,
          maxTrophies: 750,
          tokenId: "#8721",
          isNFT: true,
          stats: {
            health: 85,
            damage: 90,
            speed: 75,
            range: 70,
          },
          abilities: [
            {
              name: "Cyber Shield",
              description: "Creates a protective shield that absorbs 60% of incoming damage for 3 seconds.",
              icon: "/placeholder.svg?height=40&width=40",
            },
            {
              name: "Digital Blast",
              description: "Fires a concentrated energy beam that deals massive damage to all enemies in a line.",
              icon: "/placeholder.svg?height=40&width=40",
            },
          ],
          description: "A legendary cyber warrior with devastating attacks and a unique shield ability.",
        },
        {
          id: 2,
          name: "Golden Knight",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg-O3IUaPWmrwcMxFfOjNtLl08MtnR1VF.png",
          unlocked: true,
          rarity: "legendary",
          power: 9,
          rank: 18,
          trophies: 487,
          maxTrophies: 600,
          tokenId: "#5432",
          isNFT: true,
          stats: {
            health: 95,
            damage: 85,
            speed: 60,
            range: 50,
          },
          abilities: [
            {
              name: "Golden Slam",
              description: "Slams the ground with a golden hammer, stunning all nearby enemies.",
              icon: "/placeholder.svg?height=40&width=40",
            },
            {
              name: "Royal Guard",
              description: "Activates a protective aura that reduces damage taken by 40% for 4 seconds.",
              icon: "/placeholder.svg?height=40&width=40",
            },
          ],
          description: "A powerful knight with golden armor and devastating melee attacks.",
        },
        {
          id: 3,
          name: "Golden Gladiator",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com-YNv97ZuuXRNT90BjzJ3vBLauhK5Rfo.png",
          unlocked: true,
          rarity: "legendary",
          power: 9,
          rank: 16,
          trophies: 450,
          maxTrophies: 550,
          tokenId: "#3456",
          isNFT: true,
          stats: {
            health: 90,
            damage: 90,
            speed: 65,
            range: 55,
          },
          abilities: [
            {
              name: "Arena Champion",
              description: "Gains a shield that absorbs damage based on trophies earned in battle.",
              icon: "/placeholder.svg?height=40&width=40",
            },
            {
              name: "Golden Fury",
              description: "Unleashes a series of rapid attacks that deal increasing damage with each hit.",
              icon: "/placeholder.svg?height=40&width=40",
            },
          ],
          description: "Exclusive golden skin with special effects and animations.",
        },

        // EPIC BRAWLERS (UNLOCKED)
        {
          id: 4,
          name: "Mystic Archer",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg%20%281%29-9wGstIndm3EHsb8DVxACEeEysTvTLr.png",
          unlocked: true,
          rarity: "epic",
          power: 8,
          rank: 15,
          trophies: 412,
          maxTrophies: 500,
          tokenId: "#7654",
          isNFT: true,
          stats: {
            health: 65,
            damage: 95,
            speed: 80,
            range: 90,
          },
          abilities: [
            {
              name: "Piercing Arrow",
              description: "Shoots an arrow that passes through multiple enemies, dealing damage to each one.",
              icon: "/placeholder.svg?height=40&width=40",
            },
            {
              name: "Magic Volley",
              description: "Fires a volley of magical arrows in a wide arc, covering a large area.",
              icon: "/placeholder.svg?height=40&width=40",
            },
          ],
          description: "Master of the bow with piercing arrows and magical abilities.",
        },
        {
          id: 5,
          name: "Desert Warrior",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/klipartz.com-1kdb2gSHyxhFyYxBgeEJ2byaZlZCN6.png",
          unlocked: true,
          rarity: "epic",
          power: 8,
          rank: 14,
          trophies: 380,
          maxTrophies: 450,
          tokenId: "#7890",
          isNFT: true,
          stats: {
            health: 70,
            damage: 75,
            speed: 90,
            range: 60,
          },
          abilities: [
            {
              name: "Sandstorm",
              description: "Creates a sandstorm that obscures vision and deals damage over time.",
              icon: "/placeholder.svg?height=40&width=40",
            },
            {
              name: "Mirage",
              description: "Creates a decoy that distracts enemies and explodes after a few seconds.",
              icon: "/placeholder.svg?height=40&width=40",
            },
          ],
          description: "Sand-themed warrior with unique desert storm abilities.",
        },

        // RARE BRAWLERS (UNLOCKED)
        {
          id: 6,
          name: "Zombie Hunter",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngegg%20%282%29-8C60ISdWrtmynZ8TEf65LMGT0CP5ua.png",
          unlocked: true,
          rarity: "rare",
          power: 7,
          rank: 12,
          trophies: 320,
          maxTrophies: 400,
          tokenId: "#2345",
          isNFT: true,
          stats: {
            health: 75,
            damage: 80,
            speed: 85,
            range: 65,
          },
          abilities: [
            {
              name: "Undead Slayer",
              description: "Deals 50% more damage to enemy brawlers for a short period.",
              icon: "/placeholder.svg?height=40&width=40",
            },
            {
              name: "Survival Instinct",
              description: "Gains increased movement speed when health drops below 40%.",
              icon: "/placeholder.svg?height=40&width=40",
            },
          ],
          description: "A skilled hunter specialized in taking down multiple enemies at once.",
        },

        // LOCKED BRAWLERS
        {
          id: 7,
          name: "Shadow Assassin",
          image: "/placeholder.svg?height=200&width=200",
          unlocked: false,
          rarity: "legendary",
          power: 0,
          rank: 0,
          trophies: 0,
          maxTrophies: 0,
          stats: {
            health: 60,
            damage: 95,
            speed: 95,
            range: 60,
          },
          abilities: [
            {
              name: "Shadow Step",
              description: "Teleports behind the nearest enemy, becoming temporarily invisible.",
              icon: "/placeholder.svg?height=40&width=40",
            },
            {
              name: "Death Mark",
              description: "Marks an enemy, dealing additional damage and revealing their position.",
              icon: "/placeholder.svg?height=40&width=40",
            },
          ],
          description: "A stealthy assassin that excels at eliminating high-value targets.",
        },
        {
          id: 8,
          name: "Frost Mage",
          image: "/placeholder.svg?height=200&width=200",
          unlocked: false,
          rarity: "epic",
          power: 0,
          rank: 0,
          trophies: 0,
          maxTrophies: 0,
          stats: {
            health: 70,
            damage: 85,
            speed: 65,
            range: 85,
          },
          abilities: [
            {
              name: "Ice Barrier",
              description: "Creates a wall of ice that blocks enemy movement and projectiles.",
              icon: "/placeholder.svg?height=40&width=40",
            },
            {
              name: "Blizzard",
              description: "Summons a blizzard that slows and damages enemies in a large area.",
              icon: "/placeholder.svg?height=40&width=40",
            },
          ],
          description: "Controls the battlefield with powerful ice magic and area denial.",
        },
        {
          id: 9,
          name: "Techno Bot",
          image: "/placeholder.svg?height=200&width=200",
          unlocked: false,
          rarity: "rare",
          power: 0,
          rank: 0,
          trophies: 0,
          maxTrophies: 0,
          stats: {
            health: 80,
            damage: 70,
            speed: 70,
            range: 75,
          },
          abilities: [
            {
              name: "Repair Protocol",
              description: "Gradually repairs damage over time when not in combat.",
              icon: "/placeholder.svg?height=40&width=40",
            },
            {
              name: "Laser Beam",
              description: "Fires a continuous laser beam that deals increasing damage the longer it hits.",
              icon: "/placeholder.svg?height=40&width=40",
            },
          ],
          description: "A versatile robot with self-repair capabilities and advanced weaponry.",
        },
        {
          id: 10,
          name: "Flame Dancer",
          image: "/placeholder.svg?height=200&width=200",
          unlocked: false,
          rarity: "epic",
          power: 0,
          rank: 0,
          trophies: 0,
          maxTrophies: 0,
          stats: {
            health: 65,
            damage: 90,
            speed: 85,
            range: 70,
          },
          abilities: [
            {
              name: "Fire Trail",
              description: "Leaves a trail of fire that damages enemies who walk through it.",
              icon: "/placeholder.svg?height=40&width=40",
            },
            {
              name: "Inferno",
              description: "Creates a circular area of flames that deals massive damage over time.",
              icon: "/placeholder.svg?height=40&width=40",
            },
          ],
          description: "Manipulates fire to control space and deal damage over time.",
        },

        // NEW BRAWLERS
        {
          id: 11,
          name: "Cosmic Entity",
          image: "/placeholder.svg?height=200&width=200",
          unlocked: true,
          isNew: true,
          rarity: "legendary",
          power: 7,
          rank: 5,
          trophies: 120,
          maxTrophies: 800,
          stats: {
            health: 75,
            damage: 88,
            speed: 82,
            range: 78,
          },
          abilities: [
            {
              name: "Gravity Well",
              description: "Creates a gravitational field that pulls enemies toward its center.",
              icon: "/placeholder.svg?height=40&width=40",
            },
            {
              name: "Cosmic Ray",
              description: "Channels a beam of cosmic energy that pierces through all obstacles.",
              icon: "/placeholder.svg?height=40&width=40",
            },
          ],
          description: "A being from beyond the stars with control over gravity and cosmic energy.",
        },

        // COMMON BRAWLERS
        {
          id: 12,
          name: "Rookie Fighter",
          image: "/placeholder.svg?height=200&width=200",
          unlocked: true,
          rarity: "common",
          power: 5,
          rank: 8,
          trophies: 210,
          maxTrophies: 300,
          stats: {
            health: 70,
            damage: 65,
            speed: 70,
            range: 50,
          },
          abilities: [
            {
              name: "Basic Strike",
              description: "Performs a quick strike that deals moderate damage to a single target.",
              icon: "/placeholder.svg?height=40&width=40",
            },
            {
              name: "Battle Cry",
              description: "Increases movement speed for a short duration.",
              icon: "/placeholder.svg?height=40&width=40",
            },
          ],
          description: "A basic fighter with balanced stats and straightforward abilities.",
        },
      ])
    }, 1000)
  })
}

