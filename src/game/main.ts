import { PlayePlugin } from "@playe/phaser-3";
import Phaser from "phaser";
import { PlayGame } from "./scenes/playGame";
import { PreloadAssets } from "./scenes/preloadAssets";
import { MainMenuScene } from "./scenes/mainScene";
import { EndGameScene } from "./scenes/end-game-scene";
import { WordleInstructionsScene } from "./scenes/rulesScene";

const scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    parent: "thegame",
    width: 700,
    height: 1244,

};

// game configuration object
const configObject: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0xc4d0a8,
    scale: scaleObject,
    dom: {
        createContainer: true,
    },
    scene: [PreloadAssets, WordleInstructionsScene, EndGameScene, MainMenuScene, PlayGame],
    plugins: {
        global: [
            {
                plugin: PlayePlugin,
                key: "playe",
                start: true,
                data: {
                    loadingSceneKey: "LoadingScene",
                    gameplaySceneKey: "PlayScene",
                },
            },
        ],
    },
};

const StartGame = () => {
    return new Phaser.Game(configObject);
};

export default StartGame;
