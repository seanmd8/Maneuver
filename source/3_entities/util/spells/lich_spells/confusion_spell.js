/** @type {SpellGenerator} */
function confusion_spell_generator(){
    return {
        behavior: confusion_spell,
        telegraph_other: confusion_spell_telegraph,
        description: lich_spell_descriptions.confusion,
        pic: `${IMG_FOLDER.tiles}lich_confusion.png`
    }
}

/** @type {AIFunction} Spell which adds 2 random temporary debuff cards to the player's deck.*/
function confusion_spell(self, target, map){
    var mark = {
        pic: `${IMG_FOLDER.tiles}confusion_cloud.png`,
        description: event_descriptions.confusion_cloud,
        telegraph_other: hazard_telegraph
    }
    var cloud = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.stun_tile(location);
            }
        }
    }
    var delay = (points) => {
        return (map_to_use) => {
            for(var point of points){
                map_to_use.mark_event(point, mark);
            }
            map_to_use.add_event({name: event_names.confusion_cloud, behavior: cloud(points)});
        }
    } 
    var target = map.get_player_location();
    if(GS.boons.has(boon_names.manic_presence) && chance(1, 2)){
        var miss = get_nearest_where(map, target, (t, p) => {
            return t.type === entity_types.enemy && !point_equals(p, self.location);
        });
        target = miss ? miss : target;
    }
    for(var i = 0; i < 3; ++i){
        var rectangle = point_rectangle(target.plus(new Point(1, 1)), target.plus(new Point(-1, -1)));
        rectangle = [...rectangle, target.copy()];
        rectangle = rectangle.filter((p) => {
            return map.is_in_bounds(p);
        })
        map.add_event({name: event_names.delay, behavior: delay_event(i + 1, delay(rectangle))});
    }
}

/** @type {TelegraphFunction} Shows that the player will be confused.*/
function confusion_spell_telegraph(location, map, self){
    var target = map.get_player_location();
    var rectangle = point_rectangle(target.plus(new Point(1, 1)), target.plus(new Point(-1, -1)));
    rectangle = [...rectangle, target.copy()];
    rectangle = rectangle.filter((p) => {
        return map.is_in_bounds(p);
    })
    return rectangle;
}