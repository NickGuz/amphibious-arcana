import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { AAEvents } from "../../../AAEvents";
import { MFStates } from "./BossStates";
import Receiver from "../../../../Wolfie2D/Events/Receiver";
import BossState from "./BossState";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import MindFlayerParticles from "../MindFlayerParticles";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

export default class MFAttack extends BossState {
    private receiver: Receiver;
    private weaponSystem: MindFlayerParticles;
    private dir: number;

    public onEnter(options: Record<string, any>): void {
        console.log("ENTERING ATTACK");
        this.parent.speed = this.parent.MIN_SPEED;

        this.parent.velocity.x = 0;
        this.parent.velocity.y = 0;
        this.dir = options.dir;
        this.weaponSystem = options.weaponSystem;

        this.attack();
        this.finished(MFStates.IDLE);

        this.receiver = new Receiver();
        this.receiver.subscribe(AAEvents.BOSS_KILLED);
    }

    public update(deltaT: number): void {
        super.update(deltaT);

        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    private attack(): void {
        if (this.owner.getScene().bossDead) {
            return;
        }
        this.owner.invertX = this.dir === 1 ? true : false;
        this.owner.animation.playIfNotAlready("CASTING_LEFT", false);

        this.weaponSystem.setDir(this.dir);
        this.weaponSystem.startSystem(1000, 0, this.owner.position);
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
            key: this.owner.getScene().getAttackAudioKey(),
            loop: false,
            holdReference: false,
        });
    }

    public handleEvent(event: GameEvent): void {
        switch (event.type) {
            case AAEvents.SPAWN_BOSS: {
                break;
            }
            case AAEvents.BOSS_KILLED: {
                this.finished(MFStates.DEAD);
                break;
            }
        }
    }

    public onExit(): Record<string, any> {
        return {
            dir: this.dir,
            started: true,
            weaponSystem: this.weaponSystem,
            prevState: MFStates.ATTACK,
        };
    }
}
