function update_journal_areas(){
    for(var i = 0; i < 7; ++i){
        var area_id = `${UIIDS.journal_areas}${i}`
        display.remove_children(area_id);
        var text = display.make_side_text_box(`${area_id} text`);
        display.add_element(area_id, text);
    }
    show_area(basic_tiles_display_info(), 0, true);
    show_area(ruins_display_info(), 1);
    show_area(city_display_info(), 2);
    show_area(sewers_display_info(), 2);
    show_area(crypt_display_info(), 3);
    show_area(magma_display_info(), 3);
    show_area(forest_display_info(), 4);
    show_area(library_display_info(), 4);
    show_area(court_display_info(), 5);
    show_area(assorted_tiles_display_info(), 6, true);
    show_area(events_display_info(), 6, true);
}

function show_area(info, depth, force_visited = false){
    var visited = force_visited || GS.data.areas.has(info.name);
    if(visited && !force_visited){
        var node = GS.data.areas.get_node(info.name);
        info.visit_count = node.data.visited;
        info.clear_count = node.data.cleared;
    }
    info.true_name = info.name;
    if(!visited){
        info.name = area_names.unknown;
    }
    var check_encountered = (t) => {
        t = t();
        if(!visited){
            return {
                name: boon_names.locked,
                pic: `${IMG_FOLDER.ui}locked.png`,
                background: [info.background],
                description: journal_area_messages.locked,
            }
        }
        if(GS.data.tiles.has(t.name)){
            return {
                name: t.name,
                true_name: t.name,
                pic: t.display_pic ? t.display_pic : t.pic,
                background: [info.background],
                description: t.flavor,
            }
        }
        return {
            name: boon_names.not_encountered,
            pic: `${IMG_FOLDER.ui}not_encountered.png`,
            background: [info.background],
            description: journal_area_messages.not_encountered,
        }
    };
    if(info.boss !== undefined){
        info.boss = check_encountered(info.boss);
    }
    info.tiles = info.tiles.map(check_encountered).sort((a, b) => {
        if(a.true_name < b.true_name){
            return -1;
        }
        if(a.true_name > b.true_name){
            return 1;
        }
        return 0;
    });
    display.journal_area_section(`${UIIDS.journal_areas}${depth}`, info);
}