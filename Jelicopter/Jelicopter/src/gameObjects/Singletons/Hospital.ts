module Jelicopter.Client {

    export class Hospital extends Phaser.Sprite {

        myCollider: CircleCollider;
        level: MainGame;
        health: number;
        startHealth: number;

        constructor(game: Phaser.Game, level: MainGame) {
            super(game, 0, 0, 'Hospital', 0);
            this.level = level;
            this.game.add.sprite(0, 0, 'Hospital', 0);
            this.position = new Phaser.Point(this.game.world.centerX+50, 460);
            game.add.existing(this);
            game.physics.enable(this);
            this.loadAnimations();
            this.myCollider = new CircleCollider(this, 30, new Phaser.Point(0, this.height));
            this.anchor.set(0.5);
            this.startHealth = 9;
            this.health = this.startHealth;
        }

        loadAnimations() {
            this.animations.add('shake1', [42, 43, 44, 45], 10, false);
            this.animations.add('shake2', [38, 39, 40, 41], 10, false);
            this.animations.add('shake3', [34, 35, 36, 37], 10, false);
            this.animations.add('shake4', [30, 31, 32, 33], 10, false);
            this.animations.add('shake5', [26, 27, 28, 29], 10, false);
            this.animations.add('shake6', [22, 23, 24, 25], 10, false);
            this.animations.add('shake7', [18, 19, 20, 21], 10, false);
            this.animations.add('shake8', [14, 15, 16, 17], 10, false);
            this.animations.add('shake9', [10, 11, 12, 13], 10, false);
        }              

        takeDamage() {
            var animationName: string = 'shake' + (this.startHealth - this.health + 1);
            this.animations.play(animationName);
            this.health--;

            if (this.health <= 0) {
                //transition a bit more
                this.game.time.events.add(Phaser.Timer.SECOND * 3, this.endGame, this);
            }
        }

        endGame() {
            this.game.state.start('GameOver', true, false);
        }

        resetHospital() {
            this.health = this.startHealth;
            this.frame = 0;
        }
        
    }
}