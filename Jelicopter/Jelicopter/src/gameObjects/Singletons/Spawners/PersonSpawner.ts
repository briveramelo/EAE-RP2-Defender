module Jelicopter.Client {

    export class PersonSpawner {

        game: Phaser.Game;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
        }

        spawn(peopleToSpawn: number) {
            var peopleGotten = [];
            for (var i: number = 0; i < (peopleToSpawn); i++) {
                var randomNumber = this.game.rnd.integerInRange(0, 60);
                var person: Person = this.level.allPeople.getRandom(randomNumber, randomNumber);
                var playerX: number = this.level.playerShip.position.x;
                var spawnX:number = this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2);
                var spawnY: number = person.floorNumber;
                person.spawn(new Phaser.Point(spawnX, spawnY));                
            }
        }


    }
}