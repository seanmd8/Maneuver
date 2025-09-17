/** @type {AIFunction} AI used by claustropedes.*/
function claustropede_ai(self, target, map){
    if(self.tile.cycle === 1){
        var copy_fun;
        switch(self.tile.health){
            case 1:
                copy_fun = claustropede_1_tile;
                break;
            case 2:
                copy_fun = claustropede_2_tile;
                break;
            default:
                throw new Error(ERRORS.invalid_value);
        }
        for(var i = 0; i < 2; ++i){
            map.attack(self.location);
            var copy = copy_fun();
            stun(copy);
            map.spawn_safely(copy, SAFE_SPAWN_ATTEMPTS, true);
        }
    }
    else{
        spider_ai(self, target, map);
    }
}

/** @type {AIFunction}*/
function claustropede_hit(self, target, map){
    self.tile.cycle = 1;
}

/** @type {TelegraphFunction} */
function claustropede_telegraph(location, map, self){
    if(self.cycle === 0){
        return spider_telegraph(location, map, self);
    }
    return [];
}