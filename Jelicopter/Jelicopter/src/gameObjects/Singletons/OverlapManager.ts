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
            this.checkEnemyBulletOverlaps();
        }

        checkHumanHumanOverlaps() {
            this.people.forEach(function (person1: Person) {
                if (person1.alive && person1.isFlying && !person1.isBeingHeld) {
                    this.people.forEach(function (person2: Person) {
                        if (person2.alive) {
                            if (person1.myCollider.isColliding(person2.myCollider)) {
                                var velDiff: number = new Phaser.Point(person1.body.velocity.x - person2.body.velocity.x, person1.body.velocity.y - person2.body.velocity.y).getMagnitude();
                                if (velDiff > person1.maxTotalSpeedBeforeDeath) {
                                    person1.kill();
                                    person2.kill();                                    
                                    this.level.scoreboard.giveFeedbackOfScore(person1.position, Points.HumanToHuman);
                                }
                            }
                        }
                    }, this);


                    this.level.dropShips.forEachAlive(function (dropShip: DropShip) {
                        if (dropShip.myCollider.isColliding(person1.myCollider)) {
                            person1.kill();
                            dropShip.kill();
                            this.level.soundManager.playSound(SoundFX.DropShipExplode);
                            this.level.scoreboard.giveFeedbackOfScore(dropShip.position, Points.HumanToPPlane);
                            this.level.dropShipExplosionManager.particleBurst(dropShip.position, "blueShip");
                        }
                    }, this);

                }
            }, this);
        }

        checkEnemyBulletOverlaps() {
            this.level.enemyBullets.forEachAlive(function (bullet) {
                if (this.level.playerShip.alive && this.level.playerShip.myCollider.isColliding(bullet.myCollider)) {
                    this.level.playerShip.takeDamage();
                    bullet.kill();
                }                
            }, this);
        }

        checkPlayerBulletOverlaps() {
            this.level.playerBullets.forEachAlive(function (bullet) {
                this.people.forEach(function (person: Person) {
                    if (person.alive) {
                        if (person.myCollider.isColliding(bullet.myCollider)) {
                            person.kill();
                            bullet.kill();
                            this.level.scoreboard.giveFeedbackOfScore(person.position, Points.Human);
                        }
                    }
                }, this);

                this.level.dropShips.forEachAlive(function (dropShip: DropShip) {
                    if (dropShip.myCollider.isColliding(bullet.myCollider)) {
                        bullet.kill();
                        dropShip.kill();
                        this.level.soundManager.playSound(SoundFX.DropShipExplode);
                        this.level.scoreboard.giveFeedbackOfScore(dropShip.position, Points.PPlane);
                        this.level.dropShipExplosionManager.particleBurst(dropShip.position, "blueShip");
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