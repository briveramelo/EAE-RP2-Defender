module Jelicopter.Client {

    export class Ship extends Phaser.Sprite {

        constructor(game: Phaser.Game, level: Level01, x: number, y: number) {
            super(game, x, y, 'Ship', 1);
            this.anchor.setTo(0.5);
            this.level = level;
            //this.lives = 5;
            //this.pivot.set(64, 64);
            this.animations.add('fly', [0, 1, 2, 3, 4, 5], 30, true);
            game.add.existing(this);
            // Physics
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.myCollider = new CircleCollider(this, 30, new Phaser.Point(0,0));
            this.body.collideWorldBounds = true;
            this.body.setCircle(20);
        }

        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x, this.position.y);
        }
        level: Level01;
        myCollider: CircleCollider;
        lives: number = 5;
        timeToRevive: number = 3;
        shipSpeed: Phaser.Point = new Phaser.Point(300,300);

        update() {
            if (this.alive) {
                this.move();                
            }            
        }

        kill() {
            this.lives--;
            if (this.lives <= 0) {
                //Restart the game
                this.game.state.start('Level01', true, false);
            }
            this.game.time.events.add(Phaser.Timer.SECOND * this.timeToRevive, this.revive, this);
            super.kill();
            return this;
        }

        revive() {
            super.revive();
            return this;
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

                this.animations.play('fly');
            }
            else {
                this.animations.frame = 0;
            }


        }

    }

}