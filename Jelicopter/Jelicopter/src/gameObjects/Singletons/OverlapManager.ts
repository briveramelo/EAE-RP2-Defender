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
            this.checkParaTrooperOverlaps();
        }

        checkParaTrooperOverlaps() {
            this.level.paratroopers.forEachAlive(function (paratrooper: ParaTrooper) {
                if (!paratrooper.isOnParachute) { 
                this.people.forEach(function (person2: Person) {
                    if (person2.alive && !paratrooper.isBeingHeld) {
                            if (this.isOverlapping(paratrooper, person2)) {
                                var velDiff: number = new Phaser.Point(paratrooper.body.velocity.x - person2.body.velocity.x, paratrooper.body.velocity.y - person2.body.velocity.y).getMagnitude();
                                if (velDiff > paratrooper.maxTotalSpeedBeforeDeath) {
                                    paratrooper.kill();
                                    person2.kill();
                                    this.level.scoreboard.giveFeedbackOfScore(paratrooper.position, Points.HumanToHuman);
                                }
                            }
                        }
                    }, this);
                this.level.helis.forEachAlive(function (heli: Heli) {
                    if (heli.myCollider.isColliding(paratrooper.myCollider) && !paratrooper.isBeingHeld) {
                            paratrooper.kill();
                            heli.kill();
                            this.level.soundManager.playSound(SoundFX.HeliExplode);
                            this.level.scoreboard.giveFeedbackOfScore(heli.position, Points.HumanToHeli);
                            this.level.heliExplosionManager.particleBurst(heli.position, "blueShip");
                        }
                    }, this); 
                }
            }, this);       
        }

        checkHumanHumanOverlaps() {
            this.people.forEach(function (person1: Person) {
                if (person1.alive && person1.isFlying && !person1.isBeingHeld) {
                    this.people.forEach(function (person2: Person) {
                        if (person2.alive) {
                            if (person1.myCollider.isColliding(person2.myCollider)) {
                                var velDiff: number = new Phaser.Point(person1.body.velocity.x - person2.body.velocity.x, person1.body.velocity.y - person2.body.velocity.y).getMagnitude();
                                if (velDiff > person1.maxTotalSpeedBeforeDeath) {
                                    this.level.scoreboard.giveFeedbackOfScore(person1.position, Points.HumanToHuman);
                                    person1.kill();
                                    person2.kill();                                    
                                }
                            }
                        }
                    }, this);


                    this.level.helis.forEachAlive(function (heli: Heli) {
                        if (heli.myCollider.isColliding(person1.myCollider)) {
                            this.level.scoreboard.giveFeedbackOfScore(heli.position, Points.HumanToHeli);                            
                            person1.kill();
                            heli.kill();                            
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


                this.level.paratroopers.forEachAlive(function (paratrooper: ParaTrooper) {
                    if (this.isOverlapping(paratrooper.parachute, bullet)) {
                        paratrooper.removeChild(paratrooper.parachute);
                        bullet.kill();
                    }

                    if (paratrooper.children.indexOf(paratrooper.parachute) > -1) {
                        if (this.isOverlapping(paratrooper.person, bullet)) {
                            bullet.kill();
                            paratrooper.kill();
                            paratrooper.animateAndSound();
                        }
                    }

                    if (paratrooper.isSafeOnGround) {
                        if (this.isOverlapping(paratrooper.person, bullet)) {
                            bullet.kill();
                            paratrooper.kill();
                            paratrooper.animateAndSound();
                        }
                    }
                }, this);

                this.people.forEach(function (person: Person) {
                    if (person.alive) {
                        if (person.myCollider.isColliding(bullet.myCollider)) {
                            this.level.scoreboard.giveFeedbackOfScore(person.position, Points.Human);
                            person.kill();
                            bullet.kill();
                        }
                    }
                }, this);

                this.level.helis.forEachAlive(function (heli: Heli) {
                    if (heli.myCollider.isColliding(bullet.myCollider)) {
                        this.level.scoreboard.giveFeedbackOfScore(heli.position, Points.Heli);                        
                        bullet.kill();
                        heli.kill();                        
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