module Jelicopter.Client {

    export class BackgroundLayer extends Phaser.Sprite {

        movementSpeed: number = 0;
        baselineSpeed: number = 0;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame, spriteName: string, baselineSpeed: number, movementSpeed: number) {
            super(game, 0,0, spriteName);
            this.anchor.x = 0.5;
            this.game.add.sprite(0, 0, spriteName, 1);
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);

            this.level = level;
            this.baselineSpeed = baselineSpeed;
            this.movementSpeed = movementSpeed;
        }

        update() {
            if (this.level.playerShip.alive) {

                var movingRight: boolean = this.level.playerShip.scale.x === -1;
                var baseSpeed: number = (movingRight ? 1 : -1) * this.baselineSpeed;
                var moveSpeed: number = (movingRight ? 1 : -1) * ( (Math.abs(this.level.playerShip.body.velocity.x) - this.level.playerShip.baseSpeed) / this.level.playerShip.shipSpeed.x) * this.movementSpeed;
                this.body.velocity.x = baseSpeed + moveSpeed;
                
            }
            else {
                this.body.velocity.x = 0;
            }
        }        

    }
}