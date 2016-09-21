//var emitter_ship_death;
//var emitter_fire;
//var emitter_smoke;
//function preload() {
    

//}
//function create() {
//    game.physics.startSystem(Phaser.Physics.ARCADE);
//    game.stage.backgroundColor = 0x000000;

//    // Ship Fragments
//    emitter_ship_death = game.add.emitter(0, 0, 900);
//    emitter_ship_death.makeParticles('ship_death', [0, 1, 2, 3, 4, 5, 6, 7, 8], 900, true, true);
//    emitter_ship_death.gravity = 200;
//    emitter_ship_death.setAlpha(1, 0, 2500);
//    emitter_ship_death.setScale(1, .4, 1, .4, 2500, Phaser.Easing.Quintic.Out);

//    // Explosion Fire
//    emitter_fire = game.add.emitter(0, 0, 900);
//    emitter_fire.makeParticles('ship_fire', [0, 1, 2], 900, true, true);
//    emitter_fire.gravity = 200;
//    emitter_fire.setAlpha(.8, 0, 1500);
//    emitter_fire.setScale(.8, .2, .8, .2, 4000, Phaser.Easing.Quintic.Out);

//    // Explosion smoke
//    emitter_smoke = game.add.emitter(0, 0, 900);
//    emitter_smoke.makeParticles('ship_smoke', [0, 1, 2], 900, true, true);
//    emitter_smoke.gravity = 10;
//    emitter_smoke.setAlpha(.4, 0, 2000);
//    emitter_smoke.setScale(1, .5, 1, .5, 5000, Phaser.Easing.Quintic.Out);

//    game.input.onDown.add(particleBurst, this);
//}
//function particleBurst(pointer) {
//    //  Position the emitter where the mouse/touch event was
//    emitter_ship_death.x = pointer.x;
//    emitter_ship_death.y = pointer.y;

//    emitter_fire.x = pointer.x;
//    emitter_fire.y = pointer.y;

//    emitter_smoke.x = pointer.x;
//    emitter_smoke.y = pointer.y;
//    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
//    //  The second gives each particle a 2000ms lifespan
//    //  The third is ignored when using burst/explode mode
//    //  The final parameter (10) is how many particles will be emitted in this single burst
//    emitter_ship_death.start(true, 2500, null, 9);
//    emitter_fire.start(true, 1500, null, 3);
//    emitter_smoke.start(true, 2000, null, 5);
//}