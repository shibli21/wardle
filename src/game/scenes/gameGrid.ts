// GAME GRID

import BigLetterBox from './bigLetterBox';

export class GameGrid {
    currentRow: number;
    currentColumn: number;
    letterBox: BigLetterBox[][];
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, rows: number, firstRowX: number, firstRowY: number) {
        this.scene = scene;
        this.currentRow = 0;
        this.currentColumn = 0;
        this.letterBox = [];

        for (let i: number = 0; i < 5; i++) {
            this.letterBox[i] = [];
            for (let j: number = 0; j < rows; j++) {
                this.letterBox[i][j] = new BigLetterBox(scene, firstRowX + i * 110, firstRowY + j * 110);
            }
        }
    }

    addLetter(letter: string): void {
        this.letterBox[this.currentColumn][this.currentRow].setLetter(letter);
        this.currentColumn++;
    }

    removeLetter(): void {
        this.currentColumn--;
        this.letterBox[this.currentColumn][this.currentRow].setLetter('');
    }

    showResult(result: number[], isCorrect: boolean): void {
        const duration = 300;
        const delay = 100;

        result.forEach((element: number, index: number) => {
            const letterBox = this.letterBox[index][this.currentRow];

            this.scene.tweens.add({
                targets: letterBox,
                scaleY: 0,
                duration: duration / 2,
                delay: index * delay,
                onComplete: () => {
                    letterBox.setFrame(element);
                    letterBox.letterToShow.setTint(0xc4d0a8);

                    this.scene.tweens.add({
                        targets: letterBox,
                        scaleY: 1,
                        duration: duration / 2,
                        onComplete: () => {
                            if (isCorrect && index === 4) {
                                this.bounceAnimation();
                            }
                        }
                    });
                }
            });
        });

        this.currentRow++;
        this.currentColumn = 0;
    }

    private bounceAnimation(): void {
        const duration = 100;
        const delay = 50;

        for (let i = 0; i < 5; i++) {
            const letterBox = this.letterBox[i][this.currentRow - 1];

            this.scene.tweens.add({
                targets: letterBox,
                y: '-=20',
                duration: duration,
                delay: i * delay,
                yoyo: true,
                ease: 'Bounce.easeOut',
                onComplete: () => {
                    this.scene.time.delayedCall(500, () => {
                        this.scene.scene.start('EndGameScene');
                    });
                }
            });
        }
    }
}