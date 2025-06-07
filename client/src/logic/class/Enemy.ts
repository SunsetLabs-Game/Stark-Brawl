export class Enemy {
    private position: { x: number; y: number};
    private animation: { [key: string]: () => void };

    constructor(initialPosition: { x: number; y: number }) {
        this.position = initialPosition;
        this.animation = {
            attack: this.attackAnimation,
            die: this.dieAnimation,
            hurt: this.hurtAnimation,
            idle: this.idleAnimation,
            jump: this.jumpAnimation,
            run: this.runAnimation,
            walk: this.walkAnimation,
        };
    }

    private attackAnimation() {
        console.log("attack animation");
    }

    private dieAnimation() {
        console.log("die animation");
    }

    private hurtAnimation() {
        console.log("hurt animation");
    }

    private idleAnimation() {
        console.log("idle animation");
    }

    private jumpAnimation() {
        console.log("jump animation");
    }

    private runAnimation() {
        console.log("run animation");
    }

    private walkAnimation() {
        console.log("walk animation");
    }

    public setPosition(newPosition: { x: number; y: number }) {
        this.position = newPosition;
    }

    public getPosition(): { x: number; y: number } {
        return this.position;
    }

    public playAnimation(state: string) {
        const animation = this.animation[state];
        if (animation) {
            animation();
        } else {
            console.log("Error")
        }
    }
}