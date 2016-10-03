module Jelicopter.Client {

    export class OverlapManager extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        people: Phaser.Group;

        constructor(game: Phaser.Game, level: MainGame, people: Phaser.Group) {
            super(game, 0, 0, 'invisibleDot');
            this.game = game;
            this.level = level;
            this.people = people;
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
        }

        update() {            
            this.checkPlayerShipOverlaps();
            this.checkHumanOverlaps();
            this.checkPlayerBulletOverlaps();
            this.checkVehicleOverlaps();
            this.checkFallingParatrooperOverlaps();
        }

        checkPlayerShipOverlaps() {
            if (this.level.playerShip.alive) {

                //HELIS
                this.level.helis.forEachAlive(function (heli: Heli) {
                    if (heli.myCollider.isColliding(this.level.playerShip.myCollider)) {

                        this.level.scoreboard.giveFeedbackOfScore(heli.position, Points.Heli);
                        this.level.playerShip.takeDamage();
                        heli.kill();

                    }
                }, this); 

                //ENEMY BULLETS
                this.level.enemyBullets.forEachAlive(function (bullet) {
                    if (this.level.playerShip.alive && this.level.playerShip.myCollider.isColliding(bullet.myCollider)) {

                        this.level.playerShip.takeDamage();
                        bullet.kill();

                    }
                }, this);
            }
        }

        checkHumanOverlaps() {
            this.people.forEach(function (person1: Person) {
                if (person1.alive && !person1.isBeingHeld) {

                    //PERSON-PERSON
                    if (person1.isFlying) {
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

                    //PERSON-HELI
                    if (person1.isFlying) {
                        this.level.helis.forEachAlive(function (heli: Heli) {
                            if (heli.myCollider.isColliding(person1.myCollider)) {

                                this.level.scoreboard.giveFeedbackOfScore(heli.position, Points.HumanToHeli);
                                person1.kill();
                                heli.kill();

                            }
                        }, this);
                    }

                    //PERSON-TANK
                    this.level.vehicles.forEachAlive(function (vehicle: Vehicle) {
                        if (!vehicle.isBeingHeld) {
                            if (this.isOverlapping(vehicle, person1)) {
                                var velDiff: number = new Phaser.Point(vehicle.body.velocity.x - person1.body.velocity.x, vehicle.body.velocity.y - person1.body.velocity.y).getMagnitude();
                                if (velDiff > vehicle.maxTotalSpeedBeforeDeath) {

                                    this.level.scoreboard.giveFeedbackOfScore(vehicle.position, Points.HumanToVehicle);
                                    vehicle.kill();
                                    person1.kill();

                                }
                            }
                        }
                    }, this);

                    //PERSON-PARATROOPER
                    if (person1.isFlying) {
                        this.level.paratroopers.forEachAlive(function (paratrooper: ParaTrooper) {
                            if (this.isOverlapping(paratrooper, person1)) {
                                var velDiff: number = new Phaser.Point(paratrooper.body.velocity.x - person1.body.velocity.x, paratrooper.body.velocity.y - person1.body.velocity.y).getMagnitude();
                                if (velDiff > paratrooper.maxTotalSpeedBeforeDeath) {

                                    this.level.scoreboard.giveFeedbackOfScore(paratrooper.position, Points.HumanToParatrooper);
                                    paratrooper.kill();
                                    person1.kill();

                                }
                            }
                        }, this);
                    }            

                }
            }, this);            
        }

        checkPlayerBulletOverlaps() {
            this.level.playerBullets.forEachAlive(function (bullet) {

                //PARATROOPER
                this.level.paratroopers.forEachAlive(function (paratrooper: ParaTrooper) {
                    if (!paratrooper.isOnParachute) {
                        if (paratrooper.myCollider.isColliding(bullet.myCollider)) {
                            this.level.scoreboard.giveFeedbackOfScore(paratrooper.position, Points.Paratrooper);
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

                //PEOPLE
                this.people.forEach(function (person: Person) {
                    if (person.alive) {
                        if (person.myCollider.isColliding(bullet.myCollider)) {
                            this.level.scoreboard.giveFeedbackOfScore(person.position, Points.Human);
                            person.kill();
                            bullet.kill();
                        }
                    }
                }, this);

                //HELIS
                this.level.helis.forEachAlive(function (heli: Heli) {
                    if (heli.myCollider.isColliding(bullet.myCollider)) {

                        this.level.scoreboard.giveFeedbackOfScore(heli.position, Points.Heli);                        
                        bullet.kill();
                        heli.kill();

                    }
                }, this);

                //TANKS
                this.level.vehicles.forEachAlive(function (vehicle: Vehicle) {
                    if (vehicle.alive && !vehicle.isBeingHeld && vehicle.isFlying) {
                        if (this.isOverlapping(vehicle, bullet)) {

                            this.level.scoreboard.giveFeedbackOfScore(bullet.position, Points.Vehicle);
                            vehicle.kill();
                            bullet.kill();

                        }
                    }
                }, this);

            }, this);
        }        

        checkVehicleOverlaps() {
            this.level.vehicles.forEachAlive(function (vehicle1: Vehicle) {                

                //VEHICLE - HELI
                this.level.helis.forEachAlive(function (heli: Heli) {

                    if (!vehicle1.isBeingHeld && vehicle1.isFlying) {
                        if (heli.myCollider.isColliding(vehicle1.myCollider)) {

                            this.level.scoreboard.giveFeedbackOfScore(heli.position, Points.VehicleToHeli);
                            vehicle1.kill();
                            heli.kill();

                        }
                    }
                }, this);                          

                //VEHICLE - VEHCILE
                if (vehicle1.alive && vehicle1.isFlying && !vehicle1.isBeingHeld) {
                    this.level.vehicles.forEachAlive(function (vehicle2: Vehicle) {
                        if (!vehicle2.isBeingHeld) {
                            if (vehicle1.myCollider.isColliding(vehicle2.myCollider)) {
                                var velDiff: number = new Phaser.Point(vehicle1.body.velocity.x - vehicle2.body.velocity.x, vehicle1.body.velocity.y - vehicle2.body.velocity.y).getMagnitude();
                                if (velDiff > vehicle1.maxTotalSpeedBeforeDeath) {

                                    this.level.scoreboard.giveFeedbackOfScore(vehicle1.position, Points.VehicleToVehicle);
                                    vehicle1.kill();
                                    vehicle2.kill();

                                }
                            }
                        }
                    }, this);
                }

                //VEHICLE - PARATROOPER
                this.level.paratroopers.forEachAlive(function (paratrooper: ParaTrooper) {

                    if ((!vehicle1.isBeingHeld && vehicle1.isFlying)) {
                        if (paratrooper.myCollider.isColliding(vehicle1.myCollider)) {

                            this.level.scoreboard.giveFeedbackOfScore(paratrooper.position, Points.ParatrooperToVehicle);
                            vehicle1.kill();
                            paratrooper.kill();

                        }
                    }
                }, this);

            }, this); 
        }

        checkFallingParatrooperOverlaps() {
            this.level.paratroopers.forEachAlive(function (paratrooper: ParaTrooper) {
                if (!paratrooper.isOnParachute && !paratrooper.isSafeOnGround) {


                    //TANKS
                    this.level.vehicles.forEachAlive(function (vehicle: Vehicle) {    
                        if (paratrooper.myCollider.isColliding(vehicle.myCollider)) {

                            this.level.scoreboard.giveFeedbackOfScore(paratrooper.position, Points.ParatrooperToVehicle);
                            vehicle.kill();
                            paratrooper.kill();

                        }
                    }, this);

                    //PEOPLE
                    this.people.forEach(function (person: Person) {
                        if (person.alive){
                            if (paratrooper.myCollider.isColliding(person.myCollider)) {

                                this.level.scoreboard.giveFeedbackOfScore(paratrooper.position, Points.HumanToParatrooper);
                                person.kill();
                                paratrooper.kill();

                            }
                        }
                    }, this);


                    //HELIS
                    this.level.helis.forEachAlive(function (heli: Heli) {
                        if (paratrooper.myCollider.isColliding(heli.myCollider)) {

                            this.level.scoreboard.giveFeedbackOfScore(paratrooper.position, Points.ParatrooperToHeli);
                            heli.kill();
                            paratrooper.kill();

                        }

                    }, this);



                }
            }, this);
        }

        isOverlapping(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();
            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }
    }
}