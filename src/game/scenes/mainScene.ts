export class MainMenuScene extends Phaser.Scene {
    gameWidth: number;
    gameHeight: number;
    constructor() {
        super('MainMenuScene');
    }

    preload() {
        // Load any assets needed for the main menu
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;


        // Add background color to the scene to the full screen
        this.add.rectangle(0, 0, this.gameWidth, this.gameHeight, 0x1F1F1F).setOrigin(0);




        this.add.rectangle(80, 80, this.gameWidth - 160, 250, 0xC4D0A2)
            .setOrigin(0)
            .setStrokeStyle(2, 0x000000);

        this.add.rectangle(100, 100, this.gameWidth - 200, 210, 0xC4D0A2).setOrigin(0)
            .setStrokeStyle(8, 0x8A956D);

        this.add.text(120, 140, 'WORDLE', {
            fontFamily: 'Pixelify Sans',
            fontSize: '126px',
            color: '#2E2E2E',
            align: 'center',
            strokeThickness: 1,
        });



        this.add.rectangle(80, 380, this.gameWidth - 160, 160, 0xC4D0A2)
            .setOrigin(0)
            .setStrokeStyle(2, 0x000000);

        this.add.rectangle(100, 400, this.gameWidth - 200, 120, 0xC4D0A2)
            .setOrigin(0)
            .setStrokeStyle(8, 0x8A956D);


        this.add.text(
            130, 420,
            '> PLAY', {
            fontFamily: 'Pixelify Sans',
            fontSize: '62px',
            color: '#1F1F1F',
            stroke: '#1F1F1F',
            strokeThickness: 4,
        }).setOrigin(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('PlayGame'));

        this.add.rectangle(230, 500, 200, 8, 0x2E2E2E)

        // Add About button
        const aboutButton = this.add.text(360, 420, 'RULES', {
            fontFamily: 'Pixelify Sans',
            fontSize: '62px',
            color: '#1F1F1F',
            stroke: '#1F1F1F',
            strokeThickness: 4,
        });
        aboutButton.setOrigin(0);
        aboutButton.setInteractive({ useHandCursor: true });
        aboutButton.on('pointerdown', () => this.scene.start('WordleInstructions'));
    }
}