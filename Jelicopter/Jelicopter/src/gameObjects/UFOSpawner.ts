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
<<<<<<< HEAD
            var playerX :number = this.level.player.position.x;
            ufo.reset(this.game.rnd.between(playerX - this.level.screenWidth / 2, playerX +this.level.screenWidth / 2), this.game.rnd.between(200, 800));
=======
            ufo.reset(this.game.rnd.between(1, this.game.width), this.game.rnd.between(500, 501));
>>>>>>> a184aa52405de3e626019924c1f0583494593d8d
            this.shipsSpawned++;
            if (this.shipsSpawned < 5) {
                this.game.time.events.add(Phaser.Timer.SECOND * 3, this.spawnShips, this);
            }
        }
    }
}