function magma_display_info(){
    var area = generate_magma_area();
    return {
        name: area.name,
        background: area.background,
        boss: young_dragon_tile,
        tiles: [
            ...area.enemy_list, 
            animated_boulder_tile, 
            repulsor_tile, 
            lava_pool_tile, 
            magmatic_boulder_tile,
            smoldering_ashes_tile,
            raging_fire_tile,
            fireball_tile,
        ],
    }
}
