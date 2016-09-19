var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var GameEngine = (function (_super) {
            __extends(GameEngine, _super);
            function GameEngine() {
                _super.call(this, 1500, 600, Phaser.AUTO, 'content', null);
                this.state.add('Boot', Client.Boot, false);
                this.state.add('Preloader', Client.Preloader, false);
                this.state.add('MainMenu', Client.MainMenu, false);
                this.state.add('Level01', Client.Level01, false);
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
        var EnemyBullet = (function (_super) {
            __extends(EnemyBullet, _super);
            function EnemyBullet(game, level, x, y) {
                _super.call(this, game, x, y, 'EnemyBullet');
                this.level = level;
                this.anchor.setTo(0.5);
                this.pivot.set(2, 2);
                game.add.existing(this);
                game.physics.enable(this);
                this.body.setCircle(2);
                this.kill();
            }
            EnemyBullet.prototype.launch = function (bulletVelocity, startPoint) {
                this.revive();
                this.lifespan = 2000;
                this.position = startPoint;
                var angleOfShot = Math.atan2(bulletVelocity.y, bulletVelocity.x) * 180 / Math.PI;
                this.game.physics.arcade.velocityFromAngle(angleOfShot, 400, this.body.velocity);
                console.log(this.body);
            };
            EnemyBullet.prototype.update = function () {
                if (this.alive) {
                }
            };
            return EnemyBullet;
        }(Phaser.Sprite));
        Client.EnemyBullet = EnemyBullet;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
var Jelicopter;
(function (Jelicopter) {
    var Client;
    (function (Client) {
        var Ship = (function (_super) {
            __extends(Ship, _super);
            function Ship(game, x, y) {
                _super.call(this, game, x, y, 'Ship', 1);
                this.shipSpeed = new Phaser.Point(300, 300);
                this.anchor.setTo(0.5);
                this.pivot.set(64, 64);
                this.animations.add('fly', [0, 1, 2, 3, 4, 5], 30, true);
                game.add.existing(this);
                game.physics.enable(this);
                this.body.collideWorldBounds = true;
                this.body.setCircle(20);
            }
            Ship.prototype.update = function () {
                this.move();
            };
            Ship.prototype.move = function () {
                this.body.velocity.x = 0;
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
                this.shipSpeed = new Phaser.Point(100, 100);
                this.timeToMoveStraight = 1;
                this.timeToShoot = 1.5;
                this.timeMoving = 0;
                this.shootSpeed = 100;
                this.positionOffset = new Phaser.Point(-64, -64);
                this.level = level;
                this.anchor.setTo(0.5);
                this.pivot.set(64, 64);
                this.animations.add('ufo_fly', [0, 1, 2], 30, true);
                game.add.existing(this);
                game.physics.enable(this);
                this.body.setCircle(20);
                this.kill();
            }
            UFO.prototype.update = function () {
                this.animations.play('ufo_fly');
                if (this.level.player.alive && this.alive) {
                    var myPos = new Phaser.Point(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y);
                    if (myPos.distance(this.level.player.position) < 900 && !this.playerIsInRange && !this.waitingToShoot) {
                        console.log("within distance!");
                        this.playerIsInRange = true;
                        this.shoot();
                    }
                    else {
                        this.playerIsInRange = false;
                    }
                }
            };
            UFO.prototype.comeAlive = function () {
                this.revive();
                this.position = new Phaser.Point(100, 500);
                this.move();
                this.game.time.events.add(Phaser.Timer.SECOND * this.timeToMoveStraight, this.shoot, this);
                this.game.time.events.add(Phaser.Timer.SECOND * 5, this.kill, this);
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
                    this.body.velocity.y = (this.game.rnd.sign()) * this.shipSpeed.y;
                }
                if (this.alive) {
                    this.game.time.events.add(Phaser.Timer.SECOND * this.timeToMoveStraight, this.move, this);
                }
            };
            UFO.prototype.shoot = function () {
                this.waitingToShoot = false;
                if (this.level.player.alive && this.alive) {
                    var shootDir = new Phaser.Point(this.level.player.position.x - this.position.x, this.level.player.position.y - this.position.y);
                    var myBullet = this.level.enemyBullets.getFirstDead(false);
                    myBullet.reset(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y);
                    var angleOfShot = Math.atan2(shootDir.y, shootDir.x) * 180 / Math.PI;
                    this.game.physics.arcade.velocityFromAngle(angleOfShot, 400, myBullet.body.velocity);
                }
                if (this.alive) {
                    this.game.time.events.add(Phaser.Timer.SECOND * this.timeToShoot, this.shoot, this);
                    this.waitingToShoot = true;
                }
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
                this.game = game;
                this.level = level;
                console.log("made a ufo spawner");
                this.spawnShips();
            }
            UFOSpawner.prototype.spawnShips = function () {
                this.ufo = this.level.ufos.getFirstDead(false);
                this.ufo.comeAlive();
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
        var Level01 = (function (_super) {
            __extends(Level01, _super);
            function Level01() {
                _super.apply(this, arguments);
            }
            Level01.prototype.create = function () {
                this.physics.startSystem(Phaser.Physics.ARCADE);
                this.createEnemyBullets();
                this.background = this.add.sprite(0, 0, 'GameBackground');
                this.createUFOs();
                this.createEnemyBullets();
                this.createPlayerShip();
            };
            Level01.prototype.createUFOs = function () {
                var i = 0;
                this.ufos = this.game.add.group();
                for (i = 0; i < 30; i++) {
                    this.ufos.add(new Client.UFO(this.game, this, -1000, -1000));
                }
                this.ufoSpawner = new Client.UFOSpawner(this.game, this);
            };
            Level01.prototype.createEnemyBullets = function () {
                this.enemyBullets = this.game.add.group();
                this.enemyBullets.enableBody = true;
                this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
                this.enemyBullets.createMultiple(50, 'EnemyBullet');
                this.enemyBullets.setAll('checkWorldBounds', true);
                this.enemyBullets.setAll('outOfBoundsKill', true);
            };
            Level01.prototype.createPlayerShip = function () {
                this.player = new Client.Ship(this.game, this.world.centerX, this.world.centerY);
            };
            Level01.prototype.update = function () {
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
                this.load.atlasJSONHash('Ship', './assets/sprites/Ship/Ship_1.png', './assets/sprites/Ship/Ship_1.json');
                this.load.atlasJSONHash('UFO', './assets/sprites/UFO/UFO_1.png', './assets/sprites/UFO/UFO_1.json');
            };
            Preloader.prototype.create = function () {
                var tween = this.add.tween(this.loaderText).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.startMainMenu, this);
            };
            Preloader.prototype.startMainMenu = function () {
                this.game.state.start('MainMenu', true, false);
            };
            return Preloader;
        }(Phaser.State));
        Client.Preloader = Preloader;
    })(Client = Jelicopter.Client || (Jelicopter.Client = {}));
})(Jelicopter || (Jelicopter = {}));
//# sourceMappingURL=game.js.map