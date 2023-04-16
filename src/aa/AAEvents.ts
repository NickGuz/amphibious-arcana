/**
 * A set of events for HW4
 */
export const AAEvents = {
    // An event that tells the HW4 level to start. Has data: {}
    LEVEL_START: "LEVEL_START",
    // An event that tells the HW4 level to end. Has data: {}
    LEVEL_END: "LEVEL_END",

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

    // The event sent when the player dies. Gets sent after the player's death animation
    PLAYER_DEAD: "PLAYER_DEAD",

    PLAYER_FIRE_JUMP: "PLAYER_FIRE_JUMP",
    SHOOT_TONGUE: "SHOOT_TONGUE",
    TONGUE_WALL_COLLISION: "TONGUE_WALL_COLLISION",
    PLAYER_POS_UPDATE: "PLAYER_POS_UPDATE",
    
    PLAYER_ATTACK: "PLAYER_ATTACK",

    SELECT_TONGUE: "SELECT_TONGUE",
    SELECT_FIREBALL: "SELECT_FIREBALL",
    SELECT_ICE: "SELECT_ICE",
    PAUSE: "PAUSE",
    RESUME: "RESUME",
    CONTROLS: "CONTROLS"
} as const;