import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";


// Layers for the level select scene
export const MenuLayers = {
    MAIN: "MAIN"
} as const;

export default class LevelSelect extends Scene {

    public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    public static readonly MUSIC_PATH = "hw4_assets/music/menu.mp3";

    public loadScene(): void {
        // Load the menu song
        // TODO keep audio from main menu
        //this.load.audio(LevelSelect.MUSIC_KEY, LevelSelect.MUSIC_PATH);
    }

    public startScene(): void {
        this.addUILayer(MenuLayers.MAIN);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        let yOffset = 80;
        const leftColX = size.x - 110;
        const rightColX = size.x + 110;
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        // Create title
        const title = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.MAIN, {
            position: new Vec2(size.x, size.y - 120), 
            text: "Amphibious Arcana"
        });

        // Create a back button
        const backBtn = this.createButton("Back", new Vec2(size.x, 2*size.y - 60));

        // Create the individual level buttons
        const level1Btn = this.createButton("Level 1", new Vec2(leftColX, size.y));
        const level2Btn = this.createButton("Level 2", new Vec2(rightColX, size.y));

        const level3Btn = this.createButton("Level 3", new Vec2(leftColX, size.y + yOffset));
        const level4Btn = this.createButton("Level 4", new Vec2(rightColX, size.y + yOffset));

        const level5Btn = this.createButton("Level 5", new Vec2(leftColX, size.y + yOffset*2));
        const level6Btn = this.createButton("Level 6", new Vec2(rightColX, size.y + yOffset*2));

        // When the play button is clicked, go to the next scene
        backBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
        }

        level1Btn.onClick = () => {
            // TODO
        }

        level2Btn.onClick = () => {
            // TODO
        }

        level3Btn.onClick = () => {
            // TODO
        }

        level4Btn.onClick = () => {
            // TODO
        }

        level5Btn.onClick = () => {
            // TODO
        }

        level6Btn.onClick = () => {
            // TODO
        }

        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: LevelSelect.MUSIC_KEY, loop: true, holdReference: true});
    }

    private createButton(text: String, pos: Vec2): Button {
        let btn = <Button>this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN, {position: pos, text: text});
        btn.backgroundColor = Color.TRANSPARENT;
        btn.borderColor = Color.WHITE;
        btn.borderRadius = 0;
        btn.setPadding(new Vec2(50, 10));
        btn.font = "PixelSimple";
        return btn;
    }

    public unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        // TODO probably only destroy this on level select, and not when going back to main menu
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: LevelSelect.MUSIC_KEY});
    }
}
