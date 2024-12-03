/** @type {TileGenerator} */
function strider_tile(){
    return{
        type: `enemy`,
        name: `Strider`,
        pic: `${IMG_FOLDER.tiles}strider.png`,
        description: strider_description,
        tags: new TagList(),
        health: 2,
        difficulty: 4,
        behavior: strider_ai,
        telegraph: strider_telegraph
    }
}

/** @type {AIFunction} AI used by shadow knights.*/
function strider_ai(self, target, map){
    if(random_num(2) === 0){
        var moves = random_nearby();
    }
    else{
        var moves = order_nearby(target.difference);
    }
    moves = moves.map(move => move.times(2));
    for(let move of moves){
        if(point_equals(move, target.difference)){
            map.attack(self.location.plus(target.difference));
        }
    }
    var moved = false;
    for(var i = 0; i < moves.length && !moved; ++i){
        var destination = self.location.plus(moves[i]);
        if(map.check_empty(destination)){
            moved = map.move(self.location, destination);
        }
    }
}

/** @type {TelegraphFunction} */
function strider_telegraph(location, map, self){
    var attacks = random_nearby();
    return attacks.map(attack => location.plus(attack.times(2)));
}