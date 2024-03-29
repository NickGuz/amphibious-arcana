/**
 * An enum with all of the physics groups for HW4
 */
export const AAPhysicsGroups = {
    // Physics groups for the player and the player's weapon
    PLAYER: "PLAYER",
    /* 
        Physics groups for the different tilemap layers. Physics groups for tilemaps are
        embedded in the tilemap layer data by a property called "Group". This lets you
        set the physics group for a particular tilemap layer.
    */
    GROUND: "GROUND",
    DESTRUCTABLE: "DESTRUCTABLE",
    TONGUE_COLLIDABLE: "TONGUE_COLLIDABLE",
    FIREBALL: "FIREBALL",
    FIRE_PARTICLE: "FIRE_PARTICLE",
    ICE_PARTICLE: "ICE_PARTICLE",
    BOSS_PARTICLE: "BOSS_PARTICLE",
    ENEMY_PARTICLE: "ENEMY_PARTICLE",
    TONGUE: "TONGUE",
    ENEMY: "ENEMY",
    ANT_PARTICLE: "ANT_PARTICLE",
    ICE_PLATFORM: "ICE_PLATFORM",
    TUTORIAL: "TUTORIAL",
} as const;
