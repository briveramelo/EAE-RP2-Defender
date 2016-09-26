module Jelicopter.Client {

    export class ParaTrooperSpawner {

        game: Phaser.Game;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
        }

        spawnTroopers(troopersToSpawn: number) {
            for (var i: number = 0; i < troopersToSpawn; i++) {
                //var person: Person = this.level.people.getFirstDead(false);
                //var playerX: number = this.level.playerShip.position.x;
                //ufo.reset(this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2), this.game.rnd.between(160, 665));
                //ufo.comeAlive();
            }
        }
    }
}