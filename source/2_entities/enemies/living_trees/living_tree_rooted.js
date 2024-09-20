/** @type {TileGenerator} */
function living_tree_rooted_tile(){
    return {
        type: `enemy`,
        name: `Living Tree`,
        pic: `${IMG_FOLDER.tiles}living_tree_rooted.png`,
        description: living_tree_rooted_description,
        tags: new TagList(),
        health: 2,
        behavior: living_tree_rooted_ai,
        telegraph: living_tree_telegraph
    }
}

/** @type {AIFunction} AI used by living trees that are rooted.*/
function living_tree_rooted_ai(self, target, map){
    // Checks if it can attack the player.
    var hits = get_2_away().filter(p => {
        return point_equals(p, target.difference);
    });
    if(hits.length > 0){
        map.attack(self.location.plus(target.difference));
    }
    else{
        throw new Error(ERRORS.skip_animation);
    }
}

