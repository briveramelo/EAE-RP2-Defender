module Jelicopter.Client {

    export class EnemyBullet extends Phaser.Sprite {

        level: Level01;
        sprite: Phaser.Sprite;

        constructor(game: Phaser.Game, level:Level01, x: number, y: number) {
            super(game, x, y, 'EnemyBullet');
            this.level = level;
            this.anchor.setTo(0.5);
            this.pivot.set(2, 2);
            //this.animations.add('fly', [0, 1, 2, 3, 4, 5], 30, true);
            game.add.existing(this);
            // Physics
            game.physics.enable(this);
            this.body.setCircle(2);
            this.kill();
        }

        launch(bulletVelocity: Phaser.Point, startPoint: Phaser.Point) {
            this.revive();
            this.lifespan = 2000;
            this.position = startPoint;
            var angleOfShot = Math.atan2(bulletVelocity.y, bulletVelocity.x) * 180 / Math.PI;
            this.game.physics.arcade.velocityFromAngle(angleOfShot, 400, this.body.velocity);
            console.log(this.body);       
        }

        update() {
            if (this.alive) {
            }
        }

    }
}