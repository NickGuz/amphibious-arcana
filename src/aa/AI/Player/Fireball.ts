import Particle from "../../../Wolfie2D/Nodes/Graphics/Particle";
import ParticleSystem from "../../../Wolfie2D/Rendering/Animations/ParticleSystem";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import RandUtils from "../../../Wolfie2D/Utils/RandUtils";
import { AAPhysicsGroups } from "../../AAPhysicsGroups";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

/**
 * The particle system used for the player's weapon
 */
export default class Fireball extends ParticleSystem {

    protected gravity: number;

    /**
     * The rotation (in radians) to apply to the velocity vector of the particles
     */
    protected _rotation: number = 0;
    public get rotation(): number { return this._rotation; }
    public set rotation(rotation: number) { this._rotation = rotation; }

    /**
     * @returns true if the particle system is running; false otherwise.
     */
    public isSystemRunning(): boolean { return this.systemRunning; }
    /**
     * 
     * @returns the particles in the pool of particles used in this particles system
     */
    public getPool(): Array<Particle> { return this.particlePool; }

    /**
     * Sets the animations for a particle in the player's weapon
     * @param particle the particle to give the animation to
     */
    public setParticleAnimation(particle: Particle) {
        // Give the particle a random velocity.
        //particle.vel = RandUtils.randVec(-32, 32, 100, 200);
        particle.vel = new Vec2(0, 300);
        // Rotate the particle's velocity vector
        particle.vel.rotateCCW(this._rotation);
        particle.color = Color.RED;

        // Give the particle tweens
        particle.tweens.add("active", {
            startDelay: 0,
            duration: this.lifetime,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_SINE
                }
            ]
        });
    }

    /**
     * Initializes this particle system in the given scene and layer
     * 
     * All particles in the particle system should have their physics group set to 
     * the HW4PhysicsGroup.PLAYER_WEAPON.
     * 
     * @param scene the scene
     * @param layer the layer in the scene
     */
    public initializePool(scene: Scene, layer: string) {
        super.initializePool(scene, layer);
        for (let i = 0; i < this.particlePool.length; i++) {
            // Set particle physics group to the player's weapon
            this.particlePool[i].setGroup(AAPhysicsGroups.FIREBALL);
        }

        // this.gravity = 500;
        this.gravity = 0;  // just disabling gravity for now
    }

    public update(deltaT: number) {
        super.update(deltaT);

        if (this.particlePool.length > 0 && this.isSystemRunning()) {
            let particle = this.particlePool[0];
            if (particle) {
                particle.vel.y += this.gravity*deltaT;
                particle.move(particle.vel.scaled(deltaT));
            }
        }
    }

}