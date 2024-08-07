import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

// Layers for the controls scene
export const MenuLayers = {
    MAIN: "MAIN",
} as const;

export default class HelpScene extends Scene {
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
        const size = this.viewport.getHalfSize();
        let sizeY = size.y - 150;
        const yOffset = 20;
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        // Create title
        const title = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.MAIN, {
            position: new Vec2(size.x, size.y - 200),
            text: "Amphibious Arcana",
        });

        // Create info text
        let i = 1;
        this.createLabel(
            "Developed by Facundo Lopez Camino, Andrew Guo, and Nick Guzzardo",
            new Vec2(size.x, sizeY)
        );
        this.createLabel(
            "Art by Mia Nelson Zelaya",
            new Vec2(size.x, sizeY+ yOffset * i++)
        );
        this.createLabel(
            "Wolfie2D created by Joe Weaver and Richard McKenna",
            new Vec2(size.x, sizeY + yOffset * i++)
        );
        sizeY += 30;
        this.createLabel(
            `Gareth the Great is a wizard. He lives in a village full of other wizards.`,
            new Vec2(size.x, sizeY + yOffset * i++)
        );
        this.createLabel(
            `One night, an evil wizard launches a surprise attack on the village.`,
            new Vec2(size.x, sizeY + yOffset * i++)
        );
        this.createLabel(
            `The evil wizard steals the power of all the wizards and turns them into frogs.`,
            new Vec2(size.x, sizeY + yOffset * i++)
        );
        this.createLabel(
            `Gareth is the only one that is still strong enough to travel long distances.`,
            new Vec2(size.x, sizeY + yOffset * i++)
        );
        this.createLabel(
            `He vows to track down the evil wizard and take back the powers of the `,
            new Vec2(size.x, sizeY + yOffset * i++)
        );
        this.createLabel(`wizards in his village.`, new Vec2(size.x, sizeY + yOffset * i++));
        sizeY += 30;

        // Create cheat codes text
        this.createLabel("Cheat Codes", new Vec2(size.x, sizeY + yOffset * i++), 26);
        sizeY += 15;
        this.createLabel(
            "- Enter to enable use of cheats on the current level",
            new Vec2(size.x, sizeY + yOffset * i++)
        );
        this.createLabel(
            "- Numbers 4-0 to go to levels 0-6 respectively",
            new Vec2(size.x, sizeY + yOffset * i++)
        );
        this.createLabel(
            "- Shift to go to boss fight if there is one",
            new Vec2(size.x, sizeY + yOffset * i++)
        );
        this.createLabel("- I to enable invincibility", new Vec2(size.x, sizeY + yOffset * i++));
        this.createLabel("- K to kill the player", new Vec2(size.x, sizeY + yOffset * i++));
        this.createLabel("- L to unlock all spells", new Vec2(size.x, sizeY + yOffset * i++));
        // this.createLabel("- P gives you low health", new Vec2(size.x, sizeY + yOffset*i++));
        // this.createLabel("- O enables always full charged spells", new Vec2(size.x, sizeY + yOffset*i++));

        // Create a back button
        const backBtn = this.createButton("Back", new Vec2(size.x, 2 * size.y - 60));

        // When the play button is clicked, go to the next scene
        backBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu);
        };

        // Scene has started, so start playing music
        // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: HelpScene.MUSIC_KEY, loop: true, holdReference: true});
    }

    private createLabel(text: string, pos: Vec2, size?: number): void {
        this.add.uiElement(UIElementType.LABEL, MenuLayers.MAIN, {
            position: pos,
            text: text,
            fontSize: size || 18,
        });
    }

    private createButton(text: string, pos: Vec2): Button {
        const btn = <Button>(
            this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN, { position: pos, text: text })
        );
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
        // this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: HelpScene.MUSIC_KEY});
    }
}
