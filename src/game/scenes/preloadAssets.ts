import { PlayePlugin } from "@playe/phaser-3";
import Lottie, { AnimationItem } from "lottie-web";

export class PreloadAssets extends Phaser.Scene {
    private progressBar: Phaser.GameObjects.Graphics;
    private progressBox: Phaser.GameObjects.Graphics;
    private loadingText: Phaser.GameObjects.Text;
    private percentText: Phaser.GameObjects.Text;
    private assetText: Phaser.GameObjects.Text;
    private minLoadingTime: number;
    private loadingStartTime: number;
    private loadCompleteCalled: boolean;
    private lottieAnim: AnimationItem;

    constructor() {
        super('PreloadAssets');
        this.minLoadingTime = 3000; // 2 seconds
        this.loadCompleteCalled = false;
    }

    preload(): void {
        this.load.json('loaderAnimation', 'assets/animation/white.json');

        this.loadingStartTime = this.time.now;
        this.createProgressBar();


        // Add event listeners for loading progress
        this.load.on('progress', this.updateProgressBar, this);
        this.load.on('complete', this.checkMinLoadingTime, this);

        // Existing asset loading
        this.load.json('words', 'assets/words.json');

        this.load.spritesheet('key', 'assets/key.png', {
            frameWidth: 70,
            frameHeight: 90
        });
        this.load.spritesheet('bigkey', 'assets/bigkey.png', {
            frameWidth: 105,
            frameHeight: 90
        });
        this.load.spritesheet('box', 'assets/box.png', {
            frameWidth: 100,
            frameHeight: 100
        });

        this.load.bitmapFont('font', 'assets/font.png', 'assets/font.fnt');
        this.load.bitmapFont('bigfont', 'assets/bigfont.png', 'assets/bigfont.fnt');

        this.plugins.install('playe', PlayePlugin, true, "playe", {
            data: {
                loadingSceneKey: 'LoadingScene',
                gameplaySceneKey: 'PlayScene'
            }
        });
    }

    create(): void {
        const { width, height } = this.scale;

        // Create a DOM element for Lottie
        const lottieElement = document.createElement('div');
        lottieElement.style.width = width / 2 + 'px';
        lottieElement.style.height = height / 2 + 'px';
        lottieElement.style.position = 'absolute';
        lottieElement.style.left = '50%';
        lottieElement.style.top = '50%';
        lottieElement.style.transform = 'translate(-50%, -50%)';

        this.add.dom(0, 0, lottieElement);

        // Load and play Lottie animation
        const animationData = this.cache.json.get('loaderAnimation');
        this.lottieAnim = Lottie.loadAnimation({
            container: lottieElement,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData
        });
    }

    private createProgressBar(): void {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(width / 4, height / 1.2 - 30, width / 2, 50);

        this.loadingText = this.make.text({
            x: width / 2,
            y: height / 1.2 - 60,
            text: 'Loading...',
            style: {
                font: '24px monospace',
                color: '#2e2e2e'
            }
        });
        this.loadingText.setOrigin(0.5, 0.5);

        this.percentText = this.make.text({
            x: width / 2,
            y: height / 1.2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                color: '#ffffff'
            }
        });
        this.percentText.setOrigin(0.5, 0.5);

        this.assetText = this.make.text({
            x: width / 2,
            y: height / 1.2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                color: '#ffffff'
            }
        });
        this.assetText.setOrigin(0.5, 0.5);
    }

    private updateProgressBar(value: number): void {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        if (value < 1 || this.loadCompleteCalled) {
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(width / 4 + 10, height / 1.2 - 20, (width / 2 - 20) * value, 30);
            this.percentText.setText(`${Math.min(99, parseInt((value * 100).toString()))}%`);
        }
    }

    private checkMinLoadingTime(): void {
        const elapsedTime = this.time.now - this.loadingStartTime;
        if (elapsedTime < this.minLoadingTime) {
            this.time.delayedCall(this.minLoadingTime - elapsedTime, this.loadComplete, [], this);
        } else {
            this.loadComplete();
        }
    }

    private loadComplete(): void {
        this.loadCompleteCalled = true;

        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(this.cameras.main.width / 4 + 10, this.cameras.main.height / 1.2 - 20, this.cameras.main.width / 2 - 20, 30);
        this.percentText.setText('100%');

        // this.progressBar.destroy();
        // this.progressBox.destroy();
        this.loadingText.destroy();
        this.assetText.destroy();




        if (this.lottieAnim) {
            this.lottieAnim.destroy();
        }
        this.scene.start('MainMenuScene');
    }
}
