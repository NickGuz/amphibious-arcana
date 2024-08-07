import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AALevel, { AALayers } from "./AALevel";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import { AAPhysicsGroups } from "../AAPhysicsGroups";
import { AAEvents } from "../AAEvents";
import ScabberBehavior from "../AI/NPC/NPCBehaviors/ScabberBehavior";
import HealthbarHUD from "../GameSystems/HUD/HealthbarHUD";
import CheatsManager from "../CheatsManager";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import Level6 from "./AALevel6";
import RangedEnemyBehavior from "../AI/NPC/NPCBehaviors/RangedEnemyBehavior";
import Level0 from "./AALevel0";
import RangedEnemyParticles from "../AI/NPC/RangedEnemyParticles";

/**
 * The first level for HW4 - should be the one with the grass and the clouds.
 */
export default class Level5 extends AALevel {
    public static readonly PLAYER_SPAWN = new Vec2(50, 630);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Frog.json";

    public static readonly TILEMAP_KEY = "LEVEL1";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/AALevel5.json";
    public static readonly TILEMAP_SCALE = new Vec2(2, 2);
    public static readonly COLLIDABLE_LAYER_KEY = "Collidable";
    public static readonly TONGUE_COLLIDABLE_LAYER_KEY = "TongueCollidable";
    public static readonly WALLS_LAYER_KEY = "Main";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "hw4_assets/music/dark_level_music.wav";

    public static readonly BACKGROUND_KEY = "BACKGROUND";
    public static readonly BACKGROUND_PATH = "hw4_assets/images/Castle.png";

    public static readonly LEVEL_END = new AABB(new Vec2(1400, 232), new Vec2(24, 16));

    protected rangedEnemyParticleSystem: RangedEnemyParticles;

    protected cheatsManager: CheatsManager;

    public constructor(
        viewport: Viewport,
        sceneManager: SceneManager,
        renderingManager: RenderingManager,
        options: Record<string, any>
    ) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level5.TILEMAP_KEY;
        this.tilemapScale = Level5.TILEMAP_SCALE;
        this.collidableLayerKey = Level5.COLLIDABLE_LAYER_KEY;
        this.tongueCollidableLayerKey = Level5.TONGUE_COLLIDABLE_LAYER_KEY;
        this.wallsLayerKey = Level5.WALLS_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level0.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level5.PLAYER_SPAWN;
        // Set the key for the spells sprite

        // Music and sound
        this.levelMusicKey = Level5.LEVEL_MUSIC_KEY;
        this.jumpAudioKey = Level0.JUMP_AUDIO_KEY;
        this.attackAudioKey = Level0.ATTACK_AUDIO_KEY;
        this.healAudioKey = Level0.HEAL_AUDIO_KEY;
        this.hurtAudioKey = Level0.HURT_AUDIO_KEY;
        this.explodeAudioKey = Level0.EXPLODE_AUDIO_KEY;
        this.grappleAudioKey = Level0.GRAPPLE_AUDIO_KEY;
        this.enemyDeathAudioKey = Level0.ENEMY_DEATH_AUDIO_KEY;
        this.playerDeathAudioKey = Level0.PLAYER_DEATH_AUDIO_KEY;
        this.backgroundKey = Level5.BACKGROUND_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(736, 24).mult(this.tilemapScale);

        // made bigger for testing
        this.levelEndHalfSize = new Vec2(16, 32).mult(this.tilemapScale);

        // Initialize cheats
        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager = new CheatsManager(this.sceneManager, {
            levelMusicKey: this.levelMusicKey,
            bossMusicKey: this.bossMusicKey,
        });
        this.currLevel = Level5;

        // Setup bg stuff
        this.bgScale = new Vec2(7.0, 7.0);
        this.bgOffset = new Vec2(120, 80).mult(this.tilemapScale);
        this.bgMovementScale = 0.7;
        this.bgMovementScaleY = 0.7;
    }

    public initializeUI(): void {
        super.initializeUI();

        const size = this.viewport.getHalfSize();

        this.guideText.position = new Vec2(100, 587);
        this.guideText.size.set(655, 150);
    }

    /**
     * Load in our resources for level 1
     */
    public loadScene(): void {
        // Load the tongue shader
        super.loadScene();
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level5.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.spritesheet(this.playerSpriteKey, Level5.PLAYER_SPRITE_PATH);

        // Load in the enemy sprites
        this.load.spritesheet("Scabbers", "hw4_assets/spritesheets/scabbers2.json");
        this.load.spritesheet("Ultroloth", "hw4_assets/spritesheets/ultroloth.json");

        this.load.spritesheet("Guide", "hw4_assets/spritesheets/traveler.json");

        this.load.image(this.backgroundKey, Level5.BACKGROUND_PATH);

        // Audio and music
        this.load.audio(this.levelMusicKey, Level5.LEVEL_MUSIC_PATH);
    }

    /**
     * Unload resources for level 1 - decide what to keep
     */
    public unloadScene(): void {
        this.load.keepSpritesheet(this.playerSpriteKey);

        // this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.attackAudioKey);
        this.load.keepAudio(this.healAudioKey);
        this.load.keepAudio(this.hurtAudioKey);
        this.load.keepAudio(this.explodeAudioKey);
        this.load.keepAudio(this.grappleAudioKey);
        this.load.keepAudio(this.enemyDeathAudioKey);
        this.load.keepAudio(this.playerDeathAudioKey);

        this.load.keepImage("fireIcon");
        this.load.keepImage("tongueIcon");
        this.load.keepImage("iceIcon");
        this.load.keepImage("lockIcon");
    }

    public startScene(): void {
        super.startScene();
        // Set the next level to be Level6
        this.nextLevel = Level6;
        this.nextLevelNum = 6;

        this.initializeNPCs();
    }

    protected initializeNPCs(): void {
        const melee = [
            // new Vec2(136, 640),
            new Vec2(184, 288),
            new Vec2(248, 384),
            new Vec2(1120, 368),
            new Vec2(488, 288),
            new Vec2(860, 512),
            new Vec2(1442, 640),
            new Vec2(1556, 432),
            new Vec2(1556, 256),
        ];
        const ranged = [
            new Vec2(140, 64),
            new Vec2(329, 640),
            new Vec2(1024, 640),
            new Vec2(625, 640),
            new Vec2(1416, 640),
            new Vec2(1335, 368),
            new Vec2(712, 240),
            new Vec2(1090, 640),
        ];
        melee.forEach((l) => {
            const scabbers = this.add.animatedSprite("Scabbers", AALayers.PRIMARY);
            scabbers.scale.scale(0.25);
            scabbers.position.set(l.x, l.y);
            scabbers.addPhysics();
            scabbers.setGroup(AAPhysicsGroups.ENEMY);
            scabbers.setTrigger(AAPhysicsGroups.FIREBALL, AAEvents.FIREBALL_HIT_ENEMY, null);
            scabbers.setTrigger(AAPhysicsGroups.ICE_PARTICLE, AAEvents.ICEBALL_HIT_ENEMY, null);
            scabbers.setTrigger(AAPhysicsGroups.TONGUE, AAEvents.TONGUE_HIT_ENEMY, null);

            scabbers.health = 3;
            scabbers.maxHealth = 3;
            const healthbar = new HealthbarHUD(this, scabbers, AALayers.PRIMARY, {
                size: scabbers.size.clone().scaled(1.5, 0.25),
                offset: scabbers.size.clone().scaled(0, -1 / 5),
            });
            this.healthbars.set(scabbers.id, healthbar);
            scabbers.animation.play("IDLE");
            scabbers.addAI(ScabberBehavior, { player: this.player, tilemap: "Collidable" }); // add particles here
            this.allNPCS.set(scabbers.id, scabbers);

            scabbers.tweens.add("DEATH", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: "rotation",
                        start: 0,
                        end: Math.PI,
                        ease: EaseFunctionType.IN_OUT_QUAD,
                    },
                    {
                        property: "alpha",
                        start: 1,
                        end: 0,
                        ease: EaseFunctionType.IN_OUT_QUAD,
                    },
                ],
                onEnd: [AAEvents.NPC_KILLED],
            });

            const guide = this.add.animatedSprite("Guide", AALayers.GUIDE);
            guide.scale.scale(0.3);
            guide.position.set(100, 637);
            guide.addPhysics(null, null, false);
            guide.setGroup(AAPhysicsGroups.TUTORIAL);
            guide.setTrigger(AAPhysicsGroups.PLAYER, "GUIDE", null);

            guide.animation.play("IDLE");
            this.allNPCS.set(guide.id, guide);
        });
        ranged.forEach((l) => {
            this.rangedEnemyParticleSystem = new RangedEnemyParticles(1, Vec2.ZERO, 1000, 3, 10, 1);
            this.rangedEnemyParticleSystem.initializePool(this, AALayers.PRIMARY);
            const particles = this.rangedEnemyParticleSystem.getPool();
            particles.forEach((particle) => this.allNPCS.set(particle.id, particle));

            const ultroloth = this.add.animatedSprite("Ultroloth", AALayers.PRIMARY);
            ultroloth.scale.scale(0.25);
            ultroloth.position.set(l.x, l.y);
            ultroloth.addPhysics();
            ultroloth.setGroup(AAPhysicsGroups.ENEMY);
            ultroloth.setTrigger(AAPhysicsGroups.FIREBALL, AAEvents.FIREBALL_HIT_ENEMY, null);
            ultroloth.setTrigger(AAPhysicsGroups.ICE_PARTICLE, AAEvents.ICEBALL_HIT_ENEMY, null);
            ultroloth.setTrigger(AAPhysicsGroups.TONGUE, AAEvents.TONGUE_HIT_ENEMY, null);

            ultroloth.health = 3;
            ultroloth.maxHealth = 3;

            const healthbar = new HealthbarHUD(this, ultroloth, AALayers.PRIMARY, {
                size: ultroloth.size.clone().scaled(1, 0.15),
                offset: ultroloth.size.clone().scaled(0, -1 / 5),
            });
            this.healthbars.set(ultroloth.id, healthbar);
            ultroloth.animation.play("IDLE");
            ultroloth.addAI(RangedEnemyBehavior, {
                player: this.player,
                particles: this.rangedEnemyParticleSystem,
                tilemap: "Collidable",
            });
            this.allNPCS.set(ultroloth.id, ultroloth);

            ultroloth.tweens.add("DEATH", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: "rotation",
                        start: 0,
                        end: Math.PI,
                        ease: EaseFunctionType.IN_OUT_QUAD,
                    },
                    {
                        property: "alpha",
                        start: 1,
                        end: 0,
                        ease: EaseFunctionType.IN_OUT_QUAD,
                    },
                ],
                onEnd: [AAEvents.NPC_KILLED],
            });
        });
    }

    public updateScene(deltaT: number) {
        super.updateScene(deltaT);

        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager.update(deltaT);
    }

    /**
     * I had to override this method to adjust the viewport for the first level. I screwed up
     * when I was making the tilemap for the first level is what it boils down to.
     *
     * - Peter
     */
    protected initializeViewport(): void {
        super.initializeViewport();
        this.viewport.setBounds(16, 16, 1584, 700);
    }
}
