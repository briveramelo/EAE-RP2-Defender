module Jelicopter.Client {

    export class BackgroundLayer extends Phaser.Sprite {

        movementSpeed: number = 0;
        baselineSpeed: number = 0;
        level: Level01;

        constructor(game: Phaser.Game, level: Level01, spriteName: string, baselineSpeed: number, speed: number) {
            super(game, 0,0, spriteName);
            this.anchor.x = 0.5;
            this.game.add.sprite(0, 0, spriteName, 1);
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);

            this.level = level;
            this.baselineSpeed = baselineSpeed;
            this.movementSpeed = speed;
        }

        update() {
            if (this.level.playerShip.alive) {

                var movingRight: boolean = this.level.playerShip.scale.x === -1;
                this.body.velocity.x = (movingRight ? 1 : -1) * this.baselineSpeed;

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

                    this.body.velocity.x = (movingRight ? 1 : -1) * this.movementSpeed;

                }
            }
            else {
                this.body.velocity.x = 0;
            }
        }

    }
}