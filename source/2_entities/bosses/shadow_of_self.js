/** @type {TileGenerator} */
function shadow_of_self_tile(){
    var health = 3; // Playermax?
    if(GS.boons.has(boon_names.boss_slayer)){
        health -= 2;
    }
    var deck = GS.deck.copy();
    deck.deal();
    return{
        type: `enemy`,
        name: `Shadow of Self`,
        pic: `${IMG_FOLDER.tiles}shadow_of_self.png`,
        description: shadow_of_self_description,
        tags: new TagList([TAGS.boss]),
        health,
        death_message: shadow_of_self_death_message,
        behavior: shadow_of_self_ai,
        on_hit: shadow_of_self_hit,
        on_death: boss_death,
        card_drops: [],
        deck
    }
}

/** @type {AIFunction} Function used when the Shadow of Self is hit to teleport it and the player then make
 * clones of the player.*/
function shadow_of_self_hit(self, target, map){
    // Teleports away, teleports player away, disguises, makes <cycle> clones
}

/** @type {AIFunction} AI used by the Shadow of Self.*/
async function shadow_of_self_ai(self, target, map){
    // If was hit, do the teleporting thing

    // Get hand.
    var hand = self.tile.deck.get_hand_info();
    // Get moves from each card in hand.
    var moves = get_shadow_move_options(hand);
    moves = moves.map(move => {
        return {
            hand_position: move.hand_position,
            behavior: move.behavior,
            telegraph: telegraph_card(move.behavior, map, self.location)
        }
    })
    // Pick which move to do, then select the card from the hand.
    var choice = get_shadow_move(moves, self.location, self.location.plus(target.difference));
    shadow_hand_select(choice.hand_position);
    var instant = hand[choice.hand_position].card.options.is_instant();
    await delay(3 * ANIMATION_DELAY);

    // Perform the move and update the map.
    do_shadow_move(map, choice.behavior, self.location);
    display_map(map);

    // Wait, then update the hand to discard the selected card.
    await delay(3 * ANIMATION_DELAY);
    self.tile.deck.discard(choice.hand_position);
    refresh_shadow_hand_display(self.tile.deck.get_hand_info());

    if(instant){
        // Take another turn
        await delay(3 * ANIMATION_DELAY);
        await shadow_of_self_ai(self, target, map)
    }
}

function get_shadow_move_options(hand){
    var move_options = [];
    for(var i = 0; i < hand.length; ++i){
        var card = hand[i].card;
        for(var j = 1; j < 10; ++j){
            var behavior = card.options.get_behavior(j);
            if(behavior !== undefined){
                move_options.push({
                    hand_position: i,
                    behavior
                })
            }
        }
    }
    return move_options;
}

function get_shadow_move(moves, self, target){
    moves = randomize_arr(moves);
    // Can it attack the player?
    for(var move of moves){
        for(var point of move.telegraph.attacks){
            if(point_equals(point, target)){
                return move;
            }
        }
    }
    // Can it heal itself?
    for(var move of moves){
        for(var point of move.telegraph.healing){
            if(point_equals(point, self)){
                return move;
            }
        }
    }
    // Can it confuse the player?
    for(var move of moves){
        for(var point of move.telegraph.stun){
            if(point_equals(point, target)){
                return move;
            }
        }
    }
    // Does anything move closer?
    for(var move of moves){
        for(var point of move.telegraph.moves){
            var move_difference = point.minus(target).taxicab_distance();
            var stay_difference = self.minus(target).taxicab_distance();
            if(move_difference < stay_difference){
                return move;
            }
        }
    }
    // Pick randomly.
    return moves[random_num(moves.length)];
}

function do_shadow_move(map, moves, location){
    for(var move of moves){
        switch(move.type){
            case `attack`:
                map.attack(location.plus(move.change));
                break;
            case `move`:
                var moved = map.move(location, location.plus(move.change));
                if(moved){
                    location.plus_equals(move.change);
                }
                break;
            case `teleport`:
                var destination = map.random_empty();
                if( // If the shadow is teleported, update it's location.
                    map.move(location.plus(move.change), destination) && 
                    point_equals(move.change, new Point(0, 0))
                ){
                    location.x = destination.x;
                    location.y = destination.y;
                }
                break;
            case `stun`:
                map.stun_tile(location.plus(move.change));
                break;
            case `move_until`:
                var moved = true;
                while(moved){
                    moved = map.move(location, location.plus(move.change));
                    if(moved){
                        location.plus_equals(move.change);
                    }
                }
                break;
            case `attack_until`:
                var target = location.plus(move.change);
                while(map.is_in_bounds(target)){
                    map.attack(target);
                    target.plus_equals(move.change);
                }
                break;
            case `heal`:
                map.heal(location.plus(move.change));
                break;
            default:
                throw new Error(ERRORS.invalid_value);
        }
    }
}