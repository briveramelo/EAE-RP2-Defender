module Jelicopter.Client {

    export class HumanManager extends Phaser.Sprite {

        game: Phaser.Game;
        level: Level01;
        people: Phaser.Group;
        hospital: Hospital;

        isSaving: boolean = false;
        savePersonIndex: number;
        personBeingCarried;
        patientSaved: number=0;

        constructor(game: Phaser.Game, level: Level01, people: Phaser.Group,hospital:Hospital) {
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
                if (!this.isSaving) {
                    this.checkToCollectPeople();
                }
                else {
                    if (this.personBeingCarried.alive) {
                        this.carryPerson();
                        if (this.isOverlapping(this.level.playerShip, this.level.hospital)) {
                            this.dropPerson();
                            this.getPointsForPerson();
                            this.changeHospitalState();
                        }
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
                if (person.myCollider.isColliding(this.level.playerShip.myCollider)) {
                    this.personBeingCarried = person;
                    this.savePersonIndex = i;
                    this.isSaving = true;
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
            this.isSaving = false;
        }

        getPointsForPerson() {
            this.level.scoreboard.updateScore(10);
            this.personBeingCarried.kill();
        }

        changeHospitalState() {
            this.patientSaved++;
            this.hospital.frame = this.patientSaved;
        }

        isOverlapping(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();
            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }


    }
}