module Jelicopter.Client {

    export class Vehicle extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        tank;
        myCollider;
        floorHeight;
        isPausedForShooting: boolean;
        maxMissileShootDistance: number = 900;
        timeToShootMissle(): number {
            return this.game.rnd.integerInRange(1, 25) * 0.01 + 2.75;
        }
        isBeingHeld: boolean;
        lifeCount: number;
        isPausedForFlinging: boolean;
        rotationSpeed: number = 4;
        isFlying: boolean;
        maxYSpeedBeforeDeath: number = 500;
        maxTotalSpeedBeforeDeath: number = 599;
        launchSpeedMultiplier: number = 1.75;
        pauseForShootingEvent;
        pauseForFlingingEvent;

        constructor(game: Phaser.Game, level: MainGame) {
            super(game, 0, 0, null, 0);
            this.level = level;
            this.anchor.setTo(0.5);
            this.pivot.set(0, 0);


            this.tank = this.game.add.sprite(0, 0, 'Tank');
            this.addChild(this.tank);
            this.tank.anchor.setTo(0.5);
            this.tank.pivot.set(0, 0);
            this.myCollider = new CircleCollider(this, 50, new Phaser.Point(0, 0));
            game.physics.enable(this);
            game.add.existing(this);
            this.floorHeight = this.level.gameSize.y - 65;
            this.tank.animations.add('moveUpTank', [0, 3], 15, true);
            this.tank.animations.add('moveLeftTank', [1, 4], 15, true);
            this.tank.animations.add('moveRightTank', [2, 5], 15, true);

            //this.body.gravity.y = 600;
            this.floorHeight = this.level.gameSize.y - 52;
            this.lifeCount = 0;
            this.isPausedForFlinging = false;
            this.isPausedForShooting = true;
            super.kill();
        }

        reset(x: number, y: number) {
            super.reset(x, y);
            this.resetMissileShooting();
            this.resetFlinging();

            super.revive();
            return this;
        }

        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x, this.position.y);
        }

        update() {
            if (this.alive) {
                if ((this.position.y) > this.floorHeight && !this.isBeingHeld) {
                    this.checkToShoot();
                    this.position.x -= 4;
                    this.isFlying = false;
                    if (this.body.velocity.y > this.maxYSpeedBeforeDeath) {
                        this.dieOnFloor();
                    }
                    else if ((this.isPausedForFlinging && this.body.velocity.y > 0) || !this.isPausedForFlinging) {
                        this.standOnFloor();
                    }
                }
                else {
                    this.isFlying = true;
                    if (this.isBeingHeld) {
                        this.body.velocity.y = this.level.playerShip.body.velocity.y;
                        this.body.velocity.x = this.level.playerShip.body.velocity.x;
                    }
                    else {
                        this.rotate();
                    }
                }
            }
        }


        checkToShoot() {
            if (this.level.playerShip.alive && this.alive) {
                if (this.myPosition().distance(this.level.playerShip.myPosition()) < this.maxMissileShootDistance &&
                    !this.isPausedForShooting &&
                    !this.isBeingHeld) {

                    this.shootMissile();
                }
            }
        }

        dieOnFloor() {
            if (this.alive) {
                this.level.scoreboard.giveFeedbackOfScore(this.position, Points.Vehicle);
                this.kill();
            }

        }

        standOnFloor() {
            //this.checkToShoot();
            //this.position.x -= 4;
            if (!this.justLanded) {
                this.justLanded = true;
                this.isPausedForFlinging = false;

                this.game.time.events.remove(this.pauseForShootingEvent);
                this.pauseForShootingEvent = this.game.time.events.add(Phaser.Timer.SECOND * this.timeToShootMissle(), this.setMissileShootingToOk, this);
            }
            this.position.y = this.floorHeight + 2;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.angle = 0;
        }

        justLanded: boolean;

        rotate() {
            // this.position.y += 3;
            this.angle += this.rotationSpeed;
            this.isPausedForShooting = true;
        }


        shootMissile(): void {
            var myBullet = this.level.enemyBullets.getFirstDead(false);

            var angleOfShotRadians = this.checkAngle(myBullet);
            myBullet.lifespan = 4500;
            // myBullet.angle = -135;
            this.level.soundManager.playSound(SoundFX.FireRocket);
            this.game.physics.arcade.velocityFromAngle(angleOfShotRadians, 400, myBullet.body.velocity);
            this.resetMissileShooting();
        }

        checkAngle(myBullet) {
            var angle;
            var angleBetweenShipAndTrooper = this.game.physics.arcade.angleBetween(this.level.playerShip, this);
            if (angleBetweenShipAndTrooper < 3 && angleBetweenShipAndTrooper > 2) {
                this.tank.play('moveRightTank');
                myBullet.reset(this.position.x - 50, this.position.y + 10);
                angle = -45;
                myBullet.angle = -45;
            }
            else if (angleBetweenShipAndTrooper > 0 && angleBetweenShipAndTrooper < 1) {
                this.tank.play('moveLeftTank');
                myBullet.reset(this.position.x - 25, this.position.y + 25);
                angle = -150;
                myBullet.angle = -135;// Player is to the left of tank
            }
            else {
                this.tank.play('moveUpTank');
                myBullet.reset(this.position.x - 40, this.position.y);
                angle = -90;//center
                myBullet.angle = -90;
            }

            return angle;
        }


        getGrabbed() {
            this.isBeingHeld = true;
            this.justLanded = false;
        }

        getFlung(launchVelocity: Phaser.Point) {
            this.body.velocity.x = launchVelocity.x * this.launchSpeedMultiplier;
            this.body.velocity.y = launchVelocity.y * this.launchSpeedMultiplier;
            this.isBeingHeld = false;

            //this.game.time.events.remove(this.pauseForShootingEvent);
            this.resetFlinging();
        }

        resetMissileShooting(): void {
            this.isPausedForShooting = true;

            this.game.time.events.remove(this.pauseForShootingEvent);
            this.pauseForShootingEvent = this.game.time.events.add(Phaser.Timer.SECOND * this.timeToShootMissle(), this.setMissileShootingToOk, this);
        }

        resetFlinging() {
            this.isPausedForFlinging = true;
            this.game.time.events.remove(this.pauseForFlingingEvent);
            this.pauseForFlingingEvent = this.game.time.events.add(Phaser.Timer.SECOND * .5, this.allowForCatching, this);
        }

        setMissileShootingToOk(): void {
            this.isPausedForShooting = false;
        }        

        allowForCatching() {
            this.isPausedForFlinging = false;
        }

        disAllowShooting() {
            this.isPausedForShooting = true;
        }

        kill() {
            this.level.soundManager.playSound(SoundFX.HeliExplode);
            this.level.vehicleExplosionManager.particleBurst(this.position);

            super.kill();

            return this;
        }
        
    }
}