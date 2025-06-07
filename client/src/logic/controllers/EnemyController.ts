import { Enemy } from '@/logic/class/Enemy'

export class EnemyController {
    private enemy: Enemy;
    private speed: number;

    constructor(enemy: Enemy, speed: number) {
        this.enemy = enemy;
        this.speed = speed;
    }

    public move(direction: { x: number; y: number }) {
        const currentPosition = this.enemy.getPosition();
        const newPosition = {
            x: currentPosition.x + direction.x * this.speed,
            y: currentPosition.y + direction.y * this.speed,
        }
        this.enemy.setPosition(newPosition);
        this.enemy.playAnimation('walk');
    }

    public attack() {
        this.enemy.playAnimation('attack');
    }

    public die() {
        this.enemy.playAnimation('die');
    }

    public hurt() {
        this.enemy.playAnimation('hurt');
    }

    public idle() {
        this.enemy.playAnimation('idle');
    }

    public jump() {
        this.enemy.playAnimation('jump');
    }

    public run() {
        this.enemy.playAnimation('run');
    }

    public getPosition(): { x: number; y: number } {
        return this.enemy.getPosition();
    }
}