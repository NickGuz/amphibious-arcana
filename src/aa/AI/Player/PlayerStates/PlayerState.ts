import StateMachineAI from "../../../../Wolfie2D/AI/StateMachineAI";
import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import AAAnimatedSprite from "../../../Nodes/AAAnimatedSprite";
import PlayerController from "../PlayerController";

/**
 * An abstract state for the PlayerController
 */
export default abstract class PlayerState extends State {
    protected parent: PlayerController;
    protected owner: AAAnimatedSprite;
    protected gravity: number;

    public constructor(parent: PlayerController, owner: AAAnimatedSprite) {
        super(parent);
        this.owner = owner;
        this.gravity = 500;
    }

    public abstract onEnter(options: Record<string, any>): void;

    /**
     * Handle game events from the parent.
     * @param event the game event
     */
    public handleInput(event: GameEvent): void {
        switch (event.type) {
            // Default - throw an error
            default: {
                throw new Error(`Unhandled event in PlayerState of type ${event.type}`);
            }
        }
    }

    public update(deltaT: number): void {
        const direction = this.parent.inputDir;
        const mousePos = this.parent.faceDir;

        if (direction.x !== 0) {
            this.owner.invertX = MathUtils.sign(direction.x) < 0;
        }
        if (mousePos.x !== 0 && Input.isMouseJustPressed()) {
            this.owner.invertX = MathUtils.sign(mousePos.x) < 0;
        }
    }

    public abstract onExit(): Record<string, any>;
}
