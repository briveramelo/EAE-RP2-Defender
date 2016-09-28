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


        constructor(game: Phaser.Game, level: MainGame) {
            super(game, 0, 0, null, 0);
            this.level = level;
            this.anchor.setTo(0.5);
            this.pivot.set(0, 0);
            

            this.tank = this.game.add.sprite(0, 0, 'Tank');
            this.addChild(this.tank);

            //this.parachute = this.game.add.sprite(10, -40, 'Parachute');
            //this.parachute.anchor.setTo(0.5);
            //this.parachute.pivot.set(0, 0);
            //this.addChild(this.parachute);


            this.myCollider = new CircleCollider(this, 50, new Phaser.Point(0, 0));
            game.physics.enable(this);
            //this.body.setCircle(20);
            //this.body.gravity.y = 600;
            game.add.existing(this);
            this.floorHeight = this.level.gameSize.y - 65;
            //this.lifeCount = 0;
            this.tank.animations.add('moveUpTank', [0, 3], 15, true);
            this.tank.animations.add('moveLeftTank', [1, 4], 15, true);
            this.tank.animations.add('moveRightTank', [2, 5], 15, true);
            //this.tank.play('moveUpTank');
            this.lifeCount = 0;
            super.kill();
        }

        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x, this.position.y);
        }

        update() {
            this.checkToShoot();
            this.position.x -= 4;
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

        shootMissile(): void {
            var myBullet = this.level.enemyBullets.getFirstDead(false);
                 
            var angleOfShotRadians = this.checkAngle(myBullet);
            //if (this.tank.frame == 1) {
            //    angleOfShotRadians = -90;
            //}
            //else {
            //    if (this.tank.scale.x == this.scaleMult)
            //        angleOfShotRadians = -45;
            //    else if (this.tank.scale.x == -this.scaleMult) {
            //        myBullet.reset(this.position.x - 20, this.position.y);
            //        angleOfShotRadians = -135;
            //    }
            //}

            //angleOfShotRadians = -90;

            myBullet.lifespan = 4500;
            myBullet.angle = angleOfShotRadians;
            this.game.physics.arcade.velocityFromAngle(angleOfShotRadians, 400, myBullet.body.velocity);
            this.resetMissileShooting();
        }

        checkAngle(myBullet) {
            //this.tank.animations.stop(null, true);
            var angle;
            var angleBetweenShipAndTrooper = this.game.physics.arcade.angleBetween(this.level.playerShip, this);
            if (angleBetweenShipAndTrooper < 3 && angleBetweenShipAndTrooper > 2) {
                this.tank.play('moveRightTank');
                myBullet.reset(this.position.x+40, this.position.y+40);
                //this.tank.frame = 0; // Player is to the right of tank
                angle = -45;
            }
            else if (angleBetweenShipAndTrooper > 0 && angleBetweenShipAndTrooper < 1) {
                this.tank.play('moveLeftTank');
                myBullet.reset(this.position.x, this.position.y+40);
                angle = -135;// Player is to the left of tank
            }
            else {
                this.tank.play('moveUpTank');
                myBullet.reset(this.position.x + 40, this.position.y);
                angle = -90;//center
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
            
            //this.removeChild(this.person);
            //this.addChild(this.parachute);
            //this.addChild(this.person);
            //this.body.gravity.y = 0;
            super.reset(x, y);
            return this;
        }
    }
}