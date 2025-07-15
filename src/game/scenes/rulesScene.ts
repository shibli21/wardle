import Phaser from 'phaser';

export class WordleInstructionsScene extends Phaser.Scene {
    constructor() {
        super('WordleInstructions');
    }

    preload() {
    }

    create() {
        const { width, height } = this.scale;

        // Background
        this.add.rectangle(0, 0, width, height, 0xC4D0A2).setOrigin(0);

        // Title
        this.add.text(width / 2, 100, 'How To Play', {
            fontFamily: 'Pixelify Sans',
            fontSize: '62px',
            color: '#2E2E2E'
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(width / 2, 150, 'Guess the Wordle in 5 tries.', {
            fontFamily: 'Pixelify Sans',
            fontSize: '40px',
            color: '#2E2E2E'
        }).setOrigin(0.5);

        // Instructions
        const instructions = [
            'Each guess must be a valid 5-letter word.',
            'The color of the tiles will change to show how close your guess was to the word.'
        ];

        instructions.forEach((instruction, index) => {
            this.add.text(50, 200 + index * 40, '•', {
                fontFamily: 'Pixelify Sans',
                fontSize: '64px',
                color: '#2E2E2E'
            });
            this.add.text(80, 220 + index * 40, instruction, {
                fontFamily: 'Pixelify Sans',
                fontSize: '24px',
                color: '#2E2E2E',
                wordWrap: { width: width - 120 }
            });
        });

        // Examples title
        this.add.text(50, 410, 'Examples', {
            fontFamily: 'Pixelify Sans',
            fontSize: '30px',
            color: '#2E2E2E'
        });

        // Example words
        this.createWordExample('WEARY', 500, 0);
        this.createWordExample('PILLS', 650, 1);
        this.createWordExample('VAGUE', 800, 2);

        // Example explanations
        this.add.text(50, 550, 'W   is in the word and in the correct spot.', {
            fontFamily: 'Pixelify Sans',
            fontSize: '24px',
            color: '#2E2E2E'
        });
        this.add.text(50, 700, 'I   is in the word but in the wrong spot.', {
            fontFamily: 'Pixelify Sans',
            fontSize: '24px',
            color: '#2E2E2E'
        });
        this.add.text(50, 850, 'U   is not in the word in any spot.', {
            fontFamily: 'Pixelify Sans',
            fontSize: '24px',
            color: '#2E2E2E'
        });



        // Back button
        this.add.text(width / 2, height - 100, 'Back', {
            fontFamily: 'Pixelify Sans',
            fontSize: '40px',
            color: '#2E2E2E'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });


    }

    createWordExample(word: string, y: number, type: number) {
        const colors = [0x1F1F1F, 0x4E533C, 0x8A956D]; // Green, Yellow, Gray
        const letterWidth = 60;
        const padding = 5;

        word.split('').forEach((letter: string | string[], index: number) => {
            const x = 80 + index * (letterWidth + padding);
            const color = type === 0 && index === 0 ? colors[0] :
                type === 1 && index === 1 ? colors[1] : colors[2];

            this.add.rectangle(x, y, letterWidth, letterWidth, color);
            this.add.text(x, y, letter, {
                fontFamily: 'Pixelify Sans',
                fontSize: '40px',
                color: '#C4D0A2'
            }).setOrigin(0.5);
        });
    }
}

