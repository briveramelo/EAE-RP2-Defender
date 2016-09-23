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

            //Audio
            //this.load.audio('aliensSong', './assets/sounds/BackgroundTunes/Aliens.ogg', true);
            this.load.audio('click', './assets/sounds/click.ogg', true);

            //Backgrounds
            this.load.image('GameBackground', './assets/sprites/Background/background_base.jpg');
            this.load.image('CityBack', './assets/sprites/Background/city_back.png');
            this.load.image('CityMid', './assets/sprites/Background/city_mid.png');
            this.load.image('CityFront', './assets/sprites/Background/city_front.png');

            //Bullets
            this.load.image('EnemyBullet', './assets/sprites/Shots/EnemyBullet.png');
            this.load.image('Bullet', './assets/sprites/Shots/bullet02.png');
            this.load.image('PlayerBullet', './assets/sprites/Shots/Shot_2.png');
            this.load.image('UFOBullet', './assets/sprites/Shots/Shot_3.png');
            this.load.image('Missile', './assets/sprites/Shots/Bomb.png');
            

            ///VISUAL FX
            //Blue UFO Explosion
            this.load.spritesheet('blue_fire', './assets/sprites/VisualFX/blue_sprite.png', 115, 104);
            this.load.spritesheet('ship_smoke', './assets/sprites/VisualFX/smoke_sprite.png', 115, 104);
            //Body Explosion
            //this.load.spritesheet('man1_parts', 'assets/man1_parts_sprite.png', 124, 124);
            //this.load.image('blood', 'assets/blood_drop.png');
            //this.load.spritesheet('guts', 'assets/guts_sprite.png', 64, 64);
            //Ship Trail
            this.load.spritesheet('fire_sprite', 'assets/sprites/VisualFX/fire_sprite.png', 115, 104);
            //this.load.spritesheet('ship_death', 'assets/ship_death_sprite.png', 115, 115);
            //this.load.spritesheet('ship_smoke', 'assets/smoke_sprite.png', 115, 104);
            //BuildingExplosion
            //



            //Ships
            this.load.atlasJSONHash('Ship', './assets/sprites/Ship/Ship_1.png', './assets/sprites/Ship/Ship_1.json');
            this.load.atlasJSONHash('Jelicopter', './assets/sprites/Ship/Jelicopter_Stretch.png', './assets/sprites/Ship/Jelicopter_Stretch.json');
            this.load.atlasJSONHash('UFO', './assets/sprites/UFO/UFO_1.png', './assets/sprites/UFO/UFO_1.json');
            this.load.atlasJSONHash('BomberUFO', './assets/sprites/UFO/UFO_2.png', './assets/sprites/UFO/UFO_2.json');



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