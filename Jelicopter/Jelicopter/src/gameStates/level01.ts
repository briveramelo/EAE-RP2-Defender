module Jelicopter.Client {

    export class Level01 extends Phaser.State {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        ufos: Phaser.Group;
        enemyBullets: Phaser.Group;
        player: Ship;
        ufoSpawner: UFOSpawner;

        create() {            
            this.physics.startSystem(Phaser.Physics.ARCADE);

            this.background = this.add.sprite(0, 0, 'GameBackground');

            this.createUFOs();
            this.createEnemyBullets();
            this.createPlayerShip();
        }

        createUFOs() {
            var i: number = 0;
            this.ufos = this.game.add.group();
            for (i = 0; i < 30; i++){
                this.ufos.add( new UFO(this.game, this, -1000, -1000));
            }
            this.ufoSpawner = new UFOSpawner(this.game, this);
        }

        createEnemyBullets() {
            var i: number = 0;
            this.enemyBullets = this.game.add.group();
            for (i = 0; i < 30; i++) {
                this.enemyBullets.add( new EnemyBullet(this.game, this, -1000, -1000));
            }
            console.log(this.enemyBullets);
        }

        createPlayerShip() {
            this.player = new Ship(this.game, this.world.centerX, this.world.centerY);    
        }

        update() {
            
        }

    }

}