module Jelicopter.Client {

    export class TractorBeam extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        people: Phaser.Group;

        isCarryingPerson: boolean = false;
        personBeingCarried: Person;
        paratrooperBeingCarried: ParaTrooper;

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
                    if (this.personBeingCarried != null) {
                        if (this.personBeingCarried.alive)
                            this.carryPerson(); 
                        else {
                            this.dropPerson();
                        }                       
                    }

                    if (this.paratrooperBeingCarried != null) {
                        if (this.paratrooperBeingCarried.alive)
                            this.carryParaTrooper();
                        else {
                            this.dropParaTrooper();
                        }
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
            i = 0;
            this.level.paratroopers.forEach(function (paratrooper: ParaTrooper) {
                if (paratrooper.alive && !paratrooper.isPausedForFlinging && !this.isCarryingPerson) {
                    if (this.isOverlapping(paratrooper, this.level.playerShip)) {
                        this.collectParaTrooper(paratrooper);
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

        collectParaTrooper(paratrooper: ParaTrooper) {
            paratrooper.removeChild(paratrooper.parachute);
            this.paratrooperBeingCarried = paratrooper;
            this.isCarryingPerson = true;
            paratrooper.getGrabbed();
            this.level.soundManager.playSound(SoundFX.Abduct);
        }

        carryParaTrooper() {
            var xOffset: number = (this.level.playerShip.scale.x === 1 ? -1 : 1) * 30;
            this.paratrooperBeingCarried.position.x = this.level.playerShip.position.x + xOffset;
            this.paratrooperBeingCarried.position.y = this.level.playerShip.position.y + 50;
        }

        dropParaTrooper() {
            this.isCarryingPerson = false;
            this.paratrooperBeingCarried = null;
            this.level.soundManager.playSound(SoundFX.Abduct);
        }


        isOverlapping(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();
            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }

    }
}