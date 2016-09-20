module Jelicopter.Client {

    export class Bullet extends Phaser.Group {
        bulletTime: number = 0;
        bullet;
        constructor(game: Phaser.Game) {
            super(game);
            this.enableBody = true;
            this.physicsBodyType = Phaser.Physics.ARCADE;

            this.createMultiple(40, 'Bullet');
            this.setAll('anchor.x', 0.5);
            this.setAll('anchor.y', 0.5);
            // Physics


        }
    }
}