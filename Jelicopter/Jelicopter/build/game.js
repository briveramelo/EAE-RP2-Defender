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
            function UFO(game, x, y) {
                _super.call(this, game, x, y, 'UFO', 1);
                this.shipSpeed = new Phaser.Point(300, 300);
                this.anchor.setTo(0.5);
                this.pivot.set(64, 64);
                this.animations.add('ufo_fly', [0, 1, 2], 30, true);
                game.add.existing(this);
                game.physics.enable(this);
                this.body.collideWorldBounds = true;
                this.body.setCircle(20);
            }
            UFO.prototype.update = function () {
                this.move();
            };
            UFO.prototype.move = function () {
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
                    this.animations.play('ufo_fly');
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
        var UFOSpawner = (function (_super) {
            __extends(UFOSpawner, _super);
            function UFOSpawner() {
                _super.apply(this, arguments);
            }
            return UFOSpawner;
        }(Phaser.GameObjectFactory));
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
                this.background = this.add.sprite(0, 0, 'GameBackground');
                this.player = new Client.Ship(this.game, this.world.centerX, this.world.centerX);
                this.ufo = new Client.UFO(this.game, 500, 500);
                this.player.anchor.setTo(0, 5);
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
                this.load.atlasJSONHash('Ship', './assets/sprites/Ship_1.png', './assets/sprites/Ship_1.json');
                this.load.atlasJSONHash('UFO', './assets/sprites/UFO_1.png', './assets/sprites/UFO_1.json');
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