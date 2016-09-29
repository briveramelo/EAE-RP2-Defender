module Jelicopter.Client {

    export class TractorBeam extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        people: Phaser.Group;
        positionOffset: Phaser.Point = new Phaser.Point(103, 50);
        clipPositions: Phaser.Point[];
        isFullyLoaded: boolean = false;
        peopleBeingCarried: Person[];
        paratrooperBeingCarried: ParaTrooper;
        myCollider: CircleCollider;
        maxClipSize: number = 5;
        isWaitingToEmitPulse: boolean;
        baseLaunch: number = 100;
        maxLaunch: number = 800;
        startAbduction: Phaser.Animation;
        loopAbduction: Phaser.Animation;
        endAbduction: Phaser.Animation;

        vehicle: Vehicle;

        startFrameData;
        loopFrameData;
        endFrameData;

        constructor(game: Phaser.Game, level: MainGame, people: Phaser.Group) {
            super(game, 0, 0, 'abduction_beam', 0);

            this.startFrameData = this.getFrameArray([0, 29]);
            this.loopFrameData = this.getFrameArray([29, 39]);
            this.endFrameData = this.getFrameArray([49, 100]);

            this.pivot.set(0, 0);

            this.startAbduction = this.animations.add('start-abduct', this.startFrameData, 60, false);
            this.loopAbduction = this.animations.add('loop-abduct', this.loopFrameData, 60, true);
            this.endAbduction = this.animations.add('end-abduct', this.endFrameData, 60, false);
            this.game = game;
            this.level = level;
            this.people = people;
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.myCollider = new CircleCollider(this, 40, new Phaser.Point(110, 50));
            this.peopleBeingCarried = [];
            this.clipPositions = [];
            for (var i: number = 0; i < this.maxClipSize; i++) {
                this.peopleBeingCarried[i] = null;
                this.clipPositions[i] = new Phaser.Point(110, i * 30 + 50);
            }
            this.justDied = false;

        }

        getFrameArray(frameRange) {
            var frameData = [];
            for (var i: number = 0; i < frameRange[1] - frameRange[0]; i++) {
                frameData[i] = i + frameRange[0];
            }
            return frameData;
        }

        update() {
            if (this.level.playerShip.alive) {
                this.setPosition();
                this.carryDropPeople();
                this.carryDropVehicle();
                this.handleAnimations();
                if (!this.isFullyLoaded) {
                    this.checkToCollectPeople();
                }
            }
            else {
                this.endAnimation();
            }
        }

        handleAnimations() {            

            if (this.isFullyLoaded && this.animations.frame < this.endFrameData[0]) {
                this.endAbduction.play();
            }
            else if (!this.isFullyLoaded && (this.animations.frame == 0 || this.animations.frame >= this.endFrameData[1])) {
                this.startAbduction.play();
            }
            else if (
                this.startAbduction.isFinished && (
                    (this.animations.frame == this.loopFrameData[0] - 1) ||
                    (this.animations.frame == this.loopFrameData[0] - 2 && !this.loopAbduction.isPlaying))) {

                this.loopAbduction.play();
            }
        }

        justDied: boolean;
        endAnimation() {
            if (!this.justDied) {
                this.justDied = true;
                this.endAbduction.play();
            }
        }

        setPosition() {
            this.position.x = this.level.playerShip.position.x + (this.level.playerShip.isGoingRight ? 1 : -1) * this.positionOffset.x - 110;
            this.position.y = this.level.playerShip.position.y + this.positionOffset.y - 50;
        }

        checkToCollectPeople() {
            var i: number = 0;
            this.people.forEach(function (person: Person) {
                if (person.alive && !person.isPausedForFlinging && !person.isBeingHeld) {
                    if (person.myCollider.isColliding(this.myCollider)) {
                        if (!this.isFullyLoaded) {
                            this.collectPerson(person);
                        }
                    }
                }
                i++;
            }, this);

            //////////////////
            //AJAY, LETS GET PARATROOPERS IN THIS SAME LIST OF PEOPLE
            //////////////////

            //i = 0;
            this.level.vehicles.forEach(function (vehicle: Vehicle) {
                if (vehicle.alive && !vehicle.isPausedForFlinging && !this.isCarryingPerson) {
                    if (vehicle.myCollider.isColliding(this.myCollider)) {
                        if (!this.isFullyLoaded) {
                            this.collectVehicle(vehicle);
                        }
                    }
                }
                i++;
            }, this);
        }

        carryDropPeople() {
            var i: number = 0;
            for (var i: number = 0; i < this.maxClipSize; i++) {
                if (this.peopleBeingCarried[i] != null) {
                    if (this.peopleBeingCarried[i].alive) {
                        this.carryPerson(i);
                    }
                    else {
                        this.dropPerson(i);
                    }
                }

            }
        }

        carryDropVehicle() {
            var i: number = 0;
            if (this.vehicle != null) {
                if (this.vehicle.alive) {
                    this.carryVehicle(this.vehicle);
                }
                else {
                    this.dropVehicle(this.vehicle);
                }
            }
        }

        flingAllPeople() {
            for (var i: number = 0; i < this.maxClipSize; i++) {
                if (this.peopleBeingCarried[i] != null) {
                    this.flingPerson(i, true);
                }
                this.peopleBeingCarried[i] = null;
            };
            this.isFullyLoaded = false;
        }

        flingVehicles() {
            if (this.vehicle!=null)
            this.flingVehicle();           
            this.isFullyLoaded = false;
        }

        carryPerson(personIndex: number) {

            if (personIndex == 0) {
                this.peopleBeingCarried[0].rotate();
            }
            this.peopleBeingCarried[personIndex].position.x = this.position.x + this.clipPositions[personIndex].x;
            this.peopleBeingCarried[personIndex].position.y = this.position.y + this.clipPositions[personIndex].y;
        }

        carryVehicle(vehicle:Vehicle) {            
                vehicle.rotate();
                vehicle.position.x = this.position.x + this.clipPositions[0].x;
                vehicle.position.y = this.position.y + this.clipPositions[0].y;
        }

        dropPerson(personIndex: number) {
            this.isFullyLoaded = false;
            this.peopleBeingCarried[personIndex] = null;
            for (var i: number = 1; i < this.maxClipSize; i++) {
                if (this.peopleBeingCarried[i] != null) {
                    this.peopleBeingCarried[i - 1] = this.peopleBeingCarried[i];
                    this.peopleBeingCarried[i] = null;
                }
            }

            this.level.soundManager.playSound(SoundFX.Abduct);
        }

        dropVehicle(vehicle: Vehicle) {
            this.isFullyLoaded = false;
            this.vehicle.body.gravity.y = 600;
            this.vehicle = null;            
            this.level.soundManager.playSound(SoundFX.Abduct);
        }

        flingPerson(personIndex: number, isForAll?:boolean) {
            var isGoingRightMult: number = this.level.playerShip.isGoingRight ? 1 : -1;
            var xLaunch: number = (this.baseLaunch * isGoingRightMult) + this.level.playerShip.body.velocity.x;
            if (Math.abs(xLaunch) > this.maxLaunch) {
                xLaunch = this.maxLaunch * isGoingRightMult;
            }
            var launchVelocity: Phaser.Point = new Phaser.Point(xLaunch, this.level.playerShip.body.velocity.y);
            this.peopleBeingCarried[personIndex].getFlung(launchVelocity);
            if (!isForAll) {
                this.dropPerson(personIndex);
            }
        }

        flingVehicle() {
            var isGoingRightMult: number = this.level.playerShip.isGoingRight ? 1 : -1;
            var xLaunch: number = (this.baseLaunch * isGoingRightMult) + this.level.playerShip.body.velocity.x;
            if (Math.abs(xLaunch) > this.maxLaunch) {
                xLaunch = this.maxLaunch * isGoingRightMult;
            }
            var launchVelocity: Phaser.Point = new Phaser.Point(xLaunch, this.level.playerShip.body.velocity.y);
            this.vehicle.getFlung(launchVelocity);
            this.dropVehicle(this.vehicle);
        }

        //flingParatrooper() {
        //    var launchVelocity: Phaser.Point = new Phaser.Point(this.level.playerShip.body.velocity.x, this.level.playerShip.body.velocity.y);
        //    this.paratrooperBeingCarried.getFlung(launchVelocity);
        //    this.dropParaTrooper();
        //}

        collectPerson(person: Person) {
            var clipIndex = 0;
            for (var i: number = 0; i < this.maxClipSize; i++) {
                if (this.peopleBeingCarried[i] == null) {
                    clipIndex = i;
                    break;
                }
            }

            if (clipIndex != 0) {
                person.angle = 90;
            }

            this.peopleBeingCarried[clipIndex] = person;
            if (clipIndex == this.maxClipSize - 1) {
                this.isFullyLoaded = true;
            }

            person.getGrabbed();

            this.level.soundManager.playSound(SoundFX.Abduct);
        }

        //collectParaTrooper(paratrooper: ParaTrooper) {
        //    paratrooper.removeChild(paratrooper.parachute);
        //    this.paratrooperBeingCarried = paratrooper;
        //    this.isFullyLoaded = true;
        //    paratrooper.getGrabbed();
        //    this.level.soundManager.playSound(SoundFX.Abduct);
        //}

        collectVehicle(vehicle: Vehicle) {
            if (this.peopleBeingCarried[0] == null) {
                this.vehicle = vehicle;
                this.isFullyLoaded = true;
                vehicle.getGrabbed();
                vehicle.rotate();
                this.level.soundManager.playSound(SoundFX.Abduct);
            }

        }

        isOverlapping(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();
            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }

    }
}