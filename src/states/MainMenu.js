import _ from 'underscore';
import PolyHelper from '../util/PolyHelper';


class MainMenu extends Phaser.State {
    preload() {
        this.game.load.image('paper', 'assets/sprites/paper.png');
        this.game.load.image('title', 'assets/sprites/title.png');
        this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    }

    create() {
        this.paper = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'paper');

        this.title = this.game.add.sprite(90, 40, 'title');
        this.title.scale.setTo(0.9, 0.9);

        let style = { font: '40px', fill: 'black', wordWrap: false, align: 'center'};

        let play = this.game.add.text(150, 300, 'Play', style);
        let levelEditor  = this.game.add.text(150, 400, 'Level Editor', style);


        this.makeTextLink(play, 'coreGame');
        this.makeTextLink(levelEditor, 'levelEditor');
    }

    update() {}

    render() {}

    makeTextLink(text, nextState) {
        text.inputEnabled = true;
        text.events.onInputOver.add(() => {
            text.fill = 'white';
        });
        text.events.onInputOut.add(() => {
            text.fill = 'black';
        });
        text.events.onInputDown.add(() => {
            this.game.state.start(nextState);
        });
    }
}



export default MainMenu;
