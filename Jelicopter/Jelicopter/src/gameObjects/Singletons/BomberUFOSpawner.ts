module Jelicopter.Client {

    export class BomberUFOSpawner {

        game: Phaser.Game;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
            //this.spawnShips();
        }

        spawnShips() {
            for (var i: number = 0; i < 5; i++) {
                var bomberUFO = this.level.bomberUFOs.getFirstDead(false);//, 300, 300);
                var playerX: number = this.level.playerShip.position.x;
                bomberUFO.reset(this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2), this.game.rnd.between(400, 800));
                bomberUFO.comeAlive();
            }
        }
    }
}