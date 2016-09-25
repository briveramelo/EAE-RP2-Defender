module Jelicopter.Client {

    export class HumanManager extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        people: Phaser.Group;
        hospital: Hospital;

        isCarryingPerson: boolean = false;
        personBeingCarried;

        constructor(game: Phaser.Game, level: MainGame, people: Phaser.Group,hospital:Hospital) {
            super(game, 0, 0, 'EnemyBullet');
            this.game = game;
            this.level = level;
            this.people = people;
            this.hospital = hospital;
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
                        if (!this.level.hospital.allPatientSaved) {
                            if (!this.level.roundManager.isTransitioningBetweenRounds) {
                                if (this.isOverlapping(this.level.playerShip, this.level.hospital)) {
                                    this.personBeingCarried.remove();
                                    this.dropPerson();
                                    this.hospital.savePatient();
                                }
                            }
                        }
                    }
                    else {
                        this.dropPerson();
                    }
                }
            }
            if (this.level.people.countLiving() == 0 && !this.level.roundManager.isTransitioningBetweenRounds) {
                this.level.roundManager.startNewRound();
            }
        }

        checkToCollectPeople() {
            var i: number = 0;
            this.people.forEach(function (person: Person) {
                if (person.alive && !person.isPausedForFlinging) {
                    if (person.myCollider.isColliding(this.level.playerShip.myCollider)) {
                        this.personBeingCarried = person;
                        this.isCarryingPerson = true;
                        this.level.playerShip.CollectPerson(person);
                        person.getGrabbed();
                    }
                }
                i++;
            }, this);
        }

        carryPerson() {
            if (this.level.playerShip.scale.x === 1) {
                this.personBeingCarried.body.x = this.level.playerShip.body.x + 30;
                this.personBeingCarried.body.y = this.level.playerShip.body.y + 80;
            }
            else {
                this.personBeingCarried.body.x = this.level.playerShip.body.x - 105;
                this.personBeingCarried.body.y = this.level.playerShip.body.y + 80;
            }
        }

        dropPerson() {
            this.isCarryingPerson = false;
            this.personBeingCarried = null;
            this.level.playerShip.DropPerson();
        }

        isOverlapping(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();
            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }

    }
}