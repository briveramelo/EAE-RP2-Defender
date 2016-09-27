module Jelicopter.Client {

    export class MainGame extends Phaser.State {

        backgrounds: Phaser.Group;
        cityBackgrounds: Phaser.Group;
        cityMidgrounds: Phaser.Group;
        cityFrontGrounds: Phaser.Group;
        allBackgrounds: Phaser.Group;

        music: Phaser.Sound;
        ufos: Phaser.Group;
        bomberUFOs: Phaser.Group;
        enemyBullets: Phaser.Group;
        enemyMissiles: Phaser.Group;
        allPeople: Phaser.Group;
        male1People: Phaser.Group;
        male2People: Phaser.Group;
        female1People: Phaser.Group;
        female2People: Phaser.Group;

        //PLAYER
        playerBullets: Bullet;
        playerShip: Ship;

        //SINGELTONS
        hospital: Hospital;
        scoreboard: ScoreBoard;
        pauser: Pauser;
        roundManager: RoundManager;
        tractorBeam: TractorBeam;
        wrapManager: WrapManager;
        overlapManager: OverlapManager;
        gamepadManager: GamepadManager;
        explosionManager: ExplosionManager;
        peopleExplosionManager: PeopleExplosionManager;
        shipTrailManager: ShipTrailManager;
        soundManager: SoundManager;
        laserManager: LaserManager;

        //SPAWNERS
        ufoSpawner: ParagliderPlaneSpawner;
        bomberUFOSpawner: BomberUFOSpawner;
        personSpawner: PersonSpawner;
        vehicleSpawner: VehicleSpawner;

        //NUMBERS
        backgroundImageWidth: number = 3072;
        heightOffset: number = 0;
        gameHeight: number = 580;

        allObjects;

        create() {
            this.game.world.setBounds(0, this.heightOffset, 10000000000, this.gameHeight);
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.physics.arcade.gravity.y = 100;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;

            //CREATE BACKGROUNDS
            this.allBackgrounds = this.add.group();
            this.createBackgrounds();
            this.createCityBack();
            this.createCityMid();
            //this.createCityFront();

            //CREATE OBJECTS
            this.allObjects = [];
            var i:number = 0;
            i = this.createBuildings(i);
            i = this.createPlayerShipAndBullets(i);
            i = this.createPeople(i);
            i = this.createEnemyBullets(i);
            i = this.createEnemyMissiles(i);
            i = this.createUFOs(i);
            i = this.createBomberUFOs(i);

            //CREATE SPAWNERS
            console.log(this.male1People);
            this.personSpawner = new PersonSpawner(this.game, this);
            this.ufoSpawner = new ParagliderPlaneSpawner(this.game, this);
            this.bomberUFOSpawner = new BomberUFOSpawner(this.game, this);
            this.vehicleSpawner = new VehicleSpawner(this.game, this);

            //CREATE SINGLETONS
            this.gamepadManager = new GamepadManager(this.game, this);
            this.pauser = new Pauser(this.game);
            this.tractorBeam = new TractorBeam(this.game, this, this.allPeople);
            this.wrapManager = new WrapManager(this.game, this);
            this.overlapManager = new OverlapManager(this.game, this, this.allPeople);
            this.roundManager = new RoundManager(this.game, this, this.allPeople);
            this.explosionManager = new ExplosionManager(this.game, this);
            this.peopleExplosionManager = new PeopleExplosionManager(this.game, this);
            this.shipTrailManager = new ShipTrailManager(this.game, this);
            this.soundManager = new SoundManager(this.game);
            this.laserManager = new LaserManager(this.game, this);
            this.scoreboard = new ScoreBoard(this.game);

            //HANDLE CAMERA
            this.game.camera.roundPx = false;
            this.game.renderer.renderSession.roundPixels = false;
            this.game.camera.setPosition(this.playerShip.camTarget.x, this.playerShip.camTarget.y);
            this.game.camera.follow(this.playerShip.camTarget, Phaser.Camera.FOLLOW_LOCKON, 0.05);
        }        

        createBackgrounds() {
            this.backgrounds = this.add.group();
            for (var i = 0; i < 3; i++) {
                var background = new BackgroundLayer(this.game, this, 'GameBackground', 0, 0);
                this.backgrounds.add(background);
                this.allBackgrounds.add(background);
                background.position.x = this.game.world.centerX - this.backgroundImageWidth + i * this.backgroundImageWidth;
                background.position.y = 0;
                background.revive();
            }
        }

        createCityBack() {
            this.cityBackgrounds = this.add.group();
            for (var i = 0; i < 3; i++) {
                var background = new BackgroundLayer(this.game, this, 'CityBack', 3, 6);
                this.cityBackgrounds.add(background);
                this.allBackgrounds.add(background);
                background.position.x = this.game.world.centerX - this.backgroundImageWidth + i * this.backgroundImageWidth;
                background.position.y = 0;
                background.revive();
            }            
        }

        createCityMid() {
            this.cityMidgrounds = this.add.group();
            for (var i = 0; i < 3; i++) {
                var background = new BackgroundLayer(this.game, this, 'CityMid', 30, 100);
                this.cityBackgrounds.add(background);
                this.allBackgrounds.add(background);
                background.position.x = this.game.world.centerX - this.backgroundImageWidth + i * this.backgroundImageWidth;
                background.position.y = 50;
                background.revive();
            }
        }
        createCityFront() {
            this.cityFrontGrounds = this.add.group();
            for (var i = 0; i < 3; i++) {
                var background = new BackgroundLayer(this.game, this, 'CityFront', 0, 0);
                this.cityFrontGrounds.add(background);
                this.allBackgrounds.add(background);
                background.position.x = this.game.world.centerX - this.backgroundImageWidth + i * this.backgroundImageWidth;
                background.position.y = 0;
                background.revive();
            }
        }

        createBuildings(objStartIndex: number) {
            this.hospital = new Hospital(this.game, this);
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
            this.allPeople = this.game.add.group();
            this.male1People = this.game.add.group();
            this.male2People = this.game.add.group();
            this.female1People = this.game.add.group();
            this.female2People = this.game.add.group();

            for (var i = 0; i < 30; i++) {
                var person = new Person(this.game, this.playerShip, this, PersonType.Male1);
                this.male1People.add(person);
                this.allPeople.add(person);
            }
            console.log(this.male1People);
            for (var i = 0; i < 30; i++) {
                var person = new Person(this.game, this.playerShip, this, PersonType.Male2);
                this.male2People.add(person);
                this.allPeople.add(person);
            }
            for (var i = 0; i < 30; i++) {
                var person = new Person(this.game, this.playerShip, this, PersonType.Female1);
                this.female1People.add(person);
                this.allPeople.add(person);
            }
            for (var i = 0; i < 30; i++) {
                var person = new Person(this.game, this.playerShip, this, PersonType.Female2);
                this.female2People.add(person);
                this.allPeople.add(person);
            }
            this.allPeople.forEach(function (person) {
                this.allObjects[objStartIndex] = person;
                objStartIndex++;
            }, this);
            return objStartIndex;
        }
        createEnemyBullets(objStartIndex:number) {
            this.enemyBullets = this.game.add.group();
            this.enemyBullets.enableBody = true;
            this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.enemyBullets.createMultiple(50, 'UFOBullet');
            this.enemyBullets.forEach(function (bullet) {
                bullet.myCollider = new CircleCollider(bullet, 10, new Phaser.Point(0, 0));
                bullet.scale.set(0.5);
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
            this.enemyMissiles.createMultiple(100, 'Missile');
            this.enemyMissiles.forEach(function (missile) {
                missile.myCollider = new CircleCollider(missile, 20, new Phaser.Point(0, 0));
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
                                  
        }        

    }

}