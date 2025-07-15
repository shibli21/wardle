// KEYBOARD LETTER

import { PlayGame } from "./playGame";

// this class extends BitmapText class
export default class KeyboardLetter extends Phaser.GameObjects.Text {
    constructor(scene: PlayGame, x: number, y: number, text: string, size: number) {
        super(scene, x, y, text, { fontFamily: 'Pixelify Sans', fontSize: `${size}px`, color: '#ffffff' });
        scene.add.existing(this);
    }
}