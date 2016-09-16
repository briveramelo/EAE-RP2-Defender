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
            game.time.events.add(Phaser.Timer.SECOND * this.timeToMoveStraight, this.move, this);
        }


        shipSpeed: Phaser.Point = new Phaser.Point(100, 100);
        timeToMoveStraight: number = 1;
        timeMoving: number=0;

        update() {
            //this.move();
            this.animations.play('ufo_fly');
        }

        goStraight: boolean;

        move() {
            this.goStraight = !this.goStraight;

            if (this.goStraight) {
                this.body.velocity.y = 0;
                this.body.velocity.x = this.shipSpeed.x;
            }
            else{
                this.body.velocity.y = (this.game.rnd.sign()) * this.shipSpeed.y;
            }
            this.game.time.events.add(Phaser.Timer.SECOND * this.timeToMoveStraight, this.move, this);
        }

    }

}