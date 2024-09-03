/** @type {TileGenerator} */
function thorn_bush_tile(){
    return{
        type: `enemy`,
        name: `thorn bush`,
        pic: `${IMG_FOLDER.tiles}thorn_bush.png`,
        description: thorn_bush_description,
        tags: new TagList([TAGS.unmovable, TAGS.thorn_bush_roots]),
        health: 2,
        difficulty: 6,
        behavior: thorn_bush_ai,
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}

/** @type {AIFunction} AI used by thorn bushes.*/
function thorn_bush_ai(self, target, map){
    var current = self.location;
    for(var i = 0; i < 30 && !map.check_empty(current); ++i){
        var next = current.plus(random_nearby()[0]);
        if(map.is_in_bounds(next)){
            var space = map.get_tile(next)
            if(space.tags.has(TAGS.thorn_bush_roots) || (space.type === `empty` && random_num(4) === 0)){
                current = next;
            }
        }
    }
    if(map.check_empty(current)){
        map.add_tile(thorn_bramble_tile(), current);
    }
}