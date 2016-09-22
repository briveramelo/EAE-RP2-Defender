module Jelicopter.Client {

    export class Ship extends Phaser.Sprite {

        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x, this.position.y);
        }
        level: Level01;
        myCollider: CircleCollider;
        lives: number = 3;
        timeToRevive: number = 3;
        baseSpeed: number = 200;
        shipSpeed: Phaser.Point = new Phaser.Point(600, 300);
        bullets: Bullet;

        constructor(game: Phaser.Game, level: Level01, x: number, y: number, bullets: Bullet) {
            super(game, x, y, 'Ship', 1);
            this.anchor.setTo(0.5);
            this.level = level;
            //this.pivot.set(64, 64);
            this.animations.add('fly', [0, 1, 2, 3, 4, 5], 30, true);
            game.add.existing(this);
            // Physics
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.myCollider = new CircleCollider(this, 30, new Phaser.Point(0,0));
            //this.body.collideWorldBounds = true;
            this.body.setCircle(20);
            this.bullets = bullets;
        }

        update() {
            if (this.alive) {
                this.move();
                this.checkShoot();     
            }            
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
                        this.game.physics.arcade.velocityFromAngle(0, 1000, this.bullets.bullet.body.velocity);
                    else
                        this.game.physics.arcade.velocityFromAngle(180, 1000, this.bullets.bullet.body.velocity);
                    this.bullets.bulletTime = this.game.time.now + 50;
                }
            }

        }

        kill() {
            this.lives--;
            if (this.lives <= 0) {
                //Restart the game
                this.game.state.start('GameOver', true, false);
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
            var isGoingRight = this.scale.x === 1;
            this.body.velocity.x = (isGoingRight ? 1 : -1) * this.baseSpeed;
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
                    if (this.position.y < 795) {
                        this.body.velocity.y = this.shipSpeed.y;
                    } 
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                    if (this.position.y > 300) {
                        this.body.velocity.y = -this.shipSpeed.y;
                    } 
                }
                this.animations.play('fly');
            }
            else {
                this.animations.frame = 0;
            }


        }

    }

}