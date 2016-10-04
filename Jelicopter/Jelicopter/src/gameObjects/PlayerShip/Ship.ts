module Jelicopter.Client {
    export class Ship extends Phaser.Sprite {
        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x + (this.isGoingRight ? 1 :-1)*32, this.position.y + 32);
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

        shield1Stretch: Phaser.Sprite;
        shield1StretchAnim: Phaser.Animation;
        shield1ContractAnim: Phaser.Animation;

        shield1Hit: Phaser.Sprite;
        shield1HitAnim: Phaser.Animation;

        shield2Stretch: Phaser.Sprite;
        shield2StretchAnim: Phaser.Animation;
        shield2ContractAnim: Phaser.Animation;

        shield2Hit: Phaser.Sprite;
        shield2HitAnim: Phaser.Animation;

        screenFlash: Phaser.Sprite;        

        constructor(game: Phaser.Game, level: MainGame, bullets: Bullet) {
            super(game, game.world.centerX, game.world.centerY, 'PlayerShip', 0);
            this.position.y = 600;
            this.anchor.setTo(0.5);
            this.pivot.set(0, 0);
            this.level = level;
            this.scaleMult = 1;
            this.scale.set(this.scaleMult);

            var stretchFrames = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            var contractFrames = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 0];

            this.stretchAnim = this.animations.add('stretch', stretchFrames, 60, false);
            this.contractAnim = this.animations.add('contract', contractFrames, 60, false);
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);

            this.screenFlash = this.game.add.sprite(0, 0, 'hit-indicator');
            this.screenFlash.alpha = 0;

            this.camTarget = this.game.add.sprite(0, 0, 'invisibleDot');
            this.camTarget.position.x = this.position.x;// + (this.isGoingRight ? 1 : -1) * this.camOffset;
            this.camTarget.position.y = this.position.y;

            this.addShieldChildren(stretchFrames, contractFrames);

            this.myCollider = new CircleCollider(this, 60, new Phaser.Point(0, 0));
            this.body.setCircle(20);
            this.bullets = bullets;
            this.health = 3;
            this.maxHeight = this.level.gameSize.y - 180;
            this.minHeight = this.level.heightOffset + 85;
        }

        addShieldChildren(stretchFrames, contractFrames) {
            var shieldHitFrameData = [];
            for (var i: number = 0; i < 28; i++) {
                shieldHitFrameData[i] = i;
            }
            var anchor: Phaser.Point = new Phaser.Point(.6, 0.5);

            this.shield1Hit = this.game.add.sprite(0, 0, 'ship-shield-hit', 0);
            this.shield1Hit.anchor.set(.45, 0.5);
            this.shield1Hit.pivot.set(0, 0);
            this.shield1HitAnim = this.shield1Hit.animations.add('shipShieldHit', shieldHitFrameData, 60, false);
            this.addChild(this.shield1Hit);
            this.shield1Hit.kill();

            this.shield1Stretch = this.game.add.sprite(0, 0, 'ship-shield', 0);
            this.shield1Stretch.anchor.set(anchor.x, anchor.y);
            this.shield1Stretch.pivot.set(0, 0);
            this.shield1StretchAnim = this.shield1Stretch.animations.add('ship-shield-stretch', stretchFrames, 60, false);
            this.shield1ContractAnim = this.shield1Stretch.animations.add('ship-shield-contract', contractFrames, 60, false);
            this.addChild(this.shield1Stretch);
            
            this.shield2Hit = this.game.add.sprite(0, 0, 'ship-shield-hit', 0);
            this.shield2Hit.scale.set(1.25);
            this.shield2Hit.anchor.set(.45, 0.5);
            this.shield2Hit.pivot.set(0, 0);
            this.shield2HitAnim = this.shield2Hit.animations.add('ship-shield', shieldHitFrameData, 60, false);
            this.addChild(this.shield2Hit);
            this.shield2Hit.kill();

            this.shield2Stretch = this.game.add.sprite(0, 0, 'ship-shield-outer', 0);
            this.shield2Stretch.anchor.set(anchor.x, anchor.y);
            this.shield2Stretch.pivot.set(0, 0);
            this.shield2StretchAnim = this.shield2Stretch.animations.add('ship-shield-stretch', stretchFrames, 60, false);
            this.shield2ContractAnim = this.shield2Stretch.animations.add('ship-shield-contract', contractFrames, 60, false);
            this.addChild(this.shield2Stretch);


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
                this.screenFlash.position.x = this.game.camera.x;
                if (!this.level.gamepadManager.joyStickIsActive) {
                    this.move(this.isGoingRight);
                    var isMoving: boolean = this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
                    this.animate(isMoving);
                    var isPressed = this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
                    this.checkAction(isPressed);
                }
            }
        }
        checkAction(isPressed) {
            
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
            if (this.health == 2) {
                this.removeChild(this.shield2Stretch);
            }
            else if (this.health == 1){
                this.removeChild(this.shield1Stretch);
            }
            this.animateDamage(this.health);
            if (this.health <= 0) {
                this.level.soundManager.playSound(SoundFX.PlayerShipDeath);
                this.kill();
            }
            else {
                this.level.soundManager.playSound(SoundFX.ShieldLost);
            }
        }
        endShieldHitScale: number = 3;
        animateDamage(health: number) {
            this.screenFlash.alpha = 1;
            var tween = this.game.add.tween(this.screenFlash).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);

            switch (health) {
                case 2:                    
                    var tween = this.game.add.tween(this.shield2Hit.scale).to({ x: this.endShieldHitScale, y: this.endShieldHitScale }, 6000, Phaser.Easing.Linear.None, true);
                    this.shield2Hit.revive();
                    this.shield2HitAnim.play(30, false, true);
                    //first shield
                    break;
                case 1:
                    //this.shield1Hit.scale.set(1);
                    var tween = this.game.add.tween(this.shield1Hit.scale).to({ x: this.endShieldHitScale, y: this.endShieldHitScale }, 6000, Phaser.Easing.Linear.None, true);
                    this.shield1Hit.revive();
                    this.shield1HitAnim.play(30, false, true);
                    //second shield
                    break;
                case 0:
                    this.level.playerShipExplosionManager.burstParticles(this.position);
                    //ship explosion
                    break;
            }
        }



        kill() {
            this.game.time.events.add(Phaser.Timer.SECOND * 4, this.level.endGame, this.level);
            this.level.tractorBeam.flingAllPeople();
            this.level.tractorBeam.flingVehicles();
            this.level.soundManager.playSound(SoundFX.GameOver);
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
        animate(isMoving) {
            
            if (isMoving) {
                if (this.animations.frame == 0) {
                    this.stretchAnim.play();
                    if (this.health == 3) {
                        this.shield1StretchAnim.play();
                        this.shield2StretchAnim.play();
                    }
                    else if (this.health == 2) {
                        this.shield1StretchAnim.play();                        
                    }
                }
                if (this.wasJustFacingRight != this.isGoingRight) {
                    this.contractAnim.play();
                    if (this.health == 3) {
                        this.shield1ContractAnim.play();
                        this.shield2ContractAnim.play();
                    }
                    else if (this.health == 2) {
                        this.shield1ContractAnim.play();
                    }
                }
            }
            else {
                if (this.animations.frame == this.maxVelocityFrame) {
                    this.contractAnim.play();
                    if (this.health == 3) {
                        this.shield1ContractAnim.play();
                        this.shield2ContractAnim.play();
                    }
                    else if (this.health == 2) {
                        this.shield1ContractAnim.play();
                    }
                }
            }
            this.wasJustFacingRight = this.isGoingRight;
        }
    }
}