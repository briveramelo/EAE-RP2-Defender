module Jelicopter.Client {

    export class Preloader extends Phaser.State {

        loaderText: Phaser.Text;

        preload() {
            this.game.antialias = false;
            this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading...",
                { font: "18px Arial", fill: "#A9A91111", align: "center" });
            this.loaderText.anchor.setTo(0.5);

            //TitleScreenery
            this.load.image('titlepage', './assets/ui/titlePage.png');
            this.load.image('logo', './assets/ui/Jelicopter.png');
            this.load.audio('click', './assets/sounds/click.ogg', true);

            //Backgrounds
            this.load.image('GameBackground', './assets/sprites/Background/background_base.jpg');
            this.load.image('CityBack', './assets/sprites/Background/city_back.png');
            this.load.image('CityMid', './assets/sprites/Background/city_mid.png');

            //Maps
            this.load.image('MapCityMid', './assets/sprites/Maps/map_mid.png');
            this.load.image('MapCityBack', './assets/sprites/Maps/map_back.png');
            this.load.image('MapCityFrame', './assets/sprites/Maps/map_frame.png');

            //Bullets
            this.load.image('EnemyBullet', './assets/sprites/UFO/EnemyBullet.png');
            this.load.image('Bullet', './assets/sprites/Ship/bullet02.png');
            
            //Explosion
            this.load.spritesheet('slime_death', './assets/sprites/Explosions/slime_sprite.png', 64, 64);
            this.load.spritesheet('blue_fire', './assets/sprites/Explosions/blue_sprite.png', 115, 104);
            this.load.spritesheet('ship_smoke', './assets/sprites/Explosions/smoke_sprite.png', 115, 104);

            //Score
            this.load.spritesheet('score_feedback', './assets/sprites/Score/score_sprite.png', 90, 90);

            //Ships
            this.load.atlasJSONHash('Ship', './assets/sprites/Ship/Ship_1.png', './assets/sprites/Ship/Ship_1.json');
            this.load.atlasJSONHash('UFO', './assets/sprites/UFO/UFO_1.png', './assets/sprites/UFO/UFO_1.json');
            this.load.atlasJSONHash('BomberUFO', './assets/sprites/UFO/bomb_drop.png', './assets/sprites/UFO/bomb_drop.json');
            //this.load.spritesheet('ship_death', 'assets/ship_death_sprite.png', 115, 115);
            //this.load.spritesheet('ship_fire', 'assets/fire_sprite.png', 115, 104);
            //this.load.spritesheet('ship_smoke', 'assets/smoke_sprite.png', 115, 104);


            //People
            this.load.atlasJSONHash('JumpingMale', './assets/sprites/People/Jumping_male.png', './assets/sprites/People/Jumping_male.json');

            // Hospital
            this.load.atlasJSONHash('Hospital', './assets/sprites/Buildings/safe_place.png', './assets/sprites/Buildings/safe_place.json');

        }

        create() {
            //var tween = this.add.tween(this.loaderText).to({ alpha: 0 }, 2000,
            //    Phaser.Easing.Linear.None, true);
            //tween.onComplete.add(this.startMainMenu, this);
            this.startLevel();
        }

        startMainMenu() {
            this.game.state.start('MainMenu', true, false);
        }

        startLevel() {
            this.game.state.start('Level01', true, false);
        }

    }

}