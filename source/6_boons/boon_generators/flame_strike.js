function flame_strike(){
    return {
        name: boon_names.flame_strike,
        pic: `${IMG_FOLDER.boons}flame_strike.png`,
        description: flame_strike_description,
        prereq: prereq_flame_strike,
        unlocks: [flame_strike]
    }
}

function prereq_flame_strike(){
    return GS.boons.has(boon_names.flame_strike) < 3;
}