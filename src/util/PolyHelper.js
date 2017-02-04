
class PolyHelper {
    constructor(game, phaser) {
        this.game = game;
        this.phaser = phaser;
    }

    createPolygon(n) {
        let bitmapDataWidth = 60;
        let radius = bitmapDataWidth / 2;
        let vertices = this.generateNGon({x: bitmapDataWidth / 2, y: bitmapDataWidth / 2}, radius, n);
        let bmd = this.game.add.bitmapData(bitmapDataWidth, bitmapDataWidth);
 
        for (let i = 0; i < vertices.length; i++) {
            let p1 = vertices[i];
            let p2 = vertices[(i + 1) % vertices.length];
            let line = new this.phaser.Line(p1.x, p1.y, p2.x, p2.y);
            bmd.textureLine(line, 'line', 'repeat-x');
        }
        return bmd;
    }

    generateNGon(center, radius, numSides) {
        var thetaDelta = (2 * Math.PI)/numSides;
        var theta = thetaDelta;
        var points = [];

        for (let n = 0; n < numSides; n++) {
            var x = center.x + radius * Math.cos(theta);
            var y = center.y - radius * Math.sin(theta);
            points.push({x: x, y: y});
            theta += thetaDelta;
        }
        return points;
    }
}

export default PolyHelper;
