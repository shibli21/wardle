// THE GAME ITSELF

import { PlayePlugin } from '@playe/phaser-3';
import { GameGrid } from './gameGrid';
import { GameOptions } from './gameOptions';
import KeyboardKey from './keyboardKey';

// possible word states:
// perfect, when the letter is in the right position
// correct, when the letter exists but it's not in the right position
// wrong, when the letter does not exist
enum letterState {
    WRONG = 1,
    CORRECT,
    PERFECT
}

// keyboard layout, as a string array, each item is a row of keys
// > represents Enter
// < represents Backspace
const keyboardLayout: string[] = [
    'ABCDEFG',
    'HIJKLMN',
    'OPQRSTU',
    'VWXYZ<>'
];

// this class extends Scene class
export class PlayGame extends Phaser.Scene {
    words: string[];
    currentWord: string;
    wordToGuess: string;
    gameWidth: number;
    gameHeight: number;
    gameGrid: GameGrid;
    virtualKeyboard: KeyboardKey[][];
    retryText: Phaser.GameObjects.Text;


    // constructor
    constructor() {
        super({
            key: 'PlayGame'
        });
    }

    // method to be executed when the scene has been created
    create(): void {
        this.plugins.install('playe', PlayePlugin, true, "playe", {
            data: {
                loadingSceneKey: 'LoadingScene',
                gameplaySceneKey: 'PlayScene'
            }
        });

        const playe = this.plugins.get('playe') as PlayePlugin;

        playe.runWhenInitialized((playe) => {
            console.log('PlayeSDK has been initialized');
            playe.gameplayStart();
        });

        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;






        // Add background for the letter boxes section (top 2/3)
        this.add.rectangle(0, 0, this.gameWidth, this.gameHeight * 2 / 3, 0xC4D0A2).setOrigin(0);

        // Add background for the keyboard section (bottom 1/3)
        this.add.rectangle(0, this.gameHeight * 2 / 3, this.gameWidth, this.gameHeight / 3, 0x8B966E).setOrigin(0);


        this.add.text(this.gameWidth / 2, 70, 'WORDLE', {
            fontFamily: 'Pixelify Sans',
            fontSize: '100px',
            color: '#2E2E2E',
            align: 'center',
            strokeThickness: 1,
        }).setOrigin(0.5);

        this.words = this.cache.json.get('words');
        this.currentWord = '';
        this.wordToGuess = this.words[Phaser.Math.Between(0, this.words.length - 1)].toUpperCase();
        console.log(this.wordToGuess);

        // Add padding to the game grid
        const gridPadding = 20;
        const gridWidth = 540 + gridPadding * 2;
        const gridHeight = (110 * GameOptions.rows) + gridPadding * 2;
        const gridX = (this.gameWidth - gridWidth) / 2;
        const gridY = (this.gameHeight * 2 / 3 - gridHeight) / 2; // Center grid in top 2/3

        // Add the game grid with padding
        this.gameGrid = new GameGrid(this, GameOptions.rows, gridX + gridPadding, gridY + gridPadding);

        this.createKeyboard();

        this.createRetryButton();

    }


    createKeyboard(): void {
        // Initialize virtual keyboard
        this.virtualKeyboard = [];
        const keyboardY = this.gameHeight * 2 / 3 + 20; // Start the keyboard slightly below the 2/3 mark
        const keyboardHeight = this.gameHeight / 3 - 140; // Leave some space at the bottom

        keyboardLayout.forEach((row: string, index: number) => {
            this.virtualKeyboard[index] = [];
            const rowWidth: number = 60 * row.length;
            const firstKeyPosition: number = (this.gameWidth - rowWidth) / 2;

            for (let i: number = 0; i < row.length; i++) {
                const letter: string = row.charAt(i);
                const keyY = keyboardY + (keyboardHeight / 3) * index; // Distribute keys evenly in keyboard area
                this.virtualKeyboard[index][i] = new KeyboardKey(this, firstKeyPosition + i * 70 - 35, keyY, letter);
            }
        });

        this.input?.keyboard?.on('keydown', this.onKeyDown, this);
    }

    // method to process a key pressed
    onKeyDown(e: KeyboardEvent): void {

        // store key pressed in key variable
        const key: string = e.key;

        // if the key is space, restart the game
        if (key == ' ') {
            this.scene.start('PlayGame');
            return;
        }

        // backspace
        if (key == 'Backspace') {
            this.updateWord('<');
            return;
        }

        // regular expression saying "I want one letter"
        const regex = /^[a-zA-Z]{1}$/;

        // letter a-z or A-Z
        if (regex.test(key)) {
            this.updateWord(key);
            return;
        }

        // enter
        if (key == 'Enter') {
            this.updateWord('>');
        }
    }

    //method to be called each time we need to update a word
    updateWord(s: string): void {
        switch (s) {

            // backsace
            case '<':

                // if the word has at least one character, remove the last character
                if (this.currentWord.length > 0) {

                    // remove last current word character
                    this.currentWord = this.currentWord.slice(0, -1);

                    // call gameGrid's removeLetter method
                    this.gameGrid.removeLetter();
                }
                break;

            // enter
            case '>':
                if (this.currentWord.length == 5) {
                    if (this.words.includes(this.currentWord.toLowerCase())) {
                        const result: number[] = Array(5).fill(letterState.WRONG);
                        let tempWord: string = this.wordToGuess;

                        for (let i: number = 0; i < 5; i++) {
                            if (this.currentWord.charAt(i) == tempWord.charAt(i)) {
                                result[i] = letterState.PERFECT;
                                tempWord = this.removeChar(tempWord, i);
                            } else {
                                for (let j: number = 0; j < 5; j++) {
                                    if (this.currentWord.charAt(i) == this.wordToGuess.charAt(j) && this.currentWord.charAt(j) != this.wordToGuess.charAt(j)) {
                                        result[i] = letterState.CORRECT;
                                        tempWord = this.removeChar(tempWord, j);
                                        break;
                                    }
                                }
                            }
                        }

                        result.forEach((element: number, index: number) => {
                            const position: Phaser.Math.Vector2 = this.getLetterPosition(this.currentWord.charAt(index));
                            if (parseInt(this.virtualKeyboard[position.x][position.y].frame.name) < element) {
                                this.virtualKeyboard[position.x][position.y].setFrame(element);
                            }
                        });

                        const isCorrect = this.currentWord === this.wordToGuess;

                        if (this.gameGrid.currentRow === GameOptions.rows - 1) {
                            this.retryText.setVisible(true);
                        }

                        this.gameGrid.showResult(result, isCorrect);
                        this.currentWord = '';
                    }
                }
                break;

            // a-z or A-Z
            default:

                // if the word is less than 5 characters long, remove last character
                if (this.currentWord.length < 5) {

                    // add the letter
                    this.gameGrid.addLetter(s);

                    // update current word
                    this.currentWord += s.toUpperCase();

                }
        }
    }

    // method to get the position the virtual keyboard key, given a letter
    getLetterPosition(letter: string): Phaser.Math.Vector2 {

        // set row to zero
        let row: number = 0;

        // set column to zero
        let column: number = 0;

        // loop though all keyboardLayout array
        keyboardLayout.forEach((currentRow: string, index: number) => {

            // does current row include the letter?
            if (currentRow.includes(letter)) {

                // set row to index
                row = index;

                // set column to letter position inside current row
                column = currentRow.indexOf(letter);
            }
        })

        // return the coordinate as a 2D vector
        return new Phaser.Math.Vector2(row, column);
    }

    // simple method to change the index-th character of a string with '_'
    // just to have an unmatchable character
    removeChar(initialString: string, index: number): string {
        return initialString.substring(0, index) + '_' + initialString.substring(index + 1);
    }


    createRetryButton(): void {
        // Create retry text button and make it invisible initially
        this.retryText = this.add.text(this.gameWidth / 1.25, this.gameHeight / 1.7, 'Retry',
            {
                fontSize: '32px',
                color: '#1F1F1F',
                align: 'center',
                stroke: '#8A956D',
                strokeThickness: 2,
                padding: { x: 78, y: 20 },
            })
            .setOrigin(0.5)
            .setInteractive(
                { useHandCursor: true }
            )

            .on('pointerdown', () => this.scene.restart())
            .setVisible(false);
    }
}