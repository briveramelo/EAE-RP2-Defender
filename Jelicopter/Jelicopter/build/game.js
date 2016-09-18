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
                _super.call(this, 1024, 800, Phaser.AUTO, 'content', null);
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
        var Bullet = (function (_super) {
            __extends(Bullet, _super);
            function Bullet(game) {
                _super.call(this, game);
                this.bulletTime = 0;
                this.enableBody = true;
                this.physicsBodyType = Phaser.Physics.ARCADE;
                this.createMultiple(40, 'Bullet');
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
        var People = (function (_super) {
            __extends(People, _super);
            function People(game, ship) {
                _super.call(this, game);
                var person = this.game.add.sprite(200, 550, 'Male', 1);
                this.add(person);
                this.callAll('animations.add', 'animations', 'wave', [0, 1, 2, 3, 4], 15, true);
                this.callAll('play', null, 'wave');
                this.game.physics.arcade.enable(this);
                this.scale.set(0.62);
                this.ship = ship;
            }
            People.prototype.update = function () {
                for (var i = 0, len = this.children.length; i < len; i++) {
                    if (this.checkOverlap(this.ship, this.children[i])) {
                        console.log("Overlapping ya");
                    }
                    else {
                        console.log("Not Overlapping");
                    }
                }
            };
            People.prototype.checkOverlap = function (spriteA, spriteB) {
                var boundsA = spriteA.getBounds();
                var boundsB = spriteB.getBounds();
                return Phaser.Rectangle.intersects(boundsA, boundsB);
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
        var Ship = (function (_super) {
            __extends(Ship, _super);
            function Ship(game, x, y, bullets) {
                _super.call(this, game, x, y, 'Ship', 1);
                this.shipSpeed = new Phaser.Point(300, 300);
                this.game.physics.arcade.enable([this]);
                this.anchor.setTo(0.5);
                this.pivot.set(64, 64);
                this.animations.add('fly', [0, 1, 2, 3, 4, 5], 30, true);
                game.add.existing(this);
                this.body.collideWorldBounds = true;
                this.bullets = bullets;
            }
            Ship.prototype.update = function () {
                this.move();
                this.checkShoot();
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
                            this.game.physics.arcade.velocityFromAngle(0, 400, this.bullets.bullet.body.velocity);
                        else
                            this.game.physics.arcade.velocityFromAngle(180, 400, this.bullets.bullet.body.velocity);
                        this.bullets.bulletTime = this.game.time.now + 50;
                    }
                }
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
                this.background = this.add.sprite(0, 0, 'GameBackground');
                this.bullets = new Client.Bullet(this.game);
                this.player = new Client.Ship(this.game, this.world.centerX, this.world.centerX, this.bullets);
                this.player.anchor.setTo(0, 5);
                this.people = new Client.People(this.game, this.player);
                console.log("Created level 01");
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
                this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading...", { font: "18px Arial", fill: "#A9A91111", align: "center" });
                this.loaderText.anchor.setTo(0.5);
                this.load.image('titlepage', './assets/ui/titlePage.png');
                this.load.image('logo', './assets/ui/gameLogo.png');
                this.load.audio('click', './assets/sounds/click.ogg', true);
                this.load.image('GameBackground', './assets/sprites/GameBackground-pixel.jpg');
                this.load.image('Bullet', './assets/sprites/bullet02.png');
                this.load.atlasJSONHash('Ship', './assets/sprites/Ship_1.png', './assets/sprites/Ship_1.json');
                this.load.atlasJSONHash('Male', './assets/sprites/Jumping_male.png', './assets/sprites/Jumping_male.json');
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