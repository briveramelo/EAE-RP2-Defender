module Jelicopter.Client {

    export class OverlapManager extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        people: Phaser.Group;

        constructor(game: Phaser.Game, level: MainGame, people: Phaser.Group) {
            super(game, 0, 0, 'EnemyBullet');
            this.game = game;
            this.level = level;
            this.people = people;
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
        }

        update() {            
            this.checkHumanHumanOverlaps();
            this.checkPlayerBulletOverlaps();
        }

        checkHumanHumanOverlaps() {
            this.people.forEach(function (person1: Person) {
                if (person1.alive && person1.isFlying) {
                    this.people.forEach(function (person2: Person) {
                        if (person2.alive) {
                            if (person1.myCollider.isColliding(person2.myCollider)) {
                                var velDiff: number = new Phaser.Point(person1.body.velocity.x - person2.body.velocity.x, person1.body.velocity.y - person2.body.velocity.y).getMagnitude();
                                if (velDiff > person1.maxTotalSpeedBeforeDeath) {
                                    person1.kill(Points.HumanToHuman);
                                    person2.kill();                                    
                                }
                            }
                        }
                    }, this);
                }
            }, this);
        }

        checkEnemyMissileOverlaps() {
            this.level.enemyMissiles.forEachAlive(function (missile) {                
                if (this.isOverlapping(missile, this.level.hospital)) {
                    this.level.hospital.takeDamage();
                    missile.kill();
                }                
            }, this);      
        }

        checkPlayerBulletOverlaps() {
            this.level.playerBullets.forEachAlive(function (bullet) {
                this.people.forEach(function (person: Person) {
                    if (person.alive) {
                        if (person.myCollider.isColliding(bullet.myCollider)) {
                            bullet.kill();
                            person.kill(Points.Human);
                        }
                    }
                }, this);

                this.level.ufos.forEachAlive(function (ufo: UFO) {
                    if (ufo.myCollider.isColliding(bullet.myCollider)) {
                        this.level.scoreboard.updateScore(30);
                        bullet.kill();
                        ufo.kill();
                        this.level.explosionManager.particleBurst(ufo.position);
                    }
                }, this);

                this.level.bomberUFOs.forEachAlive(function (bomberUFO: UFO) {
                    if (bomberUFO.myCollider.isColliding(bullet.myCollider)) {
                        this.level.scoreboard.updateScore(50);
                        bullet.kill();
                        bomberUFO.kill();
                    }
                }, this);

            }, this);
        }
      
        isOverlapping(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();
            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }
    }
}