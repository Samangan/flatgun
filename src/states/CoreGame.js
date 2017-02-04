import _ from 'underscore';
import PolyHelper from '../util/PolyHelper';


// General todo:
// * Make multiplayer
// * * Make a server to sync game clients and store the level json, etc.

// MOre paper ideas:
// * The loading screen and title screen should look like a page from an old book: https://iiif.lib.harvard.edu/manifests/view/drs:12347081$7i
// * I could even use that library to make it look like the pages are turning which would be fun.
class CoreGame extends Phaser.State {
    preload () {
        // TODO: Bullets should be geometrical to stay in theme.
        // Maybe little squares?
        this.game.load.image('bullet', 'assets/sprites/bullet01.png');
        this.game.load.image('inkBlot', 'assets/sprites/ink_blot_01.png');
        this.game.load.image('inkBlot1', 'assets/sprites/ink_blot_02.png');
        this.game.load.image('inkBlot2', 'assets/sprites/ink_blot_03.png');
        this.game.load.image('inkBlot3', 'assets/sprites/ink_blot_04.png');
        this.game.load.image('inkBlot4', 'assets/sprites/ink_blot_05.png');
        this.game.load.image('inkBlot5', 'assets/sprites/ink_blot_06.png');
        this.game.load.image('inkBlot6', 'assets/sprites/ink_blot_07.png');
        this.game.load.image('wall', 'assets/sprites/wall.png');
        this.game.load.image('line', 'assets/sprites/line_2.png');
        this.game.load.image('paper', 'assets/sprites/paper.png');
        this.game.load.image('level01_name', 'assets/sprites/level_01_name.png');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.polyHelp = new PolyHelper(this.game, Phaser);
        this.paper = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'paper');
        this.levelName = this.game.add.sprite(0,0, 'level01_name');

        this.walls = this.game.add.group();
        // TODO: Create a level editor that outputs an array of Line points (line = {p1.x, p1.y, p2.x, p2.y})
        // Then we will load the json file here.
        //
        //let w = this.walls.create(100, 100, this.createWall());
        //this.game.physics.enable(w, Phaser.Physics.ARCADE);
        //w.body.immovable = true;

        this.level = 2;
        // TODO: There can be organs inside of the shapes to give them directionality.
        // * What would flat land organs even look like?
        this.playerSprite = this.game.add.sprite(300, 300, this.polyHelp.createPolygon(this.level, true));
        this.game.physics.enable(this.playerSprite, Phaser.Physics.ARCADE);
        this.playerSprite.anchor.set(0.5);
        this.playerSprite.body.bounce.set(0.8);
        this.playerSprite.body.drag.set(100);
        this.playerSprite.body.maxVelocity.set(120);

        // Init some test bullets and a test weapon (This will eventually be specific to each level)
        this.weapon = this.game.add.weapon(30, 'bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletAngleOffset = 90;
        this.weapon.bulletSpeed = 400;
        this.weapon.fireRate = 60;
        this.weapon.bulletAngleVariance = 10;
        this.weapon.trackSprite(this.playerSprite, this.playerSprite.width/2, 0, true);

        // Init some enemies:
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        for (var i = 0; i < 10; i++) {
            this.enemies.create(
                this.game.rnd.integerInRange(1, this.game.width),
                this.game.rnd.integerInRange(1, this.game.height),
                this.polyHelp.createPolygon(i + 3)
            );
        }

    }

    update() {
        this.listenForUserInput();

        // Setup collision handlers:
        this.game.physics.arcade.overlap(this.weapon.bullets, this.enemies, this.enemyCollisionHandler, null, this);
        this.game.physics.arcade.collide(this.playerSprite, this.walls);
        this.game.physics.arcade.collide(this.enemies, this.walls);
        this.game.physics.arcade.collide(this.playerSprite, this.enemies);
        this.game.physics.arcade.collide(this.enemies, this.enemies);
    }

    render() {}

    levelUp() {
        this.level++;
        this.playerSprite.loadTexture(this.polyHelp.createPolygon(this.level, true));
    }

    enemyCollisionHandler(bullet, enemy) {
        // Explode the enemy:
        let emitter = this.game.add.emitter(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 600);
        emitter.makeParticles('inkBlot');
        emitter.start(true, 500, null, 10);
        this.game.add.sprite(enemy.x, enemy.y, 'inkBlot' + this.game.rnd.integerInRange(1, 6));

        // TODO: Use https://github.com/gorhill/Javascript-Voronoi to see
        // if breaking the polygon apart would look cool.

        enemy.destroy();
        this.levelUp();
    }

    listenForUserInput() {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.game.physics.arcade.accelerationFromRotation(
                this.playerSprite.rotation,
                200,
                this.playerSprite.body.acceleration
            );
        }
        else {
            this.playerSprite.body.acceleration.set(0);
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.playerSprite.body.angularVelocity = -300;
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.playerSprite.body.angularVelocity = 300;
        } else {
            this.playerSprite.body.angularVelocity = 0;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.weapon.fire();
        }
    }
}


export default CoreGame;
