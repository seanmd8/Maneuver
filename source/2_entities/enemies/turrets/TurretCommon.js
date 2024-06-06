/** @type {AIFunction} AI used by all turrets to fire towards the player.*/
function turret_fire_ai(self, target, map){
    // Fires a shot in the direction of the player.
    var direction = sign(target.difference)
    for(var space = self.location.plus(direction); !map.attack(space) && map.check_empty(space); space.plus_equals(direction)){}
}