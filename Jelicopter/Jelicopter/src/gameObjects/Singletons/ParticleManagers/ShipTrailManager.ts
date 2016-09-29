module Jelicopter.Client {

    export class ShipTrailManager extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;

        emitter_trail: Phaser.Particles.Arcade.Emitter;
        lastXPosition :number= 0;
        lastYPosition :number= 0;
        velocityMultiplier: number = 1;

        constructor(game: Phaser.Game, level: MainGame) {
            super(game, 0, 0, 'EnemyBullet');
            this.game = game;
            this.level = level;
            game.add.existing(this);

            this.emitter_trail = game.add.emitter(game.world.centerX, game.world.centerY, 200);
            this.emitter_trail.makeParticles('player-ship-trail', [0, 1], 100, false, false);
            this.emitter_trail.gravity = 0;
            this.emitter_trail.setAlpha(1, 0, 1500);
            this.emitter_trail.setScale(1.8, .1, 1.8, .1, 1500);
            this.emitter_trail.start(false, 1500, 9);
        }

        update() {
            if (this.level.playerShip.alive) {
                var trailVelocity: Phaser.Point = new Phaser.Point(-this.level.playerShip.body.velocity.x * this.velocityMultiplier, -this.level.playerShip.body.velocity.y * this.velocityMultiplier);

                this.emitter_trail.minParticleSpeed.set(trailVelocity.x, trailVelocity.y);
                this.emitter_trail.maxParticleSpeed.set(trailVelocity.x, trailVelocity.y);

                this.emitter_trail.emitX = this.level.playerShip.position.x + (this.level.playerShip.isGoingRight ? -1 : 1) * this.level.playerShip.tailOffset();
                this.emitter_trail.emitY = this.level.playerShip.position.y + 5;
            }
            else {
                if (this.alive) {
                    this.emitter_trail.kill();
                    this.kill();
                }
            }
        }
    }


}