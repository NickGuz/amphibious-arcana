import Input from "../../../../Wolfie2D/Input/Input";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import { AAControls } from "../../../AAControls";
import { PlayerAnimations, PlayerStates } from "../PlayerController";
import PlayerState from "./PlayerState";

export default class Fall extends PlayerState {

    onEnter(options: Record<string, any>): void {
        // If we're falling, the vertical velocity should be >= 0
        // commenting this out bc it was preventing the fireball jumps from working
        if (this.parent.velocity.y > 0) {
            this.parent.velocity.y = 0;
        }
        if(!this.owner.animation.isPlaying(PlayerAnimations.TAKING_DAMAGE) && !this.owner.animation.isPlaying(PlayerAnimations.JUMP_ATTACK)){
            this.owner.animation.playIfNotAlready(PlayerAnimations.FALL)
        }    
    } 

    update(deltaT: number): void {

        // If the player hits the ground, start idling and check if we should take damage
        if (this.owner.onGround) {
            // this.parent.health -= Math.floor(this.parent.velocity.y / 300);
            this.parent.health -= 0;  // remove fall damage
            
            if (Input.isPressed(AAControls.MOVE_LEFT) || Input.isPressed(AAControls.MOVE_RIGHT)) {
                this.parent.velocity.y = 0;
                this.finished(PlayerStates.RUN);
            } else {
                this.finished(PlayerStates.IDLE);
            }
        } 
        // Otherwise, keep moving
        else {
            // Get the movement direction from the player 
            let dir = this.parent.inputDir;

            if(!this.owner.animation.isPlaying(PlayerAnimations.TAKING_DAMAGE) && !this.owner.animation.isPlaying(PlayerAnimations.JUMP_ATTACK)){
                this.owner.animation.playIfNotAlready(PlayerAnimations.FALL)
            }

            // Update the horizontal velocity of the player
            if (this.parent.isFirejumpActive) {
                this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.2*this.parent.velocity.x;
            } else if(this.parent.isGrappleActive){
                this.parent.velocity.x += dir.x * this.parent.speed/3.5 - .1* this.parent.velocity.x;
                if (Input.isPressed(AAControls.MOVE_LEFT) || Input.isPressed(AAControls.MOVE_RIGHT)){
                    this.parent.isGrappleActive = false;
                }
            }else {
                this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x;
            }

            // Update the vertical velocity of the player
            
            if(Input.isPressed(AAControls.JUMP) && this.parent.velocity.y >= 0){
                this.parent.velocity.y += this.gravity*deltaT * 0.20;
            }else{
                this.parent.velocity.y += this.gravity*deltaT;
            }

            if (this.owner.onCeiling && this.parent.velocity.y < 0) this.parent.velocity.y = Math.min(-this.parent.velocity.y, 20);

            // Move the player
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }

    } 

    onExit(): Record<string, any> {
        this.parent.isFirejumpActive = false;
        this.parent.isGrappleActive = false;
        return {};
    }
}