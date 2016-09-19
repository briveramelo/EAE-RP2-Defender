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

            //CREATE OBJECTS
            this.createEnemyBullets();
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
            this.enemyBullets = this.game.add.group();
            this.enemyBullets.enableBody = true;
            this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.enemyBullets.createMultiple(50, 'EnemyBullet');

            this.enemyBullets.setAll('checkWorldBounds', true);
            this.enemyBullets.setAll('outOfBoundsKill', true);                        
        }

        createPlayerShip() {
            this.player = new Ship(this.game, this, this.world.centerX, this.world.centerY);    
        }

        update() {
            this.physics.arcade.overlap(this.enemyBullets, this.player, this.player.kill, null, this);
        }        

    }

}