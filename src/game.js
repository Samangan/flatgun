import 'pixi';
import 'p2';

import Phaser from 'phaser';
import CoreGame from './states/CoreGame';
import LevelEditor from './states/LevelEditor';
import MainMenu from './states/MainMenu';

class Game extends Phaser.Game {
    constructor() {
        let width = 1024;
        let height = 768;

        super(width, height, Phaser.AUTO, 'content');
        this.state.add('coreGame', CoreGame, false);
        this.state.add('levelEditor', LevelEditor, false);
        this.state.add('mainMenu', MainMenu, false);

        // TODO: Add loading screen.
        this.state.start('mainMenu');
    }
}

window.game = new Game();

// Init google webfont:
window.WebFontConfig = {
    active: function() { window.game.time.events.add(Phaser.Timer.SECOND, () => {}, this); },
    google: {
        families: ['Homemade Apple']
    }
};

// Override space and arrow keys:
window.addEventListener('keydown', function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
