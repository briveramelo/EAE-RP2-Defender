module Jelicopter.Client {

    export class UFOSpawner{

        game: Phaser.Game;
        level: Level01;
        shipsSpawned: number =0;

        constructor(game: Phaser.Game, level: Level01) {
            this.game = game;
            this.level = level;
            this.spawnShips();
        }

        spawnShips() {
            var ufo = this.level.ufos.getFirstDead(false);//, 300, 300);
            ufo.comeAlive();
            ufo.reset(this.game.rnd.between(1, this.game.width), this.game.rnd.between(500, 501));
            console.log(ufo.position);
            this.shipsSpawned++;
            if (this.shipsSpawned < 5) {
                this.game.time.events.add(Phaser.Timer.SECOND * 3, this.spawnShips, this);
            }
        }
    }
}