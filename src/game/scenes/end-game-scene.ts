import { PlayePlugin } from '@playe/phaser-3';
import Phaser from 'phaser';

export class EndGameScene extends Phaser.Scene {
    constructor() {
        super('EndGameScene');
    }

    preload() {
        // Load the email input box
        this.load.html('email-input', 'html/email-input.html');
    }

    create() {
        const { width, height } = this.scale;

        this.add.rectangle(0, 0, width, height, 0x1F1F1F).setOrigin(0);

        this.add.text(width / 2, 200, 'Thanks for playing', {
            fontFamily: 'Pixelify Sans',
            fontSize: '64px',
            color: '#ffffff',
            align: 'center',
        }).setOrigin(0.5);

        this.add.text(width / 2, 300, 'Enter your email  below and we will notify', {
            fontFamily: 'Pixelify Sans',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center',
        }).setOrigin(0.5);

        this.add.text(width / 2, 330, 'you when the competition closes', {
            fontFamily: 'Pixelify Sans',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center',
        }).setOrigin(0.5);

        // Create the input box for email
        const inputBox = this.add.dom(490, 450)
            .createFromCache('email-input')
            .setOrigin(1);

        // Create the "Submit" button
        const submitButton = this.add.text(width / 2, 520, 'Submit', {
            fontFamily: 'Pixelify Sans',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center',
            backgroundColor: '#8A956D',
            padding: { x: 100, y: 20 },
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.handleSubmit(inputBox, submitButton);
            });

        this.add.text(width / 2, 600, 'Play again', {
            fontFamily: 'Pixelify Sans',
            fontSize: '32px',
            color: '#1F1F1F',
            align: 'center',
            backgroundColor: '#C4D0A2',
            padding: { x: 78, y: 20 },
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('PlayGame');
            });
    }

    handleSubmit(inputBox: Phaser.GameObjects.DOMElement, submitButton: Phaser.GameObjects.Text) {
        const email = (inputBox.getChildByName('email') as HTMLInputElement).value;

        const playe = this.plugins.get('playe') as PlayePlugin;
        playe.gamePlayFinish(1, email);

        // Remove the input box and submit button
        inputBox.destroy();
        submitButton.destroy();

        // Display a message indicating that the email has been submitted
        this.add.text(this.scale.width / 2, 450, 'Email submitted successfully!', {
            fontFamily: 'Pixelify Sans',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center',
        }).setOrigin(0.5);
    }
}
