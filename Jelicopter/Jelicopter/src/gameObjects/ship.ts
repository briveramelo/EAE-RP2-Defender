module Jelicopter.Client {

    export class Ship extends Phaser.Sprite {

        constructor(game: Phaser.Game, x: number, y: number, bullets: Bullet) {
            super(game, x, y, 'Ship', 1);
            this.game.physics.arcade.enable([this]);
            this.anchor.setTo(0.5);
            this.pivot.set(64, 64);
            this.animations.add('fly', [0, 1, 2, 3, 4, 5], 30, true);
            game.add.existing(this);
            this.body.collideWorldBounds = true;
            this.bullets = bullets;
        }

        shipSpeed: Phaser.Point = new Phaser.Point(300, 300);
        bullets: Bullet;

        update() {
            this.move();
            this.checkShoot();
        }

        checkShoot() {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.fireBullet();
            }
        }

        fireBullet() {

        if (this.game.time.now > this.bullets.bulletTime) {
            this.bullets.bullet = this.bullets.getFirstExists(false);

            if (this.bullets.bullet) {
                if (this.scale.x === 1)
                    this.bullets.bullet.reset(this.body.x + 64, this.body.y + 64);
                else
                    this.bullets.bullet.reset(this.body.x - 64, this.body.y + 64);
                this.bullets.bullet.lifespan = 2000;
                if (this.scale.x === 1)
                    this.game.physics.arcade.velocityFromAngle(0, 400, this.bullets.bullet.body.velocity);
                else
                    this.game.physics.arcade.velocityFromAngle(180, 400, this.bullets.bullet.body.velocity);
                this.bullets.bulletTime = this.game.time.now + 50;
            }
        }

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