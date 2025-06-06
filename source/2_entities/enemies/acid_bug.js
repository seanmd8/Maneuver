/** @type {TileGenerator} */
function acid_bug_tile(){
    return {
        type: `enemy`,
        name: `Acid Bug`,
        pic: `${IMG_FOLDER.tiles}acid_bug.png`,
        description: acid_bug_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: move_closer_ai,
        telegraph_other: spider_telegraph,
        on_death: acid_bug_death,
    }
}

/** @type {AIFunction} Function used when acid bugs die to explode and harm everything around them.*/
function acid_bug_death(self, target, map){
    // On death, attacks each space next to it.
    var attacks = random_nearby();
    for(var attack of attacks){
        map.attack(self.location.plus(attack));
    }
}