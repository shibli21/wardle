export default class BigLetter extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, '', { fontFamily: 'Pixelify Sans', fontSize: '84px', color: '#ffffff' });

        // set registration point to center
        this.setOrigin(0.5);

        // add the letter to the scene
        scene.add.existing(this);
    }
}