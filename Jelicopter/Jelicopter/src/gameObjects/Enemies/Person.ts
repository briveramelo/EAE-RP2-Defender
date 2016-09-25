module Jelicopter.Client {

    export class Person extends Phaser.Sprite {

        myCollider: CircleCollider;
        ship: Ship;
        game: Phaser.Game;
        level: MainGame;
        isPausedForFlinging: boolean;
        launchSpeedMultiplier: number = 1.75;
        isBeingHeld: boolean;
        runSpeed: number;

        constructor(game: Phaser.Game, ship: Ship, level:MainGame) {
            super(game, 0, 0, 'JumpingMale');
            this.game = game;
            this.ship = ship;
            this.level = level;
            this.anchor.y = 0.5;
            this.anchor.x = 0.5;
            this.myCollider = new CircleCollider(this, 35, new Phaser.Point(0, 0));
            this.game.add.sprite(0, 0, 'JumpingMale', 1);
            
            game.add.existing(this);
            game.physics.enable(this);
            this.body.setCircle(20);
            this.body.gravity.y = 600;
            //this.body.collideWorldBounds = true;

            this.animations.add('wave', [0, 1, 2, 3, 4], 15, true);
            this.play('wave');
            this.scale.set(0.62);
            this.remove();      
        }

        floorNumber: number=535;
        maxYSpeedBeforeDeath: number = 500;
        maxTotalSpeedBeforeDeath: number =599;
        isFlying: boolean;

        update() {
            if (this.alive) {
                this.play('wave');
                if ((this.position.y) > this.floorNumber && !this.isBeingHeld) {
                    this.isFlying = false;
                    if (this.body.velocity.y > this.maxYSpeedBeforeDeath) {
                        this.kill(Points.Human);                                              
                    }
                    else if ((this.isPausedForFlinging && this.body.velocity.y > 0) || !this.isPausedForFlinging) {
                        this.position.y = this.floorNumber;
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
        }        

        spawn(startPosition: Phaser.Point) {
            this.revive();
            this.isBeingHeld = false;
            this.isPausedForFlinging = false;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            
            this.position.x = startPosition.x;
            this.position.y = this.floorNumber - 10;
            this.body.velocity.x = this.runSpeed;
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

        getGrabbed() {
            this.isBeingHeld = true;
        }

        remove() {
            super.kill();
        }

        kill(points?: Points, shouldPlay?:boolean) {
            this.level.peopleExplosionManager.explodeBody(this.position);
            this.isBeingHeld = false;

            if (shouldPlay) {
                this.level.soundManager.playSound(SoundFX.PersonDeath);
            }
            if (points) {
                this.level.scoreboard.updateScore(points);  
            }

            super.kill();            

            return this;
        }
        
    }

}
