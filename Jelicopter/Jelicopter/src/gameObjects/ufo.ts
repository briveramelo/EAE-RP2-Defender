module Jelicopter.Client {

    export class UFO extends Phaser.Sprite {

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, 'UFO', 1);
            this.anchor.setTo(0.5);
            this.pivot.set(64, 64);
            this.animations.add('ufo_fly', [0, 1, 2], 30, true);
            game.add.existing(this);
            // Physics
            game.physics.enable(this);
            this.body.collideWorldBounds = true;
            this.body.setCircle(20);
        }


        shipSpeed: Phaser.Point = new Phaser.Point(300, 300);

        update() {
            this.move();
        }

        move() {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
                this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
                this.game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
                this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this.body.velocity.x = -this.shipSpeed.x;
                    if (this.scale.x === 1) {
                        this.scale.x = -1;
                    }
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                    this.body.velocity.x = this.shipSpeed.x;
                    if (this.scale.x === -1) {
                        this.scale.x = 1;
                    }
                }

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                    this.body.velocity.y = this.shipSpeed.y;
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                    this.body.velocity.y = -this.shipSpeed.y;
                }

                this.animations.play('ufo_fly');
            }            
        }

    }

}