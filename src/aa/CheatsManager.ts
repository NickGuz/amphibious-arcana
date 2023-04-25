import Input from "../Wolfie2D/Input/Input";
import SceneManager from "../Wolfie2D/Scene/SceneManager";
import { AAControls } from "./AAControls";
import Emitter from "../Wolfie2D/Events/Emitter";
import Level2 from "./Scenes/AALevel2";
import Level1 from "./Scenes/AALevel1";
import { AAEvents } from "./AAEvents";
import { GameEventType } from "../Wolfie2D/Events/GameEventType";
import Level5 from "./Scenes/AALevel5";
import ParticleSystemManager from "../Wolfie2D/Rendering/Animations/ParticleSystemManager";

export default class CheatsManager {

    protected emitter: Emitter;
    protected sceneManager: SceneManager;
    protected options: Record<string, any>;

    constructor(sceneManager: SceneManager, options: Record<string, any>) {
        this.sceneManager = sceneManager;
        this.options = options;
        this.emitter = new Emitter();
    }

    public update(deltaT: number): void {
        if (Input.isJustPressed(AAControls.GOTO_LEVEL_1)) {
            ParticleSystemManager.getInstance().clearParticleSystems();
            this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: this.options.levelMusicKey});
            this.sceneManager.changeToScene(Level1);
        }
        if (Input.isJustPressed(AAControls.GOTO_LEVEL_2)) {
            ParticleSystemManager.getInstance().clearParticleSystems();
            this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: this.options.levelMusicKey});
            this.sceneManager.changeToScene(Level2);
        }
        if (Input.isJustPressed(AAControls.GOTO_LEVEL_5)) {
            ParticleSystemManager.getInstance().clearParticleSystems();
            this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: this.options.levelMusicKey});
            this.sceneManager.changeToScene(Level5);
        }
        if (Input.isJustPressed(AAControls.TOGGLE_INVINCIBILITY)) {
            this.emitter.fireEvent(AAEvents.TOGGLE_INVINCIBILITY);
        }
        if (Input.isJustPressed(AAControls.PLAYER_KILL)) {
            this.emitter.fireEvent(AAEvents.KILL_PLAYER);
        }
    }

}