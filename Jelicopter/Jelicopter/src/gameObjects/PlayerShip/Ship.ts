﻿module Jelicopter.Client {
    export class Ship extends Phaser.Sprite {
        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x, this.position.y);
        }
        level: MainGame;
        myCollider: CircleCollider;
        lives: number = 30;
        timeToRevive: number = 3;
        baseSpeed: number = 200;
        shipSpeed: Phaser.Point = new Phaser.Point(600, 450);
        bullets: Bullet;
        wasJustPressed: boolean;
        health: number;
        maxHeight: number;
        minHeight: number;
        maxVelocityFrame: number = 8;
        isGoingRight: boolean;
        bulletSpawnOffset: Phaser.Point = new Phaser.Point(335, 72);
        stretchSpawnOffset: Phaser.Point = new Phaser.Point(348, 75);
        stretchAnim: Phaser.Animation;
        contractAnim: Phaser.Animation;
        camTarget: Phaser.Sprite;
        scaleMult: number;
        isStretched: boolean;
        tailOffset(): number {
            return (!this.isStretched ? 70 : 150);
        }
        shield1: Phaser.Sprite;
        shield1StretchAnim: Phaser.Animation;
        shield1HitAnim: Phaser.Animation;
        shield2: Phaser.Sprite;
        shield2StretchAnim: Phaser.Animation;
        shield2HitAnim: Phaser.Animation;
        constructor(game: Phaser.Game, level: MainGame, bullets: Bullet) {
            super(game, game.world.centerX, game.world.centerY, 'PlayerShip', 0);
            this.position.y = 600;
            this.anchor.setTo(0.5);
            this.pivot.set(0, 0);
            this.level = level;
            this.scaleMult = 1;
            this.scale.set(this.scaleMult);
            this.stretchAnim = this.animations.add('stretch', [0, 1, 2, 3, 4, 5, 6, 7, 8], 60, false);
            this.contractAnim = this.animations.add('contract', [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 0], 60, false);
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.camTarget = this.game.add.sprite(0, 0, 'invisibleDot');
            this.camTarget.position.x = this.position.x;// + (this.isGoingRight ? 1 : -1) * this.camOffset;
            this.camTarget.position.y = this.position.y;

            this.addShieldChildren();

            this.myCollider = new CircleCollider(this, 60, new Phaser.Point(0, 0));
            this.body.setCircle(20);
            this.bullets = bullets;
            this.health = 3;
            this.maxHeight = this.level.gameSize.y - 180;
            this.minHeight = this.level.heightOffset + 85;
        }
        addShieldChildren() {
            var shieldFrameData = [];
            for (var i: number = 0; i < 28; i++) {
                shieldFrameData[i] = i;
            }
            this.shield1 = this.game.add.sprite(0, 0, 'ship-shield-hit', 0);
            this.shield1.anchor.set(.5);
            this.shield1.pivot.set(0, 0);
            this.shield1HitAnim = this.shield1.animations.add('shipShieldHit', shieldFrameData, 60, false);
            this.addChild(this.shield1);
            this.shield2 = this.game.add.sprite(0, 0, 'ship-shield-hit', 0);
            this.shield2.scale.set(1.25);
            this.shield2.anchor.set(.5);
            this.shield2.pivot.set(0, 0);
            this.shield2HitAnim = this.shield2.animations.add('shipShieldHit', shieldFrameData, 60, false);
            this.addChild(this.shield2);
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
                this.isGoingRight = this.scale.x === this.scaleMult;
                this.isStretched = this.animations.frame >= 3 && this.animations.frame <= this.maxVelocityFrame;
                this.camTarget.position.x = this.position.x;// + (this.isGoingRight ? 1 : -1) * this.camOffset;
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
                if (this.level.tractorBeam.peopleBeingCarried[0] != null) {
                    this.level.tractorBeam.flingPerson(0);
                }
                else if (this.level.tractorBeam.vehicle != null) {
                    this.level.tractorBeam.flingVehicle();
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
                var spawnChoice: Phaser.Point = this.isStretched ? this.stretchSpawnOffset : this.bulletSpawnOffset;
                var bulletSpawnPoint: Phaser.Point = new Phaser.Point(this.body.x + (this.isGoingRight ? 1 : -1) * spawnChoice.x, this.body.y + spawnChoice.y);
                this.bullets.bullet.lifespan = 800;
                this.bullets.bullet.reset(bulletSpawnPoint.x, bulletSpawnPoint.y);
                this.bullets.bullet.scale.x = this.isGoingRight ? 1 : -1;
                this.game.physics.arcade.velocityFromAngle((this.isGoingRight ? 0 : 180), this.bullets.bulletSpeed, this.bullets.bullet.body.velocity);
                this.level.laserManager.fireLaserBurst(bulletSpawnPoint, this.isGoingRight);
            }
        }
        takeDamage() {
            this.health--;
            this.animateDamage(this.health);
            if (this.health <= 0) {
                this.level.soundManager.playSound(SoundFX.ShieldLost);
                this.kill();
            }
            else {
                this.level.soundManager.playSound(SoundFX.PlayerShipDeath);
            }
        }
        animateDamage(health: number) {
            switch (health) {
                case 2:
                    this.shield2HitAnim.play(60, false, true);
                    //first shield
                    break;
                case 1:
                    this.shield1HitAnim.play(60, false, true);
                    //second shield
                    break;
                case 0:
                  //  this.level.playerShipParticleManager.particleBurst(this.position);
                    //ship explosion
                    break;
            }
        }
        kill() {
            this.game.time.events.add(Phaser.Timer.SECOND * 4, this.level.endGame, this.level);
            this.level.tractorBeam.flingAllPeople();
            super.kill();
            return this;
        }
        revive() {
            super.revive();
            return this;
        }
        move(isGoingRight: boolean) {
            this.body.velocity.x = (isGoingRight ? 1 : -1) * (this.baseSpeed);
            this.body.velocity.y = 0;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
                this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
                this.game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
                this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this.body.velocity.x -= this.shipSpeed.x;
                    if (this.scale.x === this.scaleMult) {
                        this.scale.x = -this.scaleMult;
                    }
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                    this.body.velocity.x += this.shipSpeed.x;
                    if (this.scale.x === -this.scaleMult) {
                        this.scale.x = this.scaleMult;
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
        animate(isGoingRight: boolean) {
            var isMoving: boolean = this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
            if (isMoving) {
                if (this.animations.frame == 0) {
                    this.stretchAnim.play();
                }
                if (this.wasJustFacingRight != isGoingRight) {
                    this.contractAnim.play();
                }
            }
            else {
                if (this.animations.frame == this.maxVelocityFrame) {
                    this.contractAnim.play();
                }
            }
            this.wasJustFacingRight = isGoingRight;
        }
    }
}