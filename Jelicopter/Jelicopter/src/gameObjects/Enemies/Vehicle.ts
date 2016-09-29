module Jelicopter.Client {

    export class Vehicle extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        tank;
        myCollider;
        floorHeight;
        missileTimerAllowsShooting: boolean = true;
        maxMissileShootDistance: number = 900;
        timeToShootMissile: number = 3;
        isBeingHeld: boolean;
        lifeCount: number;
        isPausedForFlinging: boolean;
        rotationSpeed: number = 4;
        isFlying: boolean;
        maxYSpeedBeforeDeath: number = 500;
        maxTotalSpeedBeforeDeath: number = 599;
        launchSpeedMultiplier: number = 1.75;

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
            super.kill();
        }

        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x, this.position.y);
        }

        update() {
           
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

        dieOnFloor() {
            if (this.alive) {
                this.level.scoreboard.giveFeedbackOfScore(this.position, Points.Vehicle);
            }
            this.kill();
        }

        standOnFloor() {
            //this.checkToShoot();
            //this.position.x -= 4;
            this.position.y = this.floorHeight+2;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.angle = 0;
        }

        kill() {
            this.lifeCount++;
           
            super.kill();

            return this;
        }

        checkToShoot() {
            if (this.level.playerShip.alive) {
                if (this.myPosition().distance(this.level.playerShip.myPosition()) < this.maxMissileShootDistance &&
                    this.missileTimerAllowsShooting &&
                    !this.isBeingHeld) {

                    this.shootMissile();
                }
            }
        }

        rotate() {
           // this.position.y += 3;
            this.angle += this.rotationSpeed;
        }


        shootMissile(): void {
            var myBullet = this.level.enemyBullets.getFirstDead(false);
                 
            var angleOfShotRadians = this.checkAngle(myBullet);
            myBullet.lifespan = 4500;
           // myBullet.angle = -135;
            this.game.physics.arcade.velocityFromAngle(angleOfShotRadians, 400, myBullet.body.velocity);
            this.resetMissileShooting();
        }

        checkAngle(myBullet) {
            var angle;
            var angleBetweenShipAndTrooper = this.game.physics.arcade.angleBetween(this.level.playerShip, this);
            if (angleBetweenShipAndTrooper < 3 && angleBetweenShipAndTrooper > 2) {
                this.tank.play('moveRightTank');
                myBullet.reset(this.position.x-50, this.position.y+10);
                angle = -45;
                myBullet.angle = -45;
            }
            else if (angleBetweenShipAndTrooper > 0 && angleBetweenShipAndTrooper < 1) {
                this.tank.play('moveLeftTank');
                myBullet.reset(this.position.x-25, this.position.y+25);
                angle = -150;
                myBullet.angle = -135;// Player is to the left of tank
            }
            else {
                this.tank.play('moveUpTank');
                myBullet.reset(this.position.x-40, this.position.y);
                angle = -90;//center
                myBullet.angle = -90;
            }

            return angle;
        }

        resetMissileShooting(): void {
            this.missileTimerAllowsShooting = false;
            this.game.time.events.add(Phaser.Timer.SECOND * this.timeToShootMissile, this.setMissileShootingToOk, this, this.lifeCount);
        }

        setMissileShootingToOk(startingLifeCount): void {
            if (this.lifeCount == startingLifeCount) {
                this.missileTimerAllowsShooting = true;
            }
        }

        reset(x: number, y: number) {
            super.reset(x, y);
            return this;
        }

        getGrabbed() {
            this.isBeingHeld = true;
        }

        getFlung(launchVelocity: Phaser.Point) {
            this.body.velocity.x = launchVelocity.x * this.launchSpeedMultiplier;
            this.body.velocity.y = launchVelocity.y * this.launchSpeedMultiplier;
            this.isPausedForFlinging = true;
            this.isBeingHeld = false;
            this.game.time.events.add(Phaser.Timer.SECOND * 1, this.allowForCatching, this);
        }

        allowForCatching() {
            this.isPausedForFlinging = false;
        }
    }
}