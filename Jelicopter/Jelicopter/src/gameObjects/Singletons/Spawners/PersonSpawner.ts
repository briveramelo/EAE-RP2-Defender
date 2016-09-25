module Jelicopter.Client {

    export class PersonSpawner {

        game: Phaser.Game;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
        }

        spawn(peopleToSpawn: number) {
            console.log(peopleToSpawn);
            for (var i: number = 0; i < peopleToSpawn; i++) {
                var person: Person = this.level.people.getFirstDead(false);
                var playerX: number = this.level.playerShip.position.x;
                var spawnX = this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2);
                person.spawn(new Phaser.Point(spawnX, null));                
            }
        }
    }
}