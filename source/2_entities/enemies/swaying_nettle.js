/** @type {TileGenerator} */
function swaying_nettle_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}swaying_nettle_x.png`, `${IMG_FOLDER.tiles}swaying_nettle_+.png`];
    var starting_cycle = random_num(2);
    return{
        type: `enemy`,
        name: `swaying nettle`,
        pic: pic_arr[starting_cycle],
        description: swaying_nettle_description,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: swaying_nettle_ai,
        telegraph: swaying_nettle_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by swaying nettles.*/
function swaying_nettle_ai(self, target, map){
    var targets = self.tile.cycle === 0 ? DIAGONAL_DIRECTIONS : HORIZONTAL_DIRECTIONS;
    for(var target of targets){
        map.attack(self.location.plus(target));
    }
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}

/** @type {TelegraphFunction} */
function swaying_nettle_telegraph(location, map, self){
    var targets = self.cycle === 0 ? DIAGONAL_DIRECTIONS : HORIZONTAL_DIRECTIONS;
    return targets.map(target => {
        return target.plus(location);
    })
}