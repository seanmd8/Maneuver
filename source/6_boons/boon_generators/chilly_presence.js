
function chilly_presence(){
    return {
        name: boon_names.chilly_presence,
        pic: `${IMG_FOLDER.boons}chilly_presence.png`,
        description: chilly_presence_description,
        prereq: prereq_chilly_presence,
        unlocks: [chilly_presence]
    }
}

function prereq_chilly_presence(){
    return GS.boons.has(boon_names.chilly_presence) < 5;
}

function proc_chilly_presence(tile){
    if(!tile.tags.has(TAGS.boss) && GS.boons.has(boon_names.chilly_presence) > random_num(6)){
        stun(tile);
    }
}