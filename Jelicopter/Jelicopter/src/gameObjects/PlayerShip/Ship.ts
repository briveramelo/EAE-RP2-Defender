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
        maxHeight: number = 540;
        minHeight: number = 30;
        maxVelocityFrame: number = 10;
        lastFrame: number = 28;
        isGoingRight: boolean;
        bulletSpawnOffset: Phaser.Point = new Phaser.Point(160, 95);
        tailOffset: number = 70;
        stretchAnim: Phaser.Animation;
        contractAnim: Phaser.Animation;
        camTarget: Phaser.Sprite;


        constructor(game: Phaser.Game, level: MainGame, x: number, y: number, bullets: Bullet) {
            super(game, x, y, 'PlayerShip', 0);
            this.anchor.setTo(0.5);
            this.pivot.set(0, 0);
            this.level = level;

            this.stretchAnim = this.animations.add('stretch', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 60, false);
            this.contractAnim = this.animations.add('contract', [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0], 60, false);

            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.camTarget = this.game.add.sprite(0, 0, 'invisibleDot');
            this.camTarget.position.x = this.position.x + (this.isGoingRight ? 1 : -1) * this.camOffset;
            this.camTarget.position.y = this.position.y;


            this.myCollider = new CircleCollider(this, 30, new Phaser.Point(0,0));
            this.body.setCircle(20);
            this.bullets = bullets;
            this.health = 3;            
            
        }

        camOffset: number = 300;

        isFast: boolean;
        wasJustDown: boolean;
        toggleShipSpeed() {
            var isDown: boolean = this.game.input.keyboard.isDown(Phaser.KeyCode.F);
            if (isDown && !this.wasJustDown) {
                this.isFast = !this.isFast;
                this.shipSpeed.x = this.isFast ? 3000 : 600;
            }
            this.wasJustDown = isDown; 
        }        

        update() {
            if (this.alive) {
                this.toggleShipSpeed();//for debugging -- take out in release
                this.isGoingRight = this.scale.x === 1;

                this.camTarget.position.x = this.position.x + (this.isGoingRight ? 1 : -1) * this.camOffset;
                this.camTarget.position.y = this.position.y;


                if (!this.level.gamepadManager.joyStickIsActive) {
                    this.move(this.isGoingRight);
                    this.animate(this.isGoingRight);   
                    this.checkAction();
                }            
            }
        }

        checkAction() {
            var isPressed = this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
            if (isPressed && !this.wasJustPressed) {

                if (this.level.tractorBeam.personBeingCarried != null) {
                    this.level.tractorBeam.flingPerson();
                }
                else {
                    this.fireBullet();
                }
            }
            this.wasJustPressed = isPressed;
        }

        fireBullet() {
            this.bullets.bullet = this.bullets.getFirstExists(false);

            if (this.bullets.bullet) {
                this.level.soundManager.playSound(SoundFX.FireShot);
                var bulletSpawnPoint: Phaser.Point = new Phaser.Point(this.body.x + (this.isGoingRight ? 1 : -1) * this.bulletSpawnOffset.x, this.body.y + this.bulletSpawnOffset.y);                    
                this.bullets.bullet.lifespan = 800;
                this.bullets.bullet.reset(bulletSpawnPoint.x, bulletSpawnPoint.y);
                this.bullets.bullet.scale.x = this.isGoingRight ? 1 : -1;
                this.game.physics.arcade.velocityFromAngle((this.isGoingRight ? 0 : 180), this.bullets.bulletSpeed, this.bullets.bullet.body.velocity);
                this.level.laserManager.fireLaserBurst(bulletSpawnPoint, this.isGoingRight);               
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