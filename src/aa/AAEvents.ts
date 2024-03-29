/**
 * A set of events for HW4
 */
export const AAEvents = {
    // An event that tells the HW4 level to start. Has data: {}
    LEVEL_START: "LEVEL_START",
    // An event that tells the HW4 level to end. Has data: {}
    LEVEL_END: "LEVEL_END",

    PLAYER_CREATED: "PLAYER_CREATED",

    // An event triggered when the player enters an area designated as a "level end" location. Had data: {}
    PLAYER_ENTERED_LEVEL_END: "PLAYER_ENTERED_LEVEL_END",

    /**
     * The event that gets emitted when the player's health changes
     *
     * Has data: { curhp: number, maxhp: number }
     */
    HEALTH_CHANGE: "HEALTH_CHANGE",

    // The event sent when a particle hits a tile in the destructible tilemap layer
    PARTICLE_HIT_DESTRUCTIBLE: "PARTICLE_HIT_DESTRUCTIBLE",

    PLAYER_SWING: "PLAYER_SWING",
    CREATE_PLATFORM: "CREATE_PLATFORM",
    DESTROY_PLATFORM: "DESTROY_PLATFORM",

    // The event sent when the player dies. Gets sent after the player's death animation
    PLAYER_DEAD: "PLAYER_DEAD",
    NPC_KILLED: "NPC_KILLED",

    PLAYER_FIRE_JUMP: "PLAYER_FIRE_JUMP",
    SHOOT_TONGUE: "SHOOT_TONGUE",
    TONGUE_WALL_COLLISION: "TONGUE_WALL_COLLISION",

    ICE_COLLISION: "ICE_COLLISION",
    ENEMY_PARTICLE_COLLISION: "ENEMY_PARTICLE_COLLISION",

    PLAYER_ATTACK: "PLAYER_ATTACK",

    SELECT_TONGUE: "SELECT_TONGUE",
    SELECT_FIREBALL: "SELECT_FIREBALL",
    SELECT_ICE: "SELECT_ICE",
    PAUSE: "PAUSE",
    RESUME: "RESUME",
    CONTROLS: "CONTROLS",
    HELP: "HELP",

    FIREBALL_HIT_ENEMY: "FIREBALL_HIT_ENEMY",
    ICEBALL_HIT_ENEMY: "ICEBALL_HIT_ENEMY",
    TONGUE_HIT_ENEMY: "TONGUE_HIT_ENEMY",

    //this is temp i hope
    ENEMY_ATTACHED: "ENEMY_ATTACHED",

    TOGGLE_INVINCIBILITY: "TOGGLE_INVINCIBILITY",

    ANT_FIRE_HIT: "ANT_FIRE_HIT",
    PLAYER_HIT: "PLAYER_HIT",
    PLAYER_HEAL: "PLAYER_HEAL",
    KILL_PLAYER: "KILL_PLAYER",
    ICE_HIT_BOSS: "ICE_HIT_BOSS",
    TONGUE_HIT_BOSS: "TONGUE_HIT_BOSS",
    SPAWN_BOSS: "SPAWN_BOSS",
    PLAYER_TOUCH_ENEMY: "PLAYER_TOUCH_ENEMY",
    BOSS_KILLED: "BOSS_KILLED",
    GOTO_BOSS: "GOTO_BOSS",
} as const;
