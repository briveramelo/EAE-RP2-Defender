module Jelicopter.Client {

    export class UFOSpawner{

        game: Phaser.Game;
        level: Level01;
        ufo: UFO;

        constructor(game: Phaser.Game, level: Level01) {
            this.game = game;
            this.level = level;
            this.spawnShips();
        }

        spawnShips() {
            this.ufo = this.level.ufos.getFirstDead(false);//, 300, 300);
            this.ufo.comeAlive();
            //this.ufo.
        }
    }
}