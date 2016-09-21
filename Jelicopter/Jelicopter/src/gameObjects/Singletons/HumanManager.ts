module Jelicopter.Client {

    export class HumanManager extends Phaser.Sprite {

        game: Phaser.Game;
        level: Level01;
        people: Phaser.Group;

        isSaving: boolean = false;
        savePersonIndex: number;

        constructor(game: Phaser.Game, level: Level01, people: Phaser.Group) {
            super(game, 0, 0, 'EnemyBullet');
            this.game = game;
            this.level = level;
            this.people = people;
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
        }

        update() {
            this.checkToCollectPeople();
        }

        checkToCollectPeople() {
            for (var i = 0, len = this.people.children.length; i < len; i++) {
                if (this.isOverlapping(this.level.playerShip, this.people.children[i])) {
                    this.savePersonIndex = i;
                    this.isSaving = true;
                }
            }

            if (this.isSaving) {
                var i = 0;
                this.people.forEach(function (person) {
                    if (i == this.savePersonIndex) {
                        if (this.level.playerShip.scale.x === 1) {
                            person.body.x = this.level.playerShip.body.x + 30;
                            person.body.y = this.level.playerShip.body.y + 80;
                        }
                        else {
                            person.body.x = this.level.playerShip.body.x - 105;
                            person.body.y = this.level.playerShip.body.y + 80;
                        }
                    }
                    i++;
                }, this);
            }
            if (this.isOverlapping(this.level.playerShip, this.level.hospital)) {
                if (this.isSaving) {
                    this.isSaving = false;
                    this.level.scoreboard.updateScore(10);
                    var i = 0;
                    this.people.forEach(function (person) {
                        if (i == this.savePersonIndex) {
                            person.kill();
                            person.destroy();
                        }
                        i++;
                    }, this);
                }
            }
        }

        isOverlapping(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();
            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }


    }
}