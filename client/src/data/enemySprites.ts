interface EnemySprites {
    id: number;
    animations: {
        [key: string]: {
            src: string;
            frameCount: number;
            fps: number;
            width: number;
            height: number;
        };
    };
}

export const enemySprites: EnemySprites[] = [
    {
        id: 1,
        animations: {
            idle: {
                src: '/1/1_enemies_1_idle',
                frameCount: 19,
                fps: 10,
                width: 64,
                height: 64,
            },
            walk: {
                src: '/1/1_enemies_1_walk',
                frameCount: 19,
                fps: 10,
                width: 64,
                height: 64,
            },
            attack: {
                src: '/1/1_enemies_1_attack',
                frameCount: 19,
                fps: 10,
                width: 64,
                height: 64,
            },
            die: {
                src: '/1/1_enemies_1_die',
                frameCount: 19,
                fps: 10,
                width: 64,
                height: 64,
            },
            hurt: {
                src: '/1/1_enemies_1_hurt',
                frameCount: 19,
                fps: 10,
                width: 64,
                height: 64,
            },
            jump: {
                src: '/1/1_enemies_1_jump',
                frameCount: 19,
                fps: 10,
                width: 64,
                height: 64,
            },
            run: {
                src: '/1/1_enemies_1_run',
                frameCount: 19,
                fps: 10,
                width: 64,
                height: 64,
            },
        },
    },
]