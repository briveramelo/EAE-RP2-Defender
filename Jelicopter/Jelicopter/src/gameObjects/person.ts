module Jelicopter.Client {

    export class Person extends Phaser.Sprite {

        myCollider: CircleCollider;
        ship: Ship;
        game: Phaser.Game;
        level: MainGame;
        isPausedForFlinging: boolean;
        launchSpeedMultiplier: number = 1.75;
        isBeingHeld: boolean;

        constructor(game: Phaser.Game, ship: Ship, level:MainGame) {
            super(game, 0, 0, 'JumpingMale');
            this.game = game;
            this.ship = ship;
            this.level = level;
            this.anchor.y = 0.5;
            this.anchor.x = 0.5;
            this.myCollider = new CircleCollider(this, 35, new Phaser.Point(0, 0));
            this.game.add.sprite(0, 0, 'JumpingMale', 1);
            this.spawn();
            
            game.add.existing(this);
            game.physics.enable(this);
            this.body.setCircle(20);
            this.body.gravity.y = 600;
            //this.body.collideWorldBounds = true;

            this.animations.add('wave', [0, 1, 2, 3, 4], 15, true);
            this.play('wave');
            this.scale.set(0.62);
            this.revive();      
        }

        floorNumber: number=495;

        update() {
            this.play('wave');
            if ((this.position.y) > this.floorNumber && !this.isBeingHeld) {
                if ((this.isPausedForFlinging && this.body.velocity.y > 0) || !this.isPausedForFlinging){                    
                    this.body.position.y = this.floorNumber;
                    this.body.velocity.x = 0;
                }
            }
        }

        spawn() {
            this.revive();
            this.isBeingHeld = false;
            this.isPausedForFlinging = false;
            var xSpawnPosition = this.game.rnd.between(this.ship.position.x - this.level.backgroundImageWidth / 2, this.ship.position.x + this.level.backgroundImageWidth / 2);
            this.position = new Phaser.Point(xSpawnPosition, this.floorNumber-10);
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
            this.level.peopleExplosionManager.explodeBody(this.position);
            this.isBeingHeld = false;
            super.kill();
            return this;
        }
        
    }

}
