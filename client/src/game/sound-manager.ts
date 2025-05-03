export class SoundManager {
    private sounds: Record<string, HTMLAudioElement> = {}
    private music: HTMLAudioElement | null = null
    private isMuted = false
  
    constructor() {
      this.initSounds()
    }
  
    private initSounds() {
      try {
        // Create dummy audio elements instead of trying to load real files
        this.sounds["attack"] = new Audio()
        this.sounds["hit"] = new Audio()
        this.sounds["break"] = new Audio()
  
        // Create background music
        this.music = new Audio()
        if (this.music) {
          this.music.loop = true
          this.music.volume = 0.5
        }
  
        // Set volume for all sounds
        Object.values(this.sounds).forEach((sound) => {
          sound.volume = 0.3
        })
      } catch (e) {
        console.warn("Audio initialization failed:", e)
        // Create empty objects to prevent errors
        this.sounds = {}
        this.music = null
      }
    }
  
    playSound(name: string) {
      if (this.isMuted) return
  
      const sound = this.sounds[name]
      if (sound) {
        try {
          // Try to play the sound, but don't crash if it fails
          sound.play().catch((e) => {
            console.warn(`Could not play sound "${name}":`, e)
          })
        } catch (e) {
          console.warn(`Error playing sound "${name}":`, e)
        }
      }
    }
  
    playMusic() {
      if (this.isMuted || !this.music) return
  
      try {
        this.music.play().catch((e) => {
          console.warn("Could not play background music:", e)
        })
      } catch (e) {
        console.warn("Error playing background music:", e)
      }
    }
  
    stopMusic() {
      if (this.music) {
        this.music.pause()
        this.music.currentTime = 0
      }
    }
  
    stopAll() {
      this.stopMusic()
      Object.values(this.sounds).forEach((sound) => {
        sound.pause()
        sound.currentTime = 0
      })
    }
  
    toggleMute() {
      this.isMuted = !this.isMuted
  
      if (this.isMuted) {
        this.stopAll()
      } else {
        this.playMusic()
      }
  
      return this.isMuted
    }
  }
  