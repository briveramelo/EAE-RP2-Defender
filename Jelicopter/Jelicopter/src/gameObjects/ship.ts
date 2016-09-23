module Jelicopter.Client {

    export class Ship extends Phaser.Sprite {

        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x, this.position.y);
        }
        level: MainGame;
        myCollider: CircleCollider;
        lives: number = 3;
        timeToRevive: number = 3;
        baseSpeed: number = 200;
        shipSpeed: Phaser.Point = new Phaser.Point(600, 300);
        bullets: Bullet;
        wasJustPressed: boolean;
        health: number;
        maxHeight: number = 748;
        minHeight: number = 300;
        maxVelocityFrame: number = 11;
        lastFrame: number = 28;
        isGoingRight: boolean;
        bulletSpawnOffset: Phaser.Point = new Phaser.Point(148, 90);
        tailOffset: number = 95;

        stretchAnim: Phaser.Animation;
        contractAnim: Phaser.Animation;


        constructor(game: Phaser.Game, level: MainGame, x: number, y: number, bullets: Bullet) {
            super(game, x, y, 'Jelicopter', 0);
            this.anchor.setTo(0.5);
            this.pivot.set(0, 0);
            this.level = level;

            this.stretchAnim = this.animations.add('stretch', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 60, false);
            this.contractAnim = this.animations.add('contract', [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 0], 60, false);

            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.myCollider = new CircleCollider(this, 30, new Phaser.Point(0,0));
            this.body.setCircle(20);
            this.bullets = bullets;
            this.health = 3;
        }

        update() {
            if (!this.level.gamepadManager.joyStickIsActive) {
                if (this.alive) {
                    this.isGoingRight = this.scale.x === 1;
                    this.move(this.isGoingRight);
                    this.animate(this.isGoingRight);   
                    this.checkShoot();
                }            
            }
        }

        checkShoot() {
            var isPressed = this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
            if (isPressed && !this.wasJustPressed) {
                this.fireBullet();
            }
            this.wasJustPressed = isPressed;
        }


        fireBullet() {
            if (this.game.time.now > this.bullets.bulletTime) {
                this.bullets.bullet = this.bullets.getFirstExists(false);

                if (this.bullets.bullet) {
                    var bulletSpawnPoint: Phaser.Point = new Phaser.Point(this.body.x + (this.isGoingRight ? 1 : -1) * this.bulletSpawnOffset.x, this.body.y + this.bulletSpawnOffset.y);                    
                    this.bullets.bullet.lifespan = 1000;
                    this.bullets.bullet.reset(bulletSpawnPoint.x, bulletSpawnPoint.y);
                    this.bullets.bullet.scale.x = this.isGoingRight ? 1 : -1;
                    this.game.physics.arcade.velocityFromAngle( (this.isGoingRight ? 0 : 180), this.bullets.bulletSpeed, this.bullets.bullet.body.velocity);                    
                    this.bullets.bulletTime = this.game.time.now + 25;
                }
            }

        }

        takeDamage() {
            this.health--;
            if (this.health <= 0) {
                this.kill();
            }
        }

        kill() {            
            this.game.state.start('GameOver', true, false);
            super.kill();            
            return this;
        }

        revive() {
            super.revive();
            return this;
        }

        move(isGoingRight:boolean) {
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
                    if (this.position.y < this.maxHeight) {
                        this.body.velocity.y = this.shipSpeed.y;
                    } 
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                    if (this.position.y > this.minHeight) {
                        this.body.velocity.y = -this.shipSpeed.y;
                    } 
                }
            }            
        }

        wasJustFacingRight: boolean;

        animate(isGoingRight:boolean){
            
            var isMoving: boolean = this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);

            if (isMoving) {
                if (this.animations.frame == 0) {
                    this.stretchAnim.play();
                }
                if (this.wasJustFacingRight != isGoingRight) {
                    this.contractAnim.play();
                }
            }
            else{
                if (this.animations.frame == this.maxVelocityFrame) {                    
                    this.contractAnim.play();
                }
            }

            this.wasJustFacingRight = isGoingRight;

        }            
    }
}