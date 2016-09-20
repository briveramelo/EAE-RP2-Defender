var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var CircleCollider = (function () {
            function CircleCollider(mySprite, radius, offset) {
                this.mySprite = mySprite;
                this.myRadius = radius;
                this.offset = offset;
            }
            CircleCollider.prototype.myPosition = function () {
                return new Phaser.Point(this.mySprite.position.x + this.offset.x, this.mySprite.position.y + this.offset.y);
            };
            CircleCollider.prototype.isColliding = function (otherCollider) {
                if (this.myPosition().distance(otherCollider.myPosition()) < (this.myRadius + otherCollider.myRadius)) {
                    return true;
                }
                return false;
            };
            return CircleCollider;
        }());
        Client.CircleCollider = CircleCollider;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var GameEngine = (function (_super) {
            __extends(GameEngine, _super);
            function GameEngine() {
                _super.call(this, 1024, 576, Phaser.AUTO, 'content', null);
                this.state.add('Boot', Client.Boot, false);
                this.state.add('Preloader', Client.Preloader, false);
                this.state.add('MainMenu', Client.MainMenu, false);
                this.state.add('Level01', Client.Level01, false);
                this.state.add('GameOver', Client.GameOver, false);
                this.state.start('Boot');
            }
            return GameEngine;
        }(Phaser.Game));
        Client.GameEngine = GameEngine;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
window.onload = function () {
    new Jelicopter.Client.GameEngine();
};
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var Bullet = (function (_super) {
            __extends(Bullet, _super);
            function Bullet(game) {
                _super.call(this, game);
                this.bulletTime = 0;
                this.enableBody = true;
                this.physicsBodyType = Phaser.Physics.ARCADE;
                this.createMultiple(40, 'Bullet');
                this.forEach(function (bullet) {
                    bullet.myCollider = new Client.CircleCollider(bullet, 4, new Phaser.Point(0, 0));
                }, this);
                this.setAll('anchor.x', 0.5);
                this.setAll('anchor.y', 0.5);
            }
            return Bullet;
        }(Phaser.Group));
        Client.Bullet = Bullet;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var Hospital = (function (_super) {
            __extends(Hospital, _super);
            function Hospital(game, x, y) {
                _super.call(this, game, x, y, 'Hospital');
                game.add.existing(this);
                this.game.physics.arcade.enable([this]);
                this.body.collideWorldBounds = true;
            }
            return Hospital;
        }(Phaser.Sprite));
        Client.Hospital = Hospital;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var People = (function (_super) {
            __extends(People, _super);
            function People(game, ship) {
                _super.call(this, game);
                this.ship = ship;
                this.createPeople();
                this.callAll('animations.add', 'animations', 'wave', [0, 1, 2, 3, 4], 15, true);
                this.callAll('play', null, 'wave');
                this.game.physics.arcade.enable(this);
                this.scale.set(0.62);
                this.callAll('body.collideWorldBounds', '', true);
            }
            People.prototype.createPeople = function () {
                for (var i = 0; i < 10; i++) {
                    var xSpawnPosition = this.game.rnd.between(this.ship.position.x - 5760 / 2, this.ship.position.x + 5760 / 2);
                    this.person = this.game.add.sprite(xSpawnPosition, 550, 'JumpingMale', 1);
                    this.add(this.person);
                    this.person.position.x = xSpawnPosition;
                    this.person.position.y = 550;
                }
            };
            return People;
        }(Phaser.Group));
        Client.People = People;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var Person = (function (_super) {
            __extends(Person, _super);
            function Person(game, ship, x, y) {
                _super.call(this, game, x, y, 'JumpingMale');
                this.game = game;
                this.ship = ship;
                this.myCollider = new Client.CircleCollider(this, 15, new Phaser.Point(0, 0));
                var xSpawnPosition = this.game.rnd.between(this.ship.position.x - 5760 / 2, this.ship.position.x + 5760 / 2);
                this.game.add.sprite(0, 0, 'JumpingMale', 1);
                this.position = new Phaser.Point(xSpawnPosition, 700);
                game.add.existing(this);
                game.physics.enable(this);
                this.body.setCircle(20);
                this.animations.add('wave', [0, 1, 2, 3, 4], 15, true);
                this.play('wave');
                this.scale.set(0.62);
                this.revive();
            }
            Person.prototype.update = function () {
                this.play('wave');
            };
            return Person;
        }(Phaser.Sprite));
        Client.Person = Person;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var Ship = (function (_super) {
            __extends(Ship, _super);
            function Ship(game, level, x, y, bullets) {
                _super.call(this, game, x, y, 'Ship', 1);
                this.lives = 3;
                this.timeToRevive = 3;
                this.shipSpeed = new Phaser.Point(600, 300);
                this.anchor.setTo(0.5);
                this.level = level;
                this.animations.add('fly', [0, 1, 2, 3, 4, 5], 30, true);
                game.add.existing(this);
                game.physics.enable(this, Phaser.Physics.ARCADE);
                this.myCollider = new Client.CircleCollider(this, 30, new Phaser.Point(0, 0));
                this.body.collideWorldBounds = true;
                this.body.setCircle(20);
                this.bullets = bullets;
            }
            Ship.prototype.myPosition = function () {
                return new Phaser.Point(this.position.x, this.position.y);
            };
            Ship.prototype.update = function () {
                if (this.alive) {
                    this.move();
                    this.checkShoot();
                }
            };
            Ship.prototype.checkShoot = function () {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                    this.fireBullet();
                }
            };
            Ship.prototype.fireBullet = function () {
                if (this.game.time.now > this.bullets.bulletTime) {
                    this.bullets.bullet = this.bullets.getFirstExists(false);
                    if (this.bullets.bullet) {
                        if (this.scale.x === 1)
                            this.bullets.bullet.reset(this.body.x + 64, this.body.y + 64);
                        else
                            this.bullets.bullet.reset(this.body.x - 64, this.body.y + 64);
                        this.bullets.bullet.lifespan = 2000;
                        if (this.scale.x === 1)
                            this.game.physics.arcade.velocityFromAngle(0, 1000, this.bullets.bullet.body.velocity);
                        else
                            this.game.physics.arcade.velocityFromAngle(180, 1000, this.bullets.bullet.body.velocity);
                        this.bullets.bulletTime = this.game.time.now + 50;
                    }
                }
            };
            Ship.prototype.kill = function () {
                this.lives--;
                if (this.lives <= 0) {
                    this.game.state.start('Level01', true, false);
                }
                this.game.time.events.add(Phaser.Timer.SECOND * this.timeToRevive, this.revive, this);
                _super.prototype.kill.call(this);
                return this;
            };
            Ship.prototype.revive = function () {
                _super.prototype.revive.call(this);
                return this;
            };
            Ship.prototype.move = function () {
                var isGoingRight = this.scale.x === 1;
                this.body.velocity.x = (isGoingRight ? 1 : -1) * 200;
                this.body.velocity.y = 0;
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                        this.body.velocity.x = -this.shipSpeed.x;
                        if (this.scale.x === 1) {
                            this.scale.x = -1;
                        }
                    }
                    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                        this.body.velocity.x = this.shipSpeed.x;
                        if (this.scale.x === -1) {
                            this.scale.x = 1;
                        }
                    }
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                        this.body.velocity.y = this.shipSpeed.y;
                    }
                    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                        this.body.velocity.y = -this.shipSpeed.y;
                    }
                    this.animations.play('fly');
                }
                else {
                    this.animations.frame = 0;
                }
            };
            return Ship;
        }(Phaser.Sprite));
        Client.Ship = Ship;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var UFO = (function (_super) {
            __extends(UFO, _super);
            function UFO(game, level, x, y) {
                _super.call(this, game, x, y, 'UFO');
                this.shipSpeed = new Phaser.Point(-100, 100);
                this.timeToMoveStraight = 1;
                this.timeToShoot = 1.5;
                this.timeMoving = 0;
                this.shootSpeed = 100;
                this.maxShootDistance = 900;
                this.positionOffset = new Phaser.Point(-64, -64);
                this.timerAllowsShooting = true;
                this.level = level;
                this.anchor.setTo(0.5);
                this.pivot.set(64, 64);
                this.animations.add('ufo_fly', [0, 1, 2], 30, true);
                game.add.existing(this);
                this.myCollider = new Client.CircleCollider(this, 50, this.positionOffset);
                game.physics.enable(this);
                this.body.setCircle(20);
                this.kill();
            }
            UFO.prototype.myPosition = function () {
                return new Phaser.Point(this.position.x - 64, this.position.y - 64);
            };
            UFO.prototype.update = function () {
                if (this.alive) {
                    this.animations.play('ufo_fly');
                    this.checkToShoot();
                }
            };
            UFO.prototype.checkToShoot = function () {
                if (this.level.player.alive && this.alive) {
                    if (this.myPosition().distance(this.level.player.myPosition()) < this.maxShootDistance && this.timerAllowsShooting) {
                        if (this.alive) {
                            if (this.level.player.alive) {
                                this.shoot();
                            }
                        }
                    }
                }
            };
            UFO.prototype.comeAlive = function () {
                this.revive();
                this.position = new Phaser.Point(100, 500);
                this.timerAllowsShooting = true;
                this.move();
            };
            UFO.prototype.kill = function () {
                _super.prototype.kill.call(this);
                return this;
            };
            UFO.prototype.move = function () {
                this.goStraight = !this.goStraight;
                if (this.goStraight) {
                    this.body.velocity.y = 0;
                    this.body.velocity.x = this.shipSpeed.x;
                }
                else {
                }
                if (this.alive) {
                    this.game.time.events.add(Phaser.Timer.SECOND * this.timeToMoveStraight, this.move, this);
                }
            };
            UFO.prototype.shoot = function () {
                var shootDir = new Phaser.Point(this.level.player.myPosition().x - this.myPosition().x, this.level.player.myPosition().y - this.myPosition().y);
                var myBullet = this.level.enemyBullets.getFirstDead(false);
                myBullet.reset(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y);
                var angleOfShot = Math.atan2(shootDir.y, shootDir.x) * 180 / Math.PI;
                this.game.physics.arcade.velocityFromAngle(angleOfShot, 400, myBullet.body.velocity);
                this.resetShooting();
            };
            UFO.prototype.resetShooting = function () {
                this.timerAllowsShooting = false;
                this.game.time.events.add(Phaser.Timer.SECOND * this.timeToShoot, this.setShootingToOk, this);
            };
            UFO.prototype.setShootingToOk = function () {
                this.timerAllowsShooting = true;
            };
            return UFO;
        }(Phaser.Sprite));
        Client.UFO = UFO;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var UFOSpawner = (function () {
            function UFOSpawner(game, level) {
                this.shipsSpawned = 0;
                this.game = game;
                this.level = level;
                this.spawnShips();
            }
            UFOSpawner.prototype.spawnShips = function () {
                var ufo = this.level.ufos.getFirstDead(false);
                ufo.comeAlive();
                var playerX = this.level.player.position.x;
                ufo.reset(this.game.rnd.between(playerX - this.level.screenWidth / 2, playerX + this.level.screenWidth / 2), this.game.rnd.between(400, 800));
                this.shipsSpawned++;
                if (this.shipsSpawned < 5) {
                    this.game.time.events.add(Phaser.Timer.SECOND * 3, this.spawnShips, this);
                }
            };
            return UFOSpawner;
        }());
        Client.UFOSpawner = UFOSpawner;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var Boot = (function (_super) {
            __extends(Boot, _super);
            function Boot() {
                _super.apply(this, arguments);
            }
            Boot.prototype.preload = function () {
            };
            Boot.prototype.create = function () {
                this.stage.setBackgroundColor("0xFFFFFF");
                this.input.maxPointers = 1;
                this.stage.disableVisibilityChange = true;
                if (this.game.device.desktop) {
                    this.scale.pageAlignHorizontally = true;
                }
                else {
                    this.scale.minWidth = 480;
                    this.scale.minHeight = 260;
                    this.scale.maxWidth = 1024;
                    this.scale.maxHeight = 768;
                    this.scale.forceLandscape = true;
                    this.scale.pageAlignHorizontally = true;
                    this.scale.refresh();
                }
                this.game.state.start('Preloader', true, false);
            };
            return Boot;
        }(Phaser.State));
        Client.Boot = Boot;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var GameOver = (function (_super) {
            __extends(GameOver, _super);
            function GameOver() {
                _super.apply(this, arguments);
            }
            GameOver.prototype.create = function () {
                this.background = this.add.sprite(0, 0, 'GameBackground');
                var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
                this.gameOverText = this.game.add.text(400, 400, "GAME OVER", style);
                this.gameOverText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
                this.gameOverText.fixedToCamera = true;
                this.restartText = this.game.add.text(400, 600, "Restart", { font: "bold 32px Arial", fill: "#ff0044", align: "center" });
                this.restartText.inputEnabled = true;
                this.restartText.events.onInputDown.add(this.actionOnClick, this);
                this.restartText.events.onInputOver.add(this.actionOnClick, this);
                this.restartText.events.onInputOut.add(this.actionOnClick, this);
                this.restartText.events.onInputUp.add(this.actionOnClick, this);
            };
            GameOver.prototype.actionOnClick = function () {
                this.game.state.start('Level01', true, false);
            };
            GameOver.prototype.update = function () {
            };
            return GameOver;
        }(Phaser.State));
        Client.GameOver = GameOver;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var Level01 = (function (_super) {
            __extends(Level01, _super);
            function Level01() {
                _super.apply(this, arguments);
                this.screenWidth = 5760;
                this.isSaving = false;
                this.score = 0;
            }
            Level01.prototype.create = function () {
                this.game.world.setBounds(0, 250, 10000000000, 550);
                this.physics.startSystem(Phaser.Physics.ARCADE);
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.createBackgrounds();
                this.createBuildings();
                this.createPlayerShip();
                this.createPeople();
                this.createEnemyBullets();
                this.createUFOs();
                this.game.camera.follow(this.player);
                this.displayScore();
                this.addAllObjectsToList();
            };
            Level01.prototype.addAllObjectsToList = function () {
                this.allObjects = [];
                var i = 0;
                this.enemyBullets.forEach(function (bullet) {
                    this.allObjects[i] = bullet;
                    i++;
                }, this);
                this.ufos.forEach(function (ufo) {
                    this.allObjects[i] = ufo;
                    i++;
                }, this);
                this.people.forEach(function (person) {
                    this.allObjects[i] = person;
                    i++;
                }, this);
                this.bullets.forEach(function (bullet) {
                    this.allObjects[i] = bullet;
                    i++;
                }, this);
                this.allObjects[i] = this.hospital;
                i++;
            };
            Level01.prototype.createBackgrounds = function () {
                this.backgrounds = this.add.group();
                this.backgrounds.createMultiple(3, 'GameBackground');
                var i = 0;
                this.backgrounds.forEach(function (background) {
                    background.position.x = this.game.world.centerX - this.screenWidth + i * this.screenWidth;
                    background.revive();
                    i++;
                }, this);
                this.backgrounds.setAll('anchor.x', 0.5);
            };
            Level01.prototype.createPeople = function () {
                this.people = this.game.add.group();
                for (var i = 0; i < 10; i++) {
                    this.people.add(new Client.Person(this.game, this.player, -1000, -1000));
                }
            };
            Level01.prototype.createBuildings = function () {
                this.hospital = new Client.Hospital(this.game, this.game.world.centerX, 550);
            };
            Level01.prototype.createUFOs = function () {
                this.ufos = this.game.add.group();
                for (var i = 0; i < 30; i++) {
                    this.ufos.add(new Client.UFO(this.game, this, -1000, -1000));
                }
                this.ufoSpawner = new Client.UFOSpawner(this.game, this);
            };
            Level01.prototype.createEnemyBullets = function () {
                this.enemyBullets = this.game.add.group();
                this.enemyBullets.enableBody = true;
                this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
                this.enemyBullets.createMultiple(50, 'EnemyBullet');
                this.enemyBullets.forEach(function (bullet) {
                    bullet.myCollider = new Client.CircleCollider(bullet, 4, new Phaser.Point(0, 0));
                }, this);
                this.enemyBullets.setAll('checkWorldBounds', true);
                this.enemyBullets.setAll('outOfBoundsKill', true);
            };
            Level01.prototype.createPlayerShip = function () {
                this.bullets = new Client.Bullet(this.game);
                this.player = new Client.Ship(this.game, this, this.world.centerX, this.world.centerY, this.bullets);
            };
            Level01.prototype.update = function () {
                if (this.people.length === 0) {
                    this.game.state.start('GameOver', true, false);
                }
                if (this.player.alive) {
                    this.wrapAroundTheWorld(this.player, this.screenWidth);
                    this.doPlayerOverlapPhysics();
                    this.checkToCollectPeople();
                }
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.P)) {
                    this.pause();
                }
            };
            Level01.prototype.pause = function () {
                this.game.paused = !this.game.paused;
            };
            Level01.prototype.wrapAroundTheWorld = function (player, screenWidth) {
                var i = 0;
                this.allObjects.forEach(function (object) {
                    if (object.alive) {
                        var dist = Math.abs(object.position.x - player.position.x);
                        if (Math.abs(object.position.x - player.position.x) > (screenWidth / 2)) {
                            var shiftRightWard = player.body.velocity.x > 0;
                            object.position.x += (shiftRightWard ? 1 : -1) * screenWidth;
                        }
                    }
                    i++;
                });
                this.backgrounds.forEach(function (background) {
                    if (Math.abs(background.position.x - player.position.x) > (screenWidth * 2)) {
                        var shiftRightWard = player.body.velocity.x > 0;
                        background.position.x += (shiftRightWard ? 1 : -1) * screenWidth * 3;
                    }
                }, this);
            };
            Level01.prototype.doPlayerOverlapPhysics = function () {
                this.enemyBullets.forEachAlive(function (bullet) {
                    if (this.player.myCollider.isColliding(bullet.myCollider)) {
                        this.player.kill();
                        bullet.kill();
                    }
                }, this);
                this.ufos.forEachAlive(function (ufo) {
                    if (this.player.myCollider.isColliding(ufo.myCollider)) {
                        this.player.kill();
                        ufo.kill();
                    }
                }, this);
                if (this.player.lives === 0) {
                    this.game.state.start('GameOver', true, false);
                }
            };
            Level01.prototype.checkToCollectPeople = function () {
                for (var i = 0, len = this.people.children.length; i < len; i++) {
                    if (this.checkOverlap(this.player, this.people.children[i])) {
                        this.savePersonIndex = i;
                        this.isSaving = true;
                    }
                }
                if (this.isSaving) {
                    var i = 0;
                    this.people.forEach(function (item) {
                        if (i == this.savePersonIndex) {
                            if (this.player.scale.x === 1) {
                                item.body.x = this.player.body.x + 30;
                                item.body.y = this.player.body.y + 80;
                            }
                            else {
                                item.body.x = this.player.body.x - 105;
                                item.body.y = this.player.body.y + 80;
                            }
                        }
                        i++;
                    }, this);
                }
                if (this.checkOverlap(this.player, this.hospital)) {
                    if (this.isSaving) {
                        this.isSaving = false;
                        this.score += 10;
                        this.scoreText.text = 'Score: ' + this.score;
                        var i = 0;
                        this.people.forEach(function (item) {
                            if (i == this.savePersonIndex) {
                                item.kill();
                                item.destroy();
                                console.debug(this.people.length);
                            }
                            i++;
                        }, this);
                    }
                }
            };
            Level01.prototype.checkOverlap = function (spriteA, spriteB) {
                var boundsA = spriteA.getBounds();
                var boundsB = spriteB.getBounds();
                return Phaser.Rectangle.intersects(boundsA, boundsB);
            };
            Level01.prototype.displayScore = function () {
                var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
                this.scoreText = this.game.add.text(0, 0, "Score: 0", style);
                this.scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
                this.scoreText.fixedToCamera = true;
            };
            return Level01;
        }(Phaser.State));
        Client.Level01 = Level01;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var MainMenu = (function (_super) {
            __extends(MainMenu, _super);
            function MainMenu() {
                _super.apply(this, arguments);
            }
            MainMenu.prototype.create = function () {
                this.background = this.add.sprite(0, 0, 'titlepage');
                this.background.alpha = 0;
                this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
                this.logo.anchor.setTo(0.5);
                this.add.tween(this.background).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.logo).to({ y: 220 }, 2000, Phaser.Easing.Elastic.Out, true, 500);
                this.game.debug.text("Click the logo to start the game", 0, this.world.height, "red");
                this.input.onDown.addOnce(this.fadeOut, this);
            };
            MainMenu.prototype.fadeOut = function () {
                this.add.audio('click', 1, false).play();
                this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
                var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.startGame, this);
            };
            MainMenu.prototype.startGame = function () {
                this.game.state.start('Level01', true, false);
            };
            return MainMenu;
        }(Phaser.State));
        Client.MainMenu = MainMenu;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var Preloader = (function (_super) {
            __extends(Preloader, _super);
            function Preloader() {
                _super.apply(this, arguments);
            }
            Preloader.prototype.preload = function () {
                this.game.antialias = false;
                this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading...", { font: "18px Arial", fill: "#A9A91111", align: "center" });
                this.loaderText.anchor.setTo(0.5);
                this.load.image('titlepage', './assets/ui/titlePage.png');
                this.load.image('logo', './assets/ui/Jelicopter.png');
                this.load.audio('click', './assets/sounds/click.ogg', true);
                this.load.image('GameBackground', './assets/sprites/Background/GameBackground-pixel.jpg');
                this.load.image('EnemyBullet', './assets/sprites/UFO/EnemyBullet.png');
                this.load.image('Bullet', './assets/sprites/Ship/bullet02.png');
                this.load.image('Hospital', './assets/sprites/Buildings/building.png');
                this.load.atlasJSONHash('JumpingMale', './assets/sprites/People/Jumping_male.png', './assets/sprites/People/Jumping_male.json');
                this.load.atlasJSONHash('Ship', './assets/sprites/Ship/Ship_1.png', './assets/sprites/Ship/Ship_1.json');
                this.load.atlasJSONHash('UFO', './assets/sprites/UFO/UFO_1.png', './assets/sprites/UFO/UFO_1.json');
            };
            Preloader.prototype.create = function () {
                this.startLevel();
            };
            Preloader.prototype.startMainMenu = function () {
                this.game.state.start('MainMenu', true, false);
            };
            Preloader.prototype.startLevel = function () {
                this.game.state.start('Level01', true, false);
            };
            return Preloader;
        }(Phaser.State));
        Client.Preloader = Preloader;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
//# sourceMappingURL=game.js.map