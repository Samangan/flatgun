import _ from 'underscore';

// TODO:
// * Having a level would be fun. (A simple 2d death match arena so players can hide behind walls and pillars and such)
// * Make a unique weapon per level.

class CoreGame extends Phaser.State {
    preload () {
        this.game.load.image('bullet', 'assets/sprites/bullet01.png');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.n = 2;
        this.playerSprite = this.game.add.sprite(300, 300, this.createPolygon(this.n, true));
        this.game.physics.enable(this.playerSprite, Phaser.Physics.ARCADE);
        this.playerSprite.anchor.set(0.5);
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
            var c = {x: 100 * i + 50, y: 50};
            this.enemies.create(c.x, c.y, this.createPolygon(i + 3));
        }
    }

    update() {
        this.listenForUserInput();

        // Setup collision handlers:
        this.game.physics.arcade.overlap(this.weapon.bullets, this.enemies, this.enemyCollisionHandler, null, this);
    }

    render() {
    }

    levelUp() {
        this.n++;
        this.playerSprite.loadTexture(this.createPolygon(this.n, true));
    }

    enemyCollisionHandler(bullet, enemy) {
        // TODO: Make a cool death animation and explosion and shit.
        enemy.destroy();
        this.levelUp();
    }

    createPolygon(n, isPlayer) {
        let bitmapDataWidth = 60;
        let radius = bitmapDataWidth / 2;
        let vertices = this.generateNGon({x: bitmapDataWidth / 2, y: bitmapDataWidth / 2}, radius, n);
        let p = new Phaser.Polygon(vertices);

        let bmd = this.game.add.bitmapData(bitmapDataWidth, bitmapDataWidth);

        for (let i = 0; i < p.points.length; i++) {
            let p1 = p.points[i];
            let p2 = p.points[(i+1) % p.points.length];
            bmd.line(p1.x, p1.y, p2.x, p2.y, isPlayer ? 'green': 'red', 3);
        }
        return bmd;
    }

    generateNGon(center, radius, numSides) {
        var thetaDelta = (2 * Math.PI)/numSides;
        var theta = thetaDelta;
        var points = [];

        for (var n = 0; n < numSides; n++) {
            var x = center.x + radius * Math.cos(theta);
            var y = center.y - radius * Math.sin(theta);
            points.push({x: x, y: y});
            theta += thetaDelta;
        }
        return points;
    }

    listenForUserInput() {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.game.physics.arcade.accelerationFromRotation(
                this.playerSprite.rotation, 200, this.playerSprite.body.acceleration
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
