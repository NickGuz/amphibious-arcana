import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import BossState from "../BossState";

/**
 * The Dead state for the player's FSM AI.
 */
export default class B2Dead extends BossState {
    // Trigger the player's death animation when we enter the dead state
    public onEnter(options: Record<string, any>): void {
        console.log("ENTERING DEAD");
        // this.owner.tweens.play("DEATH");
    }

    // Ignore all events from the rest of the game
    public handleInput(event: GameEvent): void {}

    // Empty update method - if the boss is dead, don't update anything
    public update(deltaT: number): void {}

    public onExit(): Record<string, any> {
        return {};
    }
}
