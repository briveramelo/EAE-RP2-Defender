module Jelicopter.Client {

    export class MainGame extends Phaser.State {

        backgrounds: Phaser.Group;
        cityBackgrounds: Phaser.Group;
        cityMidgrounds: Phaser.Group;
        cityForeground: Phaser.Group;
        allBackgrounds: Phaser.Group;

        music: Phaser.Sound;
        helis: Phaser.Group;
        paratroopers: Phaser.Group;
        vehicles: Phaser.Group;
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

        paraTrooper: ParaTrooper;

        //SINGELTONS
        //hospital: Hospital;
        scoreboard: ScoreBoard;
        pauser: Pauser;
        roundManager: RoundManager;
        tractorBeam: TractorBeam;
        wrapManager: WrapManager;
        overlapManager: OverlapManager;
        gamepadManager: GamepadManager;
        heliExplosionManager: HeliExplosionManager;
        peopleExplosionManager: PeopleExplosionManager;
        shipTrailManager: ShipTrailManager;
        soundManager: SoundManager;
        laserManager: LaserManager;
        tractorBeamParticleManager: TractorBeamParticleManager;

        //SPAWNERS
        heliSpawner: HeliSpawner;
        personSpawner: PersonSpawner;
        vehicleSpawner: VehicleSpawner;
        paratrooperSpawner: ParatrooperSpawner;

        //NUMBERS
        backgroundImageWidth: number = 4533;
        heightOffset: number = 0;
        gameHeight: number;

        allObjects;
        gameSize: Phaser.Point;

        constructor(gameSize: Phaser.Point) {
            super();
            this.gameSize = gameSize;
        }

        create() {
            this.game.world.setBounds(0, this.heightOffset, 10000000000, this.gameSize.y);
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.physics.arcade.gravity.y = 100;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;

            //CREATE BACKGROUNDS
            this.allBackgrounds = this.add.group();
            this.createBackgrounds();
            this.createCityBack();
            this.createCityMid();
            this.createCityForeground();

            //CREATE OBJECTS
            this.allObjects = [];
            var i:number = 0;
            //i = this.createBuildings(i);
            i = this.createPlayerShipAndBullets(i);
            i = this.createPeople(i);
            i = this.createEnemyBullets(i);
            i = this.createEnemyMissiles(i);
            i = this.createDropShips(i);
            i = this.createParaTroopers(i);
            i = this.createVehicles(i);

            //CREATE SPAWNERS
            this.personSpawner = new PersonSpawner(this.game, this);
            this.heliSpawner = new HeliSpawner(this.game, this);
            this.vehicleSpawner = new VehicleSpawner(this.game, this);
            this.paratrooperSpawner = new ParatrooperSpawner(this.game,this);

            //CREATE SINGLETONS
            this.gamepadManager = new GamepadManager(this.game, this);
            this.pauser = new Pauser(this.game);
            this.tractorBeam = new TractorBeam(this.game, this, this.allPeople);
            this.wrapManager = new WrapManager(this.game, this);
            this.overlapManager = new OverlapManager(this.game, this, this.allPeople);
            this.roundManager = new RoundManager(this.game, this, this.allPeople);
            this.soundManager = new SoundManager(this.game);
            this.scoreboard = new ScoreBoard(this.game);

            //CREATE PARTICLE MANAGERS
            this.heliExplosionManager = new HeliExplosionManager(this.game, this);
            this.peopleExplosionManager = new PeopleExplosionManager(this.game, this);
            this.shipTrailManager = new ShipTrailManager(this.game, this);
            this.laserManager = new LaserManager(this.game, this);
            this.tractorBeamParticleManager = new TractorBeamParticleManager(this.game, this);
            //this.playerShip.addChild(this.tractorBeam);

            //HANDLE CAMERA
            this.game.camera.roundPx = false;
            this.game.renderer.renderSession.roundPixels = false;
            this.game.camera.setPosition(this.playerShip.camTarget.x, this.playerShip.camTarget.y);
            this.game.camera.follow(this.playerShip.camTarget, Phaser.Camera.FOLLOW_LOCKON);//, 0.05);

            this.soundManager.playSound(SoundFX.Background);
            //this.paraTrooper = new ParaTrooper(this.game, this.game.world.centerX, 0, this);
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
                background.position.y = -50;
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
                background.position.y = 10;
                background.revive();
            }
        }
        createCityForeground() {
            this.cityForeground = this.add.group();
            for (var i = 0; i < 3; i++) {
                var background = new BackgroundLayer(this.game, this, 'Foreground', 0, 0);
                this.cityForeground.add(background);
                this.allBackgrounds.add(background);
                background.position.x = this.game.world.centerX - this.backgroundImageWidth + i * this.backgroundImageWidth;
                background.position.y = 0;
                background.revive();
            }
        }

        //createBuildings(objStartIndex: number) {
        //    this.hospital = new Hospital(this.game, this);
        //    this.allObjects[objStartIndex] = this.hospital;
        //    objStartIndex++;
        //    return objStartIndex;
        //}
        createPlayerShipAndBullets(objStartIndex: number) {
            this.playerBullets = new Bullet(this.game);
            this.playerShip = new Ship(this.game, this, this.playerBullets);
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


        createDropShips(objStartIndex: number) {
            this.helis = this.game.add.group();
            for (var i = 0; i < 30; i++){
                this.helis.add(new Heli(this.game, this));
            }
            this.helis.forEach(function (ufo) {
                this.allObjects[objStartIndex] = ufo;
                objStartIndex++;
            }, this);
            
            return objStartIndex;
        }    

        createParaTroopers(objStartIndex: number) {
            this.paratroopers = this.game.add.group();
            for (var i = 0; i < 30; i++) {
                this.paratroopers.add(new ParaTrooper(this.game, this));
            }
            this.paratroopers.forEach(function (paratrooper) {
                this.allObjects[objStartIndex] = paratrooper;
                objStartIndex++;
            }, this);
            return objStartIndex;
        } 

        createVehicles(objStartIndex: number) {
            this.vehicles = this.game.add.group();
            for (var i = 0; i < 30; i++) {
                this.vehicles.add(new Vehicle(this.game, this));
            }
            this.vehicles.forEach(function (vehicle) {
                this.allObjects[objStartIndex] = vehicle;
                objStartIndex++;
            }, this);
            return objStartIndex;
        }
            

        update() {
                                  
        }        

    }

}