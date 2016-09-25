module Jelicopter.Client {

    export class TractorBeam extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        people: Phaser.Group;

        isCarryingPerson: boolean = false;
        personBeingCarried:Person;

        constructor(game: Phaser.Game, level: MainGame, people: Phaser.Group) {
            super(game, 0, 0, 'EnemyBullet');
            this.game = game;
            this.level = level;
            this.people = people;
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
        }

        update() {
            if (this.level.playerShip.alive) {
                if (!this.isCarryingPerson) {
                    this.checkToCollectPeople();
                }
                else {
                    if (this.personBeingCarried.alive) {
                        this.carryPerson();                        
                    }
                    else {
                        this.dropPerson();
                    }
                }
            }            
        }

        checkToCollectPeople() {
            var i: number = 0;
            this.people.forEach(function (person: Person) {
                if (person.alive && !person.isPausedForFlinging && !this.isCarryingPerson) {
                    if (person.myCollider.isColliding(this.level.playerShip.myCollider)) {
                        this.collectPerson(person);                        
                    }
                }
                i++;
            }, this);
        }

        carryPerson() {
            var xOffset : number= (this.level.playerShip.scale.x === 1 ? -1 : 1) * 30;
            this.personBeingCarried.position.x = this.level.playerShip.position.x + xOffset;
            this.personBeingCarried.position.y = this.level.playerShip.position.y + 50;
        }

        dropPerson() {
            this.isCarryingPerson = false;
            this.personBeingCarried = null;
            this.level.soundManager.playSound(SoundFX.Abduct);
        }

        flingPerson() {
            var launchVelocity: Phaser.Point = new Phaser.Point(this.level.playerShip.body.velocity.x, this.level.playerShip.body.velocity.y);
            this.personBeingCarried.getFlung(launchVelocity);
            this.dropPerson();
        }

        collectPerson(person: Person) {
            this.personBeingCarried = person;
            this.isCarryingPerson = true;
            person.getGrabbed();
            this.level.soundManager.playSound(SoundFX.Abduct);
        }


        isOverlapping(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();
            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }

    }
}