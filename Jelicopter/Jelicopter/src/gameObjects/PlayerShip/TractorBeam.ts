module Jelicopter.Client {

    export class TractorBeam extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        people: Phaser.Group;
        positionOffset: Phaser.Point = new Phaser.Point(96, 50);

        isCarryingPerson: boolean = false;
        personBeingCarried: Person;
        paratrooperBeingCarried: ParaTrooper;
        myCollider: CircleCollider;
        holdOffset(): Phaser.Point {
            return this.position;
            //var xOffset: number = (this.level.playerShip.scale.x === this.level.playerShip.scaleMult ? 1 : -1) * 96;
            //var offSet = new Phaser.Point(xOffset, 50);
            //return new Phaser.Point(this.level.playerShip.position.x + offSet.x, this.level.playerShip.position.y + offSet.y);
        }

        constructor(game: Phaser.Game, level: MainGame, people: Phaser.Group) {
            super(game, 0, 0, 'invisibleDot');
            this.game = game;
            this.level = level;
            this.people = people;
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.myCollider = new CircleCollider(this, 40, new Phaser.Point(0, 0));
        }

        update() {
            this.position.x = this.level.playerShip.position.x + (this.level.playerShip.scale.x === this.level.playerShip.scaleMult ? 1 : -1) * this.positionOffset.x;
            this.position.y = this.level.playerShip.position.y + this.positionOffset.y;

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
                    if (person.myCollider.isColliding(this.myCollider)) {
                        this.collectPerson(person);
                    }
                }
                i++;
            }, this);
            i = 0;
            this.level.paratroopers.forEach(function (paratrooper: ParaTrooper) {
                if (paratrooper.alive && !paratrooper.isPausedForFlinging && !this.isCarryingPerson) {
                    if (paratrooper.myCollider.isColliding(this.myCollider)) {
                        this.collectParaTrooper(paratrooper);
                    }
                }
                i++;
            }, this);
        }

        carryPerson() {
            this.personBeingCarried.position.x = this.holdOffset().x;
            this.personBeingCarried.position.y = this.holdOffset().y;
        }
        carryParaTrooper() {
            this.paratrooperBeingCarried.position.x = this.holdOffset().x;
            this.paratrooperBeingCarried.position.y = this.holdOffset().y;
        }

        dropPerson() {
            this.isCarryingPerson = false;
            this.personBeingCarried = null;
            this.level.soundManager.playSound(SoundFX.Abduct);
        }

        dropParaTrooper() {
            this.isCarryingPerson = false;
            this.paratrooperBeingCarried = null;
            this.level.soundManager.playSound(SoundFX.Abduct);
        }

        flingPerson() {
            var launchVelocity: Phaser.Point = new Phaser.Point(this.level.playerShip.body.velocity.x, this.level.playerShip.body.velocity.y);
            this.personBeingCarried.getFlung(launchVelocity);
            this.dropPerson();
        }

        flingParatrooper() {
            var launchVelocity: Phaser.Point = new Phaser.Point(this.level.playerShip.body.velocity.x, this.level.playerShip.body.velocity.y);
            this.paratrooperBeingCarried.getFlung(launchVelocity);
            this.dropParaTrooper();
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

        isOverlapping(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();
            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }

    }
}