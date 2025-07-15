import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "../../../PROJECTS/warrdle-clone-phaser/src/game/PhaserGame";

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;
