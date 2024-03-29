import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import Scene from "../../Wolfie2D/Scene/Scene";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import PlayerController, { PlayerAnimations, PlayerTweens } from "../AI/Player/PlayerController";
import Fireball from "../AI/Player/Fireball";
import FireParticles from "../AI/Player/FireParticles";

import { AAEvents } from "../AAEvents";
import { AAPhysicsGroups } from "../AAPhysicsGroups";
import AAFactoryManager from "../Factory/AAFactoryManager";
import MainMenu from "./MainMenu";
import TongueBehavior from "../Nodes/TongueBehavior";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import TongueShaderType from "../Shaders/TongueShaderType";
import { SpellTypes } from "../AI/Player/SpellTypes";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import IceParticles from "../AI/Player/IceParticles";
import TongueParticle from "../AI/Player/TongueParticle";
import IceBehavior from "../Nodes/IceBehavior";
import HealthbarHUD from "../GameSystems/HUD/HealthbarHUD";
import AAAnimatedSprite from "../Nodes/AAAnimatedSprite";
import ParticleSystemManager from "../../Wolfie2D/Rendering/Animations/ParticleSystemManager";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import AntParticles from "../AI/NPC/AntParticles";
import Particle from "../../Wolfie2D/Nodes/Graphics/Particle";

/**
 * A const object for the layer names
 */
export const AALayers = {
    GUIDE: "GUIDE",
    // The primary layer
    PRIMARY: "PRIMARY",
    // The UI layer
    UI: "UI",
    // The PAUSE layer
    PAUSE: "PAUSE",
    CONTROLS: "CONTROLS",
    HELP: "HELP",
    BOSSPAUSE: "BOSSPAUSE",
    TONGUE: "TONGUE",
    BACKGROUND: "BACKGROUND",
} as const;

// The layers as a type
export type AALayer = (typeof AALayers)[keyof typeof AALayers];

/**
 * An abstract HW4 scene class.
 */
export default abstract class AALevel extends Scene {
    /** Overrride the factory manager */
    public add: AAFactoryManager;

    // protected cheatsManager: CheatsManager;

    protected antParticleSystem: AntParticles;

    /** The particle system used for the fireball's explosion */
    protected fireParticleSystem: FireParticles;

    /** The fireball itself */
    protected fireballSystem: Fireball;
    protected fireballTimer: Timer;

    /** The particle system used for the ice blast */
    protected iceParticleSystem: IceParticles;

    /** The particle system used for the tongue */
    protected tongueParticleSystem: TongueParticle;

    /** The key for the player's animated sprite */
    protected playerSpriteKey: string;

    /** The animated sprite that is the player */
    protected player: AnimatedSprite;

    /** The sprite that is the fire icon */
    protected fireIcon: Sprite;
    protected tongueIcon: Sprite;
    protected iceIcon: Sprite;

    /** The player's spawn position */
    protected playerSpawn: Vec2;

    private tongue: Graphic;

    private healthBar: Label;
    private healthBarBg: Label;

    protected bossHealthBar: Label;
    protected bossHealthBarBg: Label;
    protected bossNameLabel: Label;
    protected bossPauseLabel: Label;
    protected bossPauseTimer: Timer;

    protected bossName: string;

    private spellBarSelect: Label;

    private tongueSelectPos: Vec2;
    private fireballSelectPos: Vec2;
    private iceSelectPos: Vec2;

    private selectedSpell: string;

    /** The end of level stuff */

    protected levelEndPosition: Vec2;
    protected levelEndHalfSize: Vec2;

    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => Scene;
    protected currLevel: new (...args: any) => Scene;
    protected nextLevelNum: number;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;

    // Level end transition timer and graphic
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    /** The keys to the tilemap and different tilemap layers */
    protected tilemapKey: string;
    //protected destructibleLayerKey: string;
    protected collidableLayerKey: string;
    protected tongueCollidableLayerKey: string;
    protected wallsLayerKey: string;
    /** The scale for the tilemap */
    protected tilemapScale: Vec2;
    /** The destrubtable layer of the tilemap */
    protected collidable: OrthogonalTilemap;
    /** The layer of the tilemap the tongue can collide with */
    protected tongueCollidable: OrthogonalTilemap;
    /** The wall layer of the tilemap */
    protected walls: OrthogonalTilemap;

    protected icePlatform: Graphic;

    /** Sound and music */
    protected levelMusicKey: string;
    protected bossMusicKey: string;
    protected jumpAudioKey: string;
    protected attackAudioKey: string;
    protected healAudioKey: string;
    protected hurtAudioKey: string;
    protected explodeAudioKey: string;
    protected grappleAudioKey: string;
    protected enemyDeathAudioKey: string;
    protected playerDeathAudioKey: string;

    protected allNPCS: Map<number, GameNode>;
    protected healthbars: Map<number, HealthbarHUD>;
    protected freezeOverlays: Map<number, Graphic>;
    protected frozenTimer: Timer;
    protected bossIFrameTimer: Timer;
    protected bossFightCenterPoint: Vec2;
    protected bossFightActive: boolean;
    public bossDead: boolean;

    protected guideText: Label;
    protected guideTextTimer: Timer;
    protected textLoopTimer: Timer;

    protected deathTimer: Timer;

    protected bossSpawnTrigger: Rect;

    /** The background sprite */
    protected bg: Sprite;

    /** The background sprite key */
    protected backgroundKey: string;

    /** The background view scale */
    protected bgScale: Vec2;

    /**
     * The background view offset
     *
     * This should roughly be the image size from my testing, scaled by tilemapScale
     * */
    protected bgOffset: Vec2;

    /** This scaled scrolling movement for parallax */
    protected bgMovementScale: number;

    /** Extra Y scroll movement scale for different vertical parallax scrolling value */
    protected bgMovementScaleY: number;

    /** Prev viewport center for parallax calculation */
    protected prevViewportCenter: Vec2;
    protected viewportNormalized: boolean;

    protected static readonly FIRE_ICON_PATH = "hw4_assets/icons/fire-icon.png";

    protected ignoredAnimations = [
        "ATTACKING",
        "ATTACKING_LEFT",
        "ATTACKING_RIGHT",
        "CASTING_LEFT",
        "TAKING_DAMAGE",
        "TAKING_DAMAGE_LEFT",
        "TAKING_DAMAGE_RIGHT",
    ];

    public constructor(
        viewport: Viewport,
        sceneManager: SceneManager,
        renderingManager: RenderingManager,
        options: Record<string, any>
    ) {
        super(viewport, sceneManager, renderingManager, {
            ...options,
            physics: {
                groupNames: [
                    AAPhysicsGroups.GROUND,
                    AAPhysicsGroups.PLAYER,
                    AAPhysicsGroups.FIREBALL,
                    AAPhysicsGroups.FIRE_PARTICLE,
                    AAPhysicsGroups.DESTRUCTABLE,
                    AAPhysicsGroups.TONGUE_COLLIDABLE,
                    AAPhysicsGroups.TONGUE,
                    AAPhysicsGroups.ICE_PARTICLE,
                    AAPhysicsGroups.ENEMY,
                    AAPhysicsGroups.ICE_PLATFORM,
                    AAPhysicsGroups.BOSS_PARTICLE,
                    AAPhysicsGroups.TUTORIAL,
                    AAPhysicsGroups.ANT_PARTICLE,
                    AAPhysicsGroups.ENEMY_PARTICLE,
                ],
                collisions: [
                    [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
                    [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                    [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                    [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
                    [0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
            },
        });
        this.add = new AAFactoryManager(this, this.tilemaps);

        this.tongueSelectPos = new Vec2(13.3, 25.5);
        this.fireballSelectPos = new Vec2(24.3, 25.5);
        this.iceSelectPos = new Vec2(35.3, 25.5);

        this.selectedSpell = SpellTypes.TONGUE;
        // this.selectedSpell = SpellTypes.FIREBALL;

        this.allNPCS = new Map<number, AAAnimatedSprite>();
        this.healthbars = new Map<number, HealthbarHUD>();
        this.freezeOverlays = new Map<number, Graphic>();
        this.bossDead = false;
    }

    public loadScene() {
        this.load.shader(TongueShaderType.KEY, TongueShaderType.VSHADER, TongueShaderType.FSHADER);
    }

    public startScene(): void {
        // Initialize the layers
        this.initLayers();

        // Initialize the tilemaps
        this.initializeTilemap();

        // Initialize the sprite and particle system for the players weapon
        this.initializeWeaponSystem();

        // Initialize the player
        this.initializePlayer(this.playerSpriteKey);

        // Initialize the viewport - this must come after the player has been initialized
        this.initializeViewport();
        this.subscribeToEvents();
        this.initializeUI();
        this.initializePause();
        this.getLayer(AALayers.PAUSE).disable();
        this.initializeControls();
        this.getLayer(AALayers.CONTROLS).disable();
        this.initializeHelp();
        this.getLayer(AALayers.HELP).disable();
        this.initializeBossPause();
        this.getLayer(AALayers.BOSSPAUSE).disable();

        // Initialize the ends of the levels - must be initialized after the primary layer has been added
        this.initializeLevelEnds();

        this.levelTransitionTimer = new Timer(500);
        this.levelEndTimer = new Timer(3000, () => {
            // After the level end timer ends, fade to black and then go to the next scene
            this.levelTransitionScreen.tweens.play("fadeIn");
        });

        // Init timers
        this.fireballTimer = new Timer(300);
        this.bossIFrameTimer = new Timer(1000);

        this.bossPauseTimer = new Timer(
            3000,
            () => {
                this.getLayer(AALayers.BOSSPAUSE).disable();
            },
            false
        );

        this.guideTextTimer = new Timer(30000, () => {
            this.guideText.backgroundColor.a = 0;
            this.guideText.textColor.a = 0;
            this.textLoopTimer.reset();
        });

        this.deathTimer = new Timer(3000, () => {
            this.sceneManager.changeToScene(this.currLevel);
            Input.enableInput();
        });

        // Initially disable player movement
        Input.disableInput();

        // Start the black screen fade out
        this.levelTransitionScreen.tweens.play("fadeOut");

        // Start playing the level music for the HW4 level
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
            key: this.levelMusicKey,
            loop: true,
            holdReference: true,
        });

        this.bossFightActive = false;

        // Initialize the background
        if (this.backgroundKey) {
            this.initBackground();
        }
    }

    /* Update method for the scene */

    public updateScene(deltaT: number) {
        // console.log(this.player.position.x + " " + this.player.position.y);
        // Handle all game events
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }

        if (this.backgroundKey) {
            this.moveBackground(deltaT);
        }

        if (
            this.selectedSpell === SpellTypes.ICE &&
            this.iceParticleSystem.getPool()[0].visible &&
            Input.isMouseJustPressed()
        ) {
            const iceParticle = this.iceParticleSystem.getPool()[0];
            this.emitter.fireEvent(AAEvents.CREATE_PLATFORM, {
                pos: iceParticle.position,
            });
        }

        // update if cheats unlock spells
        if (MainMenu.SPELL_UNLOCK) {
            if (this.fireIcon.imageId != "tongueIcon") {
                this.tongueIcon.setImageId("tongueIcon");
            }
            if (this.fireIcon.imageId != "fireIcon") {
                this.fireIcon.setImageId("fireIcon");
            }
            if (this.iceIcon.imageId != "iceIcon") {
                this.iceIcon.setImageId("iceIcon");
            }
        }
        this.healthbars.forEach((healthbar) => healthbar.update(deltaT));

        // Player position code to determine monster spawn positions
        // console.log(this.player.position.x, this.player.position.y);

        // Lock player to viewport in boss fights
        if (this.bossFightActive) {
            this.lockPlayer(this.player, this.viewport.getCenter(), this.viewport.getHalfSize());
        }
    }

    protected lockPlayer(player: CanvasNode, viewportCenter: Vec2, viewportHalfSize: Vec2): void {
        const playerLeftEdge = player.position.x - player.size.x / 4;
        const playerRightEdge = player.position.x + player.size.x / 4;
        const viewportLeftEdge = viewportCenter.x - viewportHalfSize.x;
        const viewportRightEdge = viewportCenter.x + viewportHalfSize.x;

        if (playerLeftEdge <= viewportLeftEdge) {
            player.position.x = viewportLeftEdge + player.size.x / 4;
        } else if (playerRightEdge >= viewportRightEdge) {
            player.position.x = viewportRightEdge - player.size.x / 4;
        }
    }

    /**
     * Handle game events.
     * @param event the game event
     */
    protected handleEvent(event: GameEvent): void {
        switch (event.type) {
            case AAEvents.PAUSE: {
                this.handlePauseGame();
                break;
            }
            case AAEvents.RESUME: {
                this.handleResumeGame();
                break;
            }
            case AAEvents.CONTROLS: {
                this.handleShowControls();
                break;
            }
            case AAEvents.HELP: {
                this.handleShowHelp();
                break;
            }
            case AAEvents.PLAYER_ENTERED_LEVEL_END: {
                this.handleEnteredLevelEnd();
                break;
            }
            // When the level starts, reenable user input
            case AAEvents.LEVEL_START: {
                Input.enableInput();
                break;
            }
            // When the level ends, change the scene to the next level
            case AAEvents.LEVEL_END: {
                ParticleSystemManager.getInstance().clearParticleSystems();
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {
                    key: this.levelMusicKey,
                });
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {
                    key: this.bossMusicKey,
                });
                if (MainMenu.LEVEL_COUNTER < this.nextLevelNum) {
                    MainMenu.LEVEL_COUNTER = this.nextLevelNum;
                }
                MainMenu.CURRENT_LEVEL = this.nextLevelNum;
                if (this.nextLevelNum >= 7) {
                    this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {
                        key: MainMenu.MUSIC_KEY,
                        loop: true,
                        holdReference: true,
                    });
                }
                this.sceneManager.changeToScene(this.nextLevel);
                break;
            }
            case AAEvents.FIREBALL_HIT_ENEMY: {
                if (this.fireballTimer.isStopped()) {
                    this.fireballTimer.start();
                    const enemy = <AAAnimatedSprite>this.allNPCS.get(event.data.get("other"));
                    enemy.health -= 1;

                    if (enemy.frozen && this.freezeOverlays.get(enemy.id)) {
                        enemy.unfreeze();
                        enemy.animation.resume();
                        enemy.health -= 3;
                        this.freezeOverlays.get(enemy.id).visible = false;
                        this.freezeOverlays.delete(enemy.id);
                    }

                    if (this.bossFightActive) {
                        this.handleHealthChange(
                            this.bossHealthBar,
                            this.bossHealthBarBg,
                            enemy.health,
                            enemy.maxHealth
                        );
                    }
                    let current = enemy.animation.currentAnimation;
                    const prev = enemy.animation.getPending();
                    enemy.animation.playIfNotAlready("TAKING_DAMAGE");
                    if (!this.ignoredAnimations.includes(current)) {
                        enemy.animation.queue(current, true);
                    } else {
                        enemy.animation.queue(prev, true);
                    }

                    this.handleFireballHit();
                }
                break;
            }
            case AAEvents.ICEBALL_HIT_ENEMY: {
                const enemy = <AAAnimatedSprite>this.allNPCS.get(event.data.get("other"));

                if (!enemy.frozen) {
                    enemy.freeze();
                    enemy.animation.pause();

                    // Add a cyan overlay to indicate that the enemy is frozen
                    const frozenOverlay = this.add.graphic(GraphicType.RECT, AALayers.PRIMARY, {
                        position: Vec2.ZERO,
                        size: Vec2.ZERO,
                    });

                    frozenOverlay.color = Color.CYAN; // Cyan color
                    frozenOverlay.alpha = 0.5; // Set transparency
                    frozenOverlay.size = enemy.size.clone().scale(0.35, 0.25);
                    frozenOverlay.position = enemy.position.clone();
                    frozenOverlay.visible = true;
                    this.freezeOverlays.set(enemy.id, frozenOverlay);

                    this.iceParticleSystem.getPool()[0].freeze();
                    this.iceParticleSystem.getPool()[0].visible = false;

                    //how long the enmy is frozen for
                    this.frozenTimer = new Timer(3000, () => {
                        enemy.unfreeze();
                        enemy.animation.resume();
                        frozenOverlay.visible = false;
                        this.freezeOverlays.delete(enemy.id);
                    });
                    this.frozenTimer.start();
                }

                break;
            }
            case AAEvents.ICE_HIT_BOSS: {
                if (this.bossIFrameTimer.isStopped()) {
                    const boss = <AAAnimatedSprite>this.allNPCS.get(event.data.get("other"));
                    boss.health -= 1;
                    this.handleHealthChange(
                        this.bossHealthBar,
                        this.bossHealthBarBg,
                        boss.health,
                        boss.maxHealth
                    );
                    let current = boss.animation.currentAnimation;
                    const prev = boss.animation.getPending();
                    boss.animation.playIfNotAlready("TAKING_DAMAGE");
                    if (!this.ignoredAnimations.includes(current)) {
                        boss.animation.queue(current, true);
                    } else {
                        boss.animation.queue(prev, true);
                    }
                    this.bossIFrameTimer.start();
                }
                break;
            }
            case AAEvents.TONGUE_HIT_BOSS: {
                if (this.bossIFrameTimer.isStopped()) {
                    const boss = <AAAnimatedSprite>this.allNPCS.get(event.data.get("other"));
                    boss.health -= 1;
                    this.handleHealthChange(
                        this.bossHealthBar,
                        this.bossHealthBarBg,
                        boss.health,
                        boss.maxHealth
                    );
                    let current = boss.animation.currentAnimation;
                    const prev = boss.animation.getPending();
                    boss.animation.playIfNotAlready("TAKING_DAMAGE");
                    if (!this.ignoredAnimations.includes(current)) {
                        boss.animation.queue(current, true);
                    } else {
                        boss.animation.queue(prev, true);
                    }
                    this.bossIFrameTimer.start();
                }
                break;
            }
            case AAEvents.TONGUE_HIT_ENEMY: {
                const enemy = <AAAnimatedSprite>this.allNPCS.get(event.data.get("other"));
                this.tongueParticleSystem.getPool()[0].freeze();
                this.tongueParticleSystem.getPool()[0].visible = false;

                const overlay = this.freezeOverlays.get(enemy.id);

                //I hope there's another way
                this.emitter.fireEvent(AAEvents.ENEMY_ATTACHED, {
                    enemy: enemy,
                    overlay: overlay,
                });

                let current = enemy.animation.currentAnimation;
                const prev = enemy.animation.getPending();
                enemy.animation.play("TAKING_DAMAGE");

                if (!this.ignoredAnimations.includes(current) && !enemy.frozen) {
                    enemy.animation.queue(current, true);
                } else {
                    enemy.animation.queue(prev, true);
                }
                break;
            }
            case AAEvents.PARTICLE_HIT_DESTRUCTIBLE: {
                if (this.fireballTimer.isStopped()) {
                    this.fireballTimer.start();
                    this.handleFireballHit();
                }
                break;
            }
            case AAEvents.ANT_FIRE_HIT: {
                this.handleAntFireballHit();
                if (event.data.get("other") === this.player.id) {
                    this.emitter.fireEvent(AAEvents.PLAYER_HIT);
                }
                break;
            }
            case AAEvents.ICE_COLLISION: {
                this.iceParticleSystem.getPool()[0].freeze();
                this.iceParticleSystem.getPool()[0].visible = false;
                break;
            }
            case AAEvents.ENEMY_PARTICLE_COLLISION: {
                let particle = <Particle>this.allNPCS.get(event.data.get("node"));
                particle.freeze();
                particle.visible = false;
                break;
            }
            case AAEvents.HEALTH_CHANGE: {
                this.handleHealthChange(
                    this.healthBar,
                    this.healthBarBg,
                    event.data.get("curhp"),
                    event.data.get("maxhp")
                );
                break;
            }
            case AAEvents.PLAYER_DEAD: {
                // MainMenu.GAME_PLAYING = false;
                ParticleSystemManager.getInstance().clearParticleSystems();
                Input.disableInput();
                if (this.deathTimer.isStopped() && !this.deathTimer.hasRun()) {
                    this.player.animation.play(PlayerAnimations.DYING);

                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
                        key: this.playerDeathAudioKey,
                        loop: false,
                        holdReference: false,
                    });
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, {
                        key: this.levelMusicKey,
                    });
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, {
                        key: this.bossMusicKey,
                    });
                    this.deathTimer.start();
                }

                // this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: this.levelMusicKey, loop: true, holdReference: true});
                // this.sceneManager.changeToScene(MainMenu);
                // this.iceParticleSystem.stopSystem();
                // this.fireParticleSystem.stopSystem();
                // this.tongueParticleSystem.stopSystem();
                // this.sceneManager.changeToScene(this.currLevel);
                // this.sceneManager.changeToScene(MainMenu);
                break;
            }
            case "NPC_BOSS_KILLED": {
                const id: number = event.data.get("node");
                const enemy = this.allNPCS.get(id);

                if (enemy) {
                    enemy.destroy();
                    const healthbar = this.healthbars.get(id);
                    if (healthbar) {
                        healthbar.visible = false;
                    }
                    const freeze = this.freezeOverlays.get(id);
                    if (freeze) {
                        freeze.visible = false;
                    }
                }

                this.emitter.fireEvent(AAEvents.BOSS_KILLED);

                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
                    key: this.enemyDeathAudioKey,
                    loop: false,
                    holdReference: false,
                });
                break;
            }
            case AAEvents.NPC_KILLED: {
                const id: number = event.data.get("node");
                const enemy = this.allNPCS.get(id);

                if (enemy) {
                    enemy.destroy();
                    const healthbar = this.healthbars.get(id);
                    if (healthbar) {
                        healthbar.visible = false;
                    }
                    const freeze = this.freezeOverlays.get(id);
                    if (freeze) {
                        freeze.visible = false;
                    }
                }

                if (this.bossFightActive) {
                    this.emitter.fireEvent(AAEvents.BOSS_KILLED);
                }
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
                    key: this.enemyDeathAudioKey,
                    loop: false,
                    holdReference: false,
                });
                break;
            }
            case AAEvents.SHOOT_TONGUE: {
                const pos = event.data.get("pos");
                const dir = event.data.get("dir");
                this.spawnTongue(pos, dir);
                break;
            }
            case AAEvents.CREATE_PLATFORM: {
                // console.log(this.tilemap.getColRowAt(Input.getGlobalMousePosition()))
                // this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(event.data.get('pos')),5);
                this.spawnIceBlock(event.data.get("pos"));
                break;
            }
            case AAEvents.DESTROY_PLATFORM: {
                this.despawnIceBlock();
                break;
            }
            // Handle spell switching
            case AAEvents.SELECT_TONGUE: {
                // TODO temp because tongue is broken
                this.handleSelectTongue();
                // this.handleSelectFireball();
                break;
            }
            case AAEvents.SELECT_FIREBALL: {
                // TODO temp because tongue is broken
                this.handleSelectFireball();
                // this.handleSelectIce();
                break;
            }
            case AAEvents.SELECT_ICE: {
                // TODO temp because tongue is broken
                this.handleSelectIce();
                // this.handleSelectTongue();
                break;
            }
            case AAEvents.TONGUE_WALL_COLLISION: {
                this.handleTongueHit();
                break;
            }
            case AAEvents.GOTO_BOSS: {
                if (!this.bossFightActive && this.bossSpawnTrigger != null) {
                    this.player.position = this.bossSpawnTrigger.position;
                }
                break;
            }
            case AAEvents.SPAWN_BOSS: {
                this.bossDead = false;
                this.viewport.follow(null);
                // this.viewport.setSmoothingFactor(4);
                this.viewport.setFocus(this.bossFightCenterPoint);
                this.bossFightActive = true;
                this.bossHealthBar.visible = true;
                this.bossHealthBarBg.visible = true;
                this.bossNameLabel.visible = true;
                // Destroy the spawn trigger so we don't call this again
                this.bossSpawnTrigger.destroy();
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {
                    key: this.levelMusicKey,
                    holdReference: true,
                });
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
                    key: this.bossMusicKey,
                    loop: true,
                    holdReference: true,
                });
                break;
            }
            case "GUIDE": {
                let texts = [""];

                if (MainMenu.CURRENT_LEVEL === 0) {
                    texts = [
                        "You're finally awake! The Mind Flayer really got us all...",
                        "It seems like you lost most of your magic. But you can get it back.",
                        "Use your tongue as a grapple on concrete surfaces to get around.",
                        "You can also hold the JUMP button to glide with your hat!",
                    ];
                } else if (MainMenu.CURRENT_LEVEL === 1) {
                    texts = [
                        "Seems like you'll need to get through this mountain.",
                        "Climb the tree with your tongue spell to reach the top!",
                        "Use your tongue spell on enemies to damage them and gain health.",
                    ];
                } else if (MainMenu.CURRENT_LEVEL === 2) {
                    texts = [
                        "Creepy.. This is the cave of the fire ants.",
                        "The exit is at the bottom right of the cave.",
                        "Be careful, the Ant-Queen might be guarding it...",
                    ];
                } else if (MainMenu.CURRENT_LEVEL === 3) {
                    texts = [
                        "You've unlocked your fireball! It deals damage to enemies.",
                        "You can also shoot it by your feet for a boost!",
                        "It will allow you to make higher jumps and reach platforms.",
                    ];
                } else if (MainMenu.CURRENT_LEVEL === 4) {
                    texts = [
                        "We made it through! We are getting closer to the castle.",
                        "I'm starting to feel the Mind Flayer's presence.",
                        "There is a chance that I could be controlled by him. I'm Sorry",
                    ];
                } else if (MainMenu.CURRENT_LEVEL === 5) {
                    texts = [
                        "You were able to get me out of his control. Thank you!",
                        "I passed down my Ice Spell to you. You can freeze enemies with it",
                        "You can create an ice platform by clicking again while its in the air.",
                    ];
                } else if (MainMenu.CURRENT_LEVEL === 6) {
                    texts = [
                        "This is it! Use all your spells to reach the Mind Flayer!",
                        "The future of this world is in your hands.",
                        "Good Luck!.",
                    ];
                }

                if (this.guideTextTimer.isStopped()) {
                    let currentIndex = 0;

                    this.guideText.text = texts[currentIndex];

                    this.textLoopTimer = new Timer(5000, () => {
                        // Increment the index and wrap around to the beginning of the array if necessary
                        currentIndex = (currentIndex + 1) % texts.length;

                        // Display the next text in the array
                        this.guideText.text = texts[currentIndex];

                        // Restart the timer and show the label
                        this.textLoopTimer.start();
                    });

                    // Start the label timer and show the label
                    this.textLoopTimer.start();
                    this.guideTextTimer.start();
                    this.guideText.backgroundColor.a = 1;
                    this.guideText.textColor.a = 1;
                }

                break;
            }
            // Default: Throw an error! No unhandled events allowed.
            default: {
                throw new Error(`Unhandled event caught in scene with type ${event.type}`);
            }
        }
    }

    protected spawnTongue(pos: Vec2, dir: Vec2): void {
        // TODO maybe use GameNode?
        if (this.tongue && !this.tongue.visible) {
            this.tongue.visible = true;
            this.tongue.setAIActive(true, { src: pos, dir: dir });
        }
    }
    protected spawnIceBlock(pos: Vec2): void {
        // TODO maybe use GameNode?
        if (this.icePlatform) {
            this.iceParticleSystem.getPool()[0].freeze();
            this.iceParticleSystem.getPool()[0].visible = false;
            this.icePlatform.visible = true;
            this.icePlatform.setAIActive(true, { src: pos });
        }
    }

    protected despawnIceBlock(): void {
        if (this.icePlatform) {
            this.icePlatform.visible = false;
            this.icePlatform.position = Vec2.ZERO;
            this.icePlatform.size = Vec2.ZERO;
        }
    }

    protected handleSelectTongue(): void {
        this.selectedSpell = SpellTypes.TONGUE;
        this.spellBarSelect.position = this.tongueSelectPos.clone();
    }

    protected handleSelectFireball(): void {
        this.selectedSpell = SpellTypes.FIREBALL;
        this.spellBarSelect.position = this.fireballSelectPos.clone();
    }

    protected handleSelectIce(): void {
        this.selectedSpell = SpellTypes.ICE;
        this.spellBarSelect.position = this.iceSelectPos.clone();
    }

    /* Handlers for the different events the scene is subscribed to */

    protected handleFireballHit(): void {
        const particle = this.fireballSystem.getPool()[0]; // fireball is a single particle

        if (!particle) {
            console.warn("Fireball particle undefined");
            return;
        }

        // Rocket jump direction
        // TODO should be less effective when fireball lands farther away
        const dir = new Vec2(-0.8 * particle.vel.x, -0.8 * particle.vel.y);

        this.fireballSystem.stopSystem();

        if (!this.fireParticleSystem.isSystemRunning()) {
            this.fireParticleSystem.setParticleVector(dir);
            this.fireParticleSystem.startSystem(1000, 0, particle.position);
        }

        this.emitter.fireEvent(AAEvents.PLAYER_FIRE_JUMP, {
            fireJumpVel: dir,
            particlePos: particle.position,
            playerPos: this.player.position,
        });
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
            key: this.explodeAudioKey,
            loop: false,
            holdReference: false,
        });
    }

    protected handleAntFireballHit(): void {
        const particle = this.antParticleSystem.getPool()[0]; // fireball is a single particle

        if (!particle) {
            console.warn("Fireball particle undefined");
            return;
        }

        // Rocket jump direction
        // TODO should be less effective when fireball lands farther away
        const dir = new Vec2(-0.1 * particle.vel.x, -0.1 * particle.vel.y);

        this.antParticleSystem.stopSystem();

        if (!this.fireParticleSystem.isSystemRunning()) {
            this.fireParticleSystem.setParticleVector(dir);
            this.fireParticleSystem.startSystem(1000, 0, particle.position);
        }

        this.emitter.fireEvent(AAEvents.PLAYER_FIRE_JUMP, {
            fireJumpVel: dir,
            particlePos: particle.position,
            playerPos: this.player.position,
        });
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
            key: this.explodeAudioKey,
            loop: false,
            holdReference: false,
        });
    }

    protected handleTongueHit(): void {
        const particle = this.tongueParticleSystem.getPool()[0]; // fireball is a single particle

        if (!particle) {
            console.warn("Tongue particle undefined");
            return;
        }

        // gotta change this for the swing
        // let dir = new Vec2(particle.vel.x/2, particle.vel.y/2);
        const dir = this.player.position.dirTo(particle.position).scale(250, 350).scale(1.2);

        this.tongueParticleSystem.stopSystem();

        this.emitter.fireEvent(AAEvents.PLAYER_SWING, {
            swingDir: dir,
            particlePos: particle.position,
            playerPos: this.player.position,
        });
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
            key: this.grappleAudioKey,
            loop: false,
            holdReference: false,
        });
    }

    /**
     * Handle the event when the player enters the level end area.
     */
    protected handleEnteredLevelEnd(): void {
        this.bossDead = true;
        // If the timer hasn't run yet, start the end level animation
        if (!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()) {
            this.levelEndTimer.start();
            this.levelEndLabel.tweens.play("slideIn");
        }
    }
    /**
     * This is the same healthbar I used for hw2. I've adapted it slightly to account for the zoom factor. Other than that, the
     * code is basically the same.
     *
     * @param currentHealth the current health of the player
     * @param maxHealth the maximum health of the player
     */
    protected handleHealthChange(
        healthBar: Label,
        healthBarBg: Label,
        currentHealth: number,
        maxHealth: number
    ): void {
        const unit = healthBarBg.size.x / maxHealth;

        healthBar.size.set(
            healthBarBg.size.x - unit * (maxHealth - currentHealth),
            healthBarBg.size.y
        );
        healthBar.position.set(
            healthBarBg.position.x - (unit / 2 / this.getViewScale()) * (maxHealth - currentHealth),
            healthBarBg.position.y
        );

        healthBar.backgroundColor =
            currentHealth < (maxHealth * 1) / 4
                ? Color.RED
                : currentHealth < (maxHealth * 3) / 4
                ? Color.YELLOW
                : Color.GREEN;
    }

    protected handlePauseGame(): void {
        if (this.bossFightActive) {
            this.getLayer(AALayers.BOSSPAUSE).enable();
            this.bossPauseTimer.start();
        } else {
            MainMenu.GAME_PLAYING = false;
            this.player.setAIActive(false, null);
            this.player.animation.pause();
            this.allNPCS.forEach((npc) => {
                // npc.setAIActive(false, null)
                npc.freeze();
                if ((<AAAnimatedSprite>npc).animation) {
                    (<AAAnimatedSprite>npc).animation.pause();
                }
            });
            this.emitter.fireEvent(GameEventType.STOP_SOUND, {
                key: this.levelMusicKey,
                holdReference: true,
            });
            this.emitter.fireEvent(GameEventType.STOP_SOUND, {
                key: this.bossMusicKey,
                holdReference: true,
            });
            this.getLayer(AALayers.PAUSE).enable();
        }
    }

    protected handleResumeGame(): void {
        MainMenu.GAME_PLAYING = true;
        this.player.setAIActive(true, {
            fireParticleSystem: this.fireParticleSystem, // TODO do we need these in HW3Level?
            fireballSystem: this.fireballSystem,
            iceParticleSystem: this.iceParticleSystem,
            tongueParticleSystem: this.tongueParticleSystem,
            tilemap: "Destructable",
        });
        this.player.animation.resume();
        this.allNPCS.forEach((npc) => {
            // npc.setAIActive(true, {})
            npc.unfreeze();
            if ((<AAAnimatedSprite>npc).animation) {
                (<AAAnimatedSprite>npc).animation.resume();
            }
        });
        if (this.bossFightActive) {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
                key: this.bossMusicKey,
                loop: true,
                holdReference: true,
            });
        } else {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
                key: this.levelMusicKey,
                loop: true,
                holdReference: true,
            });
        }
        this.getLayer(AALayers.PAUSE).disable();
    }

    protected handleShowControls(): void {
        this.getLayer(AALayers.PAUSE).disable();
        this.getLayer(AALayers.CONTROLS).enable();
    }

    protected handleShowHelp(): void {
        this.getLayer(AALayers.PAUSE).disable();
        this.getLayer(AALayers.HELP).enable();
    }

    /* Initialization methods for everything in the scene */

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.addUILayer(AALayers.UI);

        // Add a layer for players and enemies

        // this.addLayer(AALayers.PRIMARY, 1);
        this.addLayer(AALayers.TONGUE, 1);
        this.addLayer(AALayers.GUIDE, 0);
        this.addLayer(AALayers.PRIMARY, 5);
        // this.addLayer(AALayers.GUIDE, 1);

        // For some reason it needs -1 to render behind the tilemap
        this.addLayer(AALayers.BACKGROUND, -1);

        // Add a layer for Pause Menu
        this.addUILayer(AALayers.PAUSE);
        this.addUILayer(AALayers.CONTROLS);
        this.addUILayer(AALayers.HELP);
        this.addUILayer(AALayers.BOSSPAUSE);
    }

    protected initBackground(): void {
        this.prevViewportCenter = null;
        this.bg = this.add.sprite(this.backgroundKey, AALayers.BACKGROUND);
        this.bg.scale.set(this.bgScale.x, this.bgScale.y);
        this.bg.position.copy(this.bgOffset);
    }

    protected moveBackground(deltaT: number): void {
        if (!this.prevViewportCenter) {
            this.prevViewportCenter = this.viewport.getView().center.clone();
        }

        // The viewport is stupid and has a different start value depending on the last scene or something
        // and then slowly moves to the correct value, so wait for that to happen here
        if (
            !this.viewportNormalized &&
            !this.prevViewportCenter.equals(this.viewport.getView().center)
        ) {
            console.log("Viewport not normalized yet, skipping");
            this.prevViewportCenter = this.viewport.getView().center.clone();
            return;
        } else {
            this.viewportNormalized = true;
        }

        const diff = this.viewport
            .getView()
            .center.clone()
            .sub(this.prevViewportCenter)
            .scaled(this.bgMovementScale); // Controls how fast the bg scrolls
        this.bg.position.add(new Vec2(diff.x, this.bgMovementScaleY * diff.y));
        this.prevViewportCenter = this.viewport.getView().center.clone();
    }

    /**
     * Initializes the tilemaps
     * @param key the key for the tilemap data
     * @param scale the scale factor for the tilemap
     */
    protected initializeTilemap(): void {
        if (this.tilemapKey === undefined || this.tilemapScale === undefined) {
            throw new Error(
                "Cannot add the homework 4 tilemap unless the tilemap key and scale are set."
            );
        }
        // Add the tilemap to the scene
        this.add.tilemap(this.tilemapKey, this.tilemapScale);

        if (this.collidableLayerKey === undefined) {
            throw new Error(
                "Make sure the keys for the collidable layer and tongue collidable layer are both set"
            );
        }

        // Get the wall and destructible layers
        //this.walls = this.getTilemap(this.wallsLayerKey) as OrthogonalTilemap;
        this.collidable = this.getTilemap(this.collidableLayerKey) as OrthogonalTilemap;

        // Add physics to the destructible layer of the tilemap
        if (this.collidable) {
            this.collidable.addPhysics();
            this.collidable.setGroup(AAPhysicsGroups.DESTRUCTABLE);
            this.collidable.setTrigger(
                AAPhysicsGroups.FIREBALL,
                AAEvents.PARTICLE_HIT_DESTRUCTIBLE,
                null
            );
            this.collidable.setTrigger(AAPhysicsGroups.ANT_PARTICLE, AAEvents.ANT_FIRE_HIT, null);
            this.collidable.setTrigger(
                AAPhysicsGroups.TONGUE,
                AAEvents.TONGUE_WALL_COLLISION,
                null
            );
            this.collidable.setTrigger(AAPhysicsGroups.ICE_PARTICLE, AAEvents.ICE_COLLISION, null);
            this.collidable.setTrigger(
                AAPhysicsGroups.ENEMY_PARTICLE,
                AAEvents.ENEMY_PARTICLE_COLLISION,
                null
            );
        }
    }
    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        this.receiver.subscribe("NPC_BOSS_KILLED");

        this.receiver.subscribe(AAEvents.ANT_FIRE_HIT);
        this.receiver.subscribe(AAEvents.PLAYER_ENTERED_LEVEL_END);
        this.receiver.subscribe(AAEvents.LEVEL_START);
        this.receiver.subscribe(AAEvents.LEVEL_END);
        this.receiver.subscribe(AAEvents.TONGUE_WALL_COLLISION);
        this.receiver.subscribe(AAEvents.PARTICLE_HIT_DESTRUCTIBLE);
        this.receiver.subscribe(AAEvents.ICE_COLLISION);
        this.receiver.subscribe(AAEvents.ENEMY_PARTICLE_COLLISION);
        this.receiver.subscribe(AAEvents.HEALTH_CHANGE);
        this.receiver.subscribe(AAEvents.PLAYER_DEAD);
        this.receiver.subscribe(AAEvents.NPC_KILLED);
        this.receiver.subscribe(AAEvents.SHOOT_TONGUE);
        this.receiver.subscribe(AAEvents.SELECT_TONGUE);
        this.receiver.subscribe(AAEvents.SELECT_FIREBALL);
        this.receiver.subscribe(AAEvents.SELECT_ICE);
        this.receiver.subscribe(AAEvents.PAUSE);
        this.receiver.subscribe(AAEvents.RESUME);
        this.receiver.subscribe(AAEvents.CONTROLS);
        this.receiver.subscribe(AAEvents.HELP);
        this.receiver.subscribe(AAEvents.CREATE_PLATFORM);
        this.receiver.subscribe(AAEvents.DESTROY_PLATFORM);
        this.receiver.subscribe(AAEvents.FIREBALL_HIT_ENEMY);
        this.receiver.subscribe(AAEvents.ICEBALL_HIT_ENEMY);
        this.receiver.subscribe(AAEvents.TONGUE_HIT_ENEMY);
        this.receiver.subscribe(AAEvents.ICE_HIT_BOSS);
        this.receiver.subscribe(AAEvents.TONGUE_HIT_BOSS);
        this.receiver.subscribe(AAEvents.SPAWN_BOSS);
        this.receiver.subscribe(AAEvents.GOTO_BOSS);
        this.receiver.subscribe("GUIDE");
        this.receiver.subscribe("STOP_SHOWING");
    }
    /**
     * Adds in any necessary UI to the game
     */
    protected initializeUI(): void {
        // HP Label
        // this.healthLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(10, 15), text: "HP "});
        // this.healthLabel.size.set(300, 30);
        // this.healthLabel.fontSize = 24;
        // this.healthLabel.font = "Courier";

        // HealthBar
        this.healthBar = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.UI, {
            position: new Vec2(45, 15),
            text: "",
        });
        this.healthBar.size = new Vec2(300, 25);
        this.healthBar.backgroundColor = Color.GREEN;
        this.healthBar.borderRadius = 0;

        // HealthBar Border
        this.healthBarBg = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.UI, {
            position: new Vec2(45, 15),
            text: "",
        });
        this.healthBarBg.size = new Vec2(300, 25);
        this.healthBarBg.borderColor = Color.BLACK;
        this.healthBarBg.borderRadius = 0;
        this.healthBarBg.borderWidth = 2;

        // Boss Healthbar (displays on boss trigger)
        this.bossHealthBar = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.UI, {
            position: new Vec2(150, 170),
            text: "",
        });
        this.bossHealthBar.size = new Vec2(600, 25);
        this.bossHealthBar.backgroundColor = Color.GREEN;
        this.bossHealthBar.borderRadius = 0;
        this.bossHealthBar.visible = false;

        this.bossHealthBarBg = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.UI, {
            position: new Vec2(150, 170),
            text: "",
        });
        this.bossHealthBarBg.size = new Vec2(600, 25);
        this.bossHealthBarBg.borderColor = Color.BLACK;
        this.bossHealthBarBg.borderRadius = 0;
        this.bossHealthBarBg.borderWidth = 2;
        this.bossHealthBarBg.visible = false;

        // Boss name
        this.bossNameLabel = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.UI, {
            position: new Vec2(95, 162),
            text: this.bossName || "",
        });
        this.bossNameLabel.size.set(300, 30);
        this.bossNameLabel.fontSize = 24;
        this.bossNameLabel.font = "Courier";
        this.bossNameLabel.visible = false;

        // The tongue icon sprite
        this.tongueIcon =
            MainMenu.CURRENT_LEVEL >= 0
                ? this.add.sprite("tongueIcon", AALayers.UI)
                : this.add.sprite("lockIcon", AALayers.UI);
        this.tongueIcon.scale.set(0.7, 0.7);
        this.tongueIcon.position.copy(this.tongueSelectPos);

        const oneText = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.UI, {
            position: this.tongueSelectPos.clone().sub(new Vec2(4, 3)),
            text: "1",
        });
        oneText.size.set(30, 30);
        oneText.fontSize = 16;
        oneText.font = "Courier";

        // The fire icon sprite
        this.fireIcon =
            MainMenu.CURRENT_LEVEL >= 3
                ? this.add.sprite("fireIcon", AALayers.UI)
                : this.add.sprite("lockIcon", AALayers.UI);
        this.fireIcon.scale.set(0.7, 0.7);
        this.fireIcon.position.copy(this.fireballSelectPos);

        const twoText = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.UI, {
            position: this.fireballSelectPos.clone().sub(new Vec2(4, 3)),
            text: "2",
        });
        twoText.size.set(30, 30);
        twoText.fontSize = 16;
        twoText.font = "Courier";

        // The ice icon sprite
        this.iceIcon =
            MainMenu.CURRENT_LEVEL >= 5
                ? this.add.sprite("iceIcon", AALayers.UI)
                : this.add.sprite("lockIcon", AALayers.UI);
        this.iceIcon.scale.set(0.7, 0.7);
        this.iceIcon.position.copy(this.iceSelectPos);

        const threeText = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.UI, {
            position: this.iceSelectPos.clone().sub(new Vec2(4, 3)),
            text: "3",
        });
        threeText.size.set(30, 30);
        threeText.fontSize = 16;
        threeText.font = "Courier";

        // Spellbar highlighted spell border thing
        this.spellBarSelect = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.UI, {
            position: this.tongueSelectPos,
            text: "",
        });
        this.spellBarSelect.size = new Vec2(45, 45);
        this.spellBarSelect.borderColor = Color.YELLOW;
        this.spellBarSelect.borderRadius = 0;
        this.spellBarSelect.borderWidth = 2;

        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.UI, {
            position: new Vec2(-300, 100),
            text: "Level Complete",
        });
        this.levelEndLabel.size.set(1200, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";

        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -300,
                    end: 150,
                    ease: EaseFunctionType.OUT_SINE,
                },
            ],
        });

        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, AALayers.UI, {
            position: new Vec2(300, 200),
            size: new Vec2(600, 400),
        });
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;

        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD,
                },
            ],
            onEnd: [AAEvents.LEVEL_END],
        });

        /*
             Adds a tween to fade in the start of the level. After the tween has
             finished playing, a level start event gets sent to the EventQueue.
        */
        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD,
                },
            ],
            onEnd: [AAEvents.LEVEL_START],
        });

        // Guide Textbox
        this.guideText = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.GUIDE, {
            position: new Vec2(0, 0),
            text: "Hello There!",
        });
        this.guideText.size.set(600, 150);
        this.guideText.borderRadius = 25;
        this.guideText.backgroundColor = new Color(34, 32, 52, 0);
        this.guideText.textColor = Color.WHITE;
        this.guideText.textColor.a = 0;
        this.guideText.backgroundColor.a = 0;
        this.guideText.fontSize = 24;
        this.guideText.font = "MyFont";

        this.guideText.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD,
                },
            ],
        });

        this.guideText.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD,
                },
            ],
        });
    }

    protected initializePause(): void {
        const size = this.viewport.getHalfSize();
        const yPos = size.y + 100;
        const pauseMenu = <Rect>this.add.graphic(GraphicType.RECT, AALayers.PAUSE, {
            position: new Vec2(size.x, yPos - 100),
            size: new Vec2(60, 100),
        });
        pauseMenu.color = Color.BLACK;
        const resumeBtn = <Button>this.add.uiElement(UIElementType.BUTTON, AALayers.PAUSE, {
            position: new Vec2(size.x, yPos - 130),
            text: "Resume",
        });
        resumeBtn.backgroundColor = Color.TRANSPARENT;
        resumeBtn.borderColor = Color.WHITE;
        resumeBtn.borderRadius = 0;
        resumeBtn.setPadding(new Vec2(50, 10));
        resumeBtn.font = "PixelSimple";
        resumeBtn.scale = new Vec2(0.25, 0.25);

        const controlsBtn = <Button>this.add.uiElement(UIElementType.BUTTON, AALayers.PAUSE, {
            position: new Vec2(size.x, yPos - 110),
            text: "Controls",
        });
        controlsBtn.backgroundColor = Color.TRANSPARENT;
        controlsBtn.borderColor = Color.WHITE;
        controlsBtn.borderRadius = 0;
        controlsBtn.setPadding(new Vec2(50, 10));
        controlsBtn.font = "PixelSimple";
        controlsBtn.scale = new Vec2(0.25, 0.25);

        const helpBtn = <Button>this.add.uiElement(UIElementType.BUTTON, AALayers.PAUSE, {
            position: new Vec2(size.x, yPos - 90),
            text: "Help",
        });
        helpBtn.backgroundColor = Color.TRANSPARENT;
        helpBtn.borderColor = Color.WHITE;
        helpBtn.borderRadius = 0;
        helpBtn.setPadding(new Vec2(50, 10));
        helpBtn.font = "PixelSimple";
        helpBtn.scale = new Vec2(0.25, 0.25);

        const quitBtn = <Button>this.add.uiElement(UIElementType.BUTTON, AALayers.PAUSE, {
            position: new Vec2(size.x, yPos - 70),
            text: "Quit",
        });
        quitBtn.backgroundColor = Color.TRANSPARENT;
        quitBtn.borderColor = Color.WHITE;
        quitBtn.borderRadius = 0;
        quitBtn.setPadding(new Vec2(50, 10));
        quitBtn.font = "PixelSimple";
        quitBtn.scale = new Vec2(0.25, 0.25);

        resumeBtn.onClick = () => {
            this.emitter.fireEvent(AAEvents.RESUME);
        };
        controlsBtn.onClick = () => {
            this.emitter.fireEvent(AAEvents.CONTROLS);
        };
        helpBtn.onClick = () => {
            this.emitter.fireEvent(AAEvents.HELP);
        };
        quitBtn.onClick = () => {
            MainMenu.GAME_PLAYING = false;
            ParticleSystemManager.getInstance().clearParticleSystems();
            this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {
                key: MainMenu.MUSIC_KEY,
                loop: true,
                holdReference: true,
            });
            this.sceneManager.changeToScene(MainMenu);
        };
    }

    protected initializeControls(): void {
        const size = this.viewport.getHalfSize();
        const yOffset = 10;
        const controlsMenu = <Rect>this.add.graphic(GraphicType.RECT, AALayers.CONTROLS, {
            position: new Vec2(size.x, size.y),
            size: new Vec2(100, 130),
        });
        controlsMenu.color = Color.BLACK;

        let i = 1;
        this.add.uiElement(UIElementType.LABEL, AALayers.CONTROLS, {
            position: new Vec2(size.x, size.y - 55),
            text: "W - Jump",
            fontSize: 24,
        });
        this.add.uiElement(UIElementType.LABEL, AALayers.CONTROLS, {
            position: new Vec2(size.x, size.y - 55 + yOffset * i++),
            text: "A - Walk Left",
            fontSize: 24,
        });
        this.add.uiElement(UIElementType.LABEL, AALayers.CONTROLS, {
            position: new Vec2(size.x, size.y - 55 + yOffset * i++),
            text: "D - Walk Right",
            fontSize: 24,
        });
        this.add.uiElement(UIElementType.LABEL, AALayers.CONTROLS, {
            position: new Vec2(size.x, size.y - 55 + yOffset * i++),
            text: "1 - Select Spell 1",
            fontSize: 24,
        });
        this.add.uiElement(UIElementType.LABEL, AALayers.CONTROLS, {
            position: new Vec2(size.x, size.y - 55 + yOffset * i++),
            text: "2 - Select Spell 2",
            fontSize: 24,
        });
        this.add.uiElement(UIElementType.LABEL, AALayers.CONTROLS, {
            position: new Vec2(size.x, size.y - 55 + yOffset * i++),
            text: "3 - Select Spell 3",
            fontSize: 24,
        });
        this.add.uiElement(UIElementType.LABEL, AALayers.CONTROLS, {
            position: new Vec2(size.x, size.y - 55 + yOffset * i++),
            text: "Left Click - Cast Spell",
            fontSize: 24,
        });
        this.add.uiElement(UIElementType.LABEL, AALayers.CONTROLS, {
            position: new Vec2(size.x, size.y - 55 + yOffset * i++),
            text: "Move Mouse - Aim Spell",
            fontSize: 24,
        });
        this.add.uiElement(UIElementType.LABEL, AALayers.CONTROLS, {
            position: new Vec2(size.x, size.y - 55 + yOffset * i++),
            text: "ESC - Pause Game",
            fontSize: 24,
        });

        const backBtn = <Button>this.add.uiElement(UIElementType.BUTTON, AALayers.CONTROLS, {
            position: new Vec2(size.x, 2 * size.y - 50),
            text: "Back",
        });
        backBtn.backgroundColor = Color.TRANSPARENT;
        backBtn.borderColor = Color.WHITE;
        backBtn.borderRadius = 0;
        backBtn.setPadding(new Vec2(50, 10));
        backBtn.font = "PixelSimple";
        backBtn.scale = new Vec2(0.25, 0.25);
        backBtn.onClick = () => {
            this.getLayer(AALayers.CONTROLS).disable();
            this.getLayer(AALayers.PAUSE).enable();
        };
    }

    protected initializeHelp(): void {
        const size = this.viewport.getHalfSize();
        const yOffset = 10;
        const helpMenu = <Rect>this.add.graphic(GraphicType.RECT, AALayers.HELP, {
            position: new Vec2(size.x, size.y),
            size: new Vec2(140, 100),
        });
        helpMenu.color = Color.BLACK;

        let i = 1;
        this.add.uiElement(UIElementType.LABEL, AALayers.HELP, {
            position: new Vec2(size.x, size.y - 35),
            text: "- Enter to enable use of cheats on the current level",
            fontSize: 24,
        });
        this.add.uiElement(UIElementType.LABEL, AALayers.HELP, {
            position: new Vec2(size.x, size.y - 35 + yOffset * i++),
            text: "- Numbers 4-0 to go to levels 0-6 respectively",
            fontSize: 24,
        });
        this.add.uiElement(UIElementType.LABEL, AALayers.HELP, {
            position: new Vec2(size.x, size.y - 35 + yOffset * i++),
            text: "- Shift to go to boss fight if there is one",
            fontSize: 24,
        });
        this.add.uiElement(UIElementType.LABEL, AALayers.HELP, {
            position: new Vec2(size.x, size.y - 35 + yOffset * i++),
            text: "- I to enable invincibility",
            fontSize: 24,
        });
        this.add.uiElement(UIElementType.LABEL, AALayers.HELP, {
            position: new Vec2(size.x, size.y - 35 + yOffset * i++),
            text: "- K to kill the player",
            fontSize: 24,
        });
        this.add.uiElement(UIElementType.LABEL, AALayers.HELP, {
            position: new Vec2(size.x, size.y - 35 + yOffset * i++),
            text: "- L to unlock all spells",
            fontSize: 24,
        });

        const backBtn = <Button>this.add.uiElement(UIElementType.BUTTON, AALayers.HELP, {
            position: new Vec2(size.x, 2 * size.y - 70),
            text: "Back",
        });
        backBtn.backgroundColor = Color.TRANSPARENT;
        backBtn.borderColor = Color.WHITE;
        backBtn.borderRadius = 0;
        backBtn.setPadding(new Vec2(50, 10));
        backBtn.font = "PixelSimple";
        backBtn.scale = new Vec2(0.25, 0.25);
        backBtn.onClick = () => {
            this.getLayer(AALayers.HELP).disable();
            this.getLayer(AALayers.PAUSE).enable();
        };
    }

    protected initializeBossPause(): void {
        this.bossPauseLabel = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.BOSSPAUSE, {
            position: new Vec2(150, 182),
            text: "You're in danger, no time to stop right now!",
        });
        this.bossPauseLabel.size.set(300, 30);
        this.bossPauseLabel.fontSize = 24;
        this.bossPauseLabel.font = "Courier";
        this.bossPauseLabel.textColor = Color.RED;
    }

    /**
     * Initializes the particles system used by the player's weapon.
     */
    protected initializeWeaponSystem(): void {
        this.fireParticleSystem = new FireParticles(50, Vec2.ZERO, 1000, 3, 10, 50); // TODO try changing mass to see if it affects gravity?
        this.fireParticleSystem.initializePool(this, AALayers.PRIMARY);

        this.fireballSystem = new Fireball(1, Vec2.ZERO, 1000, 3, 0, 1);
        this.fireballSystem.initializePool(this, AALayers.PRIMARY);

        // init tongue
        this.tongue = this.add.graphic(GraphicType.RECT, AALayers.TONGUE, {
            position: Vec2.ZERO,
            size: Vec2.ZERO,
        });
        this.tongue.useCustomShader(TongueShaderType.KEY);
        this.tongue.color = Color.RED;
        this.tongue.visible = false;
        this.tongue.addAI(TongueBehavior, { src: Vec2.ZERO, dir: Vec2.ZERO });

        this.tongueParticleSystem = new TongueParticle(1, Vec2.ZERO, 1000, 3, 0, 1);
        this.tongueParticleSystem.initializePool(this, AALayers.PRIMARY);

        //init ice platform
        this.icePlatform = this.add.graphic(GraphicType.RECT, AALayers.PRIMARY, {
            position: Vec2.ZERO,
            size: Vec2.ZERO,
        });
        //this.icePlatform.useCustomShader(TongueShaderType.KEY);
        this.icePlatform.color = Color.CYAN;
        this.icePlatform.visible = false;
        this.icePlatform.addAI(IceBehavior, { src: Vec2.ZERO });
        this.icePlatform.addPhysics();
        this.icePlatform.setGroup(AAPhysicsGroups.ICE_PLATFORM);
        this.icePlatform.setTrigger(AAPhysicsGroups.TONGUE, AAEvents.TONGUE_WALL_COLLISION, null);
        this.icePlatform.setTrigger(
            AAPhysicsGroups.FIREBALL,
            AAEvents.PARTICLE_HIT_DESTRUCTIBLE,
            null
        );
        this.icePlatform.setTrigger(AAPhysicsGroups.ICE_PARTICLE, AAEvents.ICE_COLLISION, null);
        this.icePlatform.setTrigger(AAPhysicsGroups.ENEMY, AAEvents.DESTROY_PLATFORM, null);
        this.icePlatform.setTrigger(
            AAPhysicsGroups.ENEMY_PARTICLE,
            AAEvents.ENEMY_PARTICLE_COLLISION,
            null
        );
        // initialize Ice Blast
        this.iceParticleSystem = new IceParticles(1, Vec2.ZERO, 2000, 3, 10, 1);
        this.iceParticleSystem.initializePool(this, AALayers.PRIMARY);
    }

    /**
     * Initializes the player, setting the player's initial position to the given position.
     * @param position the player's spawn position
     */
    protected initializePlayer(key: string): void {
        if (this.fireParticleSystem === undefined) {
            throw new Error(
                "Fire particle system must be initialized before initializing the player!"
            );
        }
        if (this.iceParticleSystem === undefined) {
            throw new Error(
                "Ice particle system must be initialized before initializing the player!"
            );
        }
        if (this.playerSpawn === undefined) {
            throw new Error("Player spawn must be set before initializing the player!");
        }

        // Add the player to the scene
        this.player = this.add.animatedSprite(key, AALayers.PRIMARY);
        this.player.scale.set(0.25, 0.25);
        this.player.position.copy(this.playerSpawn);

        // Give the player physics and setup collision groups and triggers for the player
        this.player.addPhysics(
            new AABB(this.player.position.clone(), this.player.boundary.getHalfSize().clone())
        );
        this.player.setGroup(AAPhysicsGroups.PLAYER);
        this.player.setTrigger(AAPhysicsGroups.BOSS_PARTICLE, AAEvents.PLAYER_HIT, null);

        this.player.setTrigger(AAPhysicsGroups.ANT_PARTICLE, AAEvents.ANT_FIRE_HIT, null);

        this.player.setTrigger(AAPhysicsGroups.ENEMY_PARTICLE, AAEvents.PLAYER_HIT, null);
        this.player.setTrigger(AAPhysicsGroups.ENEMY, AAEvents.PLAYER_HIT, null);

        // Give the player a flip animation
        this.player.tweens.add(PlayerTweens.FLIP, {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2 * Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD,
                },
            ],
        });
        // Give the player a death animation
        this.player.tweens.add(PlayerTweens.DEATH, {
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
            onEnd: [AAEvents.PLAYER_DEAD],
        });

        // Give the player it's AI
        // This is just the option object, can pass in whatever "weapons" we want here
        this.player.addAI(PlayerController, {
            fireParticleSystem: this.fireParticleSystem, // TODO do we need these in HW3Level?
            fireballSystem: this.fireballSystem,
            iceParticleSystem: this.iceParticleSystem,
            tongueParticleSystem: this.tongueParticleSystem,
            tongueGraphic: this.tongue,
            tilemap: "Destructable",
            allNPCs: this.allNPCS,
        });

        this.emitter.fireEvent(AAEvents.PLAYER_CREATED, {
            player: this.player,
            tongue: this.tongue,
        });
    }
    /**
     * Initializes the viewport
     */
    protected initializeViewport(): void {
        if (this.player === undefined) {
            throw new Error(
                "Player must be initialized before setting the viewport to folow the player"
            );
        }
        this.viewport.follow(this.player);
        this.viewport.setZoomLevel(4);
        this.viewport.setBounds(0, 0, 512, 512);
        this.viewport.setCenter(0, 0);
    }
    /**
     * Initializes the level end area
     */
    protected initializeLevelEnds(): void {
        if (!this.layers.has(AALayers.PRIMARY)) {
            throw new Error(
                "Can't initialize the level ends until the primary layer has been added to the scene!"
            );
        }
        if (!this.levelEndPosition || !this.levelEndHalfSize) {
            console.debug("No level end trigger set, hopefully this is intended");
            return;
        }

        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, AALayers.PRIMARY, {
            position: this.levelEndPosition,
            size: this.levelEndHalfSize,
        });
        this.levelEndArea.addPhysics(undefined, undefined, false, true);
        this.levelEndArea.setTrigger(
            AAPhysicsGroups.PLAYER,
            AAEvents.PLAYER_ENTERED_LEVEL_END,
            null
        );
        this.levelEndArea.color = new Color(255, 0, 255, 0.2);
    }

    /* Misc methods */

    // Get the key of the player's jump audio file
    public getJumpAudioKey(): string {
        return this.jumpAudioKey;
    }

    public getAttackAudioKey(): string {
        return this.attackAudioKey;
    }

    public getHealAudioKey(): string {
        return this.healAudioKey;
    }

    public getHurtAudioKey(): string {
        return this.hurtAudioKey;
    }
}
