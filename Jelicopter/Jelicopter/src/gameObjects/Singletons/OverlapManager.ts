﻿module Jelicopter.Client {

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
            this.checkHumanToHeliOverlaps();
            this.checkPlayerBulletOverlaps();
            this.checkEnemyBulletOverlaps();
            this.checkParaTrooperOverlaps();
            this.checkVehicleOverlaps();
        }


        checkVehicleOverlaps() {
            this.level.vehicles.forEachAlive(function (vehicle: Vehicle) {
                this.people.forEach(function (person2: Person) {

                    if (person2.alive && !vehicle.isBeingHeld && !person2.isBeingHeld && person2.isFlying) {
                        if (this.isOverlapping(vehicle, person2)) {
                            var velDiff: number = new Phaser.Point(vehicle.body.velocity.x - person2.body.velocity.x, vehicle.body.velocity.y - person2.body.velocity.y).getMagnitude();
                            if (velDiff > vehicle.maxTotalSpeedBeforeDeath) {

                                this.level.scoreboard.giveFeedbackOfScore(vehicle.position, Points.HumanToVehicle);
                                vehicle.kill();
                                person2.kill();

                            }
                        }
                    }
                }, this);


                this.level.helis.forEachAlive(function (heli: Heli) {

                    if (vehicle.alive && !vehicle.isBeingHeld && vehicle.isFlying) {
                        if (heli.myCollider.isColliding(vehicle.myCollider)) {

                            this.level.scoreboard.giveFeedbackOfScore(heli.position, Points.VehicleToHeli);
                                vehicle.kill();
                                heli.kill();

                            }
                        }
                    }, this);
                 

          
                
                    if (vehicle.alive && vehicle.isFlying && !vehicle.isBeingHeld) {
                        this.level.vehicles.forEachAlive(function (vehicle2: Vehicle) {
                            if (vehicle2.alive && !vehicle2.isBeingHeld) {
                                if (vehicle.myCollider.isColliding(vehicle2.myCollider)) {
                                    var velDiff: number = new Phaser.Point(vehicle.body.velocity.x - vehicle2.body.velocity.x, vehicle.body.velocity.y - vehicle2.body.velocity.y).getMagnitude();
                                    if (velDiff > vehicle.maxTotalSpeedBeforeDeath) {

                                        this.level.scoreboard.giveFeedbackOfScore(vehicle.position, Points.VehicleToVehicle);
                                        vehicle.kill();
                                        vehicle2.kill();

                                    }
                                }
                            }
                        }, this);

                    }
               

            }, this); 
        }

        checkParaTrooperOverlaps() {
            this.level.paratroopers.forEachAlive(function (paratrooper: ParaTrooper) {
                this.people.forEach(function (person2: Person) {

                    if (person2.alive && !paratrooper.isBeingHeld && !person2.isBeingHeld && person2.isFlying) {
                        if (this.isOverlapping(paratrooper, person2)) {
                            var velDiff: number = new Phaser.Point(paratrooper.body.velocity.x - person2.body.velocity.x, paratrooper.body.velocity.y - person2.body.velocity.y).getMagnitude();
                            if (velDiff > paratrooper.maxTotalSpeedBeforeDeath) {

                                this.level.scoreboard.giveFeedbackOfScore(paratrooper.position, Points.HumanToParatrooper);
                                paratrooper.kill();
                                person2.kill();

                            }
                        }
                    }
                }, this);


                this.level.vehicles.forEachAlive(function (vehicle: Vehicle) {
                    if (vehicle.alive && !vehicle.isBeingHeld && vehicle.isFlying) {
                        if (this.isOverlapping(vehicle, paratrooper)) {
                            this.level.scoreboard.giveFeedbackOfScore(this.position, Points.VehicleToVehicle);
                            vehicle.kill();
                            paratrooper.kill();
                        }
                    }
                }, this);

                if (paratrooper.myCollider.isColliding(this.level.playerShip.myCollider)) {
                    //this.level.playerShip.takeDamage();
                    this.level.scoreboard.giveFeedbackOfScore(paratrooper.position, Points.Paratrooper);
                    paratrooper.kill();
                }

                if (!paratrooper.isOnParachute) { 

                    this.level.helis.forEachAlive(function (heli: Heli) {
                        if (heli.myCollider.isColliding(paratrooper.myCollider) && !paratrooper.isBeingHeld) {

                            this.level.scoreboard.giveFeedbackOfScore(heli.position, Points.ParatrooperToHeli);                            
                            paratrooper.kill();
                            heli.kill();
                                              
                        }
                    }, this); 
                }

            }, this);       
        }

        checkHumanHumanOverlaps() {
            this.people.forEach(function (person1: Person) {
                if (person1.alive && person1.isFlying && !person1.isBeingHeld) {
                    this.people.forEach(function (person2: Person) {
                        if (person2.alive && !person2.isBeingHeld) {
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

                }
            }, this);            
        }

        checkHumanToHeliOverlaps() {
            this.level.helis.forEachAlive(function (heli: Heli) {
                if (this.level.playerShip.alive) {
                    if (heli.myCollider.isColliding(this.level.playerShip.myCollider)) {
                        this.level.playerShip.takeDamage();
                        this.level.scoreboard.giveFeedbackOfScore(heli.position, Points.Heli);
                        heli.kill();
                    }
                }


                this.people.forEach(function (person: Person) {
                    if (person.alive && !person.isBeingHeld && person.isFlying) {
                        if (heli.myCollider.isColliding(person.myCollider)) {

                            this.level.scoreboard.giveFeedbackOfScore(heli.position, Points.HumanToHeli);
                            person.kill();
                            heli.kill();

                        }
                    }
                }, this);  
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
                    if (!paratrooper.isOnParachute) {
                        if (paratrooper.myCollider.isColliding(bullet.myCollider)) {
                            this.level.scoreboard.giveFeedbackOfScore(this.position, Points.Paratrooper);
                            paratrooper.kill();
                            bullet.kill();
                        }
                    }
                    if (this.isOverlapping(paratrooper.parachute, bullet)) {

                        paratrooper.removeChild(paratrooper.parachute);
                        bullet.kill();

                    }

                    if (paratrooper.children.indexOf(paratrooper.parachute) > -1 || paratrooper.isSafeOnGround) {
                        if (this.isOverlapping(paratrooper.person, bullet)) {

                            this.level.scoreboard.giveFeedbackOfScore(paratrooper.position, Points.Paratrooper);
                            bullet.kill();
                            paratrooper.kill();
                            
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