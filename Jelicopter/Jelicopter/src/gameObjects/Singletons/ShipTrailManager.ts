module Jelicopter.Client {

    export class ShipTrailManager extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;

        emitter_smokeTrail: Phaser.Particles.Arcade.Emitter;
        emitter_fireTrail: Phaser.Particles.Arcade.Emitter;
        lastXPosition :number= 0;
        lastYPosition :number= 0;
        velocityMultiplier: number = 1;

        constructor(game: Phaser.Game, level: MainGame) {
            super(game, 0, 0, 'EnemyBullet');
            this.game = game;
            this.level = level;
            game.add.existing(this);

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.emitter_smokeTrail = game.add.emitter(game.world.centerX, game.world.centerY, 400);
            this.emitter_smokeTrail.makeParticles('ship_smoke', [0,1,2], 300, false, false);
            this.emitter_smokeTrail.gravity = 0;
            this.emitter_smokeTrail.setAlpha(1, 0, 1500);
            this.emitter_smokeTrail.setScale(0.6, .1, 0.6, .1, 1500);
            this.emitter_smokeTrail.start(false, 1500, 6);

            this.emitter_fireTrail = game.add.emitter(game.world.centerX, game.world.centerY, 400);
            this.emitter_fireTrail.makeParticles('fire_sprite', [0, 1, 2], 300, false, false);
            this.emitter_fireTrail.gravity = 0;
            this.emitter_fireTrail.setAlpha(1, 0, 1500);
            this.emitter_fireTrail.setScale(0.6, .1, 0.6, .1, 1500);
            this.emitter_fireTrail.start(false, 1500,3);


            game.physics.arcade.gravity.y = 0;
            game.physics.arcade.checkCollision.left = false;
            game.physics.arcade.checkCollision.right = false;
        }

        update() {
            if (this.level.playerShip.alive) {
                var trailVelocity: Phaser.Point = new Phaser.Point(-this.level.playerShip.body.velocity.x * this.velocityMultiplier, -this.level.playerShip.body.velocity.y * this.velocityMultiplier);

                this.emitter_smokeTrail.minParticleSpeed.set(trailVelocity.x, trailVelocity.y);
                this.emitter_smokeTrail.maxParticleSpeed.set(trailVelocity.x, trailVelocity.y);
                this.emitter_fireTrail.minParticleSpeed.set(trailVelocity.x, trailVelocity.y);
                this.emitter_fireTrail.maxParticleSpeed.set(trailVelocity.x, trailVelocity.y);


                this.emitter_fireTrail.emitX = this.level.playerShip.position.x + (this.level.playerShip.isGoingRight ? -1 : 1) * this.level.playerShip.tailOffset;
                this.emitter_fireTrail.emitY = this.level.playerShip.position.y+5;
                this.emitter_smokeTrail.emitX = this.level.playerShip.position.x + (this.level.playerShip.isGoingRight ? -1 : 1) * (this.level.playerShip.tailOffset+6);
                this.emitter_smokeTrail.emitY = this.level.playerShip.position.y;
            }
        }
    }
}