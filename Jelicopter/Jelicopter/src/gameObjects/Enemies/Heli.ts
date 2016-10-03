module Jelicopter.Client {

    export class Heli extends Phaser.Sprite {

        enemyType: EnemyType;
        goStraight: boolean;
        myCollider: CircleCollider;
        level: MainGame;
        shipSpeed: Phaser.Point;
        timeToMoveStraight(): number {
            return this.game.rnd.integerInRange(1, 30) * 0.01 + 1;
        }
        timeToShoot(): number {
            return this.game.rnd.integerInRange(1, 100) * 0.01 + 2.75;
        }
        shootSpeed: number = 100;
        maxShootDistance: number = 900;
        positionOffset: Phaser.Point = new Phaser.Point(0, 0);
        timerAllowsShooting: boolean = false;
        worldHeightShiftPadding: number = 200;
        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x, this.position.y);
        }
        shootTimerEvent;
        moveUpDownEvent;

        constructor(game: Phaser.Game, level: MainGame) {
            super(game, 0, 0, 'Heli');
            this.level = level;
            this.anchor.setTo(0.5);
            this.pivot.set(0, 0);
            this.animations.add('heliFly', [0, 1, 2], 30, true);
            game.add.existing(this);
            // Physics
            this.myCollider = new CircleCollider(this, 50, this.positionOffset);
            game.physics.enable(this);
            this.body.setCircle(20);
            this.shipSpeed = new Phaser.Point(this.game.rnd.sign() * 250, 100);
            this.enemyType = EnemyType.Heli;
            super.kill();      
        }


        update() {
            if (this.alive) {
                this.animations.play('heliFly');
                this.checkToShoot();
                this.checkFaceDirection();
            }
        }

        checkFaceDirection() {
            if (this.level.playerShip.position.x > this.position.x) {
                this.scale.x = 1;
            }
            else {
                this.scale.x = -1;
            }
        }

        checkToShoot() :void{
            if (this.level.playerShip.alive) {
                if (this.timerAllowsShooting){
                    if (this.myPosition().distance(this.level.playerShip.myPosition()) < this.maxShootDistance) {
                        this.timerAllowsShooting = false;
                        this.shoot();
                    }                                    
                }
            }
        }

        comeAlive() :void{
            this.revive();
            this.timerAllowsShooting = false;
            this.game.time.events.remove(this.shootTimerEvent);
            this.shootTimerEvent = this.game.time.events.add(Phaser.Timer.SECOND * this.timeToShoot(), this.setShootingToOk, this);
            this.moveStraight();
            this.alternateUpDown();
        }

        kill(): Phaser.Sprite {
            this.level.heliExplosionManager.particleBurst(this.position);
            this.level.soundManager.playSound(SoundFX.HeliExplode);
            this.level.roundManager.checkToRespawn(this.enemyType);
            this.timerAllowsShooting = false;
            super.kill();            
            return this;
        }


        moveStraight(): void {
            this.body.velocity.x = this.shipSpeed.x;
        }

        alternateUpDown(): void {
            this.goStraight = !this.goStraight;

            if (this.goStraight) {
                this.body.velocity.y = 0;
            }
            else {
                var goUp: boolean = false;
                if (this.position.y > (this.game.height + this.level.heightOffset - this.worldHeightShiftPadding)) {
                    goUp = true;
                }
                else if (this.position.y < (this.level.heightOffset + this.worldHeightShiftPadding)) {
                    goUp = false;
                }
                else {
                    goUp = this.game.rnd.sign() == 1;
                }
                this.body.velocity.y = (goUp ? -1 : 1) * this.shipSpeed.y;
            }
            if (this.alive) {
                this.game.time.events.remove(this.moveUpDownEvent);
                this.moveUpDownEvent = this.game.time.events.add(Phaser.Timer.SECOND * this.timeToMoveStraight(), this.alternateUpDown, this);
            }
        }

        shoot(): void{
            var shootDir = new Phaser.Point(this.level.playerShip.myPosition().x - this.myPosition().x, this.level.playerShip.myPosition().y - this.myPosition().y);
            var myBullet = this.level.enemyBullets.getFirstDead(false);
            myBullet.reset(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y);
            var angleOfShotRadians = Math.atan2(shootDir.y, shootDir.x);
            this.game.physics.arcade.velocityFromAngle(angleOfShotRadians * 180 / Math.PI, 400, myBullet.body.velocity);
            myBullet.lifespan = 4500;
            myBullet.rotation = angleOfShotRadians;
            this.level.soundManager.playSound(SoundFX.FireRocket);

            this.game.time.events.remove(this.shootTimerEvent);
            this.shootTimerEvent = this.game.time.events.add(Phaser.Timer.SECOND * this.timeToShoot(), this.setShootingToOk, this);            
        }        

        setShootingToOk(): void {
            this.timerAllowsShooting = true;
        }

    }

}