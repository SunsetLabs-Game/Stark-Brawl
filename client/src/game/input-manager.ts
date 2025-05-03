export interface InputState {
    up: boolean
    down: boolean
    left: boolean
    right: boolean
    attack: boolean
    mouseX: number
    mouseY: number
  }
  
  export class InputManager {
    private keys: Record<string, boolean> = {
      w: false,
      a: false,
      s: false,
      d: false,
      arrowup: false,
      arrowdown: false,
      arrowleft: false,
      arrowright: false,
    }
    private mouseDown = false
    private mouseX = 0
    private mouseY = 0
    private canvas: HTMLCanvasElement
    private keyDownHandler: (e: KeyboardEvent) => void
    private keyUpHandler: (e: KeyboardEvent) => void
    private mouseDownHandler: (e: MouseEvent) => void
    private mouseUpHandler: (e: MouseEvent) => void
    private mouseMoveHandler: (e: MouseEvent) => void
  
    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas
  
      this.keyDownHandler = this.handleKeyDown.bind(this)
      this.keyUpHandler = this.handleKeyUp.bind(this)
      this.mouseDownHandler = this.handleMouseDown.bind(this)
      this.mouseUpHandler = this.handleMouseUp.bind(this)
      this.mouseMoveHandler = this.handleMouseMove.bind(this)
  
      window.addEventListener("keydown", this.keyDownHandler)
      window.addEventListener("keyup", this.keyUpHandler)
      canvas.addEventListener("mousedown", this.mouseDownHandler)
      window.addEventListener("mouseup", this.mouseUpHandler)
      canvas.addEventListener("mousemove", this.mouseMoveHandler)
    }
  
    cleanup() {
      window.removeEventListener("keydown", this.keyDownHandler)
      window.removeEventListener("keyup", this.keyUpHandler)
      this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
      window.removeEventListener("mouseup", this.mouseUpHandler)
      this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }
  
    private handleKeyDown(e: KeyboardEvent) {
      const key = e.key.toLowerCase()
      if (key in this.keys) {
        this.keys[key] = true
        e.preventDefault()
      }
    }
  
    private handleKeyUp(e: KeyboardEvent) {
      const key = e.key.toLowerCase()
      if (key in this.keys) {
        this.keys[key] = false
        e.preventDefault()
      }
    }
  
    private handleMouseDown(e: MouseEvent) {
      this.mouseDown = true
      this.updateMousePosition(e)
    }
  
    private handleMouseUp(_e: MouseEvent) {
      this.mouseDown = false
    }
  
    private handleMouseMove(e: MouseEvent) {
      this.updateMousePosition(e)
    }
  
    private updateMousePosition(e: MouseEvent) {
      const rect = this.canvas.getBoundingClientRect()
      this.mouseX = e.clientX - rect.left
      this.mouseY = e.clientY - rect.top
    }
  
    getInput(): InputState {
      return {
        up: this.keys["w"] || this.keys["arrowup"],
        down: this.keys["s"] || this.keys["arrowdown"],
        left: this.keys["a"] || this.keys["arrowleft"],
        right: this.keys["d"] || this.keys["arrowright"],
        attack: this.mouseDown,
        mouseX: this.mouseX,
        mouseY: this.mouseY,
      }
    }
  }
  