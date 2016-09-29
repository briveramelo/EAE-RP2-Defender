module Jelicopter.Client {

    export class ParaTrooper extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        parachute;
        parachuteCollider: CircleCollider;
        personCollider: CircleCollider;
        isSafeOnGround: boolean = false;
        isOnParachute: boolean = true;

        person;
        positionOffset: Phaser.Point = new Phaser.Point(0, 0);
        missileTimerAllowsShooting: boolean = true;
        maxMissileShootDistance: number = 900;
        timeToShootMissile: number = 3;
        floorHeight: number;

        isPausedForFlinging: boolean;
        launchSpeedMultiplier: number = 1.75;
        isBeingHeld: boolean;
        runSpeed: number;
        myCollider;
        lifeCount: number;

        maxYSpeedBeforeDeath: number = 500;
        maxTotalSpeedBeforeDeath: number = 599;
        isFlying: boolean;
        scaleMult: number;
        parachuteSpeed: number = 1;
        freeFallSpeed: number =8;


        constructor(game: Phaser.Game, level: MainGame) {
            super(game, 0, 0, null, 0);
            this.level = level;
            this.anchor.setTo(0.5);
            this.pivot.set(0, 0);
            this.scaleMult = 1;
            this.scale.setTo(this.scaleMult);

            this.person = this.game.add.sprite(0, 0, 'Bob');
            this.person.anchor.setTo(0.5);
            this.person.pivot.set(0, 0);
            this.addChild(this.person);

            this.parachute = this.game.add.sprite(10, -40, 'Parachute');
            this.parachute.anchor.setTo(0.5);
            this.parachute.pivot.set(0, 0);
            this.addChild(this.parachute);


            this.myCollider = new CircleCollider(this, 50, new Phaser.Point(0, 0));
            game.physics.enable(this);
            //this.body.setCircle(20);
            //this.body.gravity.y = 600;
            game.add.existing(this);
            this.floorHeight = this.level.gameSize.y - 65;
            this.lifeCount = 0;

            super.kill();
        }

        reset(x: number, y: number) {
            this.removeChild(this.person);
            this.addChild(this.parachute);
            this.addChild(this.person);
            this.body.gravity.y = 0;
            super.reset(x, y);
            this.revive();
            return this;
        }


        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x, this.position.y);
        }

        update() {
            if (this.alive) {
                this.throwToGround();
                if (this.isSafeOnGround) {
                    this.animateOnGround();
                    this.checkToShoot();
                }
                if (this.position.y < this.floorHeight) {
                    if (this.children.indexOf(this.parachute) > -1) {
                        this.position.y += 1;
                        this.isOnParachute = true;
                    }
                    else {
                        this.position.y += 8;
                        this.isOnParachute = false;                       
                    }
                }
                else {
                    if (this.children.indexOf(this.parachute) > -1) {                        
                        this.land();
                    }
                    else if (!this.isSafeOnGround) {                        
                        this.level.scoreboard.giveFeedbackOfScore(this.position, Points.Paratrooper);
                        this.kill();
                    }
                }
            }
        }

        land() {
            this.resetMissileShooting();
            this.isSafeOnGround = true;
            this.removeChild(this.parachute);
        }

        throwToGround() {
            
            if ((this.position.y) > this.floorHeight && !this.isBeingHeld) {                
                this.isFlying = false;
                if (this.body.velocity.y > this.maxYSpeedBeforeDeath) {
                    this.level.scoreboard.giveFeedbackOfScore(this.position, Points.Paratrooper);
                    this.kill();
                }
                else if ((this.isPausedForFlinging && this.body.velocity.y > 0) || !this.isPausedForFlinging) {
                    this.position.y = this.floorHeight;
                    this.body.velocity.x = 0;
                    this.body.velocity.y = 0;
                }
            }
            else {
                this.isFlying = true;
                if (this.isBeingHeld) {
                    this.body.velocity.y = this.level.playerShip.body.velocity.y;
                    this.body.velocity.x = this.level.playerShip.body.velocity.x;
                }
            }
        }



        animateOnGround() {           
            var angleBetweenShipAndTrooper = this.game.physics.arcade.angleBetween(this.level.playerShip, this);
            if (angleBetweenShipAndTrooper < 3 && angleBetweenShipAndTrooper > 1.6) {
                this.person.frame = 0; // Player is to the right of paratrooper
                this.person.scale.x = this.scaleMult;
            }
            else if (angleBetweenShipAndTrooper > 0 && angleBetweenShipAndTrooper < 1.25) {
                this.person.frame = 0;
                this.person.scale.x = -this.scaleMult;// Player is to the left of paratrooper
            }
            else {
                this.person.frame = 1;
                this.person.scale.x = this.scaleMult;//center
            }
            
        }

        checkToShoot(): void {
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
            myBullet.reset(this.position.x, this.position.y);
            var angleOfShotRadians;
            if (this.person.frame == 1) {
                angleOfShotRadians = -90;
            }
            else {
                if (this.person.scale.x == this.scaleMult)
                    angleOfShotRadians = -45;
                else if (this.person.scale.x == -this.scaleMult) {
                    myBullet.reset(this.position.x - 20, this.position.y);
                    angleOfShotRadians = -135;
                }
            }

            this.level.soundManager.playSound(SoundFX.FireRocket);
            myBullet.lifespan = 4500;
            myBullet.angle = angleOfShotRadians;
            this.game.physics.arcade.velocityFromAngle(angleOfShotRadians, 400, myBullet.body.velocity);
            this.resetMissileShooting();
        }

        kill() {
            this.lifeCount++;
            this.isOnParachute = true;
            this.level.peopleExplosionManager.explodeBody(this.position, PersonType.Male1);
            this.level.soundManager.playSound(SoundFX.PersonDeath);          
            super.kill();

            return this;
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

        getFlung(launchVelocity: Phaser.Point) {
            this.body.gravity.y = 600;
            this.body.velocity.x = launchVelocity.x * this.launchSpeedMultiplier;
            this.body.velocity.y = launchVelocity.y * this.launchSpeedMultiplier;
            this.isPausedForFlinging = true;
            this.isBeingHeld = false;
            this.game.time.events.add(Phaser.Timer.SECOND * 1, this.allowForCatching, this, this.lifeCount);
            this.game.time.events.add(Phaser.Timer.SECOND * 1, this.setMissileShootingToOk, this, this.lifeCount);
        }

        allowForCatching(startingLifeCount) {
            if (startingLifeCount == this.lifeCount) {
                this.isPausedForFlinging = false;
            }
        }

        getGrabbed() {
            this.isBeingHeld = true;
        }

        comeAlive(startPosition: Phaser.Point): void {
            this.revive();

            //Reset all values
            this.removeChild(this.person);
            this.body.gravity.y = 0;
            this.addChild(this.parachute);
            this.addChild(this.person);

            this.missileTimerAllowsShooting = false; 
            this.isSafeOnGround = false;
            this.isOnParachute = true;
          
        }

       

    }
}