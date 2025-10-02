/** @type {AreaGenerator}*/
function generate_library_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}library.png`,
        generate_floor: generate_library_floor,
        enemy_list: [
            moving_turret_o_tile, moving_turret_d_tile, brightling_tile, captive_void_tile, paper_construct_tile,
            unstable_wisp_tile, walking_prism_tile, specter_tile, clay_golem_tile, gem_crawler_tile
        ],
        boss_floor_list: [arcane_sentry_floor],
        next_area_list: area5,
        name: area_names.library,
    }
}

/** @type {FloorGenerator}*/
function generate_library_floor(floor_num, area, map){
    if(chance(1, 7)){
        book_row_terrain(floor_num, area, map);
        generate_normal_floor(floor_num - 4, area, map);
        return;
    }
    if(chance(2, 3)){
        bookshelf_terrain(floor_num, area, map);
    }
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function book_row_terrain(floor_num, area, map){
    var rotate = chance(1, 2);
    var x_max = rotate ? FLOOR_HEIGHT : FLOOR_WIDTH;
    var y_max = rotate ? FLOOR_WIDTH : FLOOR_HEIGHT;
    var xs = [];
    for(var i = 0; i < x_max; i += 2){
        xs.push(i + random_num(2));
    }
    var ys = rotate ? range(0, y_max) : range(1, y_max - 1);
    for(var x of xs){
        var less_ys = rand_no_repeats(ys, y_max - 3);
        for(var y of less_ys){
            var p = rotate ? new Point(y, x) : new Point(x, y);
            if(map.check_empty(p)){
                map.add_tile(bookshelf_tile(), p);
            }
        }
    }
}

/** @type {FloorGenerator}*/
function bookshelf_terrain(floor_num, area, map){
    var bookshelf_amount = random_num(10);
    for(var i = 0; i < bookshelf_amount; ++i){
        map.spawn_safely(bookshelf_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}