import Graphic from "../../Wolfie2D/Nodes/Graphic";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Tilemap from "../../Wolfie2D/Nodes/Tilemap";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import FactoryManager from "../../Wolfie2D/Scene/Factories/FactoryManager";
import AAAnimatedSprite from "../Nodes/AAAnimatedSprite";
import AALevel, { AALayer } from "../Scenes/AALevel";
import AACanvasNodeFactory from "./AACanvasNodeFactory";

/**
 * An extension of Wolfie2ds FactoryManager. I'm creating a more specific factory for my custom HW3Level. If you want to get custom
 * GameNodes into your scenes (with more specific properties) you'll have to extend the factory classes.
 */
export default class AAFactoryManager extends FactoryManager {

    private aaCanvasNodeFactory: AACanvasNodeFactory;

    public constructor(scene: AALevel, tilemaps: Tilemap[]) {
        super(scene, tilemaps)
        this.aaCanvasNodeFactory = new AACanvasNodeFactory();
        this.aaCanvasNodeFactory.init(scene);
    }

    public animatedSprite(key: string, layerName: AALayer): AAAnimatedSprite {
        return this.aaCanvasNodeFactory.addAnimatedSprite(key, layerName);
    }

    public uiElement(type: string, layerName: AALayer, options?: Record<string, any>): UIElement {
        return super.uiElement(type, layerName, options);
    }

    public graphic(type: string, layerName: AALayer, options?: Record<string, any>): Graphic {
        return super.graphic(type, layerName, options);
    }

    public sprite(key: string, layerName: AALayer): Sprite {
        return super.sprite(key, layerName);
    }
}