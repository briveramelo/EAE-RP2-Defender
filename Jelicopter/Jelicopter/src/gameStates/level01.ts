module Jelicopter.Client {

    export class Level01 extends Phaser.State {

        backgrounds: Phaser.Group;
        cityBackgrounds: Phaser.Group;
        cityMidgrounds: Phaser.Group;
        allBackgrounds: Phaser.Group;

        music: Phaser.Sound;
        ufos: Phaser.Group;
        bomberUFOs: Phaser.Group;
        enemyBullets: Phaser.Group;
        enemyMissiles: Phaser.Group;

        playerBullets: Bullet;
        playerShip: Ship;
        people: Phaser.Group;

        //Singletons
        hospital: Hospital;
        scoreboard: ScoreBoard;
        pauser: Pauser;
        roundManager: RoundManager;
        humanManager: HumanManager;
        wrapManager: WrapManager;
        overlapManager: OverlapManager;
        ufoSpawner: UFOSpawner;
        bomberUFOSpawner: BomberUFOSpawner;

        backgroundImageWidth: number = 3072;
        heightOffset: number = 250;

        allObjects;

        create() {            
            this.game.world.setBounds(0, this.heightOffset, 10000000000, 576);
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;

            //CREATE BACKGROUNDS
            this.allBackgrounds = this.add.group();
            this.createBackgrounds();
            this.createCityBack();
            this.createCityMid();

            this.allObjects = [];
            var i:number = 0;
            i = this.createBuildings(i);
            i = this.createPlayerShipAndBullets(i);
            i = this.createPeople(i);
            i = this.createEnemyBullets(i);
            i = this.createEnemyMissiles(i);
            i = this.createUFOs(i);
            i = this.createBomberUFOs(i);

            //CREATE SINGLETONS
            this.scoreboard = new ScoreBoard(this.game);
            this.pauser = new Pauser(this.game);
            this.humanManager = new HumanManager(this.game, this, this.people, this.hospital);
            this.wrapManager = new WrapManager(this.game, this);
            this.overlapManager = new OverlapManager(this.game, this);
            this.ufoSpawner = new UFOSpawner(this.game, this);
            this.bomberUFOSpawner = new BomberUFOSpawner(this.game, this);
            this.roundManager = new RoundManager(this.game, this);

            this.game.camera.follow(this.playerShip);
        }        

        createBackgrounds() {
            this.backgrounds = this.add.group();
            for (var i = 0; i < 3; i++) {
                var background = new BackgroundLayer(this.game, this, 'GameBackground', 0, 0);
                this.backgrounds.add(background);
                this.allBackgrounds.add(background);
                background.position.x = this.game.world.centerX - this.backgroundImageWidth + i * this.backgroundImageWidth;
                background.position.y = 200;
                background.revive();
            }
        }

        createCityBack() {
            this.cityBackgrounds = this.add.group();
            for (var i = 0; i < 3; i++) {
                var background = new BackgroundLayer(this.game, this, 'CityBack', 5, 10);
                this.cityBackgrounds.add(background);
                this.allBackgrounds.add(background);
                background.position.x = this.game.world.centerX - this.backgroundImageWidth + i * this.backgroundImageWidth;
                background.position.y = 200;
                background.revive();
            }            
        }

        createCityMid() {
            this.cityMidgrounds = this.add.group();
            for (var i = 0; i < 3; i++) {
                var background = new BackgroundLayer(this.game, this, 'CityMid', 80, 150);
                this.cityBackgrounds.add(background);
                this.allBackgrounds.add(background);
                background.position.x = this.game.world.centerX - this.backgroundImageWidth + i * this.backgroundImageWidth;
                background.position.y = 250;
                background.revive();
            }
        }

        createBuildings(objStartIndex: number) {
            this.hospital = new Hospital(this.game);
            this.allObjects[objStartIndex] = this.hospital;
            objStartIndex++;
            return objStartIndex;
        }
        createPlayerShipAndBullets(objStartIndex: number) {
            this.playerBullets = new Bullet(this.game);
            this.playerShip = new Ship(this.game, this, this.world.centerX, this.world.centerY, this.playerBullets);
            this.playerBullets.forEach(function (bullet) {
                this.allObjects[objStartIndex] = bullet;
                objStartIndex++;
            }, this);
            this.allObjects[objStartIndex] = this.playerShip;
            objStartIndex++;
            return objStartIndex;
        }
        createPeople(objStartIndex: number) {
            this.people = this.game.add.group();
            for (var i = 0; i < 10; i++) {
                this.people.add(new Person(this.game, this.playerShip, -1000, -1000));
            }
            this.people.forEach(function (person) {
                this.allObjects[objStartIndex] = person;
                objStartIndex++;
            }, this);
            return objStartIndex;
        }
        createEnemyBullets(objStartIndex:number) {
            this.enemyBullets = this.game.add.group();
            this.enemyBullets.enableBody = true;
            this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.enemyBullets.createMultiple(50, 'EnemyBullet');
            this.enemyBullets.forEach(function (bullet) {
                bullet.myCollider = new CircleCollider(bullet, 4, new Phaser.Point(0, 0));
                this.allObjects[objStartIndex] = bullet;
                objStartIndex++;
            }, this);

            this.enemyBullets.setAll('checkWorldBounds', true);
            this.enemyBullets.setAll('outOfBoundsKill', true);                        
            return objStartIndex;
        }
        createEnemyMissiles(objStartIndex: number) {
            this.enemyMissiles = this.game.add.group();
            this.enemyMissiles.enableBody = true;
            this.enemyMissiles.physicsBodyType = Phaser.Physics.ARCADE;
            this.enemyMissiles.createMultiple(100, 'EnemyBullet');
            this.enemyMissiles.forEach(function (missile) {
                missile.myCollider = new CircleCollider(missile, 15, new Phaser.Point(0, 0));
                this.allObjects[objStartIndex] = missile;
                objStartIndex++;
            }, this);

            this.enemyMissiles.setAll('checkWorldBounds', true);
            this.enemyMissiles.setAll('outOfBoundsKill', true);
            return objStartIndex;
        }


        createUFOs(objStartIndex: number) {
            this.ufos = this.game.add.group();
            for (var i = 0; i < 30; i++){
                this.ufos.add(new UFO(this.game, this));
            }
            this.ufos.forEach(function (ufo) {
                this.allObjects[objStartIndex] = ufo;
                objStartIndex++;
            }, this);
            
            return objStartIndex;
        }

        createBomberUFOs(objStartIndex: number) {
            this.bomberUFOs = this.game.add.group();
            for (var i = 0; i < 30; i++) {
                this.bomberUFOs.add(new BomberUFO(this.game, this));
            }
            this.bomberUFOs.forEach(function (bomberUFO) {
                this.allObjects[objStartIndex] = bomberUFO;
                objStartIndex++;
            }, this);
            return objStartIndex;
        }

        update() {
            if (this.playerShip.lives === 0 || this.people.countLiving() === 0) {
                this.game.state.start('GameOver', true, false);
            }                        
        }        

    }

}