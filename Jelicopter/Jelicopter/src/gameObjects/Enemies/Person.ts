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
        personType: PersonType;

        constructor(game: Phaser.Game, ship: Ship, level: MainGame, personType: PersonType) {
            super(game, 0, 0, PersonType[personType]);
            this.game = game;
            this.ship = ship;
            this.level = level;
            this.anchor.y = 0.5;
            this.anchor.x = 0.5;
            this.personType = personType;
            this.myCollider = new CircleCollider(this, 50, new Phaser.Point(0, 0));
            this.game.add.sprite(0, 0, PersonType[personType], 1);
            this.name = PersonType[personType];
            game.add.existing(this);
            game.physics.enable(this);
            this.body.setCircle(20);
            this.body.gravity.y = 600;
            //this.body.collideWorldBounds = true;
            var animationIndices;
            var scale;
            var frameRate;
            switch (personType) {
                case PersonType.Male1:
                    scale = 1;
                    animationIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                    frameRate = 15;
                    break;
                case PersonType.Male2:
                    scale = .25;
                    animationIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
                    frameRate = 30;
                    break;
                case PersonType.Female1:
                    scale = 1;
                    animationIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                    frameRate = 15;
                    break;
                case PersonType.Female2:
                    scale = 1;
                    animationIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                    frameRate = 15;
                    break;
            }


            this.animations.add('wave', animationIndices, frameRate, true);
            this.play('wave');
            this.scale.set(scale);
            this.pivot.set(0, 0);
            this.remove();      
        }

        floorNumber: number=515;
        maxYSpeedBeforeDeath: number = 500;
        maxTotalSpeedBeforeDeath: number =599;
        isFlying: boolean;

        update() {
            if (this.alive) {
                this.play('wave');
                if ((this.position.y) > this.floorNumber && !this.isBeingHeld) {
                    this.isFlying = false;
                    if (this.body.velocity.y > this.maxYSpeedBeforeDeath) {
                        this.kill();
                        this.level.scoreboard.giveFeedbackOfScore(this.position, Points.Human);                                               
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
            this.position.y = startPosition.y;
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

        kill() {
            this.level.peopleExplosionManager.explodeBody(this.position, this.personType);
            this.isBeingHeld = false;
            
            this.level.soundManager.playSound(SoundFX.PersonDeath);
            super.kill();            

            return this;
        }
        
    }

}
